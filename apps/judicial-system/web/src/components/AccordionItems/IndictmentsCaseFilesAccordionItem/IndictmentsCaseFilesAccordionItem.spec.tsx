import faker from 'faker'

import {
  getFilePlacement,
  getFilesBelowInChapter,
  ReorderableItem,
} from './IndictmentsCaseFilesAccordionItem'

const items: ReorderableItem[] = [
  {
    displayText: faker.lorem.words(2),
    isDivider: false,
    chapter: 0,
  },
  {
    displayText: faker.lorem.words(2),
    isDivider: false,
    id: faker.datatype.uuid(),
  },
  {
    displayText: faker.lorem.words(2),
    isDivider: false,
    id: faker.datatype.uuid(),
  },
  {
    displayText: faker.lorem.words(2),
    isDivider: false,
    chapter: 1,
  },
  {
    displayText: faker.lorem.words(2),
    isDivider: false,
    id: faker.datatype.uuid(),
  },
  {
    displayText: faker.lorem.words(2),
    isDivider: true,
  },
  {
    displayText: faker.lorem.words(2),
    isDivider: false,
    id: faker.datatype.uuid(),
  },
  {
    displayText: faker.lorem.words(2),
    isDivider: false,
    id: faker.datatype.uuid(),
  },
]

describe('getFilePlacement', () => {
  it('should return [null, null] when file is not found in files', () => {
    expect(getFilePlacement('123', [])).toEqual([null, null])
  })

  it('should return [null, null] if a file is reordered but not put under a chapter', () => {
    expect(getFilePlacement(items[items.length - 1].id || '', items)).toEqual([
      null,
      null,
    ])
  })

  it('should return the correct chapter and orderWithinChapter if a file is reordered under a chapter', () => {
    expect(getFilePlacement(items[2].id || '', items)).toEqual([0, 1])
    expect(getFilePlacement(items[4].id || '', items)).toEqual([1, 0])
  })
})

describe('getFilesBelowInChapter', () => {
  it('should return an empty array if there are no files below a file in chapter', () => {
    expect(getFilesBelowInChapter(items[4].id || '', items)).toEqual([])
  })

  it('should return an array of files that are below a file in chapter', () => {
    expect(getFilesBelowInChapter(items[1].id || '', items)).toEqual([items[2]])
    expect(getFilesBelowInChapter(items[2].id || '', items)).toEqual([])
  })
})
