import { Application } from '@island.is/application/types'
import { Fasteign } from '@island.is/clients/assets'
import {
  getSelectedRealEstate,
  sumSelectedUnitsFireCompensation,
} from './utils'

const YES = 'yes'

const ownedProperty: Fasteign = {
  fasteignanumer: 'F1234567',
  notkunareiningar: {
    notkunareiningar: [
      { notkunareininganumer: '010101', brunabotamat: 60000000 },
      { notkunareininganumer: '010102', brunabotamat: 4500000 },
    ],
  },
}

const byCodeProperty: Fasteign = {
  fasteignanumer: 'F7654321',
  notkunareiningar: {
    notkunareiningar: [
      { notkunareininganumer: '020201', brunabotamat: 30000000 },
    ],
  },
}

const buildApplication = (
  answers: Record<string, unknown>,
  externalData: Record<string, { data: unknown }>,
): Application =>
  ({
    answers,
    externalData,
  } as unknown as Application)

describe('getSelectedRealEstate', () => {
  it('resolves an owned property from the realEstate answer and getProperties externalData', () => {
    const application = buildApplication(
      { realEstate: 'F1234567' },
      { getProperties: { data: [ownedProperty] } },
    )

    const result = getSelectedRealEstate(application)

    expect(result.selectedRealEstateId).toBe('F1234567')
    expect(result.realEstates).toEqual([ownedProperty])
    expect(result.selectedRealEstate).toBe(ownedProperty)
  })

  it('resolves a by-code property from fetchPropertiesByCode externalData (SDF app)', () => {
    const application = buildApplication(
      {
        otherPropertiesThanIOwnCheckbox: [YES],
        selectedPropertyByCode: '7654321',
      },
      { fetchPropertiesByCode: { data: [byCodeProperty] } },
    )

    const result = getSelectedRealEstate(application)

    expect(result.selectedRealEstateId).toBe('F7654321')
    expect(result.selectedRealEstate).toBe(byCodeProperty)
  })

  it('falls back to the anyProperties answer for the by-code flow (legacy app)', () => {
    const application = buildApplication(
      {
        otherPropertiesThanIOwnCheckbox: [YES],
        selectedPropertyByCode: '7654321',
        anyProperties: [byCodeProperty],
      },
      {},
    )

    const result = getSelectedRealEstate(application)

    expect(result.selectedRealEstateId).toBe('F7654321')
    expect(result.realEstates).toEqual([byCodeProperty])
    expect(result.selectedRealEstate).toBe(byCodeProperty)
  })

  it('prefers fetchPropertiesByCode externalData over the anyProperties answer', () => {
    const application = buildApplication(
      {
        otherPropertiesThanIOwnCheckbox: [YES],
        selectedPropertyByCode: '7654321',
        anyProperties: [ownedProperty],
      },
      { fetchPropertiesByCode: { data: [byCodeProperty] } },
    )

    expect(getSelectedRealEstate(application).selectedRealEstate).toBe(
      byCodeProperty,
    )
  })

  it('returns no id when the by-code flow has no selected property code', () => {
    const application = buildApplication(
      { otherPropertiesThanIOwnCheckbox: [YES] },
      { fetchPropertiesByCode: { data: [byCodeProperty] } },
    )

    const result = getSelectedRealEstate(application)

    expect(result.selectedRealEstateId).toBeUndefined()
    expect(result.selectedRealEstate).toBeUndefined()
  })

  it('returns undefined realEstates when no source has data', () => {
    const application = buildApplication({ realEstate: 'F1234567' }, {})

    const result = getSelectedRealEstate(application)

    expect(result.realEstates).toBeUndefined()
    expect(result.selectedRealEstate).toBeUndefined()
  })
})

describe('sumSelectedUnitsFireCompensation', () => {
  it('sums the fire appraisal of the selected usage units only', () => {
    expect(sumSelectedUnitsFireCompensation(ownedProperty, ['010101'])).toBe(
      60000000,
    )
    expect(
      sumSelectedUnitsFireCompensation(ownedProperty, ['010101', '010102']),
    ).toBe(64500000)
  })

  it('returns 0 for no selection or no property', () => {
    expect(sumSelectedUnitsFireCompensation(ownedProperty, [])).toBe(0)
    expect(sumSelectedUnitsFireCompensation(undefined, ['010101'])).toBe(0)
  })
})
