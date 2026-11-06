import {
  getProviderSuccessData,
  type ProviderExternalData,
} from './providerResult'

type Employees = { employees: { ordinal: number }[] }
type Analysis = { outliers: unknown[] }

const employees: Employees = { employees: [{ ordinal: 1 }] }
const analysis: Analysis = { outliers: [] }

describe('getProviderSuccessData', () => {
  it('returns the payload of a successful provider', () => {
    expect(
      getProviderSuccessData<Employees>({ status: 'success', data: employees }),
    ).toBe(employees)
  })

  it('returns undefined for a missing entry', () => {
    expect(getProviderSuccessData<Employees>(undefined)).toBeUndefined()
  })

  it('returns undefined when a success entry carries no payload', () => {
    expect(
      getProviderSuccessData<Employees>({ status: 'success' }),
    ).toBeUndefined()
  })

  // The action runner writes `data: {}` next to `status: 'failure'`, so the
  // entry's `data` is truthy on a failed provider. Trusting it would hand the
  // caller an empty bag typed as a real payload.
  it('drops the empty data bag written on failure', () => {
    const failed = {
      status: 'failure',
      data: {},
      reason: { title: 'Villa', summary: 'Greining mistókst' },
    } as ProviderExternalData<Employees>

    expect(getProviderSuccessData(failed)).toBeUndefined()
  })

  /**
   * updateApplicationExternalData reports one status per provider and its
   * endpoint never applies `throwOnError`, so both of these mixed responses
   * reach the client. Each entry has to be read on its own: the failed leg must
   * not be paired with the successful one's data.
   */
  describe('partial success', () => {
    it('analysis succeeds while the employees list fails', () => {
      const externalData = {
        salaryAnalysisResult: { status: 'success', data: analysis },
        draftEmployees: { status: 'failure', data: {}, reason: 'Tímamörk' },
      }

      expect(
        getProviderSuccessData(
          externalData.salaryAnalysisResult as ProviderExternalData<Analysis>,
        ),
      ).toBe(analysis)
      expect(
        getProviderSuccessData(
          externalData.draftEmployees as ProviderExternalData<Employees>,
        ),
      ).toBeUndefined()
    })

    it('employees list succeeds while the analysis fails', () => {
      const externalData = {
        salaryAnalysisResult: { status: 'failure', data: {}, reason: 'Villa' },
        draftEmployees: { status: 'success', data: employees },
      }

      expect(
        getProviderSuccessData(
          externalData.salaryAnalysisResult as ProviderExternalData<Analysis>,
        ),
      ).toBeUndefined()
      expect(
        getProviderSuccessData(
          externalData.draftEmployees as ProviderExternalData<Employees>,
        ),
      ).toBe(employees)
    })
  })
})
