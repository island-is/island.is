import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  DefaultEvents,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import IncomePlanTemplate from './IncomePlanTemplate'
import { RatioType, YES } from './constants'

const buildApplication = (data: {
  answers?: FormValue
  externalData?: ExternalData
  state?: string
}): Application => {
  const { answers = {}, externalData = {}, state = 'draft' } = data

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

describe('Income Plan Application Template', () => {
  describe('Income plan table', () => {
    describe('equalForeignIncomePerMonth', () => {
      it('should unset equalForeignIncomePerMonth if income is MONTHLY and unevenIncomePerYear is YES', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              incomePlanTable: [
                {
                  income: RatioType.MONTHLY,
                  currency: 'ZAR',
                  january: '100',
                  february: '100',
                  march: '100',
                  november: '100',
                  incomeTypes: 'Laun',
                  incomePerYear: '400',
                  incomeCategories: 'Atvinnutekjur',
                  unevenIncomePerYear: [YES],
                  equalForeignIncomePerMonth: '999',
                },
              ],
            },
          }),
          IncomePlanTemplate,
        )

        const answer = {
          incomePlanTable: [
            {
              income: RatioType.MONTHLY,
              currency: 'ZAR',
              january: '100',
              february: '100',
              march: '100',
              november: '100',
              incomeTypes: 'Laun',
              incomePerYear: '400',
              incomeCategories: 'Atvinnutekjur',
              unevenIncomePerYear: [YES],
            },
          ],
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers).toEqual(answer)
      })
      it('should unset equalForeignIncomePerMonth if income is YEARLY', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              incomePlanTable: [
                {
                  income: RatioType.YEARLY,
                  currency: 'ZAR',
                  incomeTypes: 'Laun',
                  incomePerYear: '400',
                  incomeCategories: 'Atvinnutekjur',
                  equalForeignIncomePerMonth: '999',
                },
              ],
            },
          }),
          IncomePlanTemplate,
        )

        const answer = {
          incomePlanTable: [
            {
              income: RatioType.YEARLY,
              currency: 'ZAR',
              incomeTypes: 'Laun',
              incomePerYear: '400',
              incomeCategories: 'Atvinnutekjur',
            },
          ],
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers).toEqual(answer)
      })
    })
    describe('equalIncomePerMonth', () => {
      it('should unset equalIncomePerMonth if income is MONTHLY and unevenIncomePerYear is YES', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              incomePlanTable: [
                {
                  income: RatioType.MONTHLY,
                  currency: 'IKR',
                  january: '100',
                  february: '100',
                  march: '100',
                  november: '100',
                  incomeTypes: 'Laun',
                  incomePerYear: '400',
                  incomeCategories: 'Atvinnutekjur',
                  unevenIncomePerYear: [YES],
                  equalIncomePerMonth: '999',
                },
              ],
            },
          }),
          IncomePlanTemplate,
        )

        const answer = {
          incomePlanTable: [
            {
              income: RatioType.MONTHLY,
              currency: 'IKR',
              january: '100',
              february: '100',
              march: '100',
              november: '100',
              incomeTypes: 'Laun',
              incomePerYear: '400',
              incomeCategories: 'Atvinnutekjur',
              unevenIncomePerYear: [YES],
            },
          ],
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers).toEqual(answer)
      })
      it('should unset equalIncomePerMonth if income is YEARLY', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              incomePlanTable: [
                {
                  income: RatioType.YEARLY,
                  currency: 'IKR',
                  incomeTypes: 'Laun',
                  incomePerYear: '400',
                  incomeCategories: 'Atvinnutekjur',
                  equalIncomePerMonth: '999',
                },
              ],
            },
          }),
          IncomePlanTemplate,
        )

        const answer = {
          incomePlanTable: [
            {
              income: RatioType.YEARLY,
              currency: 'IKR',
              incomeTypes: 'Laun',
              incomePerYear: '400',
              incomeCategories: 'Atvinnutekjur',
            },
          ],
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers).toEqual(answer)
      })
    })

    describe('months and unevenIncomePerYear', () => {
      it('should unset months and unevenIncomePerYear if income is YEARLY', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              incomePlanTable: [
                {
                  income: RatioType.YEARLY,
                  january: '999',
                  february: '999',
                  march: '999',
                  april: '999',
                  may: '999',
                  june: '999',
                  july: '999',
                  august: '999',
                  september: '999',
                  october: '999',
                  november: '999',
                  december: '999',
                  currency: 'IKR',
                  incomeTypes: 'Laun',
                  incomePerYear: '1000000',
                  incomeCategories: 'Atvinnutekjur',
                  equalIncomePerMonth: '999',
                  unevenIncomePerYear: [YES],
                },
              ],
            },
          }),
          IncomePlanTemplate,
        )

        const answer = {
          incomePlanTable: [
            {
              income: RatioType.YEARLY,
              currency: 'IKR',
              incomeTypes: 'Laun',
              incomePerYear: '1000000',
              incomeCategories: 'Atvinnutekjur',
            },
          ],
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers).toEqual(answer)
      })
    })
  })
})
