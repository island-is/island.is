import { execFileSync } from 'child_process'
import path from 'path'

import { formatDateFieldBoundary } from '../field-mappers/utils'

const repoRoot = path.resolve(__dirname, '../../../../../../../..')
const utilsPath = path.resolve(__dirname, '../field-mappers/utils.ts')

// Jest gives each test file its own copy of process.env, so setting TZ here
// doesn't change the time zone Date uses. This runs the formatter in a child
// Node process started with TZ set, and prints what it returns.
const formatInTimeZone = (timeZone: string) => {
  const script = `
    const { formatDateFieldBoundary } = require(${JSON.stringify(utilsPath)})
    // Templates build date limits in local time, e.g. with startOfDay.
    console.log(formatDateFieldBoundary(new Date(2026, 10, 4)))
  `
  const output = execFileSync(
    process.execPath,
    ['-r', '@swc-node/register', '-e', script],
    {
      cwd: repoRoot,
      env: {
        ...process.env,
        TZ: timeZone,
        SWC_NODE_PROJECT: path.join(repoRoot, 'tsconfig.base.json'),
      },
      encoding: 'utf8',
    },
  )
  return output.trim().split('\n').pop()
}

describe('formatDateFieldBoundary', () => {
  it.each(['UTC', 'Europe/Copenhagen', 'America/New_York'])(
    'gives a local-midnight Date its own day in %s',
    (timeZone) => {
      expect(formatInTimeZone(timeZone)).toBe('2026-11-04')
    },
  )

  it('passes strings through unchanged', () => {
    expect(formatDateFieldBoundary('2026-11-04')).toBe('2026-11-04')
  })

  it('leaves a missing limit missing', () => {
    expect(formatDateFieldBoundary(undefined)).toBeUndefined()
  })
})
