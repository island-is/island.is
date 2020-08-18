import { ExampleForm } from '../forms/ExampleForm'
import { getFormLeaves, getFormNodeLeaves } from './formUtils'

describe('application schema utility functions', () => {
  it('should get all screens in a form', () => {
    const screens = getFormLeaves(ExampleForm)

    expect(screens.length).toBe(5)
    expect(screens[0].id).toBe('field')
    expect(screens[1].id).toBe('about')
    expect(screens[2].id).toBe('careerHistory')
    expect(screens[3].id).toBe('careerHistoryCompanies')
    expect(screens[4].id).toBe('dreamJob')
  })
  it('can get all screens for a given form node', () => {
    const screens = getFormNodeLeaves(ExampleForm.children[0])

    expect(screens.length).toBe(2)
    expect(screens[0].id).toBe('field')
    expect(screens[1].id).toBe('about')

    const otherScreens = getFormNodeLeaves(ExampleForm.children[1])

    expect(otherScreens.length).toBe(3)
    expect(otherScreens[0].id).toBe('careerHistory')
    expect(otherScreens[1].id).toBe('careerHistoryCompanies')
    expect(otherScreens[2].id).toBe('dreamJob')
  })
})
