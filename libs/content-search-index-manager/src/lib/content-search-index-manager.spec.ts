import {
  getElasticsearchIndex,
  getElasticVersion,
  getIndexTemplate,
} from './content-search-index-manager'

describe('Get index template', () => {
  it('should return template for all locales', () => {
    const indexTemplateIs = getIndexTemplate('is')
    expect(indexTemplateIs).toBeDefined()

    const indexTemplateEn = getIndexTemplate('en')
    expect(indexTemplateEn).toBeDefined()
  })
})

describe('Get elastic index version', () => {
  it('should return some hash for current index version', () => {
    const versionHash = getElasticVersion()
    expect(versionHash).toBeTruthy()
  })
})

describe('Get elasticsearch index', () => {
  it('should return a unique index for each locale', () => {
    const isIndex = getElasticsearchIndex('is').split('-')
    expect(isIndex[1]).toEqual('is')

    const enIndex = getElasticsearchIndex('en').split('-')
    expect(enIndex[1]).toEqual('en')
  })

  it('should have current version as last section', () => {
    const versionHash = getElasticVersion()
    const isIndex = getElasticsearchIndex('is').split('-')
    expect(isIndex[2]).toEqual(versionHash)
  })

  it('should allow you to supply a version', () => {
    const customVersionHash = 'myversion'
    const isIndex = getElasticsearchIndex('is', customVersionHash).split('-')
    expect(isIndex[2]).toEqual(customVersionHash)
  })
})
