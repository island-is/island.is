import { ExampleSchema } from '../schemas/example'
import { getScreensForForm, getScreensForFormNode } from './schema-utils'

describe('application schema utility functions', () => {
  it('should get all screens in a form', () => {
    const screens = getScreensForForm(ExampleSchema)

    expect(screens.length).toBe(5)
    expect(screens[0].id).toBe('field')
    expect(screens[1].id).toBe('about')
    expect(screens[2].id).toBe('any')
    expect(screens[3].id).toBe('those')
    expect(screens[4].id).toBe('where')
  })
  it('can get all screens for a given form node', () => {
    const screens = getScreensForFormNode(ExampleSchema.children[0])

    expect(screens.length).toBe(2)
    expect(screens[0].id).toBe('field')
    expect(screens[1].id).toBe('about')

    const otherScreens = getScreensForFormNode(ExampleSchema.children[1])

    expect(otherScreens.length).toBe(3)
    expect(otherScreens[0].id).toBe('any')
    expect(otherScreens[1].id).toBe('those')
    expect(otherScreens[2].id).toBe('where')
  })
})
