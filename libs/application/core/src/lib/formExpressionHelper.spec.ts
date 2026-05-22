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
})
