import React from 'react'
import { render } from '@testing-library/react'
import { ServiceCard } from '.'

// import {
//   PricingCategory,
//   DataCategory,
//   TypeCategory,
//   AccessCategory,
// } from '../../const/TestConst'

import {
  AccessCategory,
  PricingCategory,
  TypeCategory,
  DataCategory,
} from '@island.is/api-catalogue/consts'

import { ContentfulString } from '../../services/contentful.types'

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

  const filterStrings: Array<ContentfulString> = [
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
    { id: 'catalog-filter-type-rest', text: 'REST' },
    { id: 'catalog-filter-type-soap', text: 'SOAP' },
    { id: 'catalog-filter-access-xroad', text: 'X-Road' },
    { id: 'catalog-filter-access-apigw', text: 'API GW' },
    { id: 'catalog-filter-search', text: 'Leita' },
  ]

  it('should render successfully', async () => {
    const { baseElement } = render(
      <ServiceCard service={service} strings={filterStrings} />,
    )
    expect(baseElement).toBeTruthy()
  })

  describe('Card values should contain', () => {
    it('should contain service name', () => {
      const { getByText } = render(
        <ServiceCard service={service} strings={filterStrings} />,
      )
      expect(getByText(service.name)).toBeTruthy()
    })

    it('should contain owner name', () => {
      const { getByText } = render(
        <ServiceCard service={service} strings={filterStrings} />,
      )
      expect(getByText(service.owner)).toBeTruthy()
    })

    it('should contain all pricing values', () => {
      const { getByText } = render(
        <ServiceCard service={service} strings={filterStrings} />,
      )
      expect(
        getByText(
          filterStrings.find((s) => s.id === 'catalog-filter-pricing-free')
            .text,
        ),
      ).toBeTruthy()
      expect(
        getByText(
          filterStrings.find((s) => s.id === 'catalog-filter-pricing-paid')
            .text,
        ),
      ).toBeTruthy()
    })
    it('should contain all categories values', () => {
      const { getByText } = render(
        <ServiceCard service={service} strings={filterStrings} />,
      )
      expect(
        getByText(
          filterStrings.find((s) => s.id === 'catalog-filter-data-public').text,
        ),
      ).toBeTruthy()
    })
    it('should contain all types values', () => {
      const { getByText } = render(
        <ServiceCard service={service} strings={filterStrings} />,
      )
      expect(
        getByText(
          filterStrings.find((s) => s.id === 'catalog-filter-type-rest').text,
        ),
      ).toBeTruthy()
    })
    it('should contain all Access values', () => {
      const { getByText } = render(
        <ServiceCard service={service} strings={filterStrings} />,
      )
      expect(
        getByText(
          filterStrings.find((s) => s.id === 'catalog-filter-access-xroad')
            .text,
        ),
      ).toBeTruthy()
    })
  })
})
