// @ts-check
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { glob } from 'glob'
import { ROOT } from './_common.mjs'
import { resolve } from 'node:path'

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

export async function getGeneratedFilesHash() {
  const hash = createHash('sha1')
  const files = (
    await glob(patterns, {
      cwd: ROOT,
      nodir: true,
      ignore: ignorePatterns,
    })
  ).sort()
  console.log(`Files to hash:`)
  for (const _file of files) {
    console.log(_file)
    const file = resolve(ROOT, _file)
    const content = await readFile(file, 'utf8')
    hash.update(content)
  }

  const finalHash = hash.digest('hex')
  return finalHash
}
