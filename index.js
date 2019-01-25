import { any, titleCase } from "https://designstem.github.io/fachwerk/utils.js";

import Me from "./components/Me.js";
import User from "./components/User.js";
import Preview from "./components/Preview.js";
import Theme from "./components/Theme.js";

import { animals } from "./names.js";

new Vue({
  el: "#app",
  components: { Theme, Me, User, Preview },
  data: {
    name: "",
    displayname: "",
    filterName: "",
    messages: [],
    currentMessage: "",
    socket: null,
    theme: 1,
  },
  mounted() {

    const messages = store.get("messages");
    if (messages) {
      this.messages = messages
    }
    const currentMessage = store.get("currentMessage");
    if (currentMessage) {
      this.currentMessage = currentMessage
    }
    const name = store.get("name");
    const displayname = store.get("displayname");
    this.name = name || titleCase(any(animals));
    this.displayname = displayname || this.name;
    store.set("name", this.name);
    store.set("displayname", this.displayname);

    this.filterName = this.name;

    this.$watch("displayname", newDisplayname => {
      store.set("displayname", newDisplayname);
    });

    this.$watch("currentMessage", currentMessage => {
      store.set("currentMessage", currentMessage);
    });

    this.socket = io.connect("https://fantastischserver.now.sh");
    this.socket.on("message", m => {
      if (m.name !== name && m.type == 'code') {
        const index = this.messages.findIndex(
          messages => messages.name === m.name
        );
        if (index > -1) {
          this.$set(this.messages, index, m);
        } else {
          this.messages.push(m);
        }
        store.set("messages", this.messages);
      }
    });

    this.$refs.editor.onkeydown = function(e) {
      if (e.keyCode === 9) {
        const val = this.value;
        const start = this.selectionStart;
        const end = this.selectionEnd;
        this.value = val.substring(0, start) + "  " + val.substring(end);
        this.selectionStart = this.selectionEnd = start + 2;
        return false;
      }
    };
  },
  template: `
    <Theme :theme="['blue','pink'][theme]">
    <main>
      <aside>
        <Me
          :class="{ selected: name === filterName }"
          @click.native="filterName = name"
          v-model="displayname"
          :message="currentMessage"
        />
        <User
          v-for="m in messages.filter(m => m.name !== name)"
          :class="{ selected: m.name === filterName }"
          @click.native="filterName = m.name"
          :displayname="m.displayname"
          :message="m.message"
        />
      </aside>
      <textarea
        v-if="name === filterName"
        ref="editor"
        rows="20"
        type="text"
        v-model="currentMessage"
        @input="socket.emit('message', { message: currentMessage, name, displayname, type: 'code' })"
      />
      <textarea
        disabled
        v-if="name !== filterName"
        rows="20"
        type="text"
        v-model="messages.filter(m => m.name === filterName)[0].message"
      />
      <Preview style="flex: 1" :content="currentMessage" />
  </main>
  <button @click="theme = 1 - theme" style="position: fixed; left: 10px; bottom: 10px;">Change theme</button>
  </Theme>
  `
});
