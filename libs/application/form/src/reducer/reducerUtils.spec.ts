import { convertLeavesToScreens, expandRepeater } from './reducerUtils'
import {
  buildRepeater,
  buildTextField,
  FormLeaf,
  Repeater,
} from '@island.is/application/schema'
import { FormScreen } from '../types'

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
