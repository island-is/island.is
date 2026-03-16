#!/usr/bin/env node
/**
 * Generates .tsx React components from .svg source files.
 * The .svg files in svg/ directories are the single source of truth.
 *
 * Usage: node libs/application/assets/generate-components.mjs
 *
 * For new assets:
 *   1. Place the .svg file in the appropriate svg/ directory
 *   2. Run this script (or yarn codegen)
 *   3. Update the relevant index.ts to export the new component
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

/**
 * Prefixes all CSS class names defined in <style> blocks with a component-scoped
 * prefix to prevent global CSS leakage when multiple SVG components are on the same page.
 */
function scopeStyles(svg, componentName) {
  const prefix =
    componentName
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase()
      .slice(0, 12) + '_'

  const classNames = new Set()
  svg.replace(/<style[^>]*>([\s\S]*?)<\/style>/g, (_, css) => {
    let m
    const re = /\.([a-zA-Z][a-zA-Z0-9_-]*)/g
    while ((m = re.exec(css)) !== null) {
      classNames.add(m[1])
    }
  })

  if (classNames.size === 0) return svg

  // Sort longest-first so "cls-10" is replaced before "cls-1"
  const sorted = [...classNames].sort((a, b) => b.length - a.length)
  let result = svg

  for (const cls of sorted) {
    const e = cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const newCls = prefix + cls
    // Replace selector in <style> blocks
    result = result.replace(
      new RegExp(`\\.${e}(?=[{\\s,>+~:\\[])`, 'g'),
      `.${newCls}`,
    )
    // Replace in class="..." attribute values (raw SVG, before JSX conversion)
    result = result.replace(
      new RegExp(`(class="[^"]*?)\\b${e}\\b`, 'g'),
      `$1${newCls}`,
    )
  }

  return result
}

function svgToJsx(svg) {
  let result = svg
  result = result.replace(/<\?xml[^?]*\?>\s*/g, '')
  result = result.replace(/\s+xmlns:xlink="[^"]*"/g, '')
  result = result.replace(/<!--[\s\S]*?-->/g, '')
  // In JSX, <style> content must be a JS expression to avoid curly brace conflicts.
  // Strip any pre-existing {`...`} wrapper (from SVGs copied from TSX) before re-wrapping.
  result = result.replace(/<style>([\s\S]*?)<\/style>/g, (_, content) => {
    const stripped = content.replace(/^\s*\{`([\s\S]*?)`\}\s*$/, '$1')
    return `<style>{\`${stripped}\`}</style>`
  })

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

function defaultComponentName(svgFilename, suffix = 'Logo') {
  const base = svgFilename.replace(/\.svg$/, '')
  const pascal = base
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
  if (!suffix) return pascal
  return pascal.endsWith(suffix) ? pascal : pascal + suffix
}

function generateTsx(componentName, svgContent, svgRelPath, hasDefault) {
  const scoped = scopeStyles(svgContent, componentName)
  const jsx = svgToJsx(scoped).trim()

  let code = `// @generated — Do not edit. Source: ${svgRelPath}\n`
  code += `// To regenerate: yarn codegen\n`
  code += `import React, { FC } from 'react'\n\n`
  code += `export const ${componentName}: FC<React.PropsWithChildren<unknown>> = () => (\n`
  code += `  ${jsx}\n`
  code += `)\n`

  if (hasDefault) {
    code += `\nexport default ${componentName}\n`
  }

  return code
}

function processDirectory(svgDir, outDir, suffix = 'Logo') {
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
    const componentName = info?.name ?? defaultComponentName(svgFile, suffix)
    const hasDefault = info?.hasDefault ?? false

    const svgRelPath = path.relative(outDir, svgPath)
    const tsx = generateTsx(componentName, svgContent, svgRelPath, hasDefault)
    fs.writeFileSync(tsxPath, tsx, 'utf8')

    console.log(`  ${path.relative(__dirname, tsxPath)} (${componentName})`)
    count++
  }

  return count
}

// All svg → generated mappings
const tasks = [
  {
    svg: path.join(__dirname, 'institution-logos', 'svg'),
    out: path.join(__dirname, 'institution-logos', 'gen'),
    suffix: 'Logo',
  },
  {
    svg: path.join(__dirname, 'institution-logos', 'svg', 'municipalities'),
    out: path.join(__dirname, 'institution-logos', 'gen', 'municipalities'),
    suffix: 'Logo',
  },
  {
    svg: path.join(__dirname, 'graphics', 'svg'),
    out: path.join(__dirname, 'graphics', 'gen'),
    suffix: '',
  },
]

let total = 0
for (const { svg, out, suffix } of tasks) {
  const count = processDirectory(svg, out, suffix)
  if (count > 0) {
    console.log(
      `  → ${count} components from ${path.relative(__dirname, svg)}/\n`,
    )
  }
  total += count
}

console.log(`Generated ${total} components total.`)
