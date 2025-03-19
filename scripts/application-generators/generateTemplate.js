const fs = require('fs')
const path = require('path')

const templateName = process.argv[2]

if (!templateName) {
  console.error('Please provide a template name as an argument.')
  process.exit(1)
}

const nameSplit = templateName.split('/')
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
      toPascalCase(isNested ? nameSplit[1] : templateName),
    )
    data = data.replace(
      /--SCREAMING-SNAKE-CASE-TEMPLATE--/g,
      toScreamingSnakeCase(isNested ? nameSplit[1] : templateName),
    )
    data = data.replace(
      /--KEBAB-CASE-TEMPLATE--/g,
      isNested ? nameSplit[1] : templateName,
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
  'templates',
)

const newDir = path.join(templatesDir, templateName)

const generatorTemplateDir = path.join(
  templatesDir,
  'examples',
  'generator-template',
)

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
readAndWriteFile(generatorTemplateDir, newDir, '.babelrc.txt', '.babelrc')
readAndWriteFile(
  generatorTemplateDir,
  newDir,
  '.eslintrc.json.txt',
  '.eslintrc.json',
)
readAndWriteFile(
  generatorTemplateDir,
  newDir,
  'jest.config.ts.txt',
  'jest.config.ts',
)
readAndWriteFile(
  generatorTemplateDir,
  newDir,
  'project.json.txt',
  'project.json',
)
readAndWriteFile(generatorTemplateDir, newDir, 'README.md.txt', 'README.md')
readAndWriteFile(
  generatorTemplateDir,
  newDir,
  'tsconfig.json.txt',
  'tsconfig.json',
)
readAndWriteFile(
  generatorTemplateDir,
  newDir,
  'tsconfig.lib.json.txt',
  'tsconfig.lib.json',
)
readAndWriteFile(
  generatorTemplateDir,
  newDir,
  'tsconfig.spec.json.txt',
  'tsconfig.spec.json',
)

// /src
readAndWriteFile(
  generatorTemplateDir,
  newDir,
  'src/index.ts.txt',
  'src/index.ts',
)

// /src/dataProviders
readAndWriteFile(
  generatorTemplateDir,
  newDir,
  'src/dataProviders/index.ts.txt',
  'src/dataProviders/index.ts',
)

// /src/forms
readAndWriteFile(
  generatorTemplateDir,
  newDir,
  'src/forms/prerequisitesForm/index.ts.txt',
  'src/forms/prerequisitesForm/index.ts',
)

readAndWriteFile(
  generatorTemplateDir,
  newDir,
  'src/forms/mainForm/index.ts.txt',
  'src/forms/mainForm/index.ts',
)
readAndWriteFile(
  generatorTemplateDir,
  newDir,
  'src/forms/mainForm/firstSection.ts.txt',
  'src/forms/mainForm/firstSection.ts',
)
readAndWriteFile(
  generatorTemplateDir,
  newDir,
  'src/forms/mainForm/secondSection.ts.txt',
  'src/forms/mainForm/secondSection.ts',
)
readAndWriteFile(
  generatorTemplateDir,
  newDir,
  'src/forms/mainForm/overview.ts.txt',
  'src/forms/mainForm/overview.ts',
)

readAndWriteFile(
  generatorTemplateDir,
  newDir,
  'src/forms/completedForm/index.ts.txt',
  'src/forms/completedForm/index.ts',
)

// /src/lib
readAndWriteFile(
  generatorTemplateDir,
  newDir,
  'src/lib/dataSchema.ts.txt',
  'src/lib/dataSchema.ts',
)
readAndWriteFile(
  generatorTemplateDir,
  newDir,
  'src/lib/messages.ts.txt',
  'src/lib/messages.ts',
)
readAndWriteFile(
  generatorTemplateDir,
  newDir,
  'src/lib/template.ts.txt',
  'src/lib/template.ts',
)

// /src/utils
readAndWriteFile(
  generatorTemplateDir,
  newDir,
  'src/utils/constants.ts.txt',
  'src/utils/constants.ts',
)
readAndWriteFile(
  generatorTemplateDir,
  newDir,
  'src/utils/getOverviewItems.ts.txt',
  'src/utils/getOverviewItems.ts',
)
