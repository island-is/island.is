
import React from 'react'
import { render } from '@testing-library/react'

import ServiceList from './ServiceList'
import { ServiceCardInformation, SERVICE_STATUS } from '../../components';
import {  getAllPriceCategories, 
          GetServicesParameters, 
          SERVICE_SEARCH_METHOD, 
          PRICING_CATEGORY, DATA_CATEGORY, ACCESS_CATEGORY, TYPE_CATEGORY 
        } from '../../components/ServiceRepository/service-repository';

describe(' ServiceList ', () => {
  

  const params:GetServicesParameters = { 
    cursor:null, 
    limit:null, 
    owner:null, 
    name:null, 
    pricing:getAllPriceCategories(), 
    data:[],
    access:[],
    type:[],
    searchMethod:SERVICE_SEARCH_METHOD.MUST_CONTAIN_ONE_OF_CATEGORY
  };
  
  it('should render successfully', () => {
    const { baseElement } = render(<ServiceList parameters={params} prevCursor={null} nextCursor={0} />);
    expect(baseElement).toBeTruthy();
  })
  
})
