export default {
  props: ["content"],
  template: `
  <iframe
    style="border-width: 0px; width: 50vw; height: 100vh;"
    :srcdoc="content"
  />
  `
};
