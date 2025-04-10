import { createApp, HashRouter } from "../../src/index.js";
import { App } from "./src/app.js";

const router = new HashRouter([
    { path: "/"},
    { path: "/active"},
    { path: "/completed"}
]);

const app = createApp(App, {}, { router });
app.mount(document.body);
