<template>
  <button
    class="r-button"
    :disabled="disabled"
    :type="nativeType"
    @click="handleClick"
  >
    <span v-if="$slots.default">
      <slot />
    </span>
  </button>
</template>
<script>
export default {

  name: 'RButton',

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    nativeType: {
      type: String,
      default: 'button',
      validator: (value) => (['button', 'submit'].indexOf(value) !== -1),
    },
  },

  methods: {
    handleClick() {
      this.$emit('click');
    },
  },

};
</script>
<style lang="scss" scoped>
  button {

    &:disabled {
      cursor: not-allowed;
    }
  }
</style>
