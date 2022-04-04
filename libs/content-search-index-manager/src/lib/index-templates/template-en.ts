export const template = {
  order: 0,
  index_patterns: ['island-en-*'],
  settings: {
    analysis: {
      analyzer: {
        termEnglish: {
          type: 'custom',
          tokenizer: 'standard',
          filter: ['lowercase'],
        },
      },
    },
  },
  mappings: {
    properties: {
      title: {
        type: 'text',
        fields: {
          sort: {
            type: 'keyword',
          },
          stemmed: {
            type: 'text',
          },
          keyword: {
            type: 'keyword',
          },
        },
      },
      content: {
        type: 'text',
        fields: {
          stemmed: {
            type: 'text',
          },
        },
      },
      type: {
        type: 'keyword',
      },
      tags: {
        type: 'nested',
        properties: {
          key: {
            type: 'keyword',
          },
          value: {
            type: 'text',
            fields: {
              keyword: {
                type: 'keyword',
              },
            },
          },
          type: {
            type: 'keyword',
          },
        },
      },
      contentWordCount: {
        type: 'integer',
      },
      processEntryCount: {
        type: 'integer',
      },
      fillAndSignLinks: {
        type: 'integer',
      },
      pdfLinks: {
        type: 'integer',
      },
      wordLinks: {
        type: 'integer',
      },
      externalLinks: {
        type: 'integer',
      },
      popularityScore: {
        type: 'double',
      },
      termPool: {
        type: 'completion',
        analyzer: 'termEnglish',
      },
      response: {
        type: 'text',
        index: false,
        store: true,
      },
      dateCreated: {
        type: 'date',
      },
      dateUpdated: {
        type: 'date',
      },
      releaseDate: {
        type: 'date',
      },
    },
  },
}
