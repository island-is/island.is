import faker from 'faker'

import { CaseFileState } from '@island.is/judicial-system/types'

import {
  getFilePlacement,
  getFilesBelowInChapter,
  ReorderableItem,
  sortedFilesInChapter,
} from './IndictmentsCaseFilesAccordionItem'

const items: ReorderableItem[] = [
  {
    id: faker.datatype.uuid(),
    displayText: faker.lorem.words(2),
    isDivider: false,
    chapter: 0,
  },
  {
    id: faker.datatype.uuid(),
    displayText: faker.lorem.words(2),
    isDivider: false,
  },
  {
    id: faker.datatype.uuid(),
    displayText: faker.lorem.words(2),
    isDivider: false,
  },
  {
    id: faker.datatype.uuid(),
    displayText: faker.lorem.words(2),
    isDivider: false,
    chapter: 1,
  },
  {
    id: faker.datatype.uuid(),
    displayText: faker.lorem.words(2),
    isDivider: false,
  },
  {
    id: faker.datatype.uuid(),
    displayText: faker.lorem.words(2),
    isDivider: true,
  },
  {
    id: faker.datatype.uuid(),
    displayText: faker.lorem.words(2),
    isDivider: false,
  },
  {
    id: faker.datatype.uuid(),
    displayText: faker.lorem.words(2),
    isDivider: false,
  },
]

const caseFiles = [
  {
    id: faker.datatype.uuid(),
    created: faker.date.past().toISOString(),
    modified: faker.date.past().toISOString(),
    caseId: faker.datatype.uuid(),
    name: faker.lorem.word(),
    type: faker.lorem.word(),
    state: CaseFileState.STORED_IN_RVG,
    size: 1,
    chapter: 0,
    orderWithinChapter: 1,
  },
  {
    id: faker.datatype.uuid(),
    created: faker.date.past().toISOString(),
    modified: faker.date.past().toISOString(),
    caseId: faker.datatype.uuid(),
    name: faker.lorem.word(),
    type: faker.lorem.word(),
    state: CaseFileState.STORED_IN_RVG,
    size: 1,
    chapter: 0,
    orderWithinChapter: 0,
  },
  {
    id: faker.datatype.uuid(),
    created: faker.date.past().toISOString(),
    modified: faker.date.past().toISOString(),
    caseId: faker.datatype.uuid(),
    name: faker.lorem.word(),
    type: faker.lorem.word(),
    state: CaseFileState.STORED_IN_RVG,
    size: 1,
    chapter: 0,
    orderWithinChapter: 2,
  },
  {
    id: faker.datatype.uuid(),
    created: faker.date.past().toISOString(),
    modified: faker.date.past().toISOString(),
    caseId: faker.datatype.uuid(),
    name: faker.lorem.word(),
    type: faker.lorem.word(),
    state: CaseFileState.STORED_IN_RVG,
    size: 1,
    chapter: 1,
    orderWithinChapter: 0,
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

describe('sortedFilesInChapter', () => {
  it('should return an empty array if there are no files in chapter', () => {
    expect(sortedFilesInChapter(1, caseFiles)).toEqual([])
  })

  it('should return an array of files in chapter sorted by orderWithinChapter', () => {
    expect(sortedFilesInChapter(0, caseFiles)).toEqual([
      {
        displayText: caseFiles[1].name,
        isDivider: false,
        id: caseFiles[1].id,
        created: caseFiles[1].created,
        orderWithinChapter: caseFiles[1].orderWithinChapter,
      },
      {
        displayText: caseFiles[0].name,
        isDivider: false,
        id: caseFiles[0].id,
        created: caseFiles[0].created,
        orderWithinChapter: caseFiles[0].orderWithinChapter,
      },
      {
        displayText: caseFiles[2].name,
        isDivider: false,
        id: caseFiles[2].id,
        created: caseFiles[2].created,
        orderWithinChapter: caseFiles[2].orderWithinChapter,
      },
    ] as ReorderableItem[])
  })

  it('should only return an array of files in a given chapter', () => {
    expect(sortedFilesInChapter(0, caseFiles).length).toEqual(3)
  })
})
