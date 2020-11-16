import { includesAllFilterTags } from './AdgerdirArticles'
import { AdgerdirPage } from '@island.is/api/schema'

const tag_1 = 'tag 1'
const tag_2 = 'tag 2'
const tag_3 = 'tag 3'
const tag_4 = 'tag 4'

const adgerdirItems: Array<AdgerdirPage> = [
  {
    title: 'Item has id 1',
    description: '',
    id: '',
    slug: '',
    status: '',
    tags: [
      {
        id: tag_1,
        title: '',
        __typename: 'AdgerdirTag',
      },
    ],
    __typename: 'AdgerdirPage',
  },
  {
    title: 'Item A has ids 1 & 2',
    description: '',
    id: '',
    slug: '',
    status: '',
    tags: [
      {
        id: tag_1,
        title: '',
        __typename: 'AdgerdirTag',
      },
      {
        id: tag_2,
        title: '',
        __typename: 'AdgerdirTag',
      },
    ],
    __typename: 'AdgerdirPage',
  },
  {
    title: 'Item B has ids 1 & 2',
    description: '',
    id: '',
    slug: '',
    status: '',
    tags: [
      {
        id: tag_1,
        title: '',
        __typename: 'AdgerdirTag',
      },
      {
        id: tag_2,
        title: '',
        __typename: 'AdgerdirTag',
      },
    ],
    __typename: 'AdgerdirPage',
  },
  {
    title: 'Item has ids 1, 2 & 3',
    description: '',
    id: '',
    slug: '',
    status: '',
    tags: [
      {
        id: tag_1,
        title: '',
        __typename: 'AdgerdirTag',
      },
      {
        id: tag_2,
        title: '',
        __typename: 'AdgerdirTag',
      },
      {
        id: tag_3,
        title: '',
        __typename: 'AdgerdirTag',
      },
    ],
    __typename: 'AdgerdirPage',
  },
  {
    title: 'Item has ids 2 & 3',
    description: '',
    id: '',
    slug: '',
    status: '',
    tags: [
      {
        id: tag_2,
        title: '',
        __typename: 'AdgerdirTag',
      },
      {
        id: tag_3,
        title: '',
        __typename: 'AdgerdirTag',
      },
    ],
    __typename: 'AdgerdirPage',
  },
  {
    title: 'Item has id 3',
    description: '',
    id: '',
    slug: '',
    status: '',
    tags: [
      {
        id: tag_3,
        title: '',
        __typename: 'AdgerdirTag',
      },
    ],
    __typename: 'AdgerdirPage',
  },
  {
    title: 'Item has ids 1, 2, 3 & 4',
    description: '',
    id: '',
    slug: '',
    status: '',
    tags: [
      {
        id: tag_1,
        title: '',
        __typename: 'AdgerdirTag',
      },
      {
        id: tag_2,
        title: '',
        __typename: 'AdgerdirTag',
      },
      {
        id: tag_3,
        title: '',
        __typename: 'AdgerdirTag',
      },
      {
        id: tag_4,
        title: '',
        __typename: 'AdgerdirTag',
      },
    ],
    __typename: 'AdgerdirPage',
  },
  {
    title: 'Item has id 4',
    description: '',
    id: '',
    slug: '',
    status: '',
    tags: [
      {
        id: tag_4,
        title: '',
        __typename: 'AdgerdirTag',
      },
    ],
    __typename: 'AdgerdirPage',
  },
]

