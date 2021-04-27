<template>
  <div
    class="selector-container"
    :class="{'_is-error': error, '_open': opened, '_disabled': disabled}"
    v-click-outside="handleClickOutside"
  >
    <!--Головная часть селектора-->
    <div class="selector-head" @click="handleHeaderClick">
      <img class="arrow" src="./ico/arrow-bottom.svg">
      <!--Ошибка в селекторе-->
      <div v-if="error" class="message">
        {{ error }}
      </div>
      <!--Плейсхолдер при отсуствии выбранного значения-->
      <div v-if="!picked || Object.keys(picked).length === 0" class="placeholder">
        {{ placeholder }}
      </div>
      <!--выбранное значение-->
      <div v-if="picked && Object.keys(picked).length" class="picked-container _truncate">
        {{ picked[nameValue] }}
      </div>
    </div>

    <!--Выпадашка селектора-->
    <div v-if="opened" class="selector-popup">
      <div
        v-for="(item, i) in options"
        :key="i"
        class="item _truncate"
        :class="{'_active': item[nameValue] === picked[nameValue]}"
        @click="handlePickItem(item)"
      >
        {{ item[nameValue] }}
      </div>
    </div>
  </div>
</template>
<script>
import vClickOutside from 'v-click-outside';

export default {

  /**
   * @desc Универсальный компонент селектора. На данный момент невозможно контролировать контент
   * выбранного итема и доступных итемов
   * @vue-prop { Boolean } [disabled=false] disabled - Перевод селектора в пасивный режим
   * без возможности взаимодействия
   * @vue-prop { String } [placeholder=''] placeholder - Показывается если не выбран айтем
   * @vue-prop { Object } [pickedItem={}] pickedItem - При установке данного пропса,
   * селектор принимает его значение
   * @vue-prop { Array } [options=[]] options - Массив опций
   * @vue-prop { String } [nameValue=''] nameValue - На случай если переменная для
   * отображения отлична от name
   * @vue-prop { String } [error=''] error - При получении данного пропа
   * появляется сообщение об ошибке
   * @vue-emit { Object } [picked=''] picked - выбранный объект
   */

  name: 'RSelector',

  directives: {
    clickOutside: vClickOutside.directive,
  },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    pickedItem: {
      type: [Object, String],
      default: () => {},
    },
    options: {
      type: Array,
      default: () => [],
    },
    nameValue: {
      type: String,
      default: 'name',
    },
    error: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    picked: {},
    opened: false,
  }),

  watch: {
    pickedItem() {
      this.setPicked();
    },
  },

  mounted() {
    this.setPicked();
  },

  methods: {
    /**
     * Установка значения полученного извне
     */
    setPicked() {
      if (this.pickedItem && typeof this.pickedItem === 'string') {
        this.picked = {
          [this.nameValue]: this.pickedItem,
        };
        return;
      }
      if (this.pickedItem && Object.keys(this.pickedItem).length) {
        this.picked = this.pickedItem;
      }
    },

    /**
     * Клик по шапке селектра. Это то место где отображаются плейсхолдеры и выбранные элементы
     */
    handleHeaderClick() {
      this.opened = !this.opened;
    },

    /**
     * Открытие модалки с опшинами, вызывается из других компонентов по надобности
     */
    openPopup() {
      this.opened = true;
    },

    /**
     * Клик вне селектора, закрывает выпадашку
     */
    handleClickOutside() {
      this.opened = false;
    },

    /**
     * Обработчик клика по элементу в выпадашке
     */
    handlePickItem(item) {
      this.picked = item;
      this.$emit('picked', item);
      this.handleClickOutside();
    },

    /**
     * Сброс значений
     */
    dropValue() {
      this.picked = {};
    },
  },
};
</script>
<style lang="scss" scoped>
.selector-container {
  position: relative;

  &._open {

    .arrow {
      transform: rotate(180deg) translateY(1px);
    }
  }

  &._disabled {
    pointer-events: none;
    opacity: .5;
  }
}

.placeholder {
  color: gray;
}

.message {
  position: absolute;
  top: 0;
  left: 0;
}

.selector-head {
  position: relative;
  padding: {
    top: 10px;
    right: 26px;
    bottom: 10px;
    left: 12px;
  };
  border-radius: 2px;
  border: 1px solid black;
  cursor: pointer;
}

.selector-popup {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #fff;
  box-shadow: 0 6px 20px rgba(30, 25, 63, .1);
}

.item {
  padding: 9px 10px;
  cursor: pointer;

  &:hover:not(._active) {
    background: gray;
  }

  &._active {
    color: gray;
  }
}

.arrow {
  position: absolute;
  top: calc(50% - 1px);
  right: 12px;
  transition: transform .2s;
}
</style>
