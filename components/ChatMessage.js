export default {
  props: ['message'],
  template: `
  <div style="margin-bottom: 15px;">
    <div style="
      color: var(--user-textarea-color);
      margin-bottom: 5px;
      font-size: 13px;
    ">
      {{ message.displayname }}
    </div>
    <div rows="1" style="
      background: 15px;
      padding: 15px;
      background: var(--chat-textarea-bg);
      color: var(--me-textarea-color);
      font-family: Cousine, sans-serif;
      white-space: pre-wrap;
      line-height: 1.5em;
    "
    v-text="message.message.trim()"
    />
  </div>
  `
}