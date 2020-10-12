import React from 'react';
import { render } from '@testing-library/react';

import {ServiceCard} from '.';
import { 
  ApiService
 } from '@island.is/api/schema';

 import { PricingCategory,
  DataCategory,
  TypeCategory,
  AccessCategory} from '../../const/TestConst'

  import {
    AccessCategory as AccessCategoryDisplay,
    PricingCategory as PricingCategoryDisplay,
    TypeCategory as TypeCategoryDisplay, 
    DataCategory as DataCategoryDisplay,
  } from '@island.is/api-catalogue/consts'

import ContentfulApi from '../../services/contentful';



describe(' ServiceCard ', async () => {
  
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
  

  it('should render successfully', async () => {
    const filterStrings = await client.fetchPageBySlug('service-filter', 'is-IS');
    const { baseElement } = render(<ServiceCard service={service} strings={filterStrings.strings} />)
    expect(baseElement).toBeTruthy()
  })

  describe('Card values should contain', () => {
    let filterStrings;
    beforeEach(async ()=> {
      filterStrings = await client.fetchPageBySlug('service-filter', 'en-GB');
    })
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
      expect(getByText(PricingCategoryDisplay.FREE)).toBeTruthy()
      expect(getByText(PricingCategoryDisplay.PAID)).toBeTruthy()
    })
    it('should contain all categories values', () => {
      const { getByText } = render(<ServiceCard service={service} strings={filterStrings.strings} />)
      expect(getByText(DataCategoryDisplay.PUBLIC)).toBeTruthy()
    })
    it('should contain all types values', () => {
      const { getByText } = render(<ServiceCard service={service} strings={filterStrings.strings} />)
      expect(getByText(TypeCategoryDisplay.REST)).toBeTruthy()
    })
    it('should contain all Access values', () => {
      const { getByText } = render(<ServiceCard service={service} strings={filterStrings.strings} />)
      expect(getByText(AccessCategoryDisplay.XROAD)).toBeTruthy()
    })
  })
})
