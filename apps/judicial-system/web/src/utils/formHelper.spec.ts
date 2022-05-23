import { toggleInArray } from './formHelper'

describe('toggleInArray', () => {
  it.each`
    values
    ${undefined}
    ${null}
    ${[]}
  `("should return values=['test'] when values=$values", ({ values }) => {
    const item = 'test'

    const res = toggleInArray(values, item)

    expect(res).toEqual([item])
  })

  it.each`
    values
    ${['removeMe']}
    ${['keepMe', 'removeMe']}
    ${['removeMe', 'keepMe']}
    ${['keepMe', 'removeMe', 'keepMe2']}
  `('should remove item if already in values array', ({ values }) => {
    const item = 'removeMe'

    const res = toggleInArray(values, item)

    expect(res.includes(item)).toEqual(false)
  })

  it.each`
    values
    ${['keepMe']}
    ${['keepMe', 'keepMe2']}
    ${['keepMe', 'keepMe2']}
  `('should add item without removing other items', ({ values }) => {
    const item = 'addMe'

    const res = toggleInArray(values, item)

    expect(res.includes(item)).toEqual(true)
  })
})
