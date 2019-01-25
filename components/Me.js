export default {
  props: ["value", "message"],
  data: () => ({
    currentValue: "",
    timeout: false,
    active: true,
    state: "idle"
  }),
  mounted() {
    this.$watch("value", value => (this.currentValue = value), {
      immediate: true
    });
    this.$watch("state", state => { if (state == 'edit') {
      this.$refs.edit.focus()
    }});
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
  methods: { log(a) { console.log(a)} },
  template: ` <div>
  <div class="me">
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
    style="padding: 10px">
    <a title="help">💬</a>
    <a title="look">👁</a>
    <a title="help me!">️‍ </a>
    <a title="I am a mouse">🐹</a>
    <a title="busy">🔒</a>
    <a title="phone">📞</a> 
    <a title="vacation">✈</a> 
    <a title="happy">🙂</a> 
    <a title="evil">🙁</a> 
    <a title="done">✔</a> 
    <a title="dead">✝</a> 
    </div>
  </div>
  `
};
