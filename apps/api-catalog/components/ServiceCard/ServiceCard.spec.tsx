import React from 'react'
import { render } from '@testing-library/react'

import { ServiceCard } from '.'


import { SERVICE_STATUS } from '..';
import {
  ApiService,
  AccessCategory,
  PricingCategory,
  DataCategory,
  TypeCategory,
  XroadInfo,
} from '@island.is/api/schema';

//libs\api\schema\src\lib\schema.d.ts

describe(' ServiceCard ', () => {
  const xroadID: XroadInfo = {
    instance: "instance",
    memberClass: "memberclass",
    memberCode: "membercode",
    serviceCode: "serviceCode",
    subsystemCode: "subsystem"
  }
  const service: ApiService = {
    id: '0',
    owner: "Þjóðskrá",
    name: "Fasteignaskrá",
    /*status:SERVICE_STATUS.OK,      */
    pricing: [PricingCategory.Free, PricingCategory.Paid],
    data: [DataCategory.Public],
    type: [TypeCategory.Rest, TypeCategory.Soap],
    access: [AccessCategory.Xroad],
    description: "some description",
    xroadIdentifier: [
      {
        instance: "instance",
        memberClass: "memberclass",
        memberCode: "membercode",
        serviceCode: "serviceCode",
        subsystemCode: "subsystem"
      }]
  };

  const strings = [
    { id: "catalog-filter-access", text: "Aðgengi" },
    { id: "catalog-filter-data", text: "Gögn" },
    { id: "catalog-filter-data-financial", text: "Fjármál" },
    { id: "catalog-filter-data-health", text: "Heilsa" },
    { id: "catalog-filter-data-official", text: "Opinber" },
    { id: "catalog-filter-data-personal", text: "Persónugreinanleg" },
    { id: "catalog-filter-data-public", text: "Almenn" },
    { id: "catalog-filter-pricing", text: "Verð" },
    { id: "catalog-filter-pricing-free", text: "Gjaldfrjáls" },
    { id: "catalog-filter-pricing-paid", text: "Gjaldskyld" },
    { id: "catalog-filter-type", text: "Tegund" },
    { id: "catalog-filter-type-graphql", text: "GraphQL" },
    { id: "catalog-filter-type-react", text: "REST" },
    { id: "catalog-filter-type-soap", text: "SOAP" },
    { id: "catalog-filter-access-xroad", text: "X-Road" },
    { id: "catalog-filter-access-apigw", text: "API GW" },
    { id: "catalog-filter-search", text: "Leita" }
  ]

  it('should render successfully', () => {
    const { baseElement } = render(<ServiceCard cardWidth={250} service={service} strings={strings} />)
    expect(baseElement).toBeTruthy()
  })
  describe('Card values should contain', () => {

    it('should contain service name', () => {
      const { getByText } = render(<ServiceCard cardWidth={250} service={service} strings={strings} />)
      expect(getByText(service.name)).toBeTruthy()
    })

    it('should contain owner name', () => {
      const { getByText } = render(<ServiceCard cardWidth={250} service={service} strings={strings} />)
      expect(getByText(service.owner)).toBeTruthy()
    })

    it('should contain all pricing values', () => {
      const { getByText } = render(<ServiceCard cardWidth={250} service={service} strings={strings} />)
      expect(getByText(service.pricing[0])).toBeTruthy()
      expect(getByText(service.pricing[1])).toBeTruthy()
    })
    it('should contain all categories values', () => {
      const { getByText } = render(<ServiceCard cardWidth={250} service={service} strings={strings} />)
      expect(getByText(service.data[0])).toBeTruthy()
    })
    it('should contain all types values', () => {
      const { getByText } = render(<ServiceCard cardWidth={250} service={service} strings={strings} />)
      expect(getByText(service.type[0])).toBeTruthy()
      expect(getByText(service.type[1])).toBeTruthy()
    })
    it('should contain all Access values', () => {
      const { getByText } = render(<ServiceCard cardWidth={250} service={service} strings={strings} />)
      expect(getByText(service.access[0])).toBeTruthy()
    })
  })
})
