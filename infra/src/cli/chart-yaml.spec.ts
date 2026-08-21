import { serializeChartYaml } from './chart-yaml'

describe('chart YAML serialization', () => {
  it.each([
    ['plain strings', 'hello', "value: 'hello'\n"],
    ['apostrophes', "it's ready", `value: "it's ready"\n`],
    ['double quotes', 'say "hello"', `value: 'say "hello"'\n`],
    ['both quote types', `it's "ready"`, `value: 'it''s "ready"'\n`],
  ])('formats %s like Prettier', (_case, value, expected) => {
    expect(serializeChartYaml({ value })).toBe(expected)
  })
})
