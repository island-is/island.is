import { ExternalData } from '@island.is/application/types'
import { MunicipalityApi, TaxDataApi } from '../src/dataProviders'
import { ApplicantSubmitted } from '../src/forms/ApplicantSubmitted'
import { SpouseSubmitted } from '../src/forms/SpouseSubmitted'
import { Routes } from '../src/lib/constants'
import { getFinancialAidRouting } from '../src/lib/utils'
import { isVeitaMunicipality } from '../src/utils/conditions'
import * as constants from '../src/lib/constants'

describe('financial aid routing', () => {
  afterEach(() => jest.restoreAllMocks())

  it.each([
    {},
    { backend: 'municipalities' },
    { backend: 'veita', veitaTenant: 'original-tenant' },
  ])('uses stored routing %j regardless of configuration', (data) => {
    const lookup = jest
      .spyOn(constants, 'getVeitaTenant')
      .mockReturnValue('different-tenant')
    const externalData: ExternalData = {
      municipality: { data, status: 'success', date: new Date() },
    }

    expect(getFinancialAidRouting(externalData)).toEqual(
      data.backend === 'veita' ? data : { backend: 'municipalities' },
    )
    expect(isVeitaMunicipality({}, externalData)).toBe(data.backend === 'veita')
    lookup.mockReturnValue(undefined)
    expect(isVeitaMunicipality({}, externalData)).toBe(data.backend === 'veita')
    expect(lookup).not.toHaveBeenCalled()
  })

  it('defaults missing municipality data to the municipalities backend', () => {
    expect(getFinancialAidRouting({})).toEqual({
      backend: 'municipalities',
    })
    expect(isVeitaMunicipality({}, {})).toBe(false)
  })

  it('fetches applicant tax data after municipality routing is stored', () => {
    expect(TaxDataApi.order).toBeGreaterThan(MunicipalityApi.order ?? 0)
  })

  it.each([
    [ApplicantSubmitted, Routes.RVKAPPLICANTSTATUS],
    [SpouseSubmitted, Routes.RVKSPOUSESTATUS],
  ] as const)(
    'uses the pinned routing condition for status screen %s',
    (form, id) => {
      const screen = form.children.find((field) => field.id === id)
      expect(screen?.condition).toBe(isVeitaMunicipality)
    },
  )
})