describe(' Includes All Tags', () => {
  // does include
  const hasTag1: Array<AdgerdirPage> = includesAllFilterTags(adgerdirItems, [
    tag_1,
  ])
  const hasTag12: Array<AdgerdirPage> = includesAllFilterTags(adgerdirItems, [
    tag_1,
    tag_2,
  ])
  const hasTag123: Array<AdgerdirPage> = includesAllFilterTags(adgerdirItems, [
    tag_1,
    tag_2,
    tag_3,
  ])
  const hasTag23: Array<AdgerdirPage> = includesAllFilterTags(adgerdirItems, [
    tag_2,
    tag_3,
  ])
  const hasTag3: Array<AdgerdirPage> = includesAllFilterTags(adgerdirItems, [
    tag_3,
  ])
  const hasTag1234: Array<AdgerdirPage> = includesAllFilterTags(adgerdirItems, [
    tag_1,
    tag_2,
    tag_3,
    tag_4,
  ])
  const hasTag4: Array<AdgerdirPage> = includesAllFilterTags(adgerdirItems, [
    tag_4,
  ])

  // does not include
  const hasTag2: Array<AdgerdirPage> = includesAllFilterTags(adgerdirItems, [
    tag_2,
  ])
  const hasTag13: Array<AdgerdirPage> = includesAllFilterTags(adgerdirItems, [
    tag_1,
    tag_3,
  ])
  const hasTag34: Array<AdgerdirPage> = includesAllFilterTags(adgerdirItems, [
    tag_3,
    tag_4,
  ])
  const hasTagEmptyString: Array<AdgerdirPage> = includesAllFilterTags(
    adgerdirItems,
    [''],
  )
  const hasNoTags: Array<AdgerdirPage> = includesAllFilterTags(
    adgerdirItems,
    [],
  )

  it('Result array should have tag 1', () => {
    expect(hasTag1).toEqual([
      {
        title: 'Item has id 1',
        description: '',
        id: '',
        slug: '',
        status: '',
        tags: [
          {
            id: tag_1,
            title: '',
            __typename: 'AdgerdirTag',
          },
        ],
        __typename: 'AdgerdirPage',
      },
    ])
  })
  it('Result array should have tags 1 and 2', () => {
    expect(hasTag12).toEqual([
      {
        title: 'Item A has ids 1 & 2',
        description: '',
        id: '',
        slug: '',
        status: '',
        tags: [
          {
            id: tag_1,
            title: '',
            __typename: 'AdgerdirTag',
          },
          {
            id: tag_2,
            title: '',
            __typename: 'AdgerdirTag',
          },
        ],
        __typename: 'AdgerdirPage',
      },
      {
        title: 'Item B has ids 1 & 2',
        description: '',
        id: '',
        slug: '',
        status: '',
        tags: [
          {
            id: tag_1,
            title: '',
            __typename: 'AdgerdirTag',
          },
          {
            id: tag_2,
            title: '',
            __typename: 'AdgerdirTag',
          },
        ],
        __typename: 'AdgerdirPage',
      },
    ])
  })
  it('Result array should have tags 1, 2 and 3', () => {
    expect(hasTag123).toEqual([
      {
        title: 'Item has ids 1, 2 & 3',
        description: '',
        id: '',
        slug: '',
        status: '',
        tags: [
          {
            id: tag_1,
            title: '',
            __typename: 'AdgerdirTag',
          },
          {
            id: tag_2,
            title: '',
            __typename: 'AdgerdirTag',
          },
          {
            id: tag_3,
            title: '',
            __typename: 'AdgerdirTag',
          },
        ],
        __typename: 'AdgerdirPage',
      },
    ])
  })
  it('Result array should have tags 2 and 3', () => {
    expect(hasTag23).toEqual([
      {
        title: 'Item has ids 2 & 3',
        description: '',
        id: '',
        slug: '',
        status: '',
        tags: [
          {
            id: tag_2,
            title: '',
            __typename: 'AdgerdirTag',
          },
          {
            id: tag_3,
            title: '',
            __typename: 'AdgerdirTag',
          },
        ],
        __typename: 'AdgerdirPage',
      },
    ])
  })
  it('Result array should have tag 3', () => {
    expect(hasTag3).toEqual([
      {
        title: 'Item has id 3',
        description: '',
        id: '',
        slug: '',
        status: '',
        tags: [
          {
            id: tag_3,
            title: '',
            __typename: 'AdgerdirTag',
          },
        ],
        __typename: 'AdgerdirPage',
      },
    ])
  })
  it('Result array should have tags 1, 2, 3 & 4', () => {
    expect(hasTag1234).toEqual([
      {
        title: 'Item has ids 1, 2, 3 & 4',
        description: '',
        id: '',
        slug: '',
        status: '',
        tags: [
          {
            id: tag_1,
            title: '',
            __typename: 'AdgerdirTag',
          },
          {
            id: tag_2,
            title: '',
            __typename: 'AdgerdirTag',
          },
          {
            id: tag_3,
            title: '',
            __typename: 'AdgerdirTag',
          },
          {
            id: tag_4,
            title: '',
            __typename: 'AdgerdirTag',
          },
        ],
        __typename: 'AdgerdirPage',
      },
    ])
  })
  it('Result array should have tag 4', () => {
    expect(hasTag4).toEqual([
      {
        title: 'Item has id 4',
        description: '',
        id: '',
        slug: '',
        status: '',
        tags: [
          {
            id: tag_4,
            title: '',
            __typename: 'AdgerdirTag',
          },
        ],
        __typename: 'AdgerdirPage',
      },
    ])
  })
  it('Result array should be empty as none has only tag 2', () => {
    expect(hasTag2).toEqual([])
  })
  it('Result array should be empty as none has tags 1 & 3', () => {
    expect(hasTag13).toEqual([])
  })
  it('Result array should be empty as none has tags 3 & 4', () => {
    expect(hasTag34).toEqual([])
  })
  it('Should return all items since no tags is empty string', () => {
    expect(hasTagEmptyString).toEqual([])
  })
  it('Should return all items since no tags were selected', () => {
    expect(hasNoTags).toEqual(adgerdirItems)
  })
})
