import "@logseq/libs";

import React from "react";
import * as ReactDOM from "react-dom/client";

import App from "./App";
import { logseq as PL } from "../package.json";

import "./index.css";

const pluginId = PL.id;

function main() {
  console.info(`#${pluginId}: MAIN`);

  const root = ReactDOM.createRoot(document.getElementById("app")!);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  logseq.App.registerUIItem("toolbar", {
    key: pluginId,
    template: `
      <div data-on-click="showMainUI" title='Timeline' class='button'>
        <svg t="1692073400618" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18001" width="20" height="20">
          <path d="M600 160H168a40 40 0 0 0-40 40v236a40 40 0 0 0 40 40h432a40 40 0 0 0 40-40V200a40 40 0 0 0-40-40z m-32 244H200V232h368z m32 144H168a40 40 0 0 0-40 40v236a40 40 0 0 0 40 40h432a40 40 0 0 0 40-40V588a40 40 0 0 0-40-40z m-32 244H200V620h368z m274-366.9V132a4 4 0 0 0-4-4h-64a4 4 0 0 0-4 4v293.1a94.1 94.1 0 0 0 0 173.8V892a4 4 0 0 0 4 4h64a4 4 0 0 0 4-4V598.9a94.1 94.1 0 0 0 0-173.8z" p-id="18002" fill="#ffffff"></path>
        </svg>
      <div>
    `,
  });

  logseq.provideModel({
    showMainUI() {
      logseq.showMainUI();
    },
  });
}

logseq.ready(main).catch(console.error);
