//import * as components from "https://designstem.github.io/fachwerk/components.js";
//import { Init } from "https://designstem.github.io/fachwerk/mixins.js";
// for (const name in components) {
//   Vue.component(name, components[name]);
// }

import { any } from "https://designstem.github.io/fachwerk/utils.js";

import { animals } from "./names.js";

new Vue({
  el: "#app",
  data: {
    name: "",
    filterName: "",
    messages: [],
    currentMessage: "",
    socket: null
  },
  mounted() {
    this.name = any(animals);
    this.filterName = this.name
    this.socket = io.connect("https://fantastischserver.now.sh");
    this.socket.on("message", m => {
      if (m.name !== name) {
      const index = this.messages.findIndex(
        messages => messages.name === m.name
      );
      if (index > -1) {
        this.$set(this.messages, index, m);
      } else {
        this.messages.push(m);
      }
    }
    });
  },
  template: `
    <div>
      <div
        v-for="m in messages"
        :style="{fontWeight: m.name === filterName ? 'bold' : 'normal'}"
        @click="filterName = m.name"
      >{{ m.name }}</div>
      <textarea
        v-if="name === filterName"
        rows="20"
        type="text"
        v-model="currentMessage"
        @input="socket.emit('message', { message: currentMessage, name })"
      />
      <textarea
        disabled
        v-if="name !== filterName"
        rows="20"
        type="text"
        v-model="messages.filter(m => m.name === filterName)[0].message"
      />
    </div>
  `
});
