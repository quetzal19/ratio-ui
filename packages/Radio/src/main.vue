<template>
  <div class="radio-container">
    <div
      v-for="(item, i) in list"
      :key="i"
      class="item"
    >
      <label
        :for="`${uniqGroupName}${i}`"
        :class="[{'_picked': value === item[valueAlias]}, type]"
      >
        {{ item.name }}
      </label>
      <input
        v-show="false"
        :id="`${uniqGroupName}${i}`"
        type="radio"
        :name="uniqGroupName"
        :value="item[valueAlias]"
        @change="handleChange(item)"
      >
    </div>
  </div>
</template>

<script>

/**
 * @desc Универсальный компонент радио-кнопок
 * @vue-prop {String} [type='square'] type - Форма кнопок. square/round
 * @vue-prop {String} [uniqGroupName='buttonGroup'] uniqGroupName - У каждой группы кнопок
 * на странице должно быть уникальное имя,
 * иначе кнопки во вроде бы разных частях страницы будут срабатывать синхронно
 * @vue-prop {String} [valueAlias='value'] valueAlias - Замена главного поля,
 * которое отвечает за выбор элемента
 * @vue-prop {Array} [list=[]]  list- Список кнопок. Кнопка должна состоять из ключей name и value
 * @vue-prop {Boolean} [essentialPickedFirst=true] essentialPickedFirst - Нужно ли при
 * загрузке страницы выбирать первый айтем
 * @vue-prop {Object} [picked={}] picked - Выбранный из другого места итем
 */

export default {
  name: 'RRadio',

  props: {
    type: {
      type: String,
      default: 'square',
      validator: type => ['square', 'round'].indexOf(type) > -1,
    },
    uniqGroupName: {
      type: String,
      default: 'radioGroup',
    },
    list: {
      type: Array,
      default: () => [],
    },
    essentialPickedFirst: {
      type: Boolean,
      default: true,
    },
    picked: {
      type: Object,
      default: () => {},
    },
    valueAlias: {
      type: String,
      default: 'value',
    },
  },

  data: () => ({
    value: '',
  }),

  watch: {
    picked(pickedItem) {
      this.handleOuterPicked(pickedItem);
    },
  },

  mounted() {
    if (this.essentialPickedFirst && this.list.length) {
      this.handleChange(this.list[0]);
    }

    if (this.picked && Object.keys(this.picked).length) {
      this.handleOuterPicked(this.picked);
    }
  },

  methods: {
    /**
     * Обработчик выбора элемента
     * @param item - выбранный элемент, получен из шаблона
     */
    handleChange(item) {
      this.value = item[this.valueAlias];
      this.$emit('picked', item);
    },

    /**
     * Обработчик выбранного извне элемента
     * он позволяет безопасно установить его текущим выбранном в компоненте
     * @param pickedItem - выбранный элемент полученный извне
     */
    handleOuterPicked(pickedItem) {
      if (pickedItem[this.valueAlias] !== this.value) {
        this.value = pickedItem[this.valueAlias];
      }
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

  &.square,
  &.round {

    &::before {
      content: "";
      position: absolute;
      top: 1px;
      left: 0;
      width: 17px;
      height: 17px;
      border-radius: 2px;
      border: 1px solid #1C9AD0;
    }

    &::after {
      content: "";
      position: absolute;
      top: 4px;
      left: 3px;
      width: 11px;
      height: 11px;
      border-radius: 2px;
      background: #1C9AD0;
    }
  }

  &.round {

    &::before {
      border-radius: 50%;
    }

    &::after {
      border-radius: 50%;
    }
  }

  &:not(._picked) {
    opacity: .5;

    &:after {
      content: none;
    }
  }
}
</style>
