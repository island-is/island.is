import isCircular from 'is-circular'
import { pruneEntryHyperlink } from './utils'

describe('pruning entry hyperlink nodes', () => {
  it('should handle article content types correctly', () => {
    const articleSlug = 'some-slug'
    const node = {
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
            slug: articleSlug,
          },
        },
      },
    }

    pruneEntryHyperlink(node)

    expect(node.data.target.fields.slug).toBe(articleSlug)
  })

  it('should handle organization page content types correctly', () => {
    const organizationPageSlug = 'some-slug'
    const node = {
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
            slug: organizationPageSlug,
          },
        },
      },
    }

    pruneEntryHyperlink(node)

    expect(node.data.target.fields.slug).toBe(organizationPageSlug)
  })

  it('should handle organizationSubpage content types correctly', () => {
    const organizationSubpageSlug = 'some-slug'
    const organizationPageSlug = 'some-other-slug'

    const node = {
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

    pruneEntryHyperlink(node)

    expect(node.data.target.fields.organizationPage.fields.slug).toBe(
      organizationPageSlug,
    )
    expect(node.data.target.fields.slug).toBe(organizationSubpageSlug)
  })

  it('should handle organizationParentSubpage content types correctly', () => {
    const organizationParentSubpageSlug = 'some-slug'
    const organizationPageSlug = 'some-other-slug'

    const node = {
      data: {
        target: {
          sys: {
            contentType: {
              sys: {
                id: 'organizationParentSubpage',
              },
            },
          },
          fields: {
            slug: organizationParentSubpageSlug,
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

    pruneEntryHyperlink(node)

    expect(node.data.target.fields.organizationPage.fields.slug).toBe(
      organizationPageSlug,
    )
    expect(node.data.target.fields.slug).toBe(organizationParentSubpageSlug)
  })

  it('should handle subArticle content types correctly', () => {
    const subArticleSlug = 'some-slug'
    const articleSlug = 'some-other-slug'

    const parentArticle = {
      sys: {
        contentType: {
          sys: {
            id: 'article',
          },
        },
      },
      fields: {
        slug: articleSlug,
        subArticles: [] as unknown[],
      },
    }

    const node = {
      nodeType: 'entry-hyperlink',
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
            slug: subArticleSlug,
            parent: parentArticle,
          },
        },
      },
    }

    // Create a circular structure
    parentArticle.fields.subArticles.push(node.data.target)

    pruneEntryHyperlink(node)

    // Article and subarticle slug values should still be the same
    expect(node.data.target.fields.parent.fields.slug).toBe(articleSlug)
    expect(node.data.target.fields.slug).toBe(subArticleSlug)

    // It should not have a circular structure
    expect(isCircular(node)).toBeFalsy()
  })

  it('should handle deeply nested organizationSubpage entry-hyperlink references', () => {
    const organizationPageSlug = 'some-slug'
    const organizationSubpageSlug = 'some-other-slug'

    const organizationPage = {
      sys: {
        contentType: {
          sys: {
            id: 'organizationPage',
          },
        },
      },
      fields: {
        slug: organizationPageSlug,
        slices: [
          {
            sys: {
              contentType: {
                sys: {
                  id: 'oneColumnText',
                },
              },
            },
            fields: {
              content: [
                {
                  nodeType: 'entry-hyperlink',
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
                        organizationPage: null as unknown,
                        slug: organizationSubpageSlug,
                        slices: [
                          {
                            sys: {
                              contentType: {
                                sys: {
                                  id: 'oneColumnText',
                                },
                              },
                            },
                            fields: {
                              content: {
                                nodeType: 'entry-hyperlink',
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
                                      organizationPage: null as unknown,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    }

    const node = organizationPage.fields.slices[0].fields.content[0]
    const nestedNode = node.data.target.fields.slices[0].fields.content

    // Create a circular structure
    node.data.target.fields.organizationPage = organizationPage
    nestedNode.data.target.fields.organizationPage = organizationPage

    pruneEntryHyperlink(organizationPage.fields.slices[0].fields.content[0])

    // The circular structure should be gone
    expect(isCircular(node)).toBeFalsy()

    // The slug fields should be the same as they used to be
    expect(
      (node.data.target.fields.organizationPage as typeof organizationPage)
        .fields.slug,
    ).toBe(organizationPageSlug)
    expect(node.data.target.fields.slug).toBe(organizationSubpageSlug)
  })
})
