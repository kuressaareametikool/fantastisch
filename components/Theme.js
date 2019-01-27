export default {
  props: ["theme"],
  data: () => ({
    themes: {
      blue: {
        "--chat-textarea-bg": "hsl(200, 19%, 24%)",
        "--me-textarea-bg": "hsl(200, 19%, 18%)",
        "--user-textarea-bg": "hsl(200, 19%, 28%)",
        "--me-textarea-color": "hsla(0, 0%, 100%, 0.8)",
        "--user-textarea-color": "hsla(0, 0%, 100%, 0.6)",
        "--aside-bg": "hsl(200, 19%, 12%)",
        "--active": "green",
        "--inactive": "hsla(0, 0%, 100%, 0.2)",
        "--themebutton": "hsl(0, 62%, 79%)",
      },
      pink: {
        "--chat-textarea-bg": "hsl(0, 50%, 88%)",
        "--me-textarea-bg": "hsl(0, 50%, 87%)",
        "--user-textarea-bg": "hsl(0, 50%, 92%)",
        "--me-textarea-color": "hsla(0, 0%, 0%, 0.8)",
        "--user-textarea-color": "hsla(0, 0%, 0%, 0.8)",
        "--aside-bg": "hsl(0, 50%, 78%)",
        "--active": "#56e39f",
        "--inactive": "hsla(0, 0%, 0%, 0.2)",
        "--themebutton": "hsl(200, 19%, 18%)",
      }
    }
  }),
  template: `
    <div :style="themes[theme]">
      <slot />
    </div>
  `
};
