import { renderHook } from '@testing-library/react'

import { useFormExpressionEvaluator } from './useFormExpressionEvaluator'

describe('useFormExpressionEvaluator', () => {
  it('sums numeric and currency-like answer values', () => {
    const { result } = renderHook(() =>
      useFormExpressionEvaluator(
        {
          operator: 'SUM',
          args: [
            { operator: 'GET', args: ['input1'] },
            { operator: 'GET', args: ['input2'] },
            { operator: 'GET', args: ['input3'] },
          ],
        },
        {
          input1: '23 kr.',
          input2: '23',
          input3: '31 kr.',
        },
      ),
    )

    expect(result.current).toBe(77)
  })

  it('treats dot-separated currency groups as thousands, not decimals', () => {
    const { result } = renderHook(() =>
      useFormExpressionEvaluator(
        {
          operator: 'SUM',
          args: [
            { operator: 'GET', args: ['input1'] },
            { operator: 'GET', args: ['input2'] },
            { operator: 'GET', args: ['input3'] },
          ],
        },
        {
          input1: '34.242.341 kr.',
          input2: '2',
          input3: '3',
        },
      ),
    )

    expect(result.current).toBe(34242346)
  })

  it('multiplies field and literal values', () => {
    const { result } = renderHook(() =>
      useFormExpressionEvaluator(
        {
          operator: 'MULTIPLY',
          args: [{ operator: 'GET', args: ['rent'] }, 3],
        },
        { rent: '1000 kr.' },
      ),
    )

    expect(result.current).toBe(3000)
  })

  it('evaluates boolean visibility expressions', () => {
    const { result } = renderHook(() =>
      useFormExpressionEvaluator(
        {
          operator: 'OR',
          args: [
            { operator: 'EQUALS', args: [{ operator: 'GET', args: ['x'] }, 'a'] },
            { operator: 'IS_EMPTY', args: [{ operator: 'GET', args: ['y'] }] },
          ],
        },
        { x: 'b', y: '' },
      ),
    )

    expect(result.current).toBe(true)
  })

  it('evaluates AND and NOT visibility expressions', () => {
    const expression = {
      operator: 'AND' as const,
      args: [
        {
          operator: 'NOT' as const,
          args: [
            {
              operator: 'IS_EMPTY' as const,
              args: [{ operator: 'GET' as const, args: ['x'] }],
            },
          ],
        },
        {
          operator: 'NOT' as const,
          args: [
            {
              operator: 'IS_EMPTY' as const,
              args: [{ operator: 'GET' as const, args: ['y'] }],
            },
          ],
        },
      ],
    }
    const { result, rerender } = renderHook(
      ({ answers }) => useFormExpressionEvaluator(expression, answers),
      {
        initialProps: { answers: { x: '1', y: '2' } },
      },
    )

    expect(result.current).toBe(true)

    rerender({ answers: { x: '1', y: '' } })

    expect(result.current).toBe(false)
  })

  it('evaluates the displayField2 empty answer branch', () => {
    const { result } = renderHook(() =>
      useFormExpressionEvaluator(
        {
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
                  args: [
                    { operator: 'GET', args: ['radioFieldForDisplayField'] },
                  ],
                },
              ],
            },
            '',
            'unused',
          ],
        },
        { radioFieldForDisplayField: '1' },
      ),
    )

    expect(result.current).toBe('')
  })

  it('evaluates the displayField2 other amount branch', () => {
    const { result } = renderHook(() =>
      useFormExpressionEvaluator(
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
            'unused',
          ],
        },
        { radioFieldForDisplayField: 'other' },
      ),
    )

    expect(result.current).toBe('Önnur upphæð')
  })

  it('evaluates the displayField2 multiplication branch', () => {
    const { result } = renderHook(() =>
      useFormExpressionEvaluator(
        {
          operator: 'IF',
          args: [
            false,
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
                    { operator: 'GET', args: ['displayField'] },
                  ],
                },
              ],
            },
          ],
        },
        {
          input4: '2',
          displayField: '356',
          radioFieldForDisplayField: '1',
        },
      ),
    )

    expect(result.current).toBe(712)
  })
})
