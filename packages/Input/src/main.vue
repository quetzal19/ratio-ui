<template>
  <div
    class="input-container"
    :class="{'_is-error': isError, '_is-info': isInfo}"
  >
    <div v-if="isError || isInfo" class="message">
      {{ errorMessage }}
    </div>
    <input
      v-if="type !== 'tel'"
      class="r-input"
      v-model="value"
      :class="inputClass"
      :disabled="disabled"
      :type="type"
      :placeholder="placeholder"
      v-on="$listeners"
    >
    <TheMask
      v-if="type === 'tel'"
      class="r-input"
      v-model="value"
      :class="inputClass"
      :disabled="disabled"
      :type="type"
      mask="+7 (###) ###-##-##"
      :placeholder="placeholder"
      v-on="$listeners"
    />
  </div>
</template>
<script>
import { TheMask } from 'vue-the-mask';

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
      email: {
        required: '*Введите email',
        invalid: 'Email введён неверно',
      },
      tel: {
        required: '*Введите телефон',
        invalid: 'Телефон введён неверно',
      },
    },
  }),

  computed: {
    isRequired() {
      return this.validators && this.validators.indexOf('required') !== -1;
    },
  },

  watch: {
    value() {
      this.clear();
    },

    isError(value) {
      this.$emit('errorStatus', value);
    },
  },

  mounted() {
    if (this.customErrors && Object.keys(this.customErrors).length) {
      this.mergeVocabulary();
    }
  },

  methods: {
    /**
     * Проверка является ли email валидным
     * @returns {boolean}
     */
    validateEmail() {
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

      if (this.type === 'tel' && this.value.length !== 10) {
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
</style>
