import legacyTemplate from '@island.is/application/templates/examples/example-inputs/lib/template'
import template from './template'

const normalizeTemplateAst = (value: unknown): unknown => {
  if (typeof value === 'function') {
    return '[Function]'
  }

  if (Array.isArray(value)) {
    return value.map(normalizeTemplateAst)
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, entryValue]) => entryValue !== undefined)
        .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
        .map(([entryKey, entryValue]) => [
          entryKey,
          normalizeTemplateAst(entryValue),
        ]),
    )
  }

  return value
}

describe('example-inputs v2 template parity', () => {
  it('compiles the same state machine config as the legacy template', () => {
    expect(normalizeTemplateAst(template.stateMachineConfig)).toEqual(
      normalizeTemplateAst(legacyTemplate.stateMachineConfig),
    )
  })
})
