import { any, titleCase } from "https://designstem.github.io/fachwerk/utils.js";

import Me from "./components/Me.js";
import User from "./components/User.js";
import Preview from "./components/Preview.js";
import Theme from "./components/Theme.js";
import ChatMessage from "./components/ChatMessage.js";

import { animals } from "./names.js";

const debounce = (fn, time) => {
  let timeout;
  return function() {
    const functionCall = () => fn.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
};

const FEditorButton = {
  template: `
  <span style="color: var(--secondary); font-size: calc(var(--base) * 1.5); font-family: var(--mono); cursor: pointer; padding: 2px; margin-right: var(--base);">
    <slot />
  </span>
  `
};

const HtmlEditor = {
  props: ["value"],
  data: () => ({ editor: null }),
  methods: {
    onFormat() {
      const doc = this.editor.getDoc();
      const { ch, line } = doc.getCursor();
      const { formatted, cursorOffset } = prettier.formatWithCursor(
        this.editor.getValue(),
        {
          printWidth: 60,
          cursorOffset: ch,
          parser: "html",
          plugins: prettierPlugins
        }
      );
      this.editor.setValue(formatted);
      doc.setCursor({ ch: cursorOffset, line });
      this.editor.focus();
    }
  },
  mounted() {
    this.editor = CodeMirror(this.$refs.editor, {
      mode: "htmlmixed",
      theme: "material",
      lineWrapping: true,
      viewportMargin: Infinity,
      tabSize: 2,
      lineNumbers: true
    });
    this.editor.setValue(this.value);
    this.editor.on("change", debounce(editor => {
        this.$emit("input", editor.getValue())
    }, 100));
  },
  template: `
  <div style="position: relative;">
    <div style="position: absolute; top: 0; right: 0; bottom: 0; left: 0;" ref="editor" />
  </div>
  `
};

new Vue({
  el: "#app",
  components: { Theme, Me, User, Preview, ChatMessage, HtmlEditor },
  data: {
    name: "",
    displayname: "",
    filterName: "",
    messages: [],
    currentMessage: "",
    socket: null,
    theme: 0,
    currentChat: '',
    chatMessages: []
  },
  mounted() {

    const messages = store.get("messages");
    if (messages) {
      this.messages = messages
    }
    const chatMessages = store.get("chatMessages");
    if (chatMessages) {
      this.chatMessages = chatMessages
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
      this.socket.emit('message', { message: this.currentMessage, name: this.name, displayname: this.displayname, type: 'code' })
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
      if (m.type == 'chat') {
        this.chatMessages.push(m);
        store.set("chatMessages", this.chatMessages);
      }
    });

    this.$refs.chat.onkeydown = function(e) {
      if (e.keyCode === 9) {
        const val = this.value;
        const start = this.selectionStart;
        const end = this.selectionEnd;
        this.value = val.substring(0, start) + "  " + val.substring(end);
        this.selectionStart = this.selectionEnd = start + 2;
        return false;
      }
    };

    this.$refs.chat.focus();

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
          v-for="(m,i) in messages.filter(m => m.name !== name)"
          :key="i"
          :class="{ selected: m.name === filterName }"
          @click.native="filterName = m.name"
          :displayname="m.displayname"
          :message="m.message"
        />
        <User
          :class="{ selected: filterName === 'chat' }"
          @click.native="filterName = 'chat'"
          displayname="Group chat"
          :message="'a'"
        />
      </aside>

      <div v-show="name !== filterName && filterName === 'chat'"
        style="display: flex; flex-direction: column; flex: 0.9;
  height: 100vh; position: relative; padding: 15px; background: var(--user-textarea-bg)"
      >
        <div style="flex: 1.5; overflow: auto;">
          <ChatMessage
            v-for="(message,i) in chatMessages"
            :key="i"
            :message="message"
          />
        </div>
        <textarea
          placeholder="Send a message to the group"
          ref="editor"
          class="me-textarea"
          style="flex: 0.5; background: var(--chat-textarea-bg); resize: none;"
          rows="20"
          type="text"
          v-model="currentChat"
          @keyup.shift.enter="socket.emit('message', { message: currentChat, name, displayname, type: 'chat' }); currentChat = ''"
        />
        <div
          style="position: absolute; right: 25px; bottom: 25px; color: var(--user-textarea-color); cursor: pointer;"
          @click="socket.emit('message', { message: currentChat, name, displayname, type: 'chat' }); currentChat = ''"
        >Send</div>
      </div>

      <textarea
        class="user-textarea"
        disabled
        v-if="name !== filterName && filterName !== 'chat'"
        rows="20"
        type="text"
        v-model="messages.filter(m => m.name === filterName && m.type == 'code')[0].message"
      />

      <div style="flex: 1">
      <HtmlEditor
        v-model="currentMessage"
      />
      </div>

      <Preview
        v-if="name === filterName && filterName !== 'chat'"
        style="flex: 1" :content="currentMessage"
      />

  </main>
  <div
    @click="theme = 1 - theme"
    style="
      position: fixed;
      left: 10px;
      bottom: 10px;
      cursor: pointer;
      color: var(--themebutton);
    "
  >⬤</div>
  </Theme>
  `
});
