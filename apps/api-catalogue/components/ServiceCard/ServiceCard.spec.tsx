import React from 'react'
import { render } from '@testing-library/react'
import { ServiceCard } from '.'

import {	
  PricingCategory,	
  DataCategory,	
  TypeCategory,	
  AccessCategory,	
} from '../../const/TestConst'

import {
  AccessCategory as AccessCategoryDisplay,
  PricingCategory as PricingCategoryDisplay,
  TypeCategory as TypeCategoryDisplay,
  DataCategory as DataCategoryDisplay
} from '@island.is/api-catalogue/consts'

import { ContentfulString } from '../../services/contentful.types'


describe(' ServiceCard ', () => {

  const service: any = {
    id: '0',
    owner: 'Þjóðskrá',
    name: 'Fasteignaskrá',
    description: 'OK',
    pricing: [PricingCategory.Free, PricingCategory.Paid],
    data: [DataCategory.Public],
    type: [TypeCategory.Rest],
    access: [AccessCategory.Xroad],
    xroadIdentifier: [
      {
        instance: 'TestInstance',
        memberClass: 'TestMemberClass',
        memberCode: 'TestMemberCode',
        subsystemCode: 'TestSubsystemCode',
        serviceCode: 'TestServiceCode'
      },
    ]
  }

  const filterStrings : Array<ContentfulString> = [
    { id: 'catalog-filter-access', text: 'Aðgengi' },
    { id: 'catalog-filter-data', text: 'Gögn' },
    { id: 'catalog-filter-data-financial', text: 'Fjármál' },
    { id: 'catalog-filter-data-health', text: 'Heilsa' },
    { id: 'catalog-filter-data-official', text: 'Opinber' },
    { id: 'catalog-filter-data-personal', text: 'Persónugreinanleg' },
    { id: 'catalog-filter-data-public', text: DataCategoryDisplay.PUBLIC },
    { id: 'catalog-filter-pricing', text: 'Verð' },
    { id: 'catalog-filter-pricing-free', text: PricingCategoryDisplay.FREE },
    { id: 'catalog-filter-pricing-paid', text: PricingCategoryDisplay.PAID },
    { id: 'catalog-filter-type', text: 'Tegund' },
    { id: 'catalog-filter-type-graphql', text: 'GraphQL' },
    { id: 'catalog-filter-type-react', text: TypeCategoryDisplay.REST },
    { id: 'catalog-filter-type-soap', text: 'SOAP' },
    { id: 'catalog-filter-access-xroad', text: AccessCategoryDisplay.XROAD },
    { id: 'catalog-filter-access-apigw', text: 'API GW' },
    { id: 'catalog-filter-search', text: 'Leita' }
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
      expect(getByText(PricingCategoryDisplay.FREE)).toBeTruthy()
      expect(getByText(PricingCategoryDisplay.PAID)).toBeTruthy()
    })
    it('should contain all categories values', () => {
      const { getByText } = render(
        <ServiceCard service={service} strings={filterStrings} />,
      )
      expect(getByText(DataCategoryDisplay.PUBLIC)).toBeTruthy()
    })
    it('should contain all types values', () => {
      const { getByText } = render(
        <ServiceCard service={service} strings={filterStrings} />,
      )
      expect(getByText(TypeCategoryDisplay.REST)).toBeTruthy()
    })
    it('should contain all Access values', () => {
      const { getByText } = render(
        <ServiceCard service={service} strings={filterStrings} />,
      )
      expect(getByText(AccessCategoryDisplay.XROAD)).toBeTruthy()
    })
  })
})
