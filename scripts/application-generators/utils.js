const fs = require('fs')
const path = require('path')

function toPascalCase(str) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

function toScreamingSnakeCase(str) {
  return str.toUpperCase().replace(/-/g, '_')
}

function readAndWriteFile(
  { inputPath, outputPath, isNested, nameSplit, name },
  fileToRead,
  fileToWrite,
) {
  fs.readFile(path.join(inputPath, fileToRead), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err)
      return
    }

    data = data.replace(
      /--PASCAL-CASE-TEMPLATE--/g,
      toPascalCase(isNested ? nameSplit[1] : name),
    )
    data = data.replace(
      /--SCREAMING-SNAKE-CASE-TEMPLATE--/g,
      toScreamingSnakeCase(isNested ? nameSplit[1] : name),
    )
    data = data.replace(
      /--KEBAB-CASE-TEMPLATE--/g,
      isNested ? nameSplit[1] : name,
    )
    data = data.replace(/--IS-NESTED--/g, isNested ? '../' : '')

    // Ensure the directory exists
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true })
    }

    fs.writeFileSync(path.join(outputPath, fileToWrite), data, 'utf-8')
    console.log(`File ${fileToWrite} written to ${outputPath}`)
  })
}

function readAndWriteTsConfig(name) {
  fs.readFile(
    path.join(__dirname, '..', '..', 'tsconfig.base.json'),
    'utf8',
    (err, data) => {
      if (err) {
        console.error('Error reading the file:', err)
        return
      }

      try {
        const config = JSON.parse(data)

        config.compilerOptions.paths[
          `@island.is/application/templates/${name}`
        ] = [`libs/application/templates/${name}/src/index.ts`]

        fs.writeFileSync(
          path.join(__dirname, '..', '..', 'tsconfig.base.json'),
          JSON.stringify(config, null, 2),
        )
      } catch (error) {
        console.error('Error parsing tsconfig.base.json:', error)
        return
      }
    },
  )
}

module.exports = { readAndWriteFile, readAndWriteTsConfig }
