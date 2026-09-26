import {
  createIcelandicFilter,
  normalizeIcelandicLetters,
} from './icelandicFilter'

describe('normalizeIcelandicLetters', () => {
  it('maps eth and thorn to plain ASCII', () => {
    expect(normalizeIcelandicLetters('Guðrún')).toBe('Gudrún')
    expect(normalizeIcelandicLetters('Þuríður')).toBe('Thurídur')
    expect(normalizeIcelandicLetters('þök')).toBe('thök')
  })

  it('leaves other characters untouched', () => {
    expect(normalizeIcelandicLetters('Þórsdóttir')).toBe('Thórsdóttir')
  })
})

describe('createIcelandicFilter', () => {
  const filter = createIcelandicFilter()
  const option = {
    label: 'Guðrún Þórsdóttir',
    value: 'teacher-1',
    data: {},
  } as Parameters<typeof filter>[0]

  it.each<[string, boolean]>([
    ['Guð', true],
    ['Guðrún', true], // typed with eth
    ['Gudrun', true], // typed with plain ASCII — the bug this fixes
    ['Þórs', true], // typed with thorn
    ['Thorsdottir', true], // thorn as "th", plus ó→o handled by react-select
    ['Jón', false],
  ])('matches input %p -> %p', (input, expected) => {
    expect(filter(option, input)).toBe(expected)
  })
})
