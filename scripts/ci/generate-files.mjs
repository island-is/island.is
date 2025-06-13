import { execSync } from 'child_process'
import fs from 'fs/promises'
import { globSync } from 'glob'
import yaml from 'js-yaml'

const additionalPatterns = [
  '**/openapi.yaml',
  '**/api.graphql',
  '**/schema.d.ts',
  '**/schema.tsx',
  '**/schema.ts',
  '**/gen/graphql.ts',
  '**/*.generated.ts',
  '**/possibleTypes.json',
  '**/fragmentTypes.json',
  'libs/api/mocks/src/schema.ts',
  '**/gen/fetch/**/*',
]

const ignorePatterns = ['**/node_modules/**']

const findCodegenFiles = () => {
  return globSync('**/codegen.yml', { ignore: ignorePatterns })
}

const parseCodegenFile = async (filePath) => {
  const content = await fs.readFile(filePath, 'utf8')
  return yaml.load(content)
}

const addToPatterns = (patterns, item) => {
  if (Array.isArray(item)) {
    item.forEach((i) => patterns.add(i))
  } else if (typeof item === 'string') {
    patterns.add(item)
  }
}

const getPatterns = async () => {
  const codegenFiles = findCodegenFiles()
  const patterns = new Set()

  for (const file of codegenFiles) {
    const config = await parseCodegenFile(file)

    if (config.schema) {
      addToPatterns(patterns, config.schema)
    }

    if (config.generates) {
      Object.entries(config.generates).forEach(([outputFile, options]) => {
        patterns.add(outputFile)

        if (typeof options === 'object') {
          if (options.schema) {
            addToPatterns(patterns, options.schema)
          }
          if (options.documents) {
            addToPatterns(patterns, options.documents)
          }
        }
      })
    }
  }

  // Add additional patterns
  additionalPatterns.forEach((pattern) => patterns.add(pattern))

  return Array.from(patterns)
}

const extractCodegenInputs = async () => {
  const codegenFiles = findCodegenFiles()
  const inputs = new Set()

  for (const file of codegenFiles) {
    const config = await parseCodegenFile(file)

    const addInput = (val) => addToPatterns(inputs, val)

    if (config.schema) addInput(config.schema)
    if (config.documents) addInput(config.documents)

    if (config.generates) {
      Object.values(config.generates).forEach((entry) => {
        if (typeof entry !== 'object') return

        if (entry.schema) addInput(entry.schema)
        if (entry.documents) addInput(entry.documents)

        if (entry.config) {
          if (entry.config.fragments) addInput(entry.config.fragments)
          if (entry.config.baseTypesPath) addInput(entry.config.baseTypesPath)
        }
      })
    }
  }

  return Array.from(inputs)
}

async function main() {
  console.log('Starting codegen process...')

  const [outputFileName, ...args] = process.argv.slice(2)

  if (!outputFileName) {
    throw new Error(
      'Error: Please provide an output file name as the first argument.',
    )
  }

  const skipCodegen = args.includes('--skip-codegen')

  if (skipCodegen) {
    console.log('Skipping codegen command...')
  } else {
    console.log('Running codegen...')
    execSync('yarn codegen >> codegen.log', { stdio: 'inherit' })
  }

  console.log(
    'Gathering patterns from codegen.yml files and additional patterns...',
  )
  const patterns = await getPatterns()
  const inputs = await extractCodegenInputs()

  await fs.writeFile('codegen_inputs_list.txt', inputs.join('\n'))

  console.log(`Found ${patterns.length} total patterns`)
  console.log(`Found ${inputs.length} codegen input patterns`)

  console.log('::group::Input files or patterns')
  inputs.forEach((file) => console.log(file))
  console.log(`::endgroup::`)

  const existingFiles = []
  const missingFiles = []

  for (const pattern of patterns) {
    const matchingFiles = globSync(pattern, {
      nodir: true,
      ignore: ignorePatterns,
    })
    if (matchingFiles.length > 0) {
      existingFiles.push(...matchingFiles)
    } else {
      missingFiles.push(pattern)
    }
  }

  console.log(`Existing files: ${existingFiles.length}`)
  console.log(`Missing files or patterns: ${missingFiles.length}`)

  await fs.writeFile('generated_files_list.txt', existingFiles.join('\n'))

  console.log(`::group::Creating archive (${outputFileName})`)
  execSync(`tar zcvf "${outputFileName}" -T generated_files_list.txt`, {
    stdio: 'inherit',
  })
  console.log(`::endgroup::`)

  const stats = await fs.stat(outputFileName)
  const fileSizeInMegabytes = stats.size / (1024 * 1024)

  console.log(`Archive created: ${outputFileName}`)
  console.log(`Archive size: ${fileSizeInMegabytes.toFixed(2)} MB`)

  if (missingFiles.length > 0) {
    console.log('::group::Missing files or patterns')
    missingFiles.forEach((file) => console.log(file))
    console.log(`::endgroup::`)
  }
}

main().catch((error) => {
  console.error('An error occurred:', error)
  process.exit(1)
})
