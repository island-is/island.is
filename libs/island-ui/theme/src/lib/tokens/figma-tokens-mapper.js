const fs = require('fs')
const path = require('path')

// File paths
const inputFilePath = path.join(__dirname, 'figmaTokens.json')
const primitivesOutputFilePath = path.join(__dirname, 'figmaPrimitives.ts')
const colorsOutputFilePath = path.join(__dirname, 'figmaColors.ts')
const typographyOutputFilePath = path.join(__dirname, 'figmaTypography.ts')

// Helper functions
const toCamelCase = (str) =>
  str
    .replace(/^\d+(?=\s)/, '')
    .trim()
    .replace(/-/g, '')
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      index === 0 ? match.toLowerCase() : match.toUpperCase(),
    )
    .replace(/\s+/g, '')

// Process JSON and remove unwanted keys
const processValues = (json) => {
  if (Array.isArray(json)) return json.map(processValues)
  if (json && typeof json === 'object') {
    return Object.entries(json).reduce((newObj, [key, value]) => {
      if (key.startsWith('$') && key !== '$value') return newObj
      if (value?.$Value) {
        newObj[toCamelCase(key)] = value.$Value
      } else {
        newObj[toCamelCase(key)] = processValues(value)
      }
      return newObj
    }, {})
  }
  return json
}

// Transform numeric keys and handle strings
const transformNumericValues = (obj) => {
  if (typeof obj === 'string') return obj.replace(/\.(\d+)$/, '[$1]')
  if (obj && typeof obj === 'object') {
    return Array.isArray(obj)
      ? obj.map(transformNumericValues)
      : Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [
            key,
            transformNumericValues(value),
          ]),
        )
  }
  return obj
}

// Transform JSON to TypeScript format
const transformJsonToTs = (jsonData, filename, imports) => {
  const tsObject = JSON.stringify(jsonData, null, 2)
    .replace(/"(\w+)":/g, '$1:') // Remove double quotes from keys
    .replace(/"(\w+)"/g, "'$1'") // Replace double quotes with single quotes
    .replaceAll('"{', ` ${imports}.modes.mode1.`)
    .replaceAll('}"', '')
    .replace(/\.([0-9]+)/g, '[$1]')
    .replace(/-\d+/g, '') // Remove "-number" patterns

  const transformed = transformNumericValues(tsObject)
  const exportString = `export const ${filename} = ${transformed};`
  const importString = imports
    ? `import { ${imports} } from "./${imports}";\n`
    : ''

  return importString + exportString
}

// Read JSON file and process tokens
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err)
    return
  }

  const jsonData = JSON.parse(data)
  const processedJson = processValues(jsonData)

  // Map each key to a corresponding output file
  const outputMap = {
    primitives: {
      filename: 'figmaPrimitives',
      outputPath: primitivesOutputFilePath,
    },
    colorsTokens: {
      filename: 'figmaColorsTokens',
      imports: 'figmaPrimitives',
      outputPath: colorsOutputFilePath,
    },
    typographyTokens: {
      filename: 'figmaTypographyTokens',
      imports: 'figmaPrimitives',
      outputPath: typographyOutputFilePath,
    },
  }

  // For each transformed token, write the corresponding TypeScript file
  Object.entries(processedJson).forEach(([key, token]) => {
    const { filename, imports, outputPath } = outputMap[key] || {}
    if (filename) {
      const tsData = transformJsonToTs(token, filename, imports)
      fs.writeFile(outputPath, tsData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing TypeScript file:', err)
          return
        }
        console.log(
          `TypeScript file for ${filename} has been generated successfully.`,
        )
      })
    }
  })
})
