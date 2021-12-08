export const template = {
  order: 0,
  index_patterns: ['island-en-*'],
  settings: {
    analysis: {
      filter: {
        shingle: {
          type: 'shingle',
          min_shingle_size: 2,
          max_shingle_size: 3,
        },
      },
      analyzer: {
        termEnglish: {
          type: 'custom',
          tokenizer: 'standard',
          filter: ['lowercase'],
        },
        trigram: {
          type: 'custom',
          tokenizer: 'standard',
          filter: ['lowercase', 'shingle'],
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
          trigram: {
            type: 'text',
            analyzer: 'trigram',
          },
        },
      },
      content: {
        type: 'text',
        fields: {
          stemmed: {
            type: 'text',
          },
          trigram: {
            type: 'text',
            analyzer: 'trigram',
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
    },
  },
}
