#!/usr/bin/env node
const { join } = require('path')
const { existsSync, readFileSync, writeFileSync } = require('fs')
//
// Provide environment variables for static frontends by checking referenced
// variables in the code and inject them into index.html
//

const workDir = process.argv[2] ?? '/usr/share/nginx/html'
const file = join(workDir, 'index.src.html')
const fileOut = join(workDir, 'index.html')
const placeholder = '<!-- environment placeholder -->'

if (
  existsSync(file) &&
  readFileSync(file, { encoding: 'utf-8' }).indexOf(placeholder) > -1
) {
  console.log('Extracting environment')
  const public = Object.entries(process.env)
    .filter(
      ([name, _val]) =>
        name.startsWith('SI_PUBLIC_') ||
        ['APP_VERSION', 'PROD_MODE'].includes(name),
    )
    .reduce((acc, [name, value]) => ({ ...acc, [name]: value }), {})
  console.log(`Extracted ${Object.keys(public)} keys`)
  const templateContent = readFileSync(file, { encoding: 'utf-8' })
  const output = templateContent.replace(
    placeholder,
    `<script id="__SI_ENVIRONMENT__" type="application/json">${JSON.stringify(
      public,
    )}</script>`,
  )
  writeFileSync(fileOut, output, { encoding: 'utf-8' })
} else {
  console.error(`No template to fix`)
}
