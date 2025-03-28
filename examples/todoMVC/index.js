import { createApp, HashRouter } from "../../src/index.js";
import { App } from "./src/app.js";

const router = new HashRouter([
    { path: "/", component: null },
    { path: "/active", component: null },
    { path: "/completed", component: null }
]);

const app = createApp(App, {}, { router });
app.mount(document.body);
