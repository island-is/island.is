import {
  AllOrAny,
  Comparators,
  Condition,
  SingleConditionCheck,
  FormValue,
} from '@island.is/application/types'
import { buildTextField } from '../lib/fieldBuilders'
import { shouldShowFormItem } from './conditionUtils'
import { buildSection, buildSubSection } from './formBuilders'

describe('conditions', () => {
  it('should show a field which has no condition whatsoever', () => {
    expect(
      shouldShowFormItem(
        buildTextField({
          id: 'asdf',
          title: 'asdf',
        }),
        {},
      ),
    ).toBeTruthy()
  })
  describe('dynamic', () => {
    it('should show a field where the current form value fulfills the dynamic condition', () => {
      expect(
        shouldShowFormItem(
          buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: () => true,
          }),
          { money: 100 },
        ),
      ).toBeTruthy()
      expect(
        shouldShowFormItem(
          buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: (formValue: FormValue) => Number(formValue.money) > 0,
          }),
          { money: 100 },
        ),
      ).toBeTruthy()
      expect(
        shouldShowFormItem(
          buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: (formValue: FormValue) =>
              formValue.money > formValue.price,
          }),
          { money: 100, price: 50 },
        ),
      ).toBeTruthy()
    })
    it('should NOT show a field with a violated dynamic condition', () => {
      expect(
        shouldShowFormItem(
          buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: () => false,
          }),
          { money: 100 },
        ),
      ).toBeFalsy()
      expect(
        shouldShowFormItem(
          buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: (formValue: FormValue) => Number(formValue.money) > 0,
          }),
          { money: 0 },
        ),
      ).toBeFalsy()
      expect(
        shouldShowFormItem(
          buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: (formValue: FormValue) =>
              formValue.money > formValue.price,
          }),
          { money: 100, price: 5000 },
        ),
      ).toBeFalsy()
    })
    it('should be able to use external data for applying dynamic conditions', () => {
      expect(
        shouldShowFormItem(
          buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: (formValue: FormValue, externalData) =>
              formValue.money > formValue.price &&
              externalData.userProfile.status === 'success' &&
              externalData.userProfile.data === 'asdf@asdf.com',
          }),
          { money: 1000, price: 5 },
          {
            userProfile: {
              date: new Date(),
              data: 'asdf@asdf.com',
              status: 'success',
            },
          },
        ),
      ).toBeTruthy()
    })
  })
  describe('static', () => {
    it('should show a section which has a fulfilled static condition', () => {
      const field = buildTextField({
        id: 'asdf',
        title: 'asdf',
      })

      const section = buildSection({
        id: 'section',
        title: 'Section title',
        children: [field],
        condition: {
          questionId: 'anotherQuestion',
          value: 'Great Answer',
          comparator: Comparators.EQUALS,
        },
      })

      expect(
        shouldShowFormItem(section, { anotherQuestion: 'Great Answer' }),
      ).toBeTruthy()
      expect(
        shouldShowFormItem(section, { anotherQuestion: 'bad answer' }),
      ).toBeFalsy()
    })
    it('should show a sub-section which has a fulfilled static condition', () => {
      const field = buildTextField({
        id: 'asdf',
        title: 'asdf',
      })

      const subSection = buildSubSection({
        id: 'section',
        title: 'Section title',
        children: [field],
        condition: {
          questionId: 'anotherQuestion',
          value: 'Great Answer',
          comparator: Comparators.EQUALS,
        },
      })

      expect(
        shouldShowFormItem(subSection, { anotherQuestion: 'Great Answer' }),
      ).toBeTruthy()
      expect(
        shouldShowFormItem(subSection, { anotherQuestion: 'bad answer' }),
      ).toBeFalsy()
    })
    it('should show a field which has a fulfilled static condition', () => {
      const field = buildTextField({
        id: 'asdf',
        title: 'asdf',
        condition: {
          questionId: 'anotherQuestion',
          value: 'Great Answer',
          comparator: Comparators.EQUALS,
        },
      })

      expect(
        shouldShowFormItem(field, { anotherQuestion: 'Great Answer' }),
      ).toBeTruthy()
      expect(
        shouldShowFormItem(field, { anotherQuestion: 'bad answer' }),
      ).toBeFalsy()
    })
    it('should show a field which has a fulfilled static condition for a separate nested field', () => {
      const field = buildTextField({
        id: 'asdf',
        title: 'asdf',
        condition: {
          questionId: 'nested.question',
          value: 'Great Answer',
          comparator: Comparators.EQUALS,
        },
      })

      expect(
        shouldShowFormItem(field, { nested: { question: 'Great Answer' } }),
      ).toBeTruthy()
      expect(
        shouldShowFormItem(field, { nested: { question: 'bad answer' } }),
      ).toBeFalsy()
    })
  })
  describe('multiConditions', () => {
    const buildMultiConditionWithOneStaticCheck = ({
      show = true,
      on = AllOrAny.ALL,
      comparator = Comparators.EQUALS,
      value = 'Great Answer',
    }): Condition => ({
      isMultiCheck: true,
      show,
      on,
      check: [
        {
          questionId: 'anotherQuestion',
          comparator,
          value,
        },
      ],
    })
    const buildMultiCheckCondition = (data: {
      show?: boolean
      on?: AllOrAny
      check: SingleConditionCheck[]
    }): Condition => ({
      show: true,
      on: AllOrAny.ALL,
      isMultiCheck: true,
      ...data,
    })
    describe('it should show the field', () => {
      it('if it has an "ALL" condition with no checks', () => {
        const field = buildTextField({
          id: 'asdf',
          title: 'asdf',
          condition: {
            isMultiCheck: true,
            show: true,
            on: AllOrAny.ALL,
            check: [],
          },
        })
        expect(shouldShowFormItem(field, {})).toBeTruthy()
      })
      describe('if it has a single static check', () => {
        it('where an answer should be equal to some value', () => {
          const field = buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: buildMultiConditionWithOneStaticCheck({}),
          })

          expect(
            shouldShowFormItem(field, { anotherQuestion: 'Great Answer' }),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(field, { anotherQuestion: 'bad answer' }),
          ).toBeFalsy()
        })
        it('where an answer should NOT equal to some value', () => {
          const field = buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: buildMultiConditionWithOneStaticCheck({
              comparator: Comparators.NOT_EQUAL,
            }),
          })

          expect(
            shouldShowFormItem(field, { anotherQuestion: 'Great Answer' }),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(field, {
              anotherQuestion: 'This is going to be true',
            }),
          ).toBeTruthy()
        })
        it('where an answer should be less than some value', () => {
          const field = buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: buildMultiConditionWithOneStaticCheck({
              comparator: Comparators.LT,
              on: AllOrAny.ANY,
            }),
          })

          expect(
            shouldShowFormItem(field, {
              anotherQuestion: 'Another Great Answer',
            }),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(field, { anotherQuestion: 'Great Answer' }),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(field, { anotherQuestion: 'Terrible' }),
          ).toBeFalsy()
        })
        it('where an answer should be less than or equal to some value', () => {
          const field = buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: buildMultiConditionWithOneStaticCheck({
              comparator: Comparators.LTE,
            }),
          })

          expect(
            shouldShowFormItem(field, {
              anotherQuestion: 'Another Great Answer',
            }),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(field, { anotherQuestion: 'Great Answer' }),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(field, { anotherQuestion: 'Terrible' }),
          ).toBeFalsy()
        })
        it('where an answer should be greater than some value', () => {
          const field = buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: buildMultiConditionWithOneStaticCheck({
              comparator: Comparators.GT,
            }),
          })

          expect(
            shouldShowFormItem(field, { anotherQuestion: 'Perfect Answer' }),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(field, { anotherQuestion: 'Great Answer' }),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(field, { anotherQuestion: 'A very bad answer' }),
          ).toBeFalsy()
        })
        it('where an answer should be greater than or equal to some value', () => {
          const field = buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: buildMultiConditionWithOneStaticCheck({
              comparator: Comparators.GTE,
              on: AllOrAny.ANY,
            }),
          })

          expect(
            shouldShowFormItem(field, { anotherQuestion: 'Perfect Answer' }),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(field, { anotherQuestion: 'Great Answer' }),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(field, { anotherQuestion: 'A very bad answer' }),
          ).toBeFalsy()
        })
      })
      describe('if it has multiple static checks', () => {
        it('where ALL checks are valid', () => {
          const field = buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: buildMultiCheckCondition({
              check: [
                {
                  questionId: 'shouldEqual',
                  comparator: Comparators.EQUALS,
                  value: 'Great Answer',
                },
                {
                  questionId: 'shouldNotEqual',
                  comparator: Comparators.NOT_EQUAL,
                  value: 'Same answer',
                },
                {
                  questionId: 'shouldBeLessThan',
                  comparator: Comparators.LT,
                  value: 'Booming answer',
                },
              ],
            }),
          })

          expect(
            shouldShowFormItem(field, {
              shouldEqual: 'Great Answer',
              shouldNotEqual: 'another answer',
              shouldBeLessThan: 'AAArdvak',
              someRandomAnswerThatHasNoImpactHere: '1',
            }),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(field, {
              shouldEqual: 'Not a Great Answer',
              shouldNotEqual: 'another answer',
              shouldBeLessThan: 'AAArdvak',
            }),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(field, {
              shouldEqual: 'Great Answer',
              shouldNotEqual: 'Same answer',
              shouldBeLessThan: 'AAArdvak',
            }),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(field, {
              shouldEqual: 'Great Answer',
              shouldNotEqual: 'another answer',
              shouldBeLessThan: 'Zebra',
            }),
          ).toBeFalsy()
        })
        it('where ANY of the checks are valid', () => {
          const field = buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: buildMultiCheckCondition({
              on: AllOrAny.ANY,
              check: [
                {
                  questionId: 'shouldEqual',
                  comparator: Comparators.EQUALS,
                  value: 'Great Answer',
                },
                {
                  questionId: 'shouldNotEqual',
                  comparator: Comparators.NOT_EQUAL,
                  value: 'Same answer',
                },
                {
                  questionId: 'shouldBeLessThan',
                  comparator: Comparators.LT,
                  value: 'Booming answer',
                },
              ],
            }),
          })

          expect(
            shouldShowFormItem(field, {
              shouldEqual: 'Great Answer',
              shouldNotEqual: 'another answer',
              shouldBeLessThan: 'AAArdvak',
            }),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(field, {
              shouldEqual: 'Great Answer',
              shouldNotEqual: 'Same answer',
              shouldBeLessThan: 'Zebra',
            }),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(field, {
              shouldEqual: 'Not a Great Answer',
              shouldNotEqual: 'another answer',
              shouldBeLessThan: 'Zebra',
            }),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(field, {
              shouldEqual: 'Not a Great Answer',
              shouldNotEqual: 'another answer',
              shouldBeLessThan: 'AAArdvak',
            }),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(field, {
              shouldEqual: 'Not a Great Answer',
              shouldNotEqual: 'Same answer',
              shouldBeLessThan: 'Zebra',
            }),
          ).toBeFalsy()
        })
      })
    })
    describe('it should NOT show the field', () => {
      it('if it has an "ANY" condition with no checks whatsoever', () => {
        const field = buildTextField({
          id: 'asdf',
          title: 'asdf',
          condition: {
            isMultiCheck: true,
            show: true,
            on: AllOrAny.ANY,
            check: [],
          },
        })
        expect(shouldShowFormItem(field, {})).toBeFalsy()
      })
      it('if it has an "ALL" condition but not answers that are needed for the condition checks', () => {
        const field = buildTextField({
          id: 'asdf',
          title: 'asdf',
          condition: buildMultiCheckCondition({
            check: [
              {
                questionId: 'shouldEqual',
                comparator: Comparators.EQUALS,
                value: 'Great Answer',
              },
              {
                questionId: 'shouldNotEqual',
                comparator: Comparators.NOT_EQUAL,
                value: 'Same answer',
              },
              {
                questionId: 'shouldBeLessThan',
                comparator: Comparators.LT,
                value: 'Booming answer',
              },
            ],
          }),
        })

        expect(
          shouldShowFormItem(field, {
            shouldNotEqual: 'another answer',
            shouldBeLessThan: 'AAArdvak',
          }),
        ).toBeFalsy()
        expect(
          shouldShowFormItem(field, {
            shouldEqual: 'Not a Great Answer',
            shouldBeLessThan: 'AAArdvak',
          }),
        ).toBeFalsy()
        expect(
          shouldShowFormItem(field, {
            shouldEqual: 'Great Answer',
            shouldNotEqual: 'Same answer',
          }),
        ).toBeFalsy()
        expect(
          shouldShowFormItem(field, {
            shouldEqual: 'Great Answer',
          }),
        ).toBeFalsy()
        expect(
          shouldShowFormItem(field, {
            thisIsAWeirdQuestion: 'Great Answer',
          }),
        ).toBeFalsy()
      })
      it('if it has an "ANY" condition but no answers that are needed for the condition checks', () => {
        const field = buildTextField({
          id: 'asdf',
          title: 'asdf',
          condition: buildMultiCheckCondition({
            on: AllOrAny.ANY,
            check: [
              {
                questionId: 'shouldEqual',
                comparator: Comparators.EQUALS,
                value: 'Great Answer',
              },
              {
                questionId: 'shouldBeLessThan',
                comparator: Comparators.LT,
                value: 'Booming answer',
              },
            ],
          }),
        })

        expect(
          shouldShowFormItem(field, {
            anotherWeirdQuestion: 'Great Answer',
            thisIsAWeirdQuestion: 'Great Answer a',
          }),
        ).toBeFalsy()
      })
      describe('if it has "show: false" and', () => {
        it('an answer that should be equal to some value', () => {
          const field = buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: buildMultiConditionWithOneStaticCheck({ show: false }),
          })

          expect(
            shouldShowFormItem(field, { anotherQuestion: 'Great Answer' }),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(field, { anotherQuestion: 'bad answer' }),
          ).toBeTruthy()
        })
        it('an answer that should NOT equal to some value', () => {
          const field = buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: buildMultiConditionWithOneStaticCheck({
              comparator: Comparators.NOT_EQUAL,
              show: false,
            }),
          })

          expect(
            shouldShowFormItem(field, { anotherQuestion: 'Great Answer' }),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(field, {
              anotherQuestion: 'This is going to be true',
            }),
          ).toBeFalsy()
        })
        it('an answer that should be less than some value', () => {
          const field = buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: buildMultiConditionWithOneStaticCheck({
              comparator: Comparators.LT,
              on: AllOrAny.ANY,
              show: false,
            }),
          })

          expect(
            shouldShowFormItem(field, {
              anotherQuestion: 'Another Great Answer',
            }),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(field, { anotherQuestion: 'Great Answer' }),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(field, { anotherQuestion: 'Terrible' }),
          ).toBeTruthy()
        })
        it('an answer that should be less than or equal to some value', () => {
          const field = buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: buildMultiConditionWithOneStaticCheck({
              comparator: Comparators.LTE,
              show: false,
            }),
          })

          expect(
            shouldShowFormItem(field, {
              anotherQuestion: 'Another Great Answer',
            }),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(field, { anotherQuestion: 'Great Answer' }),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(field, { anotherQuestion: 'Terrible' }),
          ).toBeTruthy()
        })
        it('an answer that should be greater than some value', () => {
          const field = buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: buildMultiConditionWithOneStaticCheck({
              comparator: Comparators.GT,
              show: false,
            }),
          })

          expect(
            shouldShowFormItem(field, { anotherQuestion: 'Perfect Answer' }),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(field, { anotherQuestion: 'Great Answer' }),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(field, { anotherQuestion: 'A very bad answer' }),
          ).toBeTruthy()
        })
        it('an answer that should be greater than or equal to some value', () => {
          const field = buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: buildMultiConditionWithOneStaticCheck({
              comparator: Comparators.GTE,
              on: AllOrAny.ANY,
              show: false,
            }),
          })

          expect(
            shouldShowFormItem(field, { anotherQuestion: 'Perfect Answer' }),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(field, { anotherQuestion: 'Great Answer' }),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(field, { anotherQuestion: 'A very bad answer' }),
          ).toBeTruthy()
        })
      })
    })
  })
})
