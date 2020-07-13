import { AllOrAny, Comparators, Condition } from '../types/Condition'
import { FormValue } from '../types/Form'
import { buildTextField } from '../lib/fieldBuilders'
import { shouldShowField } from './conditionUtils'

describe('conditions', () => {
  it('should show a field which has no condition whatsoever', () => {
    expect(
      shouldShowField(
        buildTextField({
          id: 'asdf',
          name: 'asdf',
          required: false,
        }),
        {},
      ),
    ).toBeTruthy()
  })
  describe('dynamic', () => {
    it('should show a field where the current form value fulfills the dynamic condition', () => {
      expect(
        shouldShowField(
          buildTextField({
            id: 'asdf',
            name: 'asdf',
            required: false,
            condition: () => true,
          }),
          { money: 100 },
        ),
      ).toBeTruthy()
      expect(
        shouldShowField(
          buildTextField({
            id: 'asdf',
            name: 'asdf',
            required: false,
            condition: (formValue: FormValue) => formValue.money > 0,
          }),
          { money: 100 },
        ),
      ).toBeTruthy()
      expect(
        shouldShowField(
          buildTextField({
            id: 'asdf',
            name: 'asdf',
            required: false,
            condition: (formValue: FormValue) =>
              formValue.money > formValue.price,
          }),
          { money: 100, price: 50 },
        ),
      ).toBeTruthy()
    })
    it('should NOT show a field with a violated dynamic condition', () => {
      expect(
        shouldShowField(
          buildTextField({
            id: 'asdf',
            name: 'asdf',
            required: false,
            condition: () => false,
          }),
          { money: 100 },
        ),
      ).toBeFalsy()
      expect(
        shouldShowField(
          buildTextField({
            id: 'asdf',
            name: 'asdf',
            required: false,
            condition: (formValue: FormValue) => formValue.money > 0,
          }),
          { money: 0 },
        ),
      ).toBeFalsy()
      expect(
        shouldShowField(
          buildTextField({
            id: 'asdf',
            name: 'asdf',
            required: false,
            condition: (formValue: FormValue) =>
              formValue.money > formValue.price,
          }),
          { money: 100, price: 5000 },
        ),
      ).toBeFalsy()
    })
  })
  describe('static', () => {
    it('should show a field which has a fulfilled static condition', () => {
      const field = buildTextField({
        id: 'asdf',
        name: 'asdf',
        required: true,
        condition: {
          questionId: 'anotherQuestion',
          value: 'Great Answer',
          comparator: Comparators.EQUALS,
        },
      })

      expect(
        shouldShowField(field, { anotherQuestion: 'Great Answer' }),
      ).toBeTruthy()
      expect(
        shouldShowField(field, { anotherQuestion: 'bad answer' }),
      ).toBeFalsy()
    })
    it('should show a field which has a fulfilled static condition for a separate nested field', () => {
      const field = buildTextField({
        id: 'asdf',
        name: 'asdf',
        required: true,
        condition: {
          questionId: 'nested.question',
          value: 'Great Answer',
          comparator: Comparators.EQUALS,
        },
      })

      expect(
        shouldShowField(field, { nested: { question: 'Great Answer' } }),
      ).toBeTruthy()
      expect(
        shouldShowField(field, { nested: { question: 'bad answer' } }),
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
    const buildMultiCheckCondition = ({
      show = true,
      on = AllOrAny.ALL,
      check,
    }): Condition => ({
      isMultiCheck: true,
      show,
      on,
      check,
    })
    describe('it should show the field', () => {
      it('if it has an "ALL" condition with no checks', () => {
        const field = buildTextField({
          id: 'asdf',
          name: 'asdf',
          required: true,
          condition: {
            isMultiCheck: true,
            show: true,
            on: AllOrAny.ALL,
            check: [],
          },
        })
        expect(shouldShowField(field, {})).toBeTruthy()
      })
      describe('if it has a single static check', () => {
        it('where an answer should be equal to some value', () => {
          const field = buildTextField({
            id: 'asdf',
            name: 'asdf',
            required: true,
            condition: buildMultiConditionWithOneStaticCheck({}),
          })

          expect(
            shouldShowField(field, { anotherQuestion: 'Great Answer' }),
          ).toBeTruthy()
          expect(
            shouldShowField(field, { anotherQuestion: 'bad answer' }),
          ).toBeFalsy()
        })
        it('where an answer should NOT equal to some value', () => {
          const field = buildTextField({
            id: 'asdf',
            name: 'asdf',
            required: true,
            condition: buildMultiConditionWithOneStaticCheck({
              comparator: Comparators.NOT_EQUAL,
            }),
          })

          expect(
            shouldShowField(field, { anotherQuestion: 'Great Answer' }),
          ).toBeFalsy()
          expect(
            shouldShowField(field, {
              anotherQuestion: 'This is going to be true',
            }),
          ).toBeTruthy()
        })
        it('where an answer should be less than some value', () => {
          const field = buildTextField({
            id: 'asdf',
            name: 'asdf',
            required: true,
            condition: buildMultiConditionWithOneStaticCheck({
              comparator: Comparators.LT,
              on: AllOrAny.ANY,
            }),
          })

          expect(
            shouldShowField(field, { anotherQuestion: 'Another Great Answer' }),
          ).toBeTruthy()
          expect(
            shouldShowField(field, { anotherQuestion: 'Great Answer' }),
          ).toBeFalsy()
          expect(
            shouldShowField(field, { anotherQuestion: 'Terrible' }),
          ).toBeFalsy()
        })
        it('where an answer should be less than or equal to some value', () => {
          const field = buildTextField({
            id: 'asdf',
            name: 'asdf',
            required: true,
            condition: buildMultiConditionWithOneStaticCheck({
              comparator: Comparators.LTE,
            }),
          })

          expect(
            shouldShowField(field, { anotherQuestion: 'Another Great Answer' }),
          ).toBeTruthy()
          expect(
            shouldShowField(field, { anotherQuestion: 'Great Answer' }),
          ).toBeTruthy()
          expect(
            shouldShowField(field, { anotherQuestion: 'Terrible' }),
          ).toBeFalsy()
        })
        it('where an answer should be greater than some value', () => {
          const field = buildTextField({
            id: 'asdf',
            name: 'asdf',
            required: true,
            condition: buildMultiConditionWithOneStaticCheck({
              comparator: Comparators.GT,
            }),
          })

          expect(
            shouldShowField(field, { anotherQuestion: 'Perfect Answer' }),
          ).toBeTruthy()
          expect(
            shouldShowField(field, { anotherQuestion: 'Great Answer' }),
          ).toBeFalsy()
          expect(
            shouldShowField(field, { anotherQuestion: 'A very bad answer' }),
          ).toBeFalsy()
        })
        it('where an answer should be greater than or equal to some value', () => {
          const field = buildTextField({
            id: 'asdf',
            name: 'asdf',
            required: true,
            condition: buildMultiConditionWithOneStaticCheck({
              comparator: Comparators.GTE,
              on: AllOrAny.ANY,
            }),
          })

          expect(
            shouldShowField(field, { anotherQuestion: 'Perfect Answer' }),
          ).toBeTruthy()
          expect(
            shouldShowField(field, { anotherQuestion: 'Great Answer' }),
          ).toBeTruthy()
          expect(
            shouldShowField(field, { anotherQuestion: 'A very bad answer' }),
          ).toBeFalsy()
        })
      })
      describe('if it has multiple static checks', () => {
        it('where ALL checks are valid', () => {
          const field = buildTextField({
            id: 'asdf',
            name: 'asdf',
            required: true,
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
            shouldShowField(field, {
              shouldEqual: 'Great Answer',
              shouldNotEqual: 'another answer',
              shouldBeLessThan: 'AAArdvak',
              someRandomAnswerThatHasNoImpactHere: '1',
            }),
          ).toBeTruthy()
          expect(
            shouldShowField(field, {
              shouldEqual: 'Not a Great Answer',
              shouldNotEqual: 'another answer',
              shouldBeLessThan: 'AAArdvak',
            }),
          ).toBeFalsy()
          expect(
            shouldShowField(field, {
              shouldEqual: 'Great Answer',
              shouldNotEqual: 'Same answer',
              shouldBeLessThan: 'AAArdvak',
            }),
          ).toBeFalsy()
          expect(
            shouldShowField(field, {
              shouldEqual: 'Great Answer',
              shouldNotEqual: 'another answer',
              shouldBeLessThan: 'Zebra',
            }),
          ).toBeFalsy()
        })
        it('where ANY of the checks are valid', () => {
          const field = buildTextField({
            id: 'asdf',
            name: 'asdf',
            required: true,
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
            shouldShowField(field, {
              shouldEqual: 'Great Answer',
              shouldNotEqual: 'another answer',
              shouldBeLessThan: 'AAArdvak',
            }),
          ).toBeTruthy()
          expect(
            shouldShowField(field, {
              shouldEqual: 'Great Answer',
              shouldNotEqual: 'Same answer',
              shouldBeLessThan: 'Zebra',
            }),
          ).toBeTruthy()
          expect(
            shouldShowField(field, {
              shouldEqual: 'Not a Great Answer',
              shouldNotEqual: 'another answer',
              shouldBeLessThan: 'Zebra',
            }),
          ).toBeTruthy()
          expect(
            shouldShowField(field, {
              shouldEqual: 'Not a Great Answer',
              shouldNotEqual: 'another answer',
              shouldBeLessThan: 'AAArdvak',
            }),
          ).toBeTruthy()
          expect(
            shouldShowField(field, {
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
          name: 'asdf',
          required: true,
          condition: {
            isMultiCheck: true,
            show: true,
            on: AllOrAny.ANY,
            check: [],
          },
        })
        expect(shouldShowField(field, {})).toBeFalsy()
      })
      it('if it has an "ALL" condition but not answers that are needed for the condition checks', () => {
        const field = buildTextField({
          id: 'asdf',
          name: 'asdf',
          required: true,
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
          shouldShowField(field, {
            shouldNotEqual: 'another answer',
            shouldBeLessThan: 'AAArdvak',
          }),
        ).toBeFalsy()
        expect(
          shouldShowField(field, {
            shouldEqual: 'Not a Great Answer',
            shouldBeLessThan: 'AAArdvak',
          }),
        ).toBeFalsy()
        expect(
          shouldShowField(field, {
            shouldEqual: 'Great Answer',
            shouldNotEqual: 'Same answer',
          }),
        ).toBeFalsy()
        expect(
          shouldShowField(field, {
            shouldEqual: 'Great Answer',
          }),
        ).toBeFalsy()
        expect(
          shouldShowField(field, {
            thisIsAWeirdQuestion: 'Great Answer',
          }),
        ).toBeFalsy()
      })
      it('if it has an "ANY" condition but no answers that are needed for the condition checks', () => {
        const field = buildTextField({
          id: 'asdf',
          name: 'asdf',
          required: true,
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
          shouldShowField(field, {
            anotherWeirdQuestion: 'Great Answer',
            thisIsAWeirdQuestion: 'Great Answer a',
          }),
        ).toBeFalsy()
      })
      describe('if it has "show: false" and', () => {
        it('an answer that should be equal to some value', () => {
          const field = buildTextField({
            id: 'asdf',
            name: 'asdf',
            required: true,
            condition: buildMultiConditionWithOneStaticCheck({ show: false }),
          })

          expect(
            shouldShowField(field, { anotherQuestion: 'Great Answer' }),
          ).toBeFalsy()
          expect(
            shouldShowField(field, { anotherQuestion: 'bad answer' }),
          ).toBeTruthy()
        })
        it('an answer that should NOT equal to some value', () => {
          const field = buildTextField({
            id: 'asdf',
            name: 'asdf',
            required: true,
            condition: buildMultiConditionWithOneStaticCheck({
              comparator: Comparators.NOT_EQUAL,
              show: false,
            }),
          })

          expect(
            shouldShowField(field, { anotherQuestion: 'Great Answer' }),
          ).toBeTruthy()
          expect(
            shouldShowField(field, {
              anotherQuestion: 'This is going to be true',
            }),
          ).toBeFalsy()
        })
        it('an answer that should be less than some value', () => {
          const field = buildTextField({
            id: 'asdf',
            name: 'asdf',
            required: true,
            condition: buildMultiConditionWithOneStaticCheck({
              comparator: Comparators.LT,
              on: AllOrAny.ANY,
              show: false,
            }),
          })

          expect(
            shouldShowField(field, { anotherQuestion: 'Another Great Answer' }),
          ).toBeFalsy()
          expect(
            shouldShowField(field, { anotherQuestion: 'Great Answer' }),
          ).toBeTruthy()
          expect(
            shouldShowField(field, { anotherQuestion: 'Terrible' }),
          ).toBeTruthy()
        })
        it('an answer that should be less than or equal to some value', () => {
          const field = buildTextField({
            id: 'asdf',
            name: 'asdf',
            required: true,
            condition: buildMultiConditionWithOneStaticCheck({
              comparator: Comparators.LTE,
              show: false,
            }),
          })

          expect(
            shouldShowField(field, { anotherQuestion: 'Another Great Answer' }),
          ).toBeFalsy()
          expect(
            shouldShowField(field, { anotherQuestion: 'Great Answer' }),
          ).toBeFalsy()
          expect(
            shouldShowField(field, { anotherQuestion: 'Terrible' }),
          ).toBeTruthy()
        })
        it('an answer that should be greater than some value', () => {
          const field = buildTextField({
            id: 'asdf',
            name: 'asdf',
            required: true,
            condition: buildMultiConditionWithOneStaticCheck({
              comparator: Comparators.GT,
              show: false,
            }),
          })

          expect(
            shouldShowField(field, { anotherQuestion: 'Perfect Answer' }),
          ).toBeFalsy()
          expect(
            shouldShowField(field, { anotherQuestion: 'Great Answer' }),
          ).toBeTruthy()
          expect(
            shouldShowField(field, { anotherQuestion: 'A very bad answer' }),
          ).toBeTruthy()
        })
        it('an answer that should be greater than or equal to some value', () => {
          const field = buildTextField({
            id: 'asdf',
            name: 'asdf',
            required: true,
            condition: buildMultiConditionWithOneStaticCheck({
              comparator: Comparators.GTE,
              on: AllOrAny.ANY,
              show: false,
            }),
          })

          expect(
            shouldShowField(field, { anotherQuestion: 'Perfect Answer' }),
          ).toBeFalsy()
          expect(
            shouldShowField(field, { anotherQuestion: 'Great Answer' }),
          ).toBeFalsy()
          expect(
            shouldShowField(field, { anotherQuestion: 'A very bad answer' }),
          ).toBeTruthy()
        })
      })
    })
  })
})
