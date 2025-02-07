import fs from 'fs/promises'
import { glob } from 'glob'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

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

const ignorePatterns = ['**/node_modules/**', '**/dist/**', '**/build/**']

// Function to get all matching files
async function getMatchingFiles() {
  const allFiles = await Promise.all(
    patterns.map((pattern) =>
      glob(pattern, {
        ignore: ignorePatterns,
        nodir: true,
        cwd: process.cwd(),
      }),
    ),
  )
  return allFiles.flat()
}

// Main function
async function main() {
  console.log('Starting codegen process...')

  // Get initial state
  console.log('Getting initial file list...')
  const initialFiles = await getMatchingFiles()
  console.log(`Initial files count: ${initialFiles.length}`)

  // Run codegen
  console.log('Running codegen...')
  execSync('yarn codegen', { stdio: 'inherit' })

  // Get final state
  console.log('Getting final file list...')
  const finalFiles = await getMatchingFiles()
  console.log(`Final files count: ${finalFiles.length}`)

  // Find new or modified files
  console.log('Identifying new or modified files...')
  const scriptStats = await fs.stat(__filename)
  const generatedFiles = await Promise.all(
    finalFiles.map(async (file) => {
      if (!initialFiles.includes(file)) {
        console.log(`New file: ${file}`)
        return file
      }
      const stats = await fs.stat(file)
      if (stats.mtime > scriptStats.mtime) {
        console.log(`Modified file: ${file}`)
        return file
      }
      return null
    }),
  )

  const filteredGeneratedFiles = generatedFiles.filter(Boolean)
  console.log(
    `Generated/modified files count: ${filteredGeneratedFiles.length}`,
  )

  if (filteredGeneratedFiles.length === 0) {
    console.log('No new or modified files detected. This might be an issue.')
    // You might want to throw an error here or handle this case as needed
  }

  // Write list of generated files
  await fs.writeFile(
    'generated_files_list.txt',
    filteredGeneratedFiles.join('\n'),
  )

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
  console.log(`::set-output name=cache-key::${cacheKey}`)
}

main().catch(console.error)
