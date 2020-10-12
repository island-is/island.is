
import React from 'react';
import { render } from '@testing-library/react';

import { ServiceDetail } from './ServiceDetail';

import { 
  ApiService
 } from '@island.is/api/schema';

 import { PricingCategory,
          DataCategory,
          TypeCategory,
          AccessCategory} from '../../const/TestConst'

import ContentfulApi from '../../services/contentful';

describe(' ServiceDetail ', () => {

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
    const { baseElement } = render(<ServiceDetail service={service} strings={filterStrings.strings}/>)
    expect(baseElement).toBeTruthy();
  })
})
