export default {
  props: ["displayname", "value", "message"],
  data: () => ({ currentValue: '', timeout: false, active: true }),
  mounted() {
    //this.currentValue = this.value
    this.$watch(
      "message",
      _ => {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.active = true;
        this.timeout = setTimeout(() => (this.active = false), 1000*60*2);
      },
      { immediate: true }
    );
  },
  unmounted() {
    clearTimeout(this.timeout);
  },
  template: `
  <div class="user">
    <div style="display: flex">
    <div
      :style="{color: active ? 'var(--active)' : 'var(--inactive)'}"
    >●</div>&nbsp;&nbsp;
    </div>
    <div
      v-if="!value"
      :style="{transition: 'all 1s', opacity: active ? 1 : 0.25}"
    >{{ displayname }}</div>
</div>
  </div>
  `
};
