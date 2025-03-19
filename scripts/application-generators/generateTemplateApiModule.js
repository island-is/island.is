const fs = require('fs')
const path = require('path')

const templateApiModuleName = process.argv[2]

if (!templateApiModuleName) {
  console.error('Please provide a template api module name as an argument.')
  process.exit(1)
}

const nameSplit = templateApiModuleName.split('/')
const isNested = nameSplit.length > 1

function toPascalCase(str) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

function toScreamingSnakeCase(str) {
  return str.toUpperCase().replace(/-/g, '_')
}

function readAndWriteFile(inputPath, outputPath, fileToRead, fileToWrite) {
  fs.readFile(path.join(inputPath, fileToRead), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err)
      return
    }

    data = data.replace(
      /--PASCAL-CASE-TEMPLATE--/g,
      toPascalCase(isNested ? nameSplit[1] : templateApiModuleName),
    )
    data = data.replace(
      /--SCREAMING-SNAKE-CASE-TEMPLATE--/g,
      toScreamingSnakeCase(isNested ? nameSplit[1] : templateApiModuleName),
    )
    data = data.replace(
      /--KEBAB-CASE-TEMPLATE--/g,
      isNested ? nameSplit[1] : templateApiModuleName,
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

const templatesDir = path.join(
  __dirname,
  '..',
  '..',
  'libs',
  'application',
  'template-api-modules',
  'src',
  'lib',
  'modules',
  'templates',
)

const newDir = path.join(templatesDir, nameSplit[0])

const generatorTemplateDir = path.join(
  templatesDir,
  'examples',
  'generator-template',
)

fs.mkdirSync(newDir, { recursive: true })

if (isNested) {
  fs.mkdirSync(path.join(newDir, nameSplit[1]), { recursive: true })
}

readAndWriteFile(
  generatorTemplateDir,
  isNested ? path.join(newDir, nameSplit[1]) : newDir,
  'template.module.txt',
  `${isNested ? nameSplit[1] : templateApiModuleName}.module.ts`,
)
readAndWriteFile(
  generatorTemplateDir,
  isNested ? path.join(newDir, nameSplit[1]) : newDir,
  'template.service.txt',
  `${isNested ? nameSplit[1] : templateApiModuleName}.service.ts`,
)
