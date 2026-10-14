import { FAApplication } from '@island.is/application/templates/financial-aid'
import { DirectTaxPayment, UserType } from '@island.is/financial-aid/shared/lib'
import {
  getVeitaDirectTaxPayments,
  serializeVeitaDirectTaxPayments,
} from './veitaDirectTaxPayments'

type ExternalData = FAApplication['externalData']

const payment = (
  payerNationalId: string,
  userType?: UserType,
): DirectTaxPayment =>
  ({
    totalSalary: 500000,
    payerNationalId,
    personalAllowance: 60000,
    withheldAtSource: 100000,
    month: 9,
    year: 2026,
    ...(userType && { userType }),
  } as DirectTaxPayment)

const taxData = (directTaxPayments: DirectTaxPayment[], success = true) => ({
  data: {
    municipalitiesPersonalTaxReturn: { personalTaxReturn: null },
    municipalitiesDirectTaxPayments: { directTaxPayments, success },
  },
  date: '',
  status: 'success' as const,
})

const externalData = (
  applicant: ReturnType<typeof taxData>,
  spouse?: ExternalData['taxDataSpouse'],
) =>
  ({
    taxData: applicant,
    ...(spouse && { taxDataSpouse: spouse }),
  } as ExternalData)

describe('getVeitaDirectTaxPayments', () => {
  it('labels a single applicant’s payments as APPLICANT', () => {
    expect(
      getVeitaDirectTaxPayments(externalData(taxData([payment('employer-a')]))),
    ).toEqual([{ ...payment('employer-a'), userType: UserType.APPLICANT }])
  })

  it('includes spouse payments and labels them by whose tax data they are', () => {
    // Stale labels mimic the submitter-based mutation on the municipalities path.
    const data = externalData(
      taxData([payment('employer-a', UserType.SPOUSE)]),
      taxData([payment('employer-b', UserType.APPLICANT)]),
    )

    expect(getVeitaDirectTaxPayments(data)).toEqual([
      { ...payment('employer-a'), userType: UserType.APPLICANT },
      { ...payment('employer-b'), userType: UserType.SPOUSE },
    ])
  })

  it('does not mutate stored tax data', () => {
    const data = externalData(
      taxData([payment('employer-a')]),
      taxData([payment('employer-b')]),
    )
    const before = JSON.parse(JSON.stringify(data))

    getVeitaDirectTaxPayments(data)

    expect(data).toEqual(before)
  })

  it.each([
    ['missing', undefined],
    [
      'failed',
      {
        data: {} as ExternalData['taxData']['data'],
        date: '',
        status: 'failure' as const,
      },
    ],
    ['unsuccessful', taxData([], false)],
  ])('keeps applicant payments when spouse tax data is %s', (_, spouse) => {
    expect(
      getVeitaDirectTaxPayments(
        externalData(taxData([payment('employer-a')]), spouse),
      ),
    ).toEqual([{ ...payment('employer-a'), userType: UserType.APPLICANT }])
  })

  it('returns spouse payments when the applicant fetch returned none', () => {
    expect(
      getVeitaDirectTaxPayments(
        externalData(taxData([], false), taxData([payment('employer-b')])),
      ),
    ).toEqual([{ ...payment('employer-b'), userType: UserType.SPOUSE }])
  })
})

describe('serializeVeitaDirectTaxPayments', () => {
  it('sends all payments as one JSON-encoded array', () => {
    const data = externalData(
      taxData([payment('employer-a')]),
      taxData([payment('employer-b')]),
    )

    const serialized = serializeVeitaDirectTaxPayments(data)

    expect(serialized).toHaveLength(1)
    expect(JSON.parse(serialized[0])).toEqual([
      { ...payment('employer-a'), userType: UserType.APPLICANT },
      { ...payment('employer-b'), userType: UserType.SPOUSE },
    ])
  })

  it('sends an empty JSON array when no payments were fetched', () => {
    expect(
      serializeVeitaDirectTaxPayments(externalData(taxData([], false))),
    ).toEqual(['[]'])
  })
})
