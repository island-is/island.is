import { execSync } from 'child_process'
import fs from 'fs/promises'
import { globSync } from 'glob'

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
  console.log('Starting codegen process...')

  const skipCodegen = process.argv.includes('--skip-codegen')

  if (skipCodegen) {
    console.log('Skipping codegen command...')
  } else {
    // Run codegen
    console.log('Running codegen...')
    execSync('yarn codegen', { stdio: 'inherit' })
  }

  // Find files matching patterns
  console.log('Identifying generated files...')
  const generatedFiles = globSync(patterns, {
    ignore: ignorePatterns,
    nodir: true,
  }).filter(isNotIgnored)

  console.log(`Generated files count: ${generatedFiles.length}`)

  if (generatedFiles.length === 0) {
    throw new Error('No generated files detected. This might be an issue.')
  }
  // Write list of generated files
  await fs.writeFile('generated_files_list.txt', generatedFiles.join('\n'))

  // Create archive
  console.log('Creating archive...')
  execSync(`tar zcvf generated_files.tar.gz -T generated_files_list.txt`, {
    stdio: 'inherit',
  })

  // Output cache key for GitHub Actions
  const cacheKey = `codegen-${new Date().toISOString()}-${execSync(
    'git rev-parse --short HEAD',
  )
    .toString()
    .trim()}`
}

main().catch(console.error)
