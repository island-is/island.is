import {
  AllOrAny,
  Comparators,
  Condition,
  SingleConditionCheck,
  FormValue,
  ExternalData,
} from '@island.is/application/types'
import { buildTextField } from '../lib/fieldBuilders'
import { shouldShowFormItem } from './conditionUtils'
import { buildSection, buildSubSection } from './formBuilders'
import { User } from 'user'
import { createOpenIDUser } from '@island.is/testing/fixtures'

const createRandomUser = (): User => {
  const user = {
    profile: {
      nationalId: '1234567890',
      name: 'John Doe',
      idp: 'idpExample',
      subjectType: 'person',
    },
  }
  return createOpenIDUser(user as User)
}

const createExternalData = (
  key: string,
  data: any,
  status: 'failure' | 'success',
): ExternalData => ({
  [key]: {
    data,
    date: new Date(),
    status,
  },
})

describe('conditions', () => {
  it('should show a field which has no condition whatsoever', () => {
    expect(
      shouldShowFormItem(
        buildTextField({
          id: 'asdf',
          title: 'asdf',
        }),
        {},
        {},
        null,
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
          {},
          null,
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
          {},
          null,
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
          {},
          null,
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
          {},
          null,
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
          {},
          null,
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
          {},
          null,
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
          null,
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
        shouldShowFormItem(
          section,
          { anotherQuestion: 'Great Answer' },
          {},
          null,
        ),
      ).toBeTruthy()
      expect(
        shouldShowFormItem(
          section,
          { anotherQuestion: 'bad answer' },
          {},
          null,
        ),
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
        shouldShowFormItem(
          subSection,
          { anotherQuestion: 'Great Answer' },
          {},
          null,
        ),
      ).toBeTruthy()
      expect(
        shouldShowFormItem(
          subSection,
          { anotherQuestion: 'bad answer' },
          {},
          null,
        ),
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
        shouldShowFormItem(
          field,
          { anotherQuestion: 'Great Answer' },
          {},
          null,
        ),
      ).toBeTruthy()
      expect(
        shouldShowFormItem(field, { anotherQuestion: 'bad answer' }, {}, null),
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
        shouldShowFormItem(
          field,
          { nested: { question: 'Great Answer' } },
          {},
          null,
        ),
      ).toBeTruthy()
      expect(
        shouldShowFormItem(
          field,
          { nested: { question: 'bad answer' } },
          {},
          null,
        ),
      ).toBeFalsy()
    })
    it('should show a field when the condition is CONTAINS and the array contains the value', () => {
      const field = buildTextField({
        id: 'containsField',
        title: 'Contains Field',
        condition: {
          questionId: 'arrayField',
          value: 'includedValue',
          comparator: Comparators.CONTAINS,
        },
      })

      expect(
        shouldShowFormItem(
          field,
          { arrayField: ['includedValue', 'otherValue'] },
          {},
          null,
        ),
      ).toBeTruthy()

      expect(
        shouldShowFormItem(
          field,
          { arrayField: ['otherValue', 'anotherValue'] },
          {},
          null,
        ),
      ).toBeFalsy()
    })

    it('should show a field when the condition is NOT_CONTAINS and the array does not contain the value', () => {
      const field = buildTextField({
        id: 'notContainsField',
        title: 'Not Contains Field',
        condition: {
          questionId: 'arrayField',
          value: 'excludedValue',
          comparator: Comparators.NOT_CONTAINS,
        },
      })

      expect(
        shouldShowFormItem(
          field,
          { arrayField: ['otherValue', 'anotherValue'] },
          {},
          null,
        ),
      ).toBeTruthy()

      expect(
        shouldShowFormItem(
          field,
          { arrayField: ['excludedValue', 'otherValue'] },
          {},
          null,
        ),
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
        expect(shouldShowFormItem(field, {}, {}, null)).toBeTruthy()
      })
      describe('if it has a single static check', () => {
        it('where an answer should be equal to some value', () => {
          const field = buildTextField({
            id: 'asdf',
            title: 'asdf',
            condition: buildMultiConditionWithOneStaticCheck({}),
          })

          expect(
            shouldShowFormItem(
              field,
              { anotherQuestion: 'Great Answer' },
              {},
              null,
            ),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(
              field,
              { anotherQuestion: 'bad answer' },
              {},
              null,
            ),
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
            shouldShowFormItem(
              field,
              { anotherQuestion: 'Great Answer' },
              {},
              null,
            ),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(
              field,
              {
                anotherQuestion: 'This is going to be true',
              },
              {},
              null,
            ),
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
            shouldShowFormItem(
              field,
              {
                anotherQuestion: 'Another Great Answer',
              },
              {},
              null,
            ),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(
              field,
              { anotherQuestion: 'Great Answer' },
              {},
              null,
            ),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(
              field,
              { anotherQuestion: 'Terrible' },
              {},
              null,
            ),
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
            shouldShowFormItem(
              field,
              {
                anotherQuestion: 'Another Great Answer',
              },
              {},
              null,
            ),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(
              field,
              { anotherQuestion: 'Great Answer' },
              {},
              null,
            ),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(
              field,
              { anotherQuestion: 'Terrible' },
              {},
              null,
            ),
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
            shouldShowFormItem(
              field,
              { anotherQuestion: 'Perfect Answer' },
              {},
              null,
            ),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(
              field,
              { anotherQuestion: 'Great Answer' },
              {},
              null,
            ),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(
              field,
              { anotherQuestion: 'A very bad answer' },
              {},
              null,
            ),
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
            shouldShowFormItem(
              field,
              { anotherQuestion: 'Perfect Answer' },
              {},
              null,
            ),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(
              field,
              { anotherQuestion: 'Great Answer' },
              {},
              null,
            ),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(
              field,
              { anotherQuestion: 'A very bad answer' },
              {},
              null,
            ),
          ).toBeFalsy()
        })
      })
      describe('if it has multiple static checks', () => {
        let testField: ReturnType<typeof buildTextField>
        let externalData: ExternalData
        let externalDataWithOtherData: ExternalData
        beforeEach(() => {
          externalData = createExternalData(
            'anotherData',
            'someDataString',
            'success',
          )
          externalDataWithOtherData = createExternalData(
            'otherData',
            'someDataString',
            'success',
          )
          testField = buildTextField({
            id: 'multiCheckField',
            title: 'Multi Check Field',
          })
        })

        it('where ALL checks are valid', () => {
          testField.condition = buildMultiCheckCondition({
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
              {
                externalDataId: 'anotherData.data',
                value: 'someDataString',
                comparator: Comparators.EQUALS,
              },
            ],
          })

          expect(
            shouldShowFormItem(
              testField,
              {
                shouldEqual: 'Great Answer',
                shouldNotEqual: 'another answer',
                shouldBeLessThan: 'AAArdvak',
              },
              externalData,
              null,
            ),
          ).toBeTruthy()

          expect(
            shouldShowFormItem(
              testField,
              {
                shouldEqual: 'Not a Great Answer',
                shouldNotEqual: 'another answer',
                shouldBeLessThan: 'AAArdvak',
              },
              externalDataWithOtherData,
              null,
            ),
          ).toBeFalsy()
        })

        it('where ANY of the checks are valid', () => {
          testField.condition = buildMultiCheckCondition({
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
          })

          expect(
            shouldShowFormItem(
              testField,
              {
                shouldEqual: 'Not a Great Answer',
                shouldNotEqual: 'another answer',
                shouldBeLessThan: 'AAArdvak',
              },
              {},
              null,
            ),
          ).toBeTruthy()

          expect(
            shouldShowFormItem(
              testField,
              {
                shouldEqual: 'Not a Great Answer',
                shouldNotEqual: 'Same answer',
                shouldBeLessThan: 'Zebra',
              },
              {},
              null,
            ),
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
        expect(shouldShowFormItem(field, {}, {}, null)).toBeFalsy()
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
          shouldShowFormItem(
            field,
            {
              shouldNotEqual: 'another answer',
              shouldBeLessThan: 'AAArdvak',
            },
            {},
            null,
          ),
        ).toBeFalsy()
        expect(
          shouldShowFormItem(
            field,
            {
              shouldEqual: 'Not a Great Answer',
              shouldBeLessThan: 'AAArdvak',
            },
            {},
            null,
          ),
        ).toBeFalsy()
        expect(
          shouldShowFormItem(
            field,
            {
              shouldEqual: 'Great Answer',
              shouldNotEqual: 'Same answer',
            },
            {},
            null,
          ),
        ).toBeFalsy()
        expect(
          shouldShowFormItem(
            field,
            {
              shouldEqual: 'Great Answer',
            },
            {},
            null,
          ),
        ).toBeFalsy()
        expect(
          shouldShowFormItem(
            field,
            {
              thisIsAWeirdQuestion: 'Great Answer',
            },
            {},
            null,
          ),
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
          shouldShowFormItem(
            field,
            {
              anotherWeirdQuestion: 'Great Answer',
              thisIsAWeirdQuestion: 'Great Answer a',
            },
            {},
            null,
          ),
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
            shouldShowFormItem(
              field,
              { anotherQuestion: 'Great Answer' },
              {},
              null,
            ),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(
              field,
              { anotherQuestion: 'bad answer' },
              {},
              null,
            ),
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
            shouldShowFormItem(
              field,
              { anotherQuestion: 'Great Answer' },
              {},
              null,
            ),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(
              field,
              {
                anotherQuestion: 'This is going to be true',
              },
              {},
              null,
            ),
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
            shouldShowFormItem(
              field,
              {
                anotherQuestion: 'Another Great Answer',
              },
              {},
              null,
            ),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(
              field,
              { anotherQuestion: 'Great Answer' },
              {},
              null,
            ),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(
              field,
              { anotherQuestion: 'Terrible' },
              {},
              null,
            ),
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
            shouldShowFormItem(
              field,
              {
                anotherQuestion: 'Another Great Answer',
              },
              {},
              null,
            ),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(
              field,
              { anotherQuestion: 'Great Answer' },
              {},
              null,
            ),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(
              field,
              { anotherQuestion: 'Terrible' },
              {},
              null,
            ),
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
            shouldShowFormItem(
              field,
              { anotherQuestion: 'Perfect Answer' },
              {},
              null,
            ),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(
              field,
              { anotherQuestion: 'Great Answer' },
              {},
              null,
            ),
          ).toBeTruthy()
          expect(
            shouldShowFormItem(
              field,
              { anotherQuestion: 'A very bad answer' },
              {},
              null,
            ),
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
            shouldShowFormItem(
              field,
              { anotherQuestion: 'Perfect Answer' },
              {},
              null,
            ),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(
              field,
              { anotherQuestion: 'Great Answer' },
              {},
              null,
            ),
          ).toBeFalsy()
          expect(
            shouldShowFormItem(
              field,
              { anotherQuestion: 'A very bad answer' },
              {},
              null,
            ),
          ).toBeTruthy()
        })

        it('should show a field when user property fulfills the condition', () => {
          const testUser = createRandomUser()
          testUser.profile.name = 'John Doe'
          const field = buildTextField({
            id: 'userField',
            title: 'User Field',
            condition: {
              userPropId: 'profile.name',
              value: 'John Doe',
              comparator: Comparators.EQUALS,
            },
          })
          expect(shouldShowFormItem(field, {}, {}, testUser)).toBeTruthy()
        })
      })

      it('should NOT show a field when user property does not fulfill the condition', () => {
        const testUser = createRandomUser()
        testUser.profile.name = 'Jane Smith'
        const field = buildTextField({
          id: 'userField',
          title: 'User Field',
          condition: {
            userPropId: 'profile.name',
            value: 'John Doe',
            comparator: Comparators.EQUALS,
          },
        })
        expect(shouldShowFormItem(field, {}, {}, testUser)).toBeFalsy()
      })

      it('should show a field when external data fulfills the condition', () => {
        const externalData = createExternalData(
          'anotherData',
          'someDataString',
          'success',
        )
        const field = buildTextField({
          id: 'externalField',
          title: 'External Field',
          condition: {
            externalDataId: 'anotherData.data',
            value: 'someDataString',
            comparator: Comparators.EQUALS,
          },
        })
        expect(shouldShowFormItem(field, {}, externalData, null)).toBeTruthy()
      })

      it('should NOT show a field when external data does not fulfill the condition', () => {
        const externalData = createExternalData(
          'externalValue',
          'Pending',
          'failure',
        )
        const field = buildTextField({
          id: 'externalField',
          title: 'External Field',
          condition: {
            externalDataId: 'externalValue.data',
            value: 'Approved',
            comparator: Comparators.EQUALS,
          },
        })
        expect(shouldShowFormItem(field, {}, externalData, null)).toBeFalsy()
      })
    })
  })
})
