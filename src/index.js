import App from './App.svelte';
// import 'drag-drop-touch';
const app = new App({
  target: document.body,
  props: {
    name: 'Svelte'
  }
});

export default app;
