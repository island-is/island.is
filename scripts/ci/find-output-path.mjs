#!/usr/bin/env node
// @ts-check

import { runCommand } from "./cache/_utils.mjs";

const APP = process.argv[2];

const data = JSON.parse(await runCommand(`yarn nx show project ${APP}`))
const {
  targets: {
    build: { outputs, options },
  },
} = data

let output = outputs[0]
for (const [key, value] of Object.entries(options)) {
  output = output.replace(`{options.${key}}`, value)
}

console.log(output);
