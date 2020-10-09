import React from 'react';
import { render } from '@testing-library/react';

import {ServiceCard} from '.';
import { 
  ApiService,
  PricingCategory,
  DataCategory,
  TypeCategory,
  AccessCategory
 } from '@island.is/api/schema';
import ContentfulApi from '../../services/contentful';

describe(' ServiceCard ', async () => {
  // const service:ServiceCardInformation = { 
  //   id:'0', 
  //   owner:"Þjóðskrá", 
  //   name:"Fasteignaskrá", 
  //   status:SERVICE_STATUS.OK,      
  //   pricing:[PRICING_CATEGORY.FREE, PRICING_CATEGORY.PAID],
  //   data:   [DATA_CATEGORY.PUBLIC],
  //   type:   [TYPE_CATEGORY.REACT,  TYPE_CATEGORY.SOAP], 
  //   access: [ACCESS_CATEGORY.X_ROAD],
  // };
  
  const service: ApiService = {
    id: '0',
    owner: 'Þjóðskrá',
    name: 'Fasteignaskrá',
    description: 'OK',
    pricing: [PricingCategory.Free, PricingCategory.Paid],
    data: [DataCategory.Public],
    type: [TypeCategory.Rest],
    access: [AccessCategory.Xroad],
    xroadIdentifier: [{
      instance: 'TestInstance',
      memberClass: 'TestMemberClass',
      memberCode: 'TestMemberCode',
      subsystemCode: 'TestSubsystemCode',
      serviceCode: 'TestServiceCode'
    }]
  };

  const client = new ContentfulApi();
  const filterStrings = await client.fetchPageBySlug('service-filter', 'is-IS');

  it('should render successfully', () => {
    const { baseElement } = render(<ServiceCard service={service} strings={filterStrings.strings} />)
    expect(baseElement).toBeTruthy()
  })
  describe('Card values should contain', () => {

    it('should contain service name', () => {
      const { getByText } = render(<ServiceCard service={service} strings={filterStrings.strings} />)
      expect(getByText(service.name)).toBeTruthy()
    })
  
    it('should contain owner name', () => {
      const { getByText } = render(<ServiceCard service={service} strings={filterStrings.strings} />)
      expect(getByText(service.owner)).toBeTruthy()
    })
  
    it('should contain all pricing values', () => {
      const { getByText } = render(<ServiceCard service={service} strings={filterStrings.strings} />)
      expect(getByText(service.pricing[0])).toBeTruthy()
      expect(getByText(service.pricing[1])).toBeTruthy()
    })
    it('should contain all categories values', () => {
      const { getByText } = render(<ServiceCard service={service} strings={filterStrings.strings} />)
      expect(getByText(service.data[0])).toBeTruthy()
    })
    it('should contain all types values', () => {
      const { getByText } = render(<ServiceCard service={service} strings={filterStrings.strings} />)
      expect(getByText(service.type[0])).toBeTruthy()
    })
    it('should contain all Access values', () => {
      const { getByText } = render(<ServiceCard service={service} strings={filterStrings.strings} />)
      expect(getByText(service.access[0])).toBeTruthy()
    })
  })
})
