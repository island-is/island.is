import React from 'react'
import { render } from '@testing-library/react'

import { ServiceFilter } from './ServiceFilter'
import { GetApiCatalogueInput } from '@island.is/api/schema'
import { GetNamespaceQuery } from '@island.is/web/graphql/schema'

describe(' ServiceFilter ', () => {
  const strings: GetNamespaceQuery['getNamespace'] = {
    __typename: 'Namespace',
    fields:
      '{' +
      "'data': 'Gögn'," +
      "'type': 'Tegund'," +
      "'access': 'Aðgengi'," +
      "'mobile': 'Sýna flokka'," +
      "'search': 'Leita'," +
      "'pricing': 'Verð'," +
      "'typeRest': 'REST'," +
      "'typeSoap': 'SOAP'," +
      "'dataHealth': 'Heilsa'," +
      "'dataPublic': 'Almenn'," +
      "'accessApigw': 'API GW'," +
      "'accessXroad': 'X-Road'," +
      "'pricingFree': 'Gjaldfrjáls'," +
      "'pricingPaid': 'Gjaldskyld'," +
      "'typeGraphql': 'GraphQL'," +
      "'dataOfficial': 'Opinber'," +
      "'dataPersonal': 'Persónugreinanleg'," +
      "'dataFinancial': 'Fjármál'" +
      '}',
  }

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
