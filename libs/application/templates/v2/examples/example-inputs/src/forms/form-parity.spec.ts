import { Prerequisites as legacyPrerequisites } from '@island.is/application/templates/examples/example-inputs/forms/prerequisitesForm'
import { MainForm as legacyMainForm } from '@island.is/application/templates/examples/example-inputs/forms/mainForm'
import { completedForm as legacyCompletedForm } from '@island.is/application/templates/examples/example-inputs/forms/completedForm'
import { displayFieldSubsection as legacyDisplayFieldSubsection } from '@island.is/application/templates/examples/example-inputs/forms/mainForm/simpleInputsSection/displayFieldSubsection'
import { Prerequisites } from './prerequisitesForm'
import { MainForm } from './mainForm'
import { completedForm } from './completedForm'
import { displayFieldSubsection } from './mainForm/simpleInputsSection/displayFieldSubsection'
import { evaluateFormExpression } from '@island.is/application/core'
import { ApplicationTypes } from '@island.is/application/types'

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

const normalizeMainFormParityAst = (value: unknown): unknown => {
  const normalized = normalizeFormAst(value)

  if (Array.isArray(normalized)) {
    return normalized
      .filter(
        (entry) =>
          !(
            entry !== null &&
            typeof entry === 'object' &&
            [
              'multiplyInput1',
              'multiplyInput2',
              'multiplyInput3',
              'displayFieldProduct',
            ].includes(String((entry as { id?: unknown }).id))
          ),
      )
      .map(normalizeMainFormParityAst)
  }

  if (normalized !== null && typeof normalized === 'object') {
    const entries = Object.entries(
      normalized as Record<string, unknown>,
    ).filter(
      ([entryKey, entryValue]) =>
        !(
          entryKey === 'clientValueExpression' &&
          (normalized as { id?: unknown }).id === 'displayField2' &&
          entryValue !== undefined
        ) &&
        !(
          entryKey === 'condition' &&
          (normalized as { id?: unknown }).id === 'input4' &&
          entryValue !== undefined
        ) &&
        !(
          entryKey === 'clientShowWhen' &&
          (normalized as { id?: unknown }).id === 'input4' &&
          entryValue !== undefined
        ),
    )

    return Object.fromEntries(
      entries.map(([entryKey, entryValue]) => [
        entryKey,
        normalizeMainFormParityAst(entryValue),
      ]),
    )
  }

  return normalized
}

// The SDF application is a distinct application type (`EXAMPLE_INPUTS_SDF`) but
// reuses the legacy `ExampleInputsService` by namespacing its template-api
// actions (e.g. `ExampleInputs.getReferenceData`). The legacy app does not
// namespace (its own type IS the service id). Strip that namespace so the
// data-provider items compare equal on everything that affects rendering.
const NAMESPACE_PREFIX = `${ApplicationTypes.EXAMPLE_INPUTS}.`

