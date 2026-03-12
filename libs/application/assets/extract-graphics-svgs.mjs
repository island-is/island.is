#!/usr/bin/env node
/**
 * One-time script: extracts inline SVG from graphics/*.tsx into graphics/svg/*.svg
 * Run once, then delete this file.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const graphicsDir = path.join(__dirname, 'graphics')
const svgDir = path.join(graphicsDir, 'svg')

const JSX_TO_SVG_ATTRS = {
  clipPath: 'clip-path',
  clipRule: 'clip-rule',
  fillOpacity: 'fill-opacity',
  fillRule: 'fill-rule',
  floodColor: 'flood-color',
  floodOpacity: 'flood-opacity',
  fontFamily: 'font-family',
  fontSize: 'font-size',
  fontStyle: 'font-style',
  fontWeight: 'font-weight',
  stopColor: 'stop-color',
  stopOpacity: 'stop-opacity',
  strokeDasharray: 'stroke-dasharray',
  strokeDashoffset: 'stroke-dashoffset',
  strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin',
  strokeMiterlimit: 'stroke-miterlimit',
  strokeOpacity: 'stroke-opacity',
  strokeWidth: 'stroke-width',
  textAnchor: 'text-anchor',
  textDecoration: 'text-decoration',
  xlinkHref: 'xlink:href',
  className: 'class',
  htmlFor: 'for',
  tabIndex: 'tabindex',
}

function jsxToSvg(jsx) {
  let result = jsx
  for (const [jsxAttr, svgAttr] of Object.entries(JSX_TO_SVG_ATTRS)) {
    result = result.replace(
      new RegExp(`(\\s)${jsxAttr}(\\s*=)`, 'g'),
      `$1${svgAttr}$2`,
    )
  }
  if (!result.includes('xmlns=')) {
    result = result.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
  }
  return result
}

fs.mkdirSync(svgDir, { recursive: true })

const tsxFiles = fs
  .readdirSync(graphicsDir)
  .filter((f) => f.endsWith('.tsx') && f !== 'index.ts')

for (const file of tsxFiles) {
  const content = fs.readFileSync(path.join(graphicsDir, file), 'utf8')
  const match = content.match(/(<svg[\s\S]*<\/svg>)/)
  if (!match) {
    console.log(`SKIP: ${file} (no <svg> found)`)
    continue
  }
  const svgContent = jsxToSvg(match[1])
  const svgFilename = file.replace(/\.tsx$/, '.svg')
  fs.writeFileSync(path.join(svgDir, svgFilename), svgContent + '\n', 'utf8')
  console.log(`EXTRACTED: ${svgFilename}`)
}

console.log('\nDone. You can delete this script now.')
