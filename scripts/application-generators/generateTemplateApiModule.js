const fs = require('fs')
const path = require('path')
const {
  readAndWriteFile,
  readAndWriteTemplateApiModuleIndex,
} = require('./utils')

const templateApiModuleName = process.argv[2]

if (!templateApiModuleName) {
  console.error('Please provide a template api module name as an argument.')
  process.exit(1)
}

const nameSplit = templateApiModuleName.split('/')
const isNested = nameSplit.length > 1

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

const readAndWriteFileParams = {
  inputPath: generatorTemplateDir,
  outputPath: isNested ? path.join(newDir, nameSplit[1]) : newDir,
  isNested,
  nameSplit,
  name: templateApiModuleName,
}

fs.mkdirSync(newDir, { recursive: true })

if (isNested) {
  fs.mkdirSync(path.join(newDir, nameSplit[1]), { recursive: true })
}

readAndWriteFile(
  readAndWriteFileParams,
  'template.module.txt',
  `${isNested ? nameSplit[1] : templateApiModuleName}.module.ts`,
)
readAndWriteFile(
  readAndWriteFileParams,
  'template.service.txt',
  `${isNested ? nameSplit[1] : templateApiModuleName}.service.ts`,
)

readAndWriteTemplateApiModuleIndex(nameSplit, templateApiModuleName, isNested)
