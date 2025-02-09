import { execSync } from 'child_process'
import fs from 'fs/promises'
import { globSync } from 'glob'
import path from 'path'

const patterns = [
  'scripts/codegen.js',
  'libs/cms/src/lib/generated/contentfulTypes.d.ts',
  'apps/air-discount-scheme/web/i18n/withLocale.tsx',
  'apps/air-discount-scheme/web/components/AppLayout/AppLayout.tsx',
  'apps/air-discount-scheme/web/components/Header/Header.tsx',
  'apps/air-discount-scheme/web/screens/**/*.tsx',
  'libs/application/types/src/lib/ApplicationTypes.ts',
  '**/codegen.yml',
  '**/*.model.ts',
  '**/*.enum.ts',
  '**/queries/**/*',
  '**/mutations/**/*',
  '**/fragments/**/*',
  '**/gen/fetch/**/*',
  '**/*.resolver.ts',
  '**/*.service.ts',
  '**/*.dto.ts',
  '**/*.input.ts',
  '**/*.module.ts',
  '**/*.controller.ts',
  '**/*.union.ts',
  '**/*.graphql.tsx?',
  '**/*.graphql',
  '**/clientConfig.*',
  'libs/judicial-system/**',
]

const ignorePatterns = ['node_modules/**', '**/node_modules/**']

function isNotIgnored(file) {
  return !ignorePatterns.some((pattern) =>
    file.includes(pattern.replace('**/', '').replace('/**', '')),
  )
}

async function main() {
  const [outputFileName, ...args] = process.argv.slice(2)

  if (!outputFileName) {
    throw new Error(
      'Error: Please provide an output file name as the first argument.',
    )
  }

  const skipCodegen = args.includes('--skip-codegen')

  if (!skipCodegen) {
    console.log('Running codegen...')
    execSync('yarn codegen', { stdio: 'inherit' })
  }

  console.log('Identifying generated files...')
  const generatedFiles = globSync(patterns, {
    ignore: ignorePatterns,
    nodir: true,
  }).filter(isNotIgnored)

  if (generatedFiles.length === 0) {
    throw new Error('No generated files detected. This might be an issue.')
  }

  await fs.writeFile('generated_files_list.txt', generatedFiles.join('\n'))

  console.log(`Creating archive: ${outputFileName}...`)
  execSync(`tar zcf "${outputFileName}" -T generated_files_list.txt`, {
    stdio: 'ignore',
  })

  const stats = await fs.stat(outputFileName)
  const fileSizeInMegabytes = stats.size / (1024 * 1024)

  const cacheKey = `codegen-${execSync('git rev-parse HEAD').toString().trim()}`

  const patternCounts = patterns.reduce((acc, pattern) => {
    const count = globSync(pattern, { ignore: ignorePatterns, nodir: true })
      .length
    acc[pattern] = count
    return acc
  }, {})

  console.log('\n--- Codegen stats ---')
  console.log(`Cache key: ${cacheKey}`)
  console.log(`Archive created: ${outputFileName}`)
  console.log(`Archive size: ${fileSizeInMegabytes.toFixed(2)} MB`)
  console.log(`Total files archived: ${generatedFiles.length}`)

  console.log('\nFiles matched per pattern:')
  Object.entries(patternCounts).forEach(([pattern, count]) => {
    console.log(`${pattern}: ${count}`)
  })
}

main().catch((error) => {
  console.error('An error occurred:', error)
  process.exit(1)
})