const normalizePrerequisitesParityAst = (value: unknown): unknown => {
  const normalized = normalizeFormAst(value)

  if (Array.isArray(normalized)) {
    return normalized.map(normalizePrerequisitesParityAst)
  }

  if (normalized !== null && typeof normalized === 'object') {
    return Object.fromEntries(
      Object.entries(normalized as Record<string, unknown>).map(
        ([entryKey, entryValue]) =>
          (entryKey === 'action' || entryKey === 'actionId') &&
          typeof entryValue === 'string' &&
          entryValue.startsWith(NAMESPACE_PREFIX)
            ? [entryKey, entryValue.slice(NAMESPACE_PREFIX.length)]
            : [entryKey, normalizePrerequisitesParityAst(entryValue)],
      ),
    )
  }

  return normalized
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

const getDisplayField = (id: string) => {
  const children = (
    displayFieldSubsection as {
      children: Array<{ children?: unknown[] }>
    }
  ).children[0].children as Array<{
    id?: string
    clientValueExpression?: unknown
    value?: (answers: Record<string, unknown>) => string
  }>

  const field = children.find((child) => child.id === id)
  if (!field?.value || field.clientValueExpression === undefined) {
    throw new Error(`Client-computed display field ${id} was not found`)
  }

  return field
}

const expectDisplayFieldClientServerParity = (
  id: string,
  answers: Record<string, unknown>,
) => {
  const field = getDisplayField(id)
  expect(
    String(evaluateFormExpression(field.clientValueExpression, answers)),
  ).toBe(field.value(answers))
}

describe('example-inputs v2 form parity', () => {
  it('matches the legacy prerequisites form AST', () => {
    expect(normalizePrerequisitesParityAst(Prerequisites)).toEqual(
      normalizePrerequisitesParityAst(legacyPrerequisites),
    )
  })

  it('matches the legacy main form AST', () => {
    expect(normalizeMainFormParityAst(MainForm)).toEqual(
      normalizeMainFormParityAst(legacyMainForm),
    )
  })

  it('matches the legacy completed form AST', () => {
    const normalizeCompletedFormParityAst = (value: unknown): unknown => {
      const normalized = normalizeFormAst(value)

      if (Array.isArray(normalized)) {
        return normalized.map(normalizeCompletedFormParityAst)
      }

      if (normalized !== null && typeof normalized === 'object') {
        const entries = Object.entries(
          normalized as Record<string, unknown>,
        ).filter(
          ([entryKey, entryValue]) =>
            !(
              entryKey === 'condition' &&
              (normalized as { id?: unknown }).id ===
                'uiForms.conclusionLink' &&
              entryValue !== undefined
            ),
        )

        return Object.fromEntries(
          entries.map(([entryKey, entryValue]) => [
            entryKey,
            normalizeCompletedFormParityAst(entryValue),
          ]),
        )
      }

      return normalized
    }

    expect(normalizeCompletedFormParityAst(completedForm)).toEqual(
      normalizeCompletedFormParityAst(legacyCompletedForm),
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

    expect(
      getDisplayValue(displayFieldSubsection, 'displayField', answers),
    ).toBe('356')
    expect(
      getDisplayValue(legacyDisplayFieldSubsection, 'displayField', answers),
    ).toBe('356')
  })

  it('marks the summed display field as client-computed', () => {
    const children = (
      displayFieldSubsection as {
        children: Array<{ children?: unknown[] }>
      }
    ).children[0].children as Array<{
      id?: string
      clientValueExpression?: unknown
    }>

    expect(
      children.find((child) => child.id === 'displayField')
        ?.clientValueExpression,
    ).toEqual({
      operator: 'SUM',
      args: [
        { operator: 'GET', args: ['input1'] },
        { operator: 'GET', args: ['input2'] },
        { operator: 'GET', args: ['input3'] },
      ],
    })
  })

  it('marks the rental amount display field as client-computed', () => {
    const children = (
      displayFieldSubsection as {
        children: Array<{ children?: unknown[] }>
      }
    ).children[0].children as Array<{
      id?: string
      clientValueExpression?: unknown
    }>

    expect(
      children.find((child) => child.id === 'displayField2')
        ?.clientValueExpression,
    ).toEqual({
      operator: 'IF',
      args: [
        {
          operator: 'OR',
          args: [
            {
              operator: 'IS_EMPTY',
              args: [{ operator: 'GET', args: ['input4'] }],
            },
            {
              operator: 'IS_EMPTY',
              args: [{ operator: 'GET', args: ['radioFieldForDisplayField'] }],
            },
          ],
        },
        '',
        {
          operator: 'IF',
          args: [
            {
              operator: 'EQUALS',
              args: [
                { operator: 'GET', args: ['radioFieldForDisplayField'] },
                'other',
              ],
            },
            'Önnur upphæð',
            {
              operator: 'MULTIPLY',
              args: [
                { operator: 'GET', args: ['input4'] },
                {
                  operator: 'SUM',
                  args: [
                    { operator: 'GET', args: ['input1'] },
                    { operator: 'GET', args: ['input2'] },
                    { operator: 'GET', args: ['input3'] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })
  })

  it('adds a multiplied plus added value display field example', () => {
    const children = (
      displayFieldSubsection as {
        children: Array<{ children?: unknown[] }>
      }
    ).children[0].children as Array<{
      id?: string
      clientShowWhen?: unknown
      clientValueExpression?: unknown
      value?: (answers: Record<string, unknown>) => string
    }>
    const displayFieldProduct = children.find(
      (child) => child.id === 'displayFieldProduct',
    )

    expect(displayFieldProduct?.clientShowWhen).toEqual({
      operator: 'AND',
      args: [
        {
          operator: 'NOT',
          args: [
            {
              operator: 'IS_EMPTY',
              args: [{ operator: 'GET', args: ['multiplyInput1'] }],
            },
          ],
        },
        {
          operator: 'NOT',
          args: [
            {
              operator: 'IS_EMPTY',
              args: [{ operator: 'GET', args: ['multiplyInput2'] }],
            },
          ],
        },
      ],
    })
    expect(displayFieldProduct?.clientValueExpression).toEqual({
      operator: 'SUM',
      args: [
        {
          operator: 'MULTIPLY',
          args: [
            { operator: 'GET', args: ['multiplyInput1'] },
            { operator: 'GET', args: ['multiplyInput2'] },
          ],
        },
        { operator: 'GET', args: ['multiplyInput3'] },
      ],
    })
    expect(
      displayFieldProduct?.value?.({
        multiplyInput1: '2',
        multiplyInput2: '32',
        multiplyInput3: '5',
      }),
    ).toBe('69')
  })

  it('keeps server and client display field calculations in parity', () => {
    expectDisplayFieldClientServerParity('displayField', {
      input1: '2',
      input2: '3',
      input3: '4',
    })
    expectDisplayFieldClientServerParity('displayFieldProduct', {
      multiplyInput1: '2',
      multiplyInput2: '32',
      multiplyInput3: '5',
    })
    expectDisplayFieldClientServerParity('displayField2', {
      input1: '2',
      input2: '3',
      input3: '4',
      input4: '10',
      radioFieldForDisplayField: '2',
    })
    expectDisplayFieldClientServerParity('displayField2', {
      input1: '2',
      input2: '3',
      input3: '4',
      input4: '10',
      radioFieldForDisplayField: 'other',
    })
  })
})
