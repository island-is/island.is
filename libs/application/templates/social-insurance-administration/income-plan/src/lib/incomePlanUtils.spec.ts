import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import {
  getApplicationExternalData,
  getCategoriesOptions,
  getOneInstanceOfCategory,
  getTypesOptions,
} from './incomePlanUtils'

const buildApplication = (data?: {
  answers?: FormValue
  externalData?: ExternalData
  state?: string
}): Application => {
  const { answers = {}, externalData = {}, state = 'draft' } = data ?? {}

  return {
    id: '12345',
    assignees: [],
    applicant: '1234567890',
    typeId: ApplicationTypes.INCOME_PLAN,
    created: new Date(),
    modified: new Date(),
    applicantActors: [],
    answers,
    state,
    externalData,
    status: ApplicationStatus.IN_PROGRESS,
  }
}

describe('getCategoriesOptions', () => {
  it('should return income type categories', () => {
    const application = buildApplication({
      externalData: {
        socialInsuranceAdministrationCategorizedIncomeTypes: {
          data: [
            {
              categoryNumber: 1,
              categoryName: 'Atvinnutekjur',
              categoryCode: 'ATV01',
              incomeTypeNumber: 101,
              incomeTypeName: 'Laun',
              incomeTypeCode: 'IPC01',
            },
            {
              categoryNumber: 2,
              categoryName: 'Fjármagnstekjur',
              categoryCode: 'FJT01',
              incomeTypeNumber: 201,
              incomeTypeName: 'Atvinnuleysisbætur',
              incomeTypeCode: 'IPC02',
            },
          ],
          date: new Date(),
          status: 'success',
        },
      },
    })
    const { categorizedIncomeTypes } = getApplicationExternalData(
      application.externalData,
    )

    const categories = getOneInstanceOfCategory(categorizedIncomeTypes)

    const res = getCategoriesOptions(application.externalData)

    const expected =
      categories &&
      categories.map((item) => {
        return {
          value: item.categoryName || '',
          label: item.categoryName || '',
        }
      })

    expect(res).toEqual(expected)
  })
})

describe('getTypesOptions', () => {
  it('should return income type', () => {
    const application = buildApplication({
      externalData: {
        socialInsuranceAdministrationCategorizedIncomeTypes: {
          data: [
            {
              categoryNumber: 1,
              categoryName: 'Atvinnutekjur',
              categoryCode: 'ATV01',
              incomeTypeNumber: 101,
              incomeTypeName: 'Laun',
              incomeTypeCode: 'IPC01',
            },
            {
              categoryNumber: 2,
              categoryName: 'Fjármagnstekjur',
              categoryCode: 'FJT01',
              incomeTypeNumber: 201,
              incomeTypeName: 'Atvinnuleysisbætur',
              incomeTypeCode: 'IPC02',
            },
          ],
          date: new Date(),
          status: 'success',
        },
      },
    })
    const categoryName = 'Atvinnutekjur'

    const { categorizedIncomeTypes } = getApplicationExternalData(
      application.externalData,
    )

    const res = getTypesOptions(application.externalData, categoryName)
    const expected = categorizedIncomeTypes
      .filter((item) => item.categoryName === categoryName)
      .map((item) => {
        return {
          value: item.incomeTypeName || '',
          label: item.incomeTypeName || '',
        }
      })

    expect(res).toEqual(expected)
  })
})
