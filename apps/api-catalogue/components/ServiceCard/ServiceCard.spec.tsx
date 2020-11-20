import React from 'react'
import { render } from '@testing-library/react'
import { ServiceCard } from '.'
import {
  AccessCategory,
  PricingCategory,
  TypeCategory,
  DataCategory,
} from '@island.is/api-catalogue/consts'

import { GetNamespaceQuery } from '../../types'
import { useNamespace } from '../../hooks'

describe(' ServiceCard ', () => {
  const service: any = {
    id: '0',
    owner: 'Þjóðskrá',
    name: 'Fasteignaskrá',
    description: 'OK',
    pricing: [PricingCategory.FREE, PricingCategory.PAID],
    data: [DataCategory.PUBLIC],
    type: [TypeCategory.REST],
    access: [AccessCategory.XROAD],
    xroadIdentifier: [
      {
        instance: 'TestInstance',
        memberClass: 'TestMemberClass',
        memberCode: 'TestMemberCode',
        subsystemCode: 'TestSubsystemCode',
        serviceCode: 'TestServiceCode',
      },
    ],
  }
  const filterContent: GetNamespaceQuery['getNamespace'] = {
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

  const n = useNamespace(filterContent)

  it('should render successfully', async () => {
    const { baseElement } = render(
      <ServiceCard service={service} strings={filterContent} />,
    )
    expect(baseElement).toBeTruthy()
  })

  describe('Card values should contain', () => {
    it('should contain service name', () => {
      const { getByText } = render(
        <ServiceCard service={service} strings={filterContent} />,
      )
      expect(getByText(service.name)).toBeTruthy()
    })

    it('should contain owner name', () => {
      const { getByText } = render(
        <ServiceCard service={service} strings={filterContent} />,
      )
      expect(getByText(service.owner)).toBeTruthy()
    })

    it('should contain all pricing values', () => {
      const { getByText } = render(
        <ServiceCard service={service} strings={filterContent} />,
      )
      expect(getByText(n('pricingFree'))).toBeTruthy()
      expect(getByText(n('pricingPaid'))).toBeTruthy()
    })
    it('should contain all categories values', () => {
      const { getByText } = render(
        <ServiceCard service={service} strings={filterContent} />,
      )
      expect(getByText(n('dataPublic'))).toBeTruthy()
    })
    it('should contain all types values', () => {
      const { getByText } = render(
        <ServiceCard service={service} strings={filterContent} />,
      )
      expect(getByText(n('typeRest'))).toBeTruthy()
    })
    it('should contain all Access values', () => {
      const { getByText } = render(
        <ServiceCard service={service} strings={filterContent} />,
      )
      expect(getByText(n('accessXroad'))).toBeTruthy()
    })
  })
})
