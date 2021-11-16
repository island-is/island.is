export const template = {
  order: 0,
  index_patterns: ['island-is-*'],
  settings: {
    analysis: {
      filter: {
        icelandicStemmer: {
          type: 'stemmer_override',
          rules_path: 'analyzers/{STEMMER}',
        },
        icelandicStop: {
          type: 'stop',
          stopwords_path: 'analyzers/{STOPWORDS}',
        },
        icelandicAutocompleteStop: {
          type: 'stop',
          stopwords_path: 'analyzers/{AUTOCOMPLETESTOP}',
        },
        icelandicKeyword: {
          type: 'keyword_marker',
          ignore_case: true,
          keywords_path: 'analyzers/{KEYWORDS}',
        },
        icelandicSynonym: {
          type: 'synonym',
          lenient: true,
          synonyms_path: 'analyzers/{SYNONYMS}',
        },
        icelandicDeCompounded: {
          type: 'dictionary_decompounder',
          word_list_path: 'analyzers/{HYPHENWHITELIST}',
          max_subword_size: 18,
          min_subword_size: 4,
        },
      },
      analyzer: {
        baseIcelandic: {
          type: 'custom',
          tokenizer: 'standard',
          filter: [
            'lowercase',
            'icelandicSynonym',
            'icelandicStop',
            'icelandicKeyword',
            'icelandicStemmer',
          ],
        },
        compoundIcelandic: {
          type: 'custom',
          tokenizer: 'standard',
          filter: [
            'lowercase',
            'icelandicSynonym',
            'icelandicStop',
            'icelandicKeyword',
            'icelandicDeCompounded',
            'icelandicStemmer',
          ],
        },
        termIcelandic: {
          type: 'custom',
          tokenizer: 'standard',
          filter: [
            'lowercase',
            'icelandicSynonym',
            'icelandicStop',
            'icelandicAutocompleteStop',
          ],
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
            type: 'icu_collation_keyword',
            index: false,
            language: 'is',
            country: 'is',
          },
          stemmed: {
            type: 'text',
            analyzer: 'baseIcelandic',
          },
          compound: {
            type: 'text',
            analyzer: 'compoundIcelandic',
          },
          keyword: {
            type: 'keyword',
          },
        },
      },
      content: {
        type: 'text',
        fielddata: true,
        fields: {
          stemmed: {
            type: 'text',
            analyzer: 'baseIcelandic',
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
            analyzer: 'baseIcelandic',
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
        analyzer: 'termIcelandic',
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
