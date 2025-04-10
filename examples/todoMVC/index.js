import { createApp } from "../../src/index.js";
import { App } from "./src/app.js";

const app = createApp(App);
app.mount(document.body);
