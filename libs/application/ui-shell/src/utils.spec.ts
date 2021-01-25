import { extractAnswersToSubmitFromScreen } from './utils'
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
  Field,
  FormValue,
} from '@island.is/application/core'

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
        const externalDataProvider = buildExternalDataProvider({
          id: 'arrayField',
          title: 'Repeater',
          dataProviders: [],
        })
        const screen: ExternalDataProviderScreen = {
          sectionIndex: 0,
          subSectionIndex: 0,
          ...externalDataProvider,
        }

        expect(
          extractAnswersToSubmitFromScreen(currentAnswers, screen),
        ).toEqual({})
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
})
