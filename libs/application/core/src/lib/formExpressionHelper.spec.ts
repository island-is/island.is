import {
  evaluateFormExpression,
  getFormExpressionDependencies,
} from './formExpressionEvaluator'
import { expr } from './formExpressionHelper'

describe('formExpressionHelper', () => {
  it('builds GET expressions for field ids', () => {
    expect(expr.get('fieldId')).toEqual({
      operator: 'GET',
      args: ['fieldId'],
    })
  })

  it('wraps string arguments to isEmpty as GET expressions', () => {
    expect(expr.isEmpty('input4')).toEqual({
      operator: 'IS_EMPTY',
      args: [
        {
          operator: 'GET',
          args: ['input4'],
        },
      ],
    })
  })

  it('builds readable non-empty visibility expressions', () => {
    expect(
      expr.and(
        expr.isNotEmpty('multiplyInput1'),
        expr.isNotEmpty('multiplyInput2'),
      ),
    ).toEqual({
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
  })

  it('builds conditional expressions with named branches', () => {
    expect(
      expr.if({
        condition: expr.isEmpty('input4'),
        then: '',
        otherwise: expr.multiply(expr.get('input4'), expr.get('displayField')),
      }),
    ).toEqual({
      operator: 'IF',
      args: [
        {
          operator: 'IS_EMPTY',
          args: [{ operator: 'GET', args: ['input4'] }],
        },
        '',
        {
          operator: 'MULTIPLY',
          args: [
            { operator: 'GET', args: ['input4'] },
            { operator: 'GET', args: ['displayField'] },
          ],
        },
      ],
    })
  })

  it('builds nested display field logic expressions', () => {
    expect(
      expr.if(
        expr.or(
          expr.isEmpty('input4'),
          expr.isEmpty('radioFieldForDisplayField'),
        ),
        '',
        expr.if(
          expr.equals(expr.get('radioFieldForDisplayField'), 'other'),
          'Önnur upphæð',
          expr.multiply(expr.get('input4'), expr.get('displayField')),
        ),
      ),
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
              args: [
                { operator: 'GET', args: ['radioFieldForDisplayField'] },
              ],
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
                { operator: 'GET', args: ['displayField'] },
              ],
            },
          ],
        },
      ],
    })
  })

  it('collects GET dependencies from nested expressions', () => {
    expect(
      getFormExpressionDependencies(
        expr.if({
          condition: expr.and(
            expr.equals(expr.get('propertyInfo.categoryClass'), 'special'),
            expr.isNotEmpty('input1'),
          ),
          then: expr.sum(expr.get('input2'), expr.get('input1')),
          otherwise: '',
        }),
      ),
    ).toEqual(['propertyInfo.categoryClass', 'input1', 'input2'])
  })

  it('returns no dependencies for literals and undefined expressions', () => {
    expect(getFormExpressionDependencies(undefined)).toEqual([])
    expect(getFormExpressionDependencies('literal')).toEqual([])
    expect(getFormExpressionDependencies(42)).toEqual([])
    expect(getFormExpressionDependencies(true)).toEqual([])
  })

  it('builds and evaluates numeric comparison expressions', () => {
    expect(evaluateFormExpression(expr.gt(expr.get('amount'), 0), { amount: 1 })).toBe(
      true,
    )
    expect(evaluateFormExpression(expr.gte(expr.get('amount'), 0), { amount: 0 })).toBe(
      true,
    )
    expect(evaluateFormExpression(expr.lt(expr.get('amount'), 0), { amount: -1 })).toBe(
      true,
    )
    expect(evaluateFormExpression(expr.lte(expr.get('amount'), 0), { amount: 0 })).toBe(
      true,
    )
  })

  it('builds CONTAINS expressions, keeping the searched value as a literal', () => {
    expect(expr.contains(expr.get('usageUnits'), '123')).toEqual({
      operator: 'CONTAINS',
      args: [{ operator: 'GET', args: ['usageUnits'] }, '123'],
    })
    // A string collection is normalized to a GET; the value stays literal.
    expect(expr.contains('usageUnits', '123')).toEqual({
      operator: 'CONTAINS',
      args: [{ operator: 'GET', args: ['usageUnits'] }, '123'],
    })
  })

  it('evaluates CONTAINS against array and string collections', () => {
    const membership = expr.contains(expr.get('usageUnits'), '123')
    expect(
      evaluateFormExpression(membership, { usageUnits: ['123', '456'] }),
    ).toBe(true)
    expect(
      evaluateFormExpression(membership, { usageUnits: ['456'] }),
    ).toBe(false)
    expect(evaluateFormExpression(membership, { usageUnits: undefined })).toBe(
      false,
    )
    expect(
      evaluateFormExpression(expr.contains(expr.get('code'), 'ab'), {
        code: 'abc',
      }),
    ).toBe(true)
  })

  it('sums only the CONTAINS-selected branches (usage-unit appraisal pattern)', () => {
    const tree = expr.sum(
      expr.if({
        condition: expr.contains(expr.get('usageUnits'), '1'),
        then: 50000000,
        otherwise: 0,
      }),
      expr.if({
        condition: expr.contains(expr.get('usageUnits'), '2'),
        then: 7300000,
        otherwise: 0,
      }),
      expr.if({
        condition: expr.contains(expr.get('usageUnits'), '3'),
        then: 8600000,
        otherwise: 0,
      }),
    )
    expect(evaluateFormExpression(tree, { usageUnits: ['2', '3'] })).toBe(
      15900000,
    )
    expect(evaluateFormExpression(tree, { usageUnits: [] })).toBe(0)
  })

  it('type-checks schema-bound client expression field ids', () => {
    type Answers = {
      amount?: number
      status?: 'draft' | 'submitted'
    }
    const typedExpr = expr.forSchema<Answers>()

    expect(typedExpr.get('status')).toEqual({
      operator: 'GET',
      args: ['status'],
    })
    typedExpr.gt(typedExpr.get('amount'), 0)

    // @ts-expect-error Invalid answer id.
    typedExpr.get('missing')

    // @ts-expect-error Numeric helpers only accept numeric answer fields.
    typedExpr.gt(typedExpr.get('status'), 0)
  })
})
