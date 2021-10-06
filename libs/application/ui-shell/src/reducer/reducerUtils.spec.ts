import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildRepeater,
  buildSection,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'

import {
  convertFormToScreens,
  findCurrentScreen,
  getNavigableSectionsInForm,
} from './reducerUtils'
import { FormScreen, MultiFieldScreen, RepeaterScreen } from '../types'

describe('reducerUtils', () => {
  describe('find current screen', () => {
    const buildIntroScreen = (
      id: string,
      isNavigable = true,
      sectionIndex = -1,
      subSectionIndex = -1,
    ) => ({
      ...buildDescriptionField({
        id,
        title: 'Introduction',
        description: 'welcome',
      }),
      isNavigable,
      sectionIndex,
      subSectionIndex,
    })

    const buildTextScreen = (
      id: string,
      isNavigable = true,
      sectionIndex = -1,
      subSectionIndex = -1,
    ) => ({
      ...buildTextField({
        id: id,
        title: 'What is the family name?',
      }),
      isNavigable,
      sectionIndex,
      subSectionIndex,
    })

    const convertScreens = (
      screens: FormScreen[],
      answers = {},
      externalData = {},
    ) =>
      convertFormToScreens(
        buildForm({
          id: 'ExampleForm',
          title: 'asdf',
          children: screens,
        }),
        answers,
        externalData,
      )

    describe('with stopOnFirstMissingAnswer = false', () => {
      const screens: FormScreen[] = [
        buildIntroScreen('intro'),
        buildTextScreen('a'),
        buildTextScreen('b'),
        buildTextScreen('c'),
      ]

      it('should default to the first screen if there are no answers', () => {
        expect(findCurrentScreen(convertScreens(screens), {})).toBe(0)
      })

      it('should default to the first screen if the answers dont really match the list of screens', () => {
        expect(
          findCurrentScreen(convertScreens(screens), {
            random: 'asdf',
            notThis: '4',
          }),
        ).toBe(0)
      })

      it('should go to the screen where the last answer belongs to the screen before', () => {
        expect(
          findCurrentScreen(convertScreens(screens), { a: 'answer' }),
        ).toBe(2)
        expect(
          findCurrentScreen(convertScreens(screens), { b: 'answer' }),
        ).toBe(0)
        expect(
          findCurrentScreen(convertScreens(screens), {
            a: 'answer',
            b: 'answer',
          }),
        ).toBe(3)
      })

      it('should go to the screen missing an answer', () => {
        expect(
          findCurrentScreen(convertScreens(screens), {
            a: 'answer',
            c: 'answer',
          }),
        ).toBe(2)
      })

      it('should, if the last answer is in a partially answered multifield, go to that screen', () => {
        const screens = [
          buildIntroScreen('intro'),
          buildMultiField({
            id: 'multifield',
            children: [buildTextScreen('a'), buildTextScreen('b')],
            title: 'This is a great screen',
          }) as MultiFieldScreen,
          buildTextScreen('c'),
        ]

        const answers1 = { a: 'sick' }
        const answers2 = { b: 'very sick' }

        expect(
          findCurrentScreen(convertScreens(screens, answers1), answers1),
        ).toBe(1)
        expect(
          findCurrentScreen(convertScreens(screens, answers2), answers2),
        ).toBe(1)
      })

      it('should, if the last answer is in a fully answered multifield, go to the next screen after', () => {
        const screens: FormScreen[] = [
          buildIntroScreen('intro'),
          buildMultiField({
            id: 'multifield',
            children: [buildTextScreen('a'), buildTextScreen('b')],
            title: 'This is a great screen',
          }) as MultiFieldScreen,
          buildTextScreen('c'),
        ]

        const answers = { a: 'sick', b: 'very sick' }

        expect(
          findCurrentScreen(convertScreens(screens, answers), answers),
        ).toBe(2)
      })

      it('should, if the last answer is a fully built repeater, go to the repeater screen', () => {
        const screens: FormScreen[] = [
          buildIntroScreen('intro'),
          buildTextScreen('first'),
          buildRepeater({
            id: 'person',
            children: [buildTextScreen('a'), buildTextScreen('b')],
            title: 'This is a great screen',
            component: 'SomeComponent',
          }) as RepeaterScreen,
          buildTextScreen('c'),
        ]

        const answers1 = { person: [{ a: '1', b: '2' }] }
        const answers2 = { person: [] }
        const answers3 = { first: 'asdf' }

        expect(
          findCurrentScreen(convertScreens(screens, answers1), answers1),
        ).toBe(2)
        // Empty repeater equals no answer so in this case we should go to the first screen
        expect(
          findCurrentScreen(convertScreens(screens, answers2), answers2),
        ).toBe(0)
        expect(
          findCurrentScreen(convertScreens(screens, answers3), answers3),
        ).toBe(2)
      })

      it('should, go to the last remaining answer in a repeater when everything before it has been answered', () => {
        const screens: FormScreen[] = [
          buildIntroScreen('intro'),
          buildTextScreen('first'),
          buildRepeater({
            id: 'person',
            children: [buildTextScreen('a'), buildTextScreen('b')],
            title: 'This is a great screen',
            component: 'SomeComponent',
          }) as RepeaterScreen,
          buildTextScreen('c'),
        ]

        const answers1 = { first: 'hello', person: [{ a: '1' }] }
        const convertedScreens = convertScreens(screens, answers1)

        expect(findCurrentScreen(convertedScreens, answers1)).toBe(4)
      })
    })

    describe('with stopOnFirstMissingAnswer = true', () => {
      it('should only skip fields that do not require answers when they come before an answer', () => {
        const screens: FormScreen[] = [
          buildIntroScreen('intro1'),
          buildTextScreen('first'),
          buildIntroScreen('intro1'),
          buildIntroScreen('intro2'),
          buildTextScreen('second'),
          buildIntroScreen('done'),
        ]

        const answers1 = {}
        const answers2 = { first: 'something' }
        const answers3 = { first: 'something', second: 'more' }

        // No answer, so we should go to intro1
        expect(
          findCurrentScreen(convertScreens(screens, answers1), answers1, true),
        ).toBe(0)
        // We have an answer to 'first' go to intro2
        expect(
          findCurrentScreen(convertScreens(screens, answers2), answers2, true),
        ).toBe(2)
        // We have an answer to 'first' and 'second' so we're done
        expect(
          findCurrentScreen(convertScreens(screens, answers3), answers3, true),
        ).toBe(5)
      })

      it('should not stop on repeater, even if it has an answer, if a previous question is missing an answer', () => {
        const screens: FormScreen[] = [
          buildIntroScreen('intro1'),
          buildTextScreen('first'),
          buildRepeater({
            id: 'person',
            children: [buildTextScreen('a'), buildTextScreen('b')],
            title: 'This is a great screen',
            component: 'SomeComponent',
          }) as RepeaterScreen,
          buildTextScreen('c'),
        ]

        const screensNoIntro = screens.slice(1)
        const answers1 = { person: [{ a: '1' }] }

        // We expect to go to the first intro screen before the question with the missing answer
        expect(
          findCurrentScreen(convertScreens(screens, answers1), answers1, true),
        ).toBe(0)
        // Or the question if there was no intro screen
        expect(
          findCurrentScreen(
            convertScreens(screensNoIntro, answers1),
            answers1,
            true,
          ),
        ).toBe(0)
      })

      it('should stop in the middle of a repeater if it has a missing answer', () => {
        const screens: FormScreen[] = [
          buildIntroScreen('intro1'),
          buildTextScreen('first'),
          buildRepeater({
            id: 'person',
            children: [
              buildTextScreen('a'),
              buildTextScreen('b'),
              buildTextScreen('c'),
            ],
            title: 'This is a great screen',
            component: 'SomeComponent',
          }) as RepeaterScreen,
          buildTextScreen('c'),
        ]

        const answers1 = { first: 'hello', person: [{ a: '1' }] }

        expect(
          findCurrentScreen(convertScreens(screens, answers1), answers1, true),
        ).toBe(4)
      })

      it('should not skip a repeater with missing answers', () => {
        const screens: FormScreen[] = [
          buildIntroScreen('intro'),
          buildTextScreen('first'),
          buildRepeater({
            id: 'person',
            children: [
              buildTextScreen('a'),
              buildTextScreen('b'),
              buildTextScreen('c'),
            ],
            title: 'This is a great screen',
            component: 'SomeComponent',
          }) as RepeaterScreen,
          buildTextScreen('second'),
          buildIntroScreen('outro'),
        ]

        const answers1 = { first: 'hello', person: [] }
        const answers2 = { first: 'hello' }

        expect(
          findCurrentScreen(convertScreens(screens, answers1), answers1, true),
        ).toBe(2)
        expect(
          findCurrentScreen(convertScreens(screens, answers2), answers2, true),
        ).toBe(2)
      })
    })
  })

  describe('get navigable sections in form', () => {
    const firstSection = buildSection({
      id: '1',
      title: 'first',
      children: [],
    })
    const secondSection = buildSection({
      id: '2',
      title: 'second',
      children: [],
    })
    const thirdSection = buildSection({
      id: '3',
      title: 'third',
      children: [],
    })
    it('should return all sections if no section has a condition', () => {
      const sections = [firstSection, secondSection, thirdSection]
      const form = buildForm({
        id: 'ExampleForm',
        children: sections,
        title: 'asdf',
      })

      expect(getNavigableSectionsInForm(form, {}, {})).toEqual(sections)
    })
    it('should only return sections that have non-violated conditions', () => {
      const sections = [
        firstSection,
        buildSection({
          id: '2',
          title: 'second',
          children: [],
          condition: () => false,
        }),
        thirdSection,
      ]
      const form = buildForm({
        id: 'ExampleForm',
        children: sections,
        title: 'asdf',
      })

      expect(getNavigableSectionsInForm(form, {}, {})).toEqual([
        firstSection,
        thirdSection,
      ])
    })
    it('should only return non-condition-violating sub-sections of sections', () => {
      const subSection = buildSubSection({
        id: 'sub1',
        title: 'sub1',
        children: [],
        condition: () => false,
      })

      const subSection2 = buildSubSection({
        id: 'sub2',
        title: 'sub2',
        children: [],
        condition: () => true,
      })

      const subSection3 = buildSubSection({
        id: 'sub3',
        title: 'sub3',
        children: [],
      })

      const sections = [
        firstSection,
        secondSection,
        buildSection({
          id: 'withSubsections',
          title: 'sick',
          children: [subSection, subSection2, subSection3],
        }),
      ]

      const form = buildForm({
        id: 'ExampleForm',
        children: sections,
        title: 'asdf',
      })

      expect(getNavigableSectionsInForm(form, {}, {})).toEqual([
        firstSection,
        secondSection,
        buildSection({
          id: 'withSubsections',
          title: 'sick',
          children: [subSection2, subSection3],
        }),
      ])
    })
  })

  describe('convert form to screens', () => {
    describe('conditions', () => {
      it('should hide all fields that belong to a section that violates condition', () => {
        const invisibleSection = buildSection({
          id: '1',
          title: 'where am i',
          condition: () => false,
          children: [
            buildTextField({ id: '1', title: '1' }),
            buildTextField({ id: '2', title: '2' }),
          ],
        })

        const visibleSection = buildSection({
          id: '2',
          title: 'visible',
          condition: () => true,
          children: [
            buildTextField({ id: '3', title: '3' }),
            buildTextField({ id: '4', title: '4' }),
            buildTextField({ id: '5', title: '5' }),
          ],
        })

        const form = buildForm({
          id: 'ExampleForm',
          title: 'asdf',
          children: [invisibleSection, visibleSection],
        })

        const screens = convertFormToScreens(form, {}, {})

        expect(screens.length).toBe(5)
        expect(screens[0].isNavigable).toBe(false)
        expect(screens[0].id).toBe('1')
        expect(screens[1].isNavigable).toBe(false)
        expect(screens[1].id).toBe('2')
        expect(screens[2].isNavigable).toBe(true)
        expect(screens[2].id).toBe('3')
        expect(screens[3].isNavigable).toBe(true)
        expect(screens[3].id).toBe('4')
        expect(screens[4].isNavigable).toBe(true)
        expect(screens[4].id).toBe('5')
      })
    })

    describe('multifield', () => {
      it('should convert multifield to a single screen', () => {
        const multifield = buildMultiField({
          id: 'multi',
          title: 'multi',
          children: [
            buildTextField({ id: '1', title: '1' }),
            buildTextField({ id: '2', title: '2' }),
            buildTextField({ id: '3', title: '3' }),
            buildTextField({ id: '4', title: '4' }),
            buildTextField({ id: '5', title: '5' }),
          ],
        })

        const form = buildForm({
          id: 'ExampleForm',
          title: 'asdf',
          children: [multifield],
        })

        const screens = convertFormToScreens(form, {}, {})

        expect(screens.length).toBe(1)
        expect(screens[0].id).toBe('multi')
      })
    })
    describe('repeaters', () => {
      const children = [
        buildTextField({ id: '1', title: '1' }),
        buildTextField({ id: '2', title: '2' }),
      ]

      const repeater = {
        ...buildRepeater({
          id: 'id',
          title: 'repeater',
          component: 'asdf',
          children,
        }),
      }

      it('should only include the repeater screen if it has not been expanded', () => {
        const form = buildForm({
          id: 'ExampleForm',
          title: 'asdf',
          children: [repeater],
        })
        const screens = convertFormToScreens(form, {}, {})

        expect(screens.length).toBe(1)

        expect(screens[0]).toEqual({
          ...repeater,
          sectionIndex: -1,
          subSectionIndex: -1,
          isNavigable: true,
        })
      })
    })
    describe('sections and subsections', () => {
      it('should attach the index of the section and possibly subsections which own the screens', () => {
        const invisibleSection = buildSection({
          id: '1',
          title: 'where am i',
          condition: () => false,
          children: [
            buildTextField({ id: '1', title: '1' }),
            buildSubSection({
              id: 'sub1',
              title: 'sub1',
              children: [buildTextField({ id: '2', title: '2' })],
            }),
          ],
        })

        const visibleSection = buildSection({
          id: '2',
          title: 'visible',
          condition: () => true,
          children: [
            buildSubSection({
              id: 'sub2',
              title: 'sub2',
              children: [
                buildTextField({ id: '3', title: '3' }),
                buildTextField({ id: '4', title: '4' }),
              ],
            }),
            buildSubSection({
              id: 'sub3',
              title: 'sub3',
              children: [buildTextField({ id: '5', title: '5' })],
            }),
          ],
        })

        const form = buildForm({
          id: 'ExampleForm',
          title: 'asdf',
          children: [
            invisibleSection,
            visibleSection,
            buildTextField({
              id: 'noSection',
              title: 'Part of no section nor parent',
            }),
          ],
        })

        const screens = convertFormToScreens(form, {}, {})

        expect(screens.length).toBe(6)
        expect(screens[0].sectionIndex).toBe(-1)
        expect(screens[0].subSectionIndex).toBe(-1)
        expect(screens[0].id).toBe('1')
        expect(screens[1].sectionIndex).toBe(-1)
        expect(screens[1].subSectionIndex).toBe(-1)
        expect(screens[1].id).toBe('2')
        expect(screens[2].sectionIndex).toBe(0)
        expect(screens[2].subSectionIndex).toBe(0)
        expect(screens[2].id).toBe('3')
        expect(screens[3].sectionIndex).toBe(0)
        expect(screens[3].subSectionIndex).toBe(0)
        expect(screens[3].id).toBe('4')
        expect(screens[4].sectionIndex).toBe(0)
        expect(screens[4].subSectionIndex).toBe(1)
        expect(screens[4].id).toBe('5')
        expect(screens[5].sectionIndex).toBe(0) // a orphaned field will inherit the last section before
        expect(screens[5].subSectionIndex).toBe(-1)
        expect(screens[5].id).toBe('noSection')
      })
    })
  })
})
