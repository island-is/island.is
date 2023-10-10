import { pruneEntryHyperlink } from './utils'

describe('pruning entry hyperlink nodes', () => {
  it('should remove objects at depth 2', () => {
    const test = {
      data: {
        target: {
          fields: {
            // Depth 1
            parent: {
              fields: {
                slug: 'something',
                relatedArticles: [{ slug: 'something-else' }], // This is at depth 2 (if we start counting from 1)
              },
            },
            title: 'some title',
            slug: 'some-slug',
          },
        },
      },
    }

    pruneEntryHyperlink(test)

    expect(test).toStrictEqual({
      data: {
        target: {
          fields: {
            // Only depth 1 remains
            parent: {
              fields: {
                slug: 'something',
              },
            },
            title: 'some title',
            slug: 'some-slug',
          },
        },
      },
    })
  })
})
