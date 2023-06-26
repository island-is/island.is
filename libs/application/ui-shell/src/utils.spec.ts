import {
  extractAnswersToSubmitFromScreen,
  isJSONObject,
  parseMessage,
} from './utils'
import {
  ExternalDataProviderScreen,
  FieldDef,
  MultiFieldScreen,
  RepeaterScreen,
} from './types'
import {
  buildExternalDataProvider,
  buildMultiField,
  buildRepeater,
  buildTextField,
} from '@island.is/application/core'
import { Field, FormValue } from '@island.is/application/types'

describe('ui-shell-utils', () => {
  describe('extractAnswersOnScreen', () => {
    const currentAnswers: FormValue = {
      theField: 'someAnswer',
      anotherField: 'anotherAnswer',
      nestedField: {
        someStuff: 'sick',
        moreStuff: 'yes',
        yetMore: 'finally',
      },
      arrayField: [{ a: 1, b: 2, c: 3 }, { a: 4 }],
    }

    function buildFieldDef(field: Field): FieldDef {
      return {
        sectionIndex: 0,
        subSectionIndex: 0,
        ...field,
      }
    }

    describe('should return an empty object', () => {
      it('when the current screen is a repeater', () => {
        const repeater = buildRepeater({
          id: 'arrayField',
          component: 'comp',
          title: 'Repeater',
          children: [],
        })

        const screen: RepeaterScreen = {
          sectionIndex: 0,
          subSectionIndex: 0,
          ...repeater,
          children: [],
        }

        expect(
          extractAnswersToSubmitFromScreen(currentAnswers, screen),
        ).toEqual({})
      })

      it('when the current screen is an external data provider', () => {
        const screenId = 'approveExternalData'

        const answers = {
          [screenId]: true,
        }

        const externalDataProvider = buildExternalDataProvider({
          id: screenId,
          title: 'External Data Provider',
          dataProviders: [],
        })

        const screen: ExternalDataProviderScreen = {
          sectionIndex: 0,
          subSectionIndex: 0,
          ...externalDataProvider,
        }

        expect(extractAnswersToSubmitFromScreen(answers, screen)).toEqual(
          answers,
        )
      })

      it('when the current screen includes a question that is not part of the passed in form value', () => {
        const textField = buildTextField({
          id: 'notPartOfAnything',
          title: 'Question?',
        })

        const screen: FieldDef = buildFieldDef(textField)

        expect(
          extractAnswersToSubmitFromScreen(currentAnswers, screen),
        ).toEqual({})
      })
    })

    describe('should only return the answers that are part of the screen', () => {
      it('when it is a single field', () => {
        const textField = buildTextField({ id: 'theField', title: 'Question?' })
        const screen: FieldDef = buildFieldDef(textField)

        expect(
          extractAnswersToSubmitFromScreen(currentAnswers, screen),
        ).toEqual({
          theField: 'someAnswer',
        })
      })

      it('when the screen id is part of a nested form value', () => {
        const textField = buildTextField({
          id: 'nestedField.someStuff',
          title: 'Question?',
        })

        const screen: FieldDef = buildFieldDef(textField)

        expect(
          extractAnswersToSubmitFromScreen(currentAnswers, screen),
        ).toEqual({
          nestedField: { someStuff: 'sick' },
        })
      })

      it('when the screen is a multifield', () => {
        const name = 'Question?'

        const children = [
          buildTextField({ id: 'theField', title: name }),
          buildTextField({ id: 'nestedField.someStuff', title: name }),
          buildTextField({ id: 'nestedField.yetMore', title: name }),
        ]

        const multiField = buildMultiField({
          id: 'someId',
          title: name,
          children,
        })

        const screen: MultiFieldScreen = {
          sectionIndex: 0,
          subSectionIndex: 0,
          ...multiField,
          children: children.map(buildFieldDef),
        }

        expect(
          extractAnswersToSubmitFromScreen(currentAnswers, screen),
        ).toEqual({
          theField: 'someAnswer',
          nestedField: {
            someStuff: 'sick',
            yetMore: 'finally',
          },
        })
      })
    })

    describe('repeater children', () => {
      it('should return the whole array', () => {
        const screenA: FieldDef = buildFieldDef(
          buildTextField({
            id: 'arrayField[1].a',
            title: 'Question?',
          }),
        )

        const screen0B: FieldDef = buildFieldDef(
          buildTextField({
            id: 'arrayField[0].b',
            title: 'Question?',
          }),
        )

        expect(
          extractAnswersToSubmitFromScreen(currentAnswers, screenA),
        ).toEqual({
          arrayField: [{ a: 1, b: 2, c: 3 }, { a: 4 }],
        })

        expect(
          extractAnswersToSubmitFromScreen(currentAnswers, screen0B),
        ).toEqual({
          arrayField: [{ a: 1, b: 2, c: 3 }, { a: 4 }],
        })
      })

      it('should work for multifields that are part of repeaters', () => {
        const children = [
          buildTextField({
            id: 'arrayField[0].a',
            title: 'Question?',
          }),
          buildTextField({
            id: 'arrayField[0].b',
            title: 'Question b?',
          }),
        ]

        const multiField = buildMultiField({
          id: 'anyMultifieldId',
          title: 'multi',
          children,
        })

        const screen: MultiFieldScreen = {
          sectionIndex: 0,
          subSectionIndex: 0,
          isPartOfRepeater: true,
          ...multiField,
          children: children.map(buildFieldDef),
        }

        expect(
          extractAnswersToSubmitFromScreen(currentAnswers, screen),
        ).toEqual({
          arrayField: [{ a: 1, b: 2, c: 3 }, { a: 4 }],
        })
      })
    })
  })

  describe('isJSONObject', () => {
    it('return true if the message is a valid JSON object', () => {
      expect(
        isJSONObject('{"field":true,"otherField":"isAString"}'),
      ).toBeTruthy()
    })

    it('return false if the message looks like a JSON but is not valid', () => {
      expect(isJSONObject('{field:true,fake:"itsnot"}')).toBeFalsy()
    })

    it('return false if the message is a string', () => {
      expect(isJSONObject('error message')).toBeFalsy()
    })

    it('return false if the message contains brackets in the middle of the message', () => {
      expect(
        isJSONObject('error message with {brackets} in the middle'),
      ).toBeFalsy()
    })
  })

  describe('parseMessage', () => {
    it(`return an object if it's a stringified json object`, () => {
      expect(parseMessage('{"field":"value"}')).toMatchObject({
        field: 'value',
      })
    })

    it(`return an object if it's a stringified json object`, () => {
      expect(parseMessage('{field:value}')).toStrictEqual('{field:value}')
    })

    it('return a string if the message is only a string', () => {
      expect(parseMessage('error message')).toStrictEqual('error message')
    })
  })
})
