const fs = require('fs')
const path = require('path')
const { readAndWriteFile, readAndWriteTsConfig } = require('./utils')

const templateName = process.argv[2]

if (!templateName) {
  console.error('Please provide a template name as an argument.')
  process.exit(1)
}

const nameSplit = templateName.split('/')
const isNested = nameSplit.length > 1

const templatesDir = path.join(
  __dirname,
  '..',
  '..',
  'libs',
  'application',
  'templates',
)

const newDir = path.join(templatesDir, templateName)

const generatorTemplateDir = path.join(
  templatesDir,
  'examples',
  'generator-template',
)

const readAndWriteFileParams = {
  inputPath: generatorTemplateDir,
  outputPath: newDir,
  isNested,
  nameSplit,
  name: templateName,
}

// Folder structure

fs.mkdirSync(newDir, { recursive: true })

fs.mkdirSync(path.join(newDir, 'src'), { recursive: true })
fs.mkdirSync(path.join(newDir, 'src', 'assets'), { recursive: true })
fs.mkdirSync(path.join(newDir, 'src', 'dataProviders'), { recursive: true })
fs.mkdirSync(path.join(newDir, 'src', 'forms'), { recursive: true })
fs.mkdirSync(path.join(newDir, 'src', 'forms/prerequisitesForm'), {
  recursive: true,
})
fs.mkdirSync(path.join(newDir, 'src', 'forms/mainForm'), { recursive: true })
fs.mkdirSync(path.join(newDir, 'src', 'forms/completedForm'), {
  recursive: true,
})
fs.mkdirSync(path.join(newDir, 'src', 'lib'), { recursive: true })
fs.mkdirSync(path.join(newDir, 'src', 'utils'), { recursive: true })

// /
readAndWriteFile(readAndWriteFileParams, '.babelrc.txt', '.babelrc')
readAndWriteFile(readAndWriteFileParams, '.eslintrc.json.txt', '.eslintrc.json')
readAndWriteFile(readAndWriteFileParams, 'jest.config.ts.txt', 'jest.config.ts')
readAndWriteFile(readAndWriteFileParams, 'project.json.txt', 'project.json')
readAndWriteFile(readAndWriteFileParams, 'README.md.txt', 'README.md')
readAndWriteFile(readAndWriteFileParams, 'tsconfig.json.txt', 'tsconfig.json')
readAndWriteFile(
  readAndWriteFileParams,
  'tsconfig.lib.json.txt',
  'tsconfig.lib.json',
)
readAndWriteFile(
  readAndWriteFileParams,
  'tsconfig.spec.json.txt',
  'tsconfig.spec.json',
)

// /src
readAndWriteFile(readAndWriteFileParams, 'src/index.ts.txt', 'src/index.ts')

// /src/dataProviders
readAndWriteFile(
  readAndWriteFileParams,
  'src/dataProviders/index.ts.txt',
  'src/dataProviders/index.ts',
)

// /src/forms
readAndWriteFile(
  readAndWriteFileParams,
  'src/forms/prerequisitesForm/index.ts.txt',
  'src/forms/prerequisitesForm/index.ts',
)

readAndWriteFile(
  readAndWriteFileParams,
  'src/forms/mainForm/index.ts.txt',
  'src/forms/mainForm/index.ts',
)
readAndWriteFile(
  readAndWriteFileParams,
  'src/forms/mainForm/firstSection.ts.txt',
  'src/forms/mainForm/firstSection.ts',
)
readAndWriteFile(
  readAndWriteFileParams,
  'src/forms/mainForm/secondSection.ts.txt',
  'src/forms/mainForm/secondSection.ts',
)
readAndWriteFile(
  readAndWriteFileParams,
  'src/forms/mainForm/overview.ts.txt',
  'src/forms/mainForm/overview.ts',
)

readAndWriteFile(
  readAndWriteFileParams,
  'src/forms/completedForm/index.ts.txt',
  'src/forms/completedForm/index.ts',
)

// /src/lib
readAndWriteFile(
  readAndWriteFileParams,
  'src/lib/dataSchema.ts.txt',
  'src/lib/dataSchema.ts',
)
readAndWriteFile(
  readAndWriteFileParams,
  'src/lib/messages.ts.txt',
  'src/lib/messages.ts',
)
readAndWriteFile(
  readAndWriteFileParams,
  'src/lib/template.ts.txt',
  'src/lib/template.ts',
)

// /src/utils
readAndWriteFile(
  readAndWriteFileParams,
  'src/utils/constants.ts.txt',
  'src/utils/constants.ts',
)
readAndWriteFile(
  readAndWriteFileParams,
  'src/utils/getOverviewItems.ts.txt',
  'src/utils/getOverviewItems.ts',
)

readAndWriteTsConfig(templateName)
