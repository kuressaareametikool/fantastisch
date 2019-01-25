import { emojis } from '../emojis.js'

export default {
  props: ["value", "message"],
  data: () => ({
    currentValue: "",
    timeout: false,
    active: true,
    state: "idle",
    emojis: emojis,
  }),
  mounted() {
    this.$watch("value", value => (this.currentValue = value), {
      immediate: true
    });
    this.$watch("state", state => {
      if (state == "edit") {
        this.$refs.edit.focus();
      }
    });
    this.$watch(
      "message",
      _ => {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.active = true;
        this.timeout = setTimeout(() => (this.active = false), 1000 * 60 * 2);
      },
      { immediate: true }
    );
  },
  unmounted() {
    clearTimeout(this.timeout);
  },
  methods: {
    log(a) {
      console.log(a);
    },
    insertEmoji(emoji) {
      var startPos = this.$refs.edit.selectionStart;
      var endPos = this.$refs.edit.selectionEnd;
      this.$refs.edit.value =
        this.$refs.edit.value.substring(0, startPos) +
        emoji +
        this.$refs.edit.value.substring(endPos, this.$refs.edit.value.length);
      this.$refs.edit.selectionStart = startPos + 2;
      this.$refs.edit.selectionEnd = startPos + 2;
    }
  },
  template: `<div class="me">
  <div class="edit">
    <div style="display: flex;">
      <div
        :style="{color: active ? 'var(--active)' : 'var(--inactive)'}"
      >●</div>&nbsp;
      <div
      v-if="state == 'idle' || state == 'hover'"
      >
        {{ value }}
      </div>
      <input
        v-show="state === 'edit'"
        ref="edit"
        type="text"
        v-model="currentValue"
        @keyup.enter="$emit('input', currentValue); state = 'idle';"
        @keyup.esc="state = 'idle';"
      />
    </div>
    <div style="opacity: 0.5; display: flex;">
      <div
        v-if="state == 'idle'"
        @mouseover="state = 'hover'"
      >Me</div>
      <div
        v-if="state == 'hover'"
        @mouseout="state = 'idle'"
        @click="state = 'edit';"
      >Edit</div>
      <div
        v-if="state == 'edit'"
        @click="$emit('input', currentValue); state = 'idle';"
      >✔</div>
      <div 
        v-if="state == 'edit'" 
        @click="state = 'idle';"
      >&nbsp;&nbsp;✕</div>
    </div>
    </div>
   <div 
      v-show="state === 'edit'" 
      style="padding-top: 10px"
    >
    <a
      v-for="(help, emoji) in emojis"
      :title="help"
      @click="insertEmoji(emoji)"
    >{{ emoji }}</a>
    </div>
  </div>
  `
};
