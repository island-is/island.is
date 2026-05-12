import { evaluateClientDisplayExpression } from './clientDisplayExpression'

describe('evaluateClientDisplayExpression', () => {
  it('sums numeric and currency-like answer values', () => {
    expect(
      evaluateClientDisplayExpression(
        { type: 'sum', fields: ['input1', 'input2', 'input3'] },
        {
          input1: '23 kr.',
          input2: '23',
          input3: '31 kr.',
        },
      ),
    ).toBe('77')
  })

  it('treats dot-separated currency groups as thousands, not decimals', () => {
    expect(
      evaluateClientDisplayExpression(
        { type: 'sum', fields: ['input1', 'input2', 'input3'] },
        {
          input1: '34.242.341 kr.',
          input2: '2',
          input3: '3',
        },
      ),
    ).toBe('34242346')
  })

  it('multiplies field and constant factors', () => {
    expect(
      evaluateClientDisplayExpression(
        {
          type: 'multiply',
          factors: [{ field: 'rent' }, { value: 3 }],
        },
        { rent: '1000 kr.' },
      ),
    ).toBe('3000')
  })
})
