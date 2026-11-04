import { execFileSync } from 'child_process'
import path from 'path'

import { parseDateAnswer, toDateAnswer } from '../dateAnswer'

const repoRoot = path.resolve(__dirname, '../../../..')
const helperPath = path.resolve(__dirname, '../dateAnswer.ts')

// Jest gives each test file its own copy of process.env, so setting TZ here
// doesn't change the time zone Date uses. These checks run in a child Node
// process started with TZ set, and print what the helpers return.
const runInTimeZone = (timeZone: string) => {
  const script = `
    const { parseDateAnswer, toDateAnswer } = require(${JSON.stringify(
      helperPath,
    )})
    const read = parseDateAnswer('2026-11-04')
    console.log(JSON.stringify({
      // The date picker returns local midnight of the picked day.
      stored: toDateAnswer(new Date(2026, 10, 4)),
      shown: [read.getFullYear(), read.getMonth(), read.getDate()],
      roundTrip: toDateAnswer(parseDateAnswer('2026-01-31')),
    }))
  `
  const output = execFileSync(
    process.execPath,
    ['-r', '@swc-node/register', '-e', script],
    { cwd: repoRoot, env: { ...process.env, TZ: timeZone }, encoding: 'utf8' },
  )
  return JSON.parse(output.trim().split('\n').pop() ?? '')
}

describe('date answers', () => {
  // Iceland is UTC all year. Converting through UTC shifts the day east of
  // UTC when storing, and west of UTC when reading.
  it.each(['Atlantic/Reykjavik', 'Europe/Copenhagen', 'America/New_York'])(
    'keep the picked day in %s',
    (timeZone) => {
      expect(runInTimeZone(timeZone)).toEqual({
        stored: '2026-11-04',
        shown: [2026, 10, 4],
        roundTrip: '2026-01-31',
      })
    },
  )

  it('stores nothing for an invalid date', () => {
    expect(toDateAnswer(new Date('not a date'))).toBeUndefined()
    expect(toDateAnswer(null)).toBeUndefined()
  })

  it('reads nothing from a missing or unreadable value', () => {
    expect(parseDateAnswer(undefined)).toBeUndefined()
    expect(parseDateAnswer('')).toBeUndefined()
    expect(parseDateAnswer('not a date')).toBeUndefined()
    expect(parseDateAnswer(20261104)).toBeUndefined()
  })
})
