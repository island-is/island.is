import {
  FinanceClientV3PaymentErrorCode,
  getFinanceClientV3Problem,
} from './financeV3.errors'

const fetchError = (status: number, body?: unknown) => ({
  name: 'FetchError',
  status,
  body,
})

const problem = {
  type: '6',
  title: 'Bad Request',
  status: '400',
  detail: 'Búið að taka á móti álagningu',
}

describe('getFinanceClientV3Problem', () => {
  it('reads the problem FJS wraps in `error`', () => {
    expect(
      getFinanceClientV3Problem(fetchError(400, { error: problem })),
    ).toEqual({
      status: 400,
      problem,
      code: FinanceClientV3PaymentErrorCode.PayFlowAlreadyReceived,
    })
  })

  it('reads a problem at the top level of the body', () => {
    expect(getFinanceClientV3Problem(fetchError(400, problem))).toMatchObject({
      status: 400,
      code: '6',
    })
  })

  it('trims the code', () => {
    expect(
      getFinanceClientV3Problem(
        fetchError(400, { error: { ...problem, type: ' 12 ' } }),
      )?.code,
    ).toBe(FinanceClientV3PaymentErrorCode.OtherPaymentInProgress)
  })

  it('has a status but no problem when the body is not one', () => {
    expect(getFinanceClientV3Problem(fetchError(401))).toEqual({
      status: 401,
      problem: undefined,
      code: undefined,
    })
  })

  it('is null when FJS did not answer', () => {
    expect(getFinanceClientV3Problem(new Error('Timeout'))).toBeNull()
    expect(getFinanceClientV3Problem(undefined)).toBeNull()
  })
})
