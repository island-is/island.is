import {
  calculateProgress,
  convertLeavesToScreens,
  expandRepeater,
  findCurrentScreen,
} from './reducerUtils'
import {
  buildIntroductionField,
  buildMultiField,
  buildRepeater,
  buildTextField,
  FormLeaf,
  Repeater,
} from '@island.is/application/schema'
import { FormScreen } from '../types'

describe('reducerUtils', () => {
  describe('calculate progress', () => {
    const introScreen = {
      ...buildIntroductionField({
        id: 'intro',
        name: 'Introduction',
        introduction: 'welcome',
      }),
      isNavigable: true,
    }
    const textScreen = {
      ...buildTextField({
        id: 'familyName',
        name: 'What is the family name?',
      }),
      isNavigable: true,
    }
    it('should return 0 when at the beginning of the application', () => {
      const screens: FormScreen[] = [
        introScreen,
        textScreen,
        textScreen,
        textScreen,
      ]
      expect(calculateProgress(0, screens)).toBe(0)
      expect(calculateProgress(-1, screens)).toBe(0)
    })
    it('should return 100 when at the end of the application', () => {
      const screens: FormScreen[] = [
        introScreen,
        textScreen,
        textScreen,
        textScreen,
      ]
      expect(calculateProgress(screens.length - 1, screens)).toBe(100)
      expect(calculateProgress(screens.length, screens)).toBe(100)
    })
    it('should return 50 when in the middle of the application', () => {
      const screens: FormScreen[] = [
        introScreen,
        textScreen,
        textScreen,
        textScreen,
      ]
      expect(calculateProgress(2, screens)).toBe(50)
    })
    it('should not include un-navigable screens when calculating the progress', () => {
      const screens: FormScreen[] = [
        introScreen,
        textScreen,
        { ...textScreen, isNavigable: false },
        textScreen,
        textScreen,
      ]
      expect(calculateProgress(1, screens)).toBe(25)
      expect(calculateProgress(3, screens)).toBe(50)
    })
    it('should not include screens that are children of a repeater', () => {
      const screens: FormScreen[] = [
        introScreen,
        textScreen,
        { ...textScreen, repeaterIndex: 0 },
        { ...textScreen, repeaterIndex: 0 },
        { ...textScreen, repeaterIndex: 0 },
        { ...textScreen, repeaterIndex: 0 },
        textScreen,
        textScreen,
      ]
      expect(calculateProgress(1, screens)).toBe(25)
      expect(calculateProgress(6, screens)).toBe(50)
    })
  })
  describe('expand repeater', () => {
    const repeater = buildRepeater({
      id: 'person',
      name: 'Family Member',
      children: [
        buildTextField({
          id: 'name',
          name: 'Name',
          required: true,
        }),
        buildTextField({
          id: 'age',
          name: 'Age',
          required: true,
        }),
      ],
    })
    const randomField = buildTextField({
      id: 'familyName',
      name: 'What is the family name?',
    })
    it('should add all children of a repeater to the list of leaves and screens', () => {
      const leaves: FormLeaf[] = [repeater, randomField]
      const screens: FormScreen[] = convertLeavesToScreens(leaves, {})
      const [newFormLeaves, newScreens] = expandRepeater(0, leaves, screens, {})
      expect(newScreens.length).toBe(4)
      expect(newFormLeaves.length).toBe(newScreens.length)

      const improvedRepeater = newFormLeaves[0] as Repeater
      expect(improvedRepeater.id).toEqual(repeater.id)
      expect(improvedRepeater.repetitions).toEqual(1)

      expect(newFormLeaves[1].id).toBe('person[0].name')
      expect(newScreens[1].id).toBe('person[0].name')

      expect(newFormLeaves[2].id).toBe('person[0].age')
      expect(newScreens[2].id).toBe('person[0].age')

      expect(newFormLeaves[3].id).toBe('familyName')
      expect(newScreens[3].id).toBe('familyName')
    })

    it('should increment repetitions and add more screens when expanding an already expanded repeater', () => {
      const leaves: FormLeaf[] = [repeater, randomField]
      const screens: FormScreen[] = convertLeavesToScreens(leaves, {})
      const [newLeaves, newScreens] = expandRepeater(0, leaves, screens, {})
      const [newerLeaves, newerScreens] = expandRepeater(
        0,
        newLeaves,
        newScreens,
        {},
      )
      expect(newerScreens.length).toBe(6)
      expect(newerLeaves.length).toBe(newerScreens.length)

      const improvedRepeater = newerLeaves[0] as Repeater
      expect(improvedRepeater.id).toEqual(repeater.id)
      expect(improvedRepeater.repetitions).toEqual(2)

      expect(newerLeaves[0].id).toBe('person')
      expect(newerScreens[0].id).toBe('person')

      expect(newerLeaves[1].id).toBe('person[0].name')
      expect(newerScreens[1].id).toBe('person[0].name')

      expect(newerLeaves[2].id).toBe('person[0].age')
      expect(newerScreens[2].id).toBe('person[0].age')

      expect(newerLeaves[3].id).toBe('person[1].name')
      expect(newerScreens[3].id).toBe('person[1].name')

      expect(newerLeaves[4].id).toBe('person[1].age')
      expect(newerScreens[4].id).toBe('person[1].age')

      expect(newerLeaves[5].id).toBe('familyName')
      expect(newerScreens[5].id).toBe('familyName')
    })

    it('should return undefined if the desired index is not representing a repeater', () => {
      const leaves: FormLeaf[] = [repeater, randomField]
      const screens: FormScreen[] = convertLeavesToScreens(leaves, {})
      const [newLeaves, newScreens] = expandRepeater(1, leaves, screens, {})
      expect(newLeaves).toBeUndefined()
      expect(newScreens).toBeUndefined()

      const [newerLeaves, newerScreens] = expandRepeater(6, leaves, screens, {})
      expect(newerLeaves).toBeUndefined()
      expect(newerScreens).toBeUndefined()
    })
  })
  describe('find current screen', () => {
    const buildIntroScreen = (id, isNavigable = true) => ({
      ...buildIntroductionField({
        id,
        name: 'Introduction',
        introduction: 'welcome',
      }),
      isNavigable,
    })
    const buildTextScreen = (id, isNavigable = true) => ({
      ...buildTextField({
        id: id,
        name: 'What is the family name?',
      }),
      isNavigable,
    })
    const screens: FormScreen[] = [
      buildIntroScreen('intro'),
      buildTextScreen('a'),
      buildTextScreen('b'),
      buildTextScreen('c'),
    ]
    it('should default to the first screen if there are no answers', () => {
      expect(findCurrentScreen(screens, {})).toBe(0)
    })
    it('should default to the first screen if the answers dont really match the list of screens', () => {
      expect(findCurrentScreen(screens, { random: 'asdf', notThis: '4' })).toBe(
        0,
      )
    })
    it('should go to the screen where the last answer belongs to the screen before', () => {
      expect(findCurrentScreen(screens, { a: 'answer' })).toBe(2)
      expect(findCurrentScreen(screens, { b: 'answer' })).toBe(3)
    })
    it('should go to the last screen if the last question has an answer', () => {
      expect(findCurrentScreen(screens, { a: 'answer', c: 'answer' })).toBe(3)
    })
    it('should, if the last answer is in a partially answered multifield, go to that screen', () => {
      const screens: FormScreen[] = [
        buildIntroScreen('intro'),
        buildMultiField({
          id: 'multifield',
          children: [buildTextScreen('a'), buildTextScreen('b')],
          name: 'This is a great screen',
        }),
        buildTextScreen('c'),
      ]
      expect(findCurrentScreen(screens, { a: 'sick' })).toBe(1)
      expect(findCurrentScreen(screens, { b: 'very sick' })).toBe(1)
    })
    it('should, if the last answer is in a fully answered multifield, go to the next screen after', () => {
      const screens: FormScreen[] = [
        buildIntroScreen('intro'),
        buildMultiField({
          id: 'multifield',
          children: [buildTextScreen('a'), buildTextScreen('b')],
          name: 'This is a great screen',
        }),
        buildTextScreen('c'),
      ]
      expect(findCurrentScreen(screens, { a: 'sick', b: 'very sick' })).toBe(2)
    })
    it('should, if the last answer is a fully built repeater, go to the repeater screen', () => {
      const screens: FormScreen[] = [
        buildIntroScreen('intro'),
        buildTextScreen('first'),
        buildRepeater({
          id: 'person',
          children: [buildTextScreen('a'), buildTextScreen('b')],
          name: 'This is a great screen',
        }),
        buildTextScreen('c'),
      ]
      expect(findCurrentScreen(screens, { person: [{ a: '1', b: '2' }] })).toBe(
        2,
      )
      expect(findCurrentScreen(screens, { person: [] })).toBe(2)
      expect(findCurrentScreen(screens, { first: 'asdf' })).toBe(2)
    })
  })
})
