<template>
  <div
    class="input-container"
    :class="{'_is-error': isError, '_is-info': isInfo}"
  >
    <div
      v-if="type === 'password' && enableShowPasswordIcons && value"
      class="password-show"
      @mouseenter="iconPasswordHovered = true"
      @mouseleave="iconPasswordHovered = false"
    >
      <div v-if="showPassword" class="open" @click="showPassword = false">
        <div v-if="iconPasswordHovered">
          <img v-if="!showPasswordIcons"
               src="./ico/password-hide.svg"
               style="position: relative; top: 2px;"
          >
          <img v-else :src="showPasswordIcons.hide">
        </div>
        <div v-else>
          <img v-if="!showPasswordIcons" src="./ico/password-show.svg">
          <img v-else :src="showPasswordIcons.show">
        </div>
      </div>
      <div v-else class="close" @click="showPassword = true">
        <div v-if="iconPasswordHovered">
          <img v-if="!showPasswordIcons" src="./ico/password-show.svg">
          <img v-else :src="showPasswordIcons.show">
        </div>
        <div v-else>
          <img v-if="!showPasswordIcons"
               src="./ico/password-hide.svg"
               style="position: relative; top: 2px;"
          >
          <img v-else :src="showPasswordIcons.hide">
        </div>
      </div>
    </div>
    <div v-if="isError || isInfo" class="message">
      {{ errorMessage }}
    </div>
    <input
      v-if="type !== 'tel'"
      class="r-input"
      v-model="value"
      :class="inputClass"
      :disabled="disabled"
      :type="typeComputed"
      :placeholder="placeholder"
      v-on="$listeners"
    >
    <TheMask
      v-if="type === 'tel'"
      class="r-input"
      ref="phoneMask"
      v-model="value"
      :class="inputClass"
      :disabled="disabled"
      :type="type"
      mask="+7 (###) ###-##-##"
      :placeholder="placeholder"
      v-on="$listeners"
      v-bind="$attrs"
      @click.native="handleTelFocus"
    />
  </div>
</template>
<script>
import { TheMask } from 'vue-the-mask';

/**
 * @desc Универсальный компонент инпута.
 * @vue-prop { String } [bindedValue=''] bindedValue - предустановленное
 * значение которое надо установить в value.
 * @vue-prop { Boolean } [enableShowPasswordIcons=true] enableShowPasswordIcons -
 * показать/скрыть иконки для пароля.
 * @vue-prop { Object } [showPasswordIcons={}] showPasswordIcons - если нужно передать кастомные
 * иконки для показа/сокрытия пароля, то передавать пути к ним надо сюда как объект c полями show
 * и hide
 * @vue-computed { String } typeComputed - Перед передачей в шаблон обрабатываем тип.
 * В данный момент используется для тоглера c паролями.
 */

export default {
  name: 'RInput',

  components: {
    TheMask,
  },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
    inputClass: {
      type: String,
      default: '',
    },
    // required, email
    validators: {
      type: Array,
      default: () => [],
    },
    customErrors: {
      type: Object,
      default: () => {},
    },
    bindedValue: {
      type: [String, Number],
      default: '',
    },
    enableShowPasswordIcons: {
      type: Boolean,
      default: true,
    },
    showPasswordIcons: {
      type: Object,
      default: () => {},
    },
  },

  data: () => ({
    value: '',
    isError: false,
    isInfo: false,
    errorMessage: '',
    errorsVocabulary: {
      text: {
        required: 'Поле обязательно',
      },
      password: {
        required: 'Введите пароль',
      },
      email: {
        required: '*Введите email',
        invalid: 'Email введён неверно',
      },
      tel: {
        required: '*Введите телефон',
        invalid: 'Телефон введён неверно',
      },
    },

    showPassword: false,
    iconPasswordHovered: false,
  }),

  computed: {
    isRequired() {
      return this.validators && this.validators.indexOf('required') !== -1;
    },
    typeComputed() {
      if (this.type === 'password') {
        return this.showPassword ? 'input' : 'password';
      }
      return this.type;
    },
  },

  watch: {
    value() {
      this.clear();
    },

    bindedValue(value) {
      if (this.value !== value) {
        this.value = value;
      }
    },

    isError(value) {
      this.$emit('errorStatus', value);
    },
  },

  mounted() {
    if (this.customErrors && Object.keys(this.customErrors).length) {
      this.mergeVocabulary();
    }

    if (this.bindedValue) {
      this.value = this.bindedValue;
    }
  },

  methods: {
    /**
     * Активация маски телефона по клику
     */
    handleTelFocus() {
      if (!this.value) {
        this.$refs.phoneMask.onInput({
          isTrusted: false,
          target: {
            value: ' (',
          }
        });
      }
    },
    /**
     * Проверка является ли email валидным
     * @returns {boolean}
     */
    validateEmail() {
      // eslint-disable-next-line
      const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      return re.test(String(this.value).toLowerCase());
    },

    /**
     * Главный валидатор по всем типам полей
     * @returns {boolean} - true если всё хорошо и false если валидация провалилась
     */
    validate() {
      if (this.isRequired && !this.value) {
        this.isError = true;
        this.errorMessage = this.errorsVocabulary[this.type].required;
        return false;
      }

      if (this.type === 'email' && this.validators.indexOf('email') !== -1 && !this.validateEmail()) {
        this.isError = true;
        this.errorMessage = this.errorsVocabulary[this.type].invalid;
        return false;
      }

      if (this.type === 'tel' && this.value.length < 10) {
        this.isError = true;
        this.errorMessage = this.errorsVocabulary[this.type].invalid;
        return false;
      }

      this.clear();
      return true;
    },

    /**
     * Очистить валидацию и ошибки
     */
    clear() {
      this.isError = false;
      this.errorMessage = '';
    },

    /**
     * Установка кастомной ошибки извне компонента
     */
    setErrorState(message) {
      this.isError = true;
      this.errorMessage = message;
    },

    /**
     * Если пришли кастомные сообщения, то добавляем их в словарь ошибок
     */
    mergeVocabulary() {
      this.errorsVocabulary = {
        ...this.errorsVocabulary,
        ...this.customErrors,
      };
    },
  },

};
</script>
<style lang="scss" scoped>
.input-container {
  position: relative;
}

.message {
  position: absolute;
  top: 0;
  left: 0;
}

.password-show {
  position: absolute;
  top: 0;
  right: 17px;
  display: flex;
  align-items: center;
  width: 25px;
  height: 100%;
  cursor: pointer;

  .close,
  .open {
    height: 16px;
  }
}
</style>
