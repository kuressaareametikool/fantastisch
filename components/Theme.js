export default {
  props: ["theme"],
  data: () => ({
    themes: {
      blue: {
        "--textarea-bg": "hsl(200, 19%, 18%)",
        "--textarea-color": "hsla(0, 0%, 100%, 0.8)",
        "--textarea-color-disabled": "hsla(0, 0%, 100%, 0.3)",
        "--aside-bg": "hsl(200, 19%, 12%)",
        "--active": "green",
        "--inactive": "hsla(0, 0%, 100%, 0.2)",
      },
      pink: {
        "--me-textarea-bg": "hsl(0, 62%, 79%)",
        "--user-textarea-bg": "hsl(0, 62%, 89%)",
        "--me-textarea-color": "hsla(0, 0%, 0%, 0.8)",
        "--user-textarea-color": "hsla(0, 0%, 0%, 0.5)",
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
