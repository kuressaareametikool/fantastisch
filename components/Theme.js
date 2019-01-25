export default {
  props: ["theme"],
  data: () => ({
    themes: {
      blue: {
        "--me-textarea-bg": "hsl(200, 19%, 18%)",
        "--user-textarea-bg": "hsl(200, 19%, 28%)",
        "--me-textarea-color": "hsla(0, 0%, 100%, 0.8)",
        "--user-textarea-color": "hsla(0, 0%, 100%, 0.6)",
        "--aside-bg": "hsl(200, 19%, 12%)",
        "--active": "green",
        "--inactive": "hsla(0, 0%, 100%, 0.2)",
      },
      pink: {
        "--me-textarea-bg": "hsl(0, 62%, 79%)",
        "--user-textarea-bg": "hsl(0, 62%, 89%)",
        "--me-textarea-color": "hsla(0, 0%, 0%, 0.8)",
        "--user-textarea-color": "hsla(0, 0%, 0%, 0.6)",
        "--aside-bg": "hsl(0, 62%, 95%)",
        "--active": "#56e39f",
        "--inactive": "hsla(0, 0%, 0%, 0.2)",
      }
    }
  }),
  template: `
    <div :style="themes[theme]">
      <slot />
    </div>
  `
};
