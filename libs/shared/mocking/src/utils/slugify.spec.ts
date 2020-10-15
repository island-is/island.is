import { slugify } from './slugify'

interface Obj {
  title: string
}

describe('slugify', () => {
  it('creates a function which slugs another field', () => {
    // Arrange
    const slugHelper = slugify<Obj, keyof Obj>('title')

    // Act
    const slug = slugHelper.call({ title: 'Hello world' })

    // Assert
    expect(slug).toEqual('hello-world')
  })
})
