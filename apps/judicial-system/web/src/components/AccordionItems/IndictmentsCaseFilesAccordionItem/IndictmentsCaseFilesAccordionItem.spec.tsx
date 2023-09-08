import faker from 'faker'

import { CaseFileState } from '@island.is/judicial-system/types'

import {
  getFilesToUpdate,
  ReorderableItem,
  sortedFilesInChapter,
} from './IndictmentsCaseFilesAccordionItem'

const items: ReorderableItem[] = [
  {
    id: faker.datatype.uuid(),
    displayText: faker.lorem.words(2),
    isDivider: false,
    isHeading: false,
    chapter: 0,
    orderWithinChapter: 0,
  },
  {
    id: faker.datatype.uuid(),
    displayText: faker.lorem.words(2),
    isDivider: false,
    isHeading: false,
    chapter: 0,
    orderWithinChapter: 1,
  },
  {
    id: faker.datatype.uuid(),
    displayText: faker.lorem.words(2),
    isDivider: false,
    isHeading: true,
    chapter: 1,
  },
  {
    id: faker.datatype.uuid(),
    displayText: faker.lorem.words(2),
    isDivider: false,
    isHeading: false,
    chapter: 1,
    orderWithinChapter: 0,
  },
  {
    id: faker.datatype.uuid(),
    displayText: faker.lorem.words(2),
    isDivider: true,
    isHeading: false,
  },
  {
    id: faker.datatype.uuid(),
    displayText: faker.lorem.words(2),
    isDivider: false,
    isHeading: false,
  },
  {
    id: faker.datatype.uuid(),
    displayText: faker.lorem.words(2),
    isDivider: false,
    isHeading: false,
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
    chapter: 2,
    orderWithinChapter: 0,
  },
]

describe('getFilesToUpdate', () => {
  it('should return no items when file is not found in files', () => {
    expect(getFilesToUpdate('123', [])).toEqual([null, null, []])
  })

  it('should return the item if a file is reordered but not put under a chapter', () => {
    expect(getFilesToUpdate(items[items.length - 1].id || '', items)).toEqual([
      null,
      null,
      [items[items.length - 1]],
    ])
  })

  it('should return the correct chapter, orderWithinChapter and items if a file is reordered under a chapter', () => {
    expect(getFilesToUpdate(items[0].id || '', items)).toEqual([
      0,
      0,
      [items[0], items[1]],
    ])
    expect(getFilesToUpdate(items[1].id || '', items)).toEqual([
      0,
      1,
      [items[1]],
    ])
    expect(getFilesToUpdate(items[3].id || '', items)).toEqual([
      1,
      0,
      [items[3]],
    ])
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
        isHeading: false,
        chapter: 0,
        id: caseFiles[1].id,
        created: caseFiles[1].created,
        orderWithinChapter: caseFiles[1].orderWithinChapter,
        canOpen: false,
      },
      {
        displayText: caseFiles[0].name,
        isDivider: false,
        isHeading: false,
        chapter: 0,
        id: caseFiles[0].id,
        created: caseFiles[0].created,
        orderWithinChapter: caseFiles[0].orderWithinChapter,
        canOpen: false,
      },
      {
        displayText: caseFiles[2].name,
        isDivider: false,
        isHeading: false,
        chapter: 0,
        id: caseFiles[2].id,
        created: caseFiles[2].created,
        orderWithinChapter: caseFiles[2].orderWithinChapter,
        canOpen: false,
      },
    ] as ReorderableItem[])
  })

  it('should only return an array of files in a given chapter', () => {
    expect(sortedFilesInChapter(0, caseFiles).length).toEqual(3)
  })
})
