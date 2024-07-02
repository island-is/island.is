#!/usr/bin/env node
// @ts-check

import { runCommand } from './cache/_utils.mjs'

const APP = process.argv[2]
if (!APP) {
  throw new Error('APP not provided')
}
const data = JSON.parse(await runCommand(`yarn nx show project ${APP}`))
const {
  targets: { build },
} = data

const options = build?.options ?? {}
let output = build?.outputs?.[0] ?? options.outputPath

if (!output) {
  throw new Error(`Could not find output path for ${APP}`)
}

for (const [key, value] of Object.entries(options)) {
  output = output.replaceAll(`{options.${key}}`, value)
}
output = output.replaceAll(`{workspaceRoot}/`, '')

console.log(output)
