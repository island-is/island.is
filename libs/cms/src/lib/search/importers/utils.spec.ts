import { pruneEntryHyperlink } from './utils'

describe('pruning entry hyperlink nodes', () => {
  it('should handle article content types correctly', () => {
    const articleSlug = 'some-slug'
    const test = {
      data: {
        target: {
          sys: {
            contentType: {
              sys: {
                id: 'article',
              },
            },
          },
          fields: {
            title: 'some title',
            slug: articleSlug,
            relatedArticles: [
              {
                title: 'some other title',
                slug: 'some-other-slug',
              },
            ],
          },
        },
      },
    }

    pruneEntryHyperlink(test)

    expect(test.data.target.fields.slug).toBe(articleSlug)
  })

  it('should handle organization page content types correctly', () => {
    const organizationPageSlug = 'some-slug'
    const test = {
      data: {
        target: {
          sys: {
            contentType: {
              sys: {
                id: 'organizationPage',
              },
            },
          },
          fields: {
            title: 'some title',
            slug: organizationPageSlug,
          },
        },
      },
    }

    pruneEntryHyperlink(test)

    expect(test.data.target.fields.slug).toBe(organizationPageSlug)
  })

  it('should handle organizationSubpage content types correctly', () => {
    const organizationSubpageSlug = 'some-slug'
    const organizationPageSlug = 'some-other-slug'
    const test = {
      data: {
        target: {
          sys: {
            contentType: {
              sys: {
                id: 'organizationSubpage',
              },
            },
          },
          fields: {
            title: 'some title',
            slug: organizationSubpageSlug,
            organizationPage: {
              sys: {
                contentType: {
                  sys: {
                    id: 'organizationPage',
                  },
                },
              },
              fields: {
                slug: organizationPageSlug,
              },
            },
          },
        },
      },
    }

    pruneEntryHyperlink(test)

    expect(test.data.target.fields.organizationPage.fields.slug).toBe(
      organizationPageSlug,
    )
    expect(test.data.target.fields.slug).toBe(organizationSubpageSlug)
  })

  it('should handle subArticle content types correctly', () => {
    const subArticleSlug = 'some-slug'
    const articleSlug = 'some-other-slug'
    const test = {
      data: {
        target: {
          sys: {
            contentType: {
              sys: {
                id: 'subArticle',
              },
            },
          },
          fields: {
            title: 'some title',
            slug: subArticleSlug,
            parent: {
              sys: {
                contentType: {
                  sys: {
                    id: 'article',
                  },
                },
              },
              fields: {
                slug: articleSlug,
              },
            },
          },
        },
      },
    }

    pruneEntryHyperlink(test)

    expect(test.data.target.fields.parent.fields.slug).toBe(articleSlug)
    expect(test.data.target.fields.slug).toBe(subArticleSlug)
  })
})
