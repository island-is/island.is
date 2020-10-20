import React from 'react'
import { render } from '@testing-library/react'

import { ServiceFilter } from './ServiceFilter'
import { GetApiCatalogueInput } from '@island.is/api/schema'
import { ContentfulString } from '../../services/contentful.types'

describe(' ServiceFilter ', () => {
  const strings: Array<ContentfulString> = [
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

  it('should render successfully', () => {
    const { baseElement } = render(
      <ServiceFilter
        iconVariant="default"
        rootClasses={null}
        isLoading={true}
        parameters={params}
        onClear={null}
        onCheckCategoryChanged={null}
        strings={strings}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
