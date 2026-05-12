import { Prerequisites as legacyPrerequisites } from '@island.is/application/templates/examples/example-inputs/forms/prerequisitesForm'
import { MainForm as legacyMainForm } from '@island.is/application/templates/examples/example-inputs/forms/mainForm'
import { completedForm as legacyCompletedForm } from '@island.is/application/templates/examples/example-inputs/forms/completedForm'
import { displayFieldSubsection as legacyDisplayFieldSubsection } from '@island.is/application/templates/examples/example-inputs/forms/mainForm/simpleInputsSection/displayFieldSubsection'
import { Prerequisites } from './prerequisitesForm'
import { MainForm } from './mainForm'
import { completedForm } from './completedForm'
import { displayFieldSubsection } from './mainForm/simpleInputsSection/displayFieldSubsection'

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

const getDisplayValue = (
  subsection: unknown,
  id: string,
  answers: Record<string, unknown> = {},
) => {
  const children = (subsection as { children: Array<{ children?: unknown[] }> })
    .children[0].children as Array<{
    id?: string
    value?: (answers: Record<string, unknown>) => string
  }>

  const field = children.find((child) => child.id === id)
  if (!field?.value) {
    throw new Error(`Display field ${id} was not found`)
  }

  return field.value(answers)
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

  it('defaults the summed display field to zero before inputs are answered', () => {
    expect(getDisplayValue(displayFieldSubsection, 'displayField')).toBe('0')
    expect(getDisplayValue(legacyDisplayFieldSubsection, 'displayField')).toBe(
      '0',
    )
  })

  it('sums the display field from formatted currency input values', () => {
    const answers = {
      input1: '2 kr.',
      input2: '32 kr.',
      input3: '322 kr.',
    }

    expect(getDisplayValue(displayFieldSubsection, 'displayField', answers)).toBe(
      '356',
    )
    expect(
      getDisplayValue(legacyDisplayFieldSubsection, 'displayField', answers),
    ).toBe('356')
  })

  it('marks the summed display field as client-computed', () => {
    const children = (displayFieldSubsection as {
      children: Array<{ children?: unknown[] }>
    }).children[0].children as Array<{
      id?: string
      clientExpression?: unknown
    }>

    expect(
      children.find((child) => child.id === 'displayField')?.clientExpression,
    ).toEqual({
      type: 'sum',
      fields: ['input1', 'input2', 'input3'],
    })
  })
})
