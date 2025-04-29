import { ApplicationTemplateHelper, YES } from '@island.is/application/core'
import { RatioType } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  DefaultEvents,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import IncomePlanTemplate from './IncomePlanTemplate'

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

describe('Income Plan Template', () => {
  describe('state transitions', () => {
    it('should transition from draft to tryggingastofnunSubmitted on submit', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            confirmCorrectInfo: true,
          },
        }),
        IncomePlanTemplate,
      )
      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('tryggingastofnunSubmitted')
    })
  })

  describe('state transitions', () => {
    it('should transition from draft to tryggingastofnunSubmitted on abort', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            confirmCorrectInfo: true,
          },
        }),
        IncomePlanTemplate,
      )
      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.ABORT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('tryggingastofnunSubmitted')
    })
  })

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
                  incomeType: 'Laun',
                  incomePerYear: '400',
                  incomeCategory: 'Atvinnutekjur',
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
              incomeType: 'Laun',
              incomePerYear: '400',
              incomeCategory: 'Atvinnutekjur',
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
                  incomeType: 'Laun',
                  incomePerYear: '400',
                  incomeCategory: 'Atvinnutekjur',
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
              incomeType: 'Laun',
              incomePerYear: '400',
              incomeCategory: 'Atvinnutekjur',
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
                  incomeType: 'Laun',
                  incomePerYear: '400',
                  incomeCategory: 'Atvinnutekjur',
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
              incomeType: 'Laun',
              incomePerYear: '400',
              incomeCategory: 'Atvinnutekjur',
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
                  incomeType: 'Laun',
                  incomePerYear: '400',
                  incomeCategory: 'Atvinnutekjur',
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
              incomeType: 'Laun',
              incomePerYear: '400',
              incomeCategory: 'Atvinnutekjur',
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
                  incomeType: 'Laun',
                  incomePerYear: '1000000',
                  incomeCategory: 'Atvinnutekjur',
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
              incomeType: 'Laun',
              incomePerYear: '1000000',
              incomeCategory: 'Atvinnutekjur',
            },
          ],
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers).toEqual(answer)
      })
      it('should unset months and unevenIncomePerYear if incomeCategory is not INCOME', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              incomePlanTable: [
                {
                  income: RatioType.MONTHLY,
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
                  incomeType: 'Skattskyldar tekjur (óskilgreint)',
                  incomePerYear: '1000000',
                  incomeCategory: 'Aðrar tekjur',
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
              income: RatioType.MONTHLY,
              currency: 'IKR',
              incomeType: 'Skattskyldar tekjur (óskilgreint)',
              incomePerYear: '1000000',
              incomeCategory: 'Aðrar tekjur',
              equalIncomePerMonth: '999',
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
