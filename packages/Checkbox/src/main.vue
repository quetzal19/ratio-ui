<template>
  <div class="radio-container">
    <label
      :for="uniqName"
      :class="[{'_picked': value}, type]"
    >
      <img
        v-if="type === 'normal' && !iconPath"
        src="./ico/success.svg"
        alt="Иконка успеха"
        class="icon"
      >
      <img
        v-if="type === 'normal' && iconPath"
        :src="iconPath"
        alt="Иконка успеха"
        class="icon"
      >
      <slot v-if="type === 'normal'" />
    </label>
    <input
      v-show="false"
      :id="uniqName"
      type="checkbox"
      :value="value"
      @change="handleChange(item)"
    >
  </div>
</template>

<script>

/**
 * @desc Универсальный компонент радио-кнопок
 * @vue-prop {String} [type='square'] type - Форма кнопок. normal/switcher
 * @vue-prop {String} [uniqName='buttonGroup'] uniqName - Уникальное имя для чекбокса
 * @vue-prop {Object} [default=false] default - Выбранный из другого места итем
 * @vue-prop {String} [iconPath='./ico/success.svg'] iconPath - Иконка активного чекбокса
 * для стандартного представления
 */

export default {
  name: 'RCheckbox',

  props: {
    type: {
      type: String,
      default: 'normal',
    },
    uniqName: {
      type: String,
      default: 'checkbox',
    },
    default: {
      type: Boolean,
      default: false,
    },
    iconPath: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    value: false,
  }),

  watch: {
    default(value) {
      this.value = value;
    },
  },

  mounted() {
    this.value = this.default;
  },

  methods: {
    /**
     * Обработчик выбора чекбокса
     */
    handleChange() {
      this.value = !this.value;
      this.$emit('picked', this.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.radio-container {
  display: flex;
  flex-wrap: wrap;
  margin-right: -8px;
  margin-bottom: -8px;
}

.button {
  padding: 10px 28px;
  font-size: 14px;
  line-height: 20px;
  font-weight: normal;
}

.item {
  margin-right: 8px;
  margin-bottom: 8px;
}

label {
  position: relative;
  display: flex;
  align-items: center;
  height: 18px;
  padding-left: 26px;
  font-size: 12px;
  line-height: 18px;
  text-transform: none;
  cursor: pointer;

  &.normal {

    &::before {
      content: "";
      position: absolute;
      top: 1px;
      left: 0;
      width: 16px;
      height: 16px;
      border-radius: 2px;
      border: 1px solid #1C9AD0;
    }
  }

  .icon {
    position: absolute;
    top: 4px;
    left: 3px;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    color: #1C9AD0;
  }

  &.switcher {
    width: 38px;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 38px;
      height: 20px;
      border-radius: 23px;
      background: #D1F4FF;
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #1C9AD0;
      transition: transform .2s;
    }
  }

  &:not(._picked) {
    opacity: .5;

    .icon {
      display: none;
    }

    &::after {
      transform: translateX(18px);
    }
  }
}
</style>
