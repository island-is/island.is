import React from 'react'
import { render } from '@testing-library/react'

import { ServiceFilter } from './ServiceFilter'
import { GetApiCatalogueInput } from '@island.is/api/schema'

describe(' ServiceFilter ', () => {
  const OLD_ENV = process.env;
    
  beforeAll(() =>{
    process.env = OLD_ENV;
    process.env.CONTENTFUL_SPACE_ID = 'jtzqkuaxipis'
    process.env.CONTENTFUL_ACCESS_TOKEN = 'N6X1O7qgBQ_FqxQx0O-keh3tJDrEhV8myczR3w-ZbS0'
  })
  afterAll(() => {
    process.env = OLD_ENV; // restore old env
  });

  it('should render successfully', () => {
    const strings = [
      { id: 'catalog-filter-access', text: 'Aðgengi' },
      { id: 'catalog-filter-data', text: 'Gögn' },
      { id: 'catalog-filter-data-financial', text: 'Fjármál' },
      { id: 'catalog-filter-data-health', text: 'Heilsa' },
      { id: 'catalog-filter-data-official', text: 'Opinber' },
      { id: 'catalog-filter-data-personal', text: 'Persónugreinanleg' },
      { id: 'catalog-filter-data-public', text: 'Almenn' },
      { id: 'catalog-filter-pricing', text: 'Verð' },
      { id: 'catalog-filter-pricing-free', text: 'Gjaldfrjáls' },
      { id: 'catalog-filter-pricing-paid', text: 'Gjaldskyld' },
      { id: 'catalog-filter-type', text: 'Tegund' },
      { id: 'catalog-filter-type-graphql', text: 'GraphQL' },
      { id: 'catalog-filter-type-react', text: 'REST' },
      { id: 'catalog-filter-type-soap', text: 'SOAP' },
      { id: 'catalog-filter-access-xroad', text: 'X-Road' },
      { id: 'catalog-filter-access-apigw', text: 'API GW' },
      { id: 'catalog-filter-search', text: 'Leita' },
    ]

    const params: GetApiCatalogueInput = {
      access: [],
      cursor: null,
      data: [],
      limit: null,
      pricing: [],
      query: null,
      type: [],
    }
    const { baseElement } = render(
      <ServiceFilter
        iconVariant="default"
        rootClasses={null}
        isLoading={true}
        parameters={params}
        onInputChange={({ target }) => {(target) => {} }}
        onClear={null}
        onCheckCategoryChanged={null}
        strings={strings}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
