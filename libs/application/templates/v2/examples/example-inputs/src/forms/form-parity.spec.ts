import { Prerequisites as legacyPrerequisites } from '@island.is/application/templates/examples/example-inputs/forms/prerequisitesForm'
import { MainForm as legacyMainForm } from '@island.is/application/templates/examples/example-inputs/forms/mainForm'
import { completedForm as legacyCompletedForm } from '@island.is/application/templates/examples/example-inputs/forms/completedForm'
import { Prerequisites } from './prerequisitesForm'
import { MainForm } from './mainForm'
import { completedForm } from './completedForm'

jest.mock('@island.is/island-ui/theme', () => ({
  theme: {
    color: {
      black: 'black',
      blue200: 'blue200',
      purple400: 'purple400',
      red400: 'red400',
      red600: 'red600',
      yellow600: 'yellow600',
    },
  },
}))

const normalizeFormAst = (value: unknown): unknown => {
  if (typeof value === 'function') {
    return '[Function]'
  }

  if (Array.isArray(value)) {
    return value.map(normalizeFormAst)
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, entryValue]) => entryValue !== undefined)
        .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
        .map(([entryKey, entryValue]) => [
          entryKey,
          normalizeFormAst(entryValue),
        ]),
    )
  }

  return value
}

describe('example-inputs v2 form parity', () => {
  it('matches the legacy prerequisites form AST', () => {
    expect(normalizeFormAst(Prerequisites)).toEqual(
      normalizeFormAst(legacyPrerequisites),
    )
  })

  it('matches the legacy main form AST', () => {
    expect(normalizeFormAst(MainForm)).toEqual(normalizeFormAst(legacyMainForm))
  })

  it('matches the legacy completed form AST', () => {
    expect(normalizeFormAst(completedForm)).toEqual(
      normalizeFormAst(legacyCompletedForm),
    )
  })
})
