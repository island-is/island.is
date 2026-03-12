#!/usr/bin/env node
/**
 * Generates .tsx React components from .svg source files.
 * The .svg files in svg/ directories are the single source of truth.
 *
 * Usage: node generate-components.mjs
 *
 * For new logos:
 *   1. Place the .svg file in the svg/ directory
 *   2. Run this script
 *   3. Update index.ts to export the new component
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SVG_TO_JSX_ATTRS = {
  'accent-height': 'accentHeight',
  'alignment-baseline': 'alignmentBaseline',
  'clip-path': 'clipPath',
  'clip-rule': 'clipRule',
  'color-interpolation': 'colorInterpolation',
  'color-interpolation-filters': 'colorInterpolationFilters',
  'dominant-baseline': 'dominantBaseline',
  'fill-opacity': 'fillOpacity',
  'fill-rule': 'fillRule',
  'flood-color': 'floodColor',
  'flood-opacity': 'floodOpacity',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-style': 'fontStyle',
  'font-variant': 'fontVariant',
  'font-weight': 'fontWeight',
  'image-rendering': 'imageRendering',
  'letter-spacing': 'letterSpacing',
  'lighting-color': 'lightingColor',
  'marker-end': 'markerEnd',
  'marker-mid': 'markerMid',
  'marker-start': 'markerStart',
  'paint-order': 'paintOrder',
  'pointer-events': 'pointerEvents',
  'shape-rendering': 'shapeRendering',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-opacity': 'strokeOpacity',
  'stroke-width': 'strokeWidth',
  'text-anchor': 'textAnchor',
  'text-decoration': 'textDecoration',
  'text-rendering': 'textRendering',
  'word-spacing': 'wordSpacing',
  'writing-mode': 'writingMode',
  'xlink:href': 'xlinkHref',
  'xlink:show': 'xlinkShow',
  'xlink:title': 'xlinkTitle',
  'xlink:type': 'xlinkType',
  'xml:lang': 'xmlLang',
  'xml:space': 'xmlSpace',
  class: 'className',
  for: 'htmlFor',
  tabindex: 'tabIndex',
}

function svgToJsx(svg) {
  let result = svg
  result = result.replace(/<\?xml[^?]*\?>\s*/g, '')
  result = result.replace(/\s+xmlns:xlink="[^"]*"/g, '')
  // Remove comments
  result = result.replace(/<!--[\s\S]*?-->/g, '')

  for (const [svgAttr, jsxAttr] of Object.entries(SVG_TO_JSX_ATTRS)) {
    const escaped = svgAttr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    result = result.replace(
      new RegExp(`(\\s)${escaped}(\\s*=)`, 'g'),
      `$1${jsxAttr}$2`,
    )
  }

  return result
}

function getComponentInfo(tsxPath) {
  if (!fs.existsSync(tsxPath)) return null
  const content = fs.readFileSync(tsxPath, 'utf8')
  const nameMatch = content.match(/export\s+const\s+(\w+)\s*[=:]/)
  const hasDefault = /export\s+default\s+/.test(content)
  return nameMatch ? { name: nameMatch[1], hasDefault } : null
}

function defaultComponentName(svgFilename) {
  return svgFilename.replace(/\.svg$/, '')
}

function generateTsx(componentName, svgContent, svgFilename, hasDefault) {
  const jsx = svgToJsx(svgContent).trim()

  let code = `// @generated — Do not edit. Source: svg/${svgFilename}\n`
  code += `// To regenerate: node generate-components.mjs\n`
  code += `import React, { FC } from 'react'\n\n`
  code += `export const ${componentName}: FC<React.PropsWithChildren<unknown>> = () => (\n`
  code += `  ${jsx}\n`
  code += `)\n`

  if (hasDefault) {
    code += `\nexport default ${componentName}\n`
  }

  return code
}

function processDirectory(svgDir, outDir) {
  if (!fs.existsSync(svgDir)) return 0

  const svgFiles = fs.readdirSync(svgDir).filter((f) => f.endsWith('.svg'))
  if (svgFiles.length === 0) return 0

  fs.mkdirSync(outDir, { recursive: true })
  let count = 0

  for (const svgFile of svgFiles) {
    const svgPath = path.join(svgDir, svgFile)
    const basename = svgFile.replace(/\.svg$/, '')
    const tsxPath = path.join(outDir, basename + '.tsx')

    const svgContent = fs.readFileSync(svgPath, 'utf8')

    const info = getComponentInfo(tsxPath)
    const componentName = info?.name ?? defaultComponentName(svgFile)
    const hasDefault = info?.hasDefault ?? false

    const tsx = generateTsx(componentName, svgContent, svgFile, hasDefault)
    fs.writeFileSync(tsxPath, tsx, 'utf8')

    console.log(
      `GENERATED: ${path.relative(__dirname, tsxPath)} (${componentName})`,
    )
    count++
  }

  return count
}

const generatedDir = path.join(__dirname, 'generated')

let total = 0
total += processDirectory(path.join(__dirname, 'svg'), generatedDir)

const municipalitiesSvgDir = path.join(__dirname, 'municipalities', 'svg')
const municipalitiesOutDir = path.join(generatedDir, 'municipalities')
total += processDirectory(municipalitiesSvgDir, municipalitiesOutDir)

console.log(`\nGenerated ${total} components into generated/.`)
