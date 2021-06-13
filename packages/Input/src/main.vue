<template>
  <div
    class="input-container"
    :class="{
      '_is-error': isError,
      '_is-info': isInfo,
      '_required': validators && validators.indexOf('required') !== -1 && !value,
    }"
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
    <div
      v-if="isError || isInfo"
      class="message ellipsis"
      :title="errorMessage"
    >
      {{ errorMessage }}
    </div>
    <input
      v-if="type !== 'tel'"
      class="r-input"
      v-model="value"
      :class="[inputClass, {'_invalid' : isError}]"
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
      :class="[inputClass, {'_invalid' : isError}]"
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
 * Добавлен функционал проверки ввода пользователя через regexp. Для включения функционала
 * нужно передать в компонент:
 * 'regexp' добавить в массив validators
 * regexp - должен содержать регулярку, по которой проверять
 * customErrors - должен содержать текст ошибки для этой проверки. Формат такой:
 * customErrors: {
 *   regexp: {
 *     invalid: 'text'
 *   }
 * }
 * forbidClearOnInput - должен быть поставлен в true, чтобы работала посимвольная проверка
 * На сам этот компонент нужно повесить обработчик ввода, чтобы форсить проверку при
 * вводе каждого символа. Выглядит так: @input="$refs.refName.validate()",
 * где refName - ref этого компонента
 * Чтобы настройки для этого функционала не валялись где попало, можно посмотреть пример
 * в корневом сторе: nameInputValidationRules. В нем собраны правила для валидации полей ФИО.
 *
 * @vue-prop { String } [bindedValue=''] bindedValue - предустановленное
 * значение которое надо установить в value.
 * @vue-prop { Boolean } [enableShowPasswordIcons=true] enableShowPasswordIcons -
 * показать/скрыть иконки для пароля.
 * @vue-prop { Object } [showPasswordIcons={}] showPasswordIcons - если нужно передать кастомные
 * иконки для показа/сокрытия пароля, то передавать пути к ним надо сюда как объект c полями show
 * и hide
 * @vue-prop { Boolean } [forbidClearOnInput=false] forbidClearOnInput - запрещает скидывать
 * ошибку при вводе символа. Нужен для посимвольной проверки через regexp, иначе ошибка каждый
 * раз скидывается и смысл посимвольной проверки теряется
 * @vue-prop { Object } regexp - регулярка, с которой нужно сравнить то, что ввел пользователь.
 * Позволяет, например, запретить все символы, кроме кириллицыя
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
    // required, email, regexp
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
    forbidClearOnInput: {
      type: Boolean,
      default: false,
    },
    regexp: {
    },
  },

  data: () => ({
    value: '',
    isError: false,
    isInfo: false,
    errorMessage: '',
    errorsVocabulary: {
      text: {
        required: '*Поле обязательно',
      },
      password: {
        required: '*Введите пароль',
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
    isRegexp() {
      return this.validators && this.validators.indexOf('regexp') !== -1;
    },
  },

  watch: {
    value() {
      if (!this.forbidClearOnInput) this.clear();
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
          },
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

      if (this.isRegexp && !String(this.value).match(this.regexp)) {
        this.isError = true;
        this.errorMessage = this.errorsVocabulary.regexp.invalid;
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

input {
  transition: .1s;
}

.message {
  position: absolute;
  top: 4px;
  left: 0;
  max-width: calc(100% - 20px);
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
