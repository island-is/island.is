
import React from 'react'
import { render } from '@testing-library/react'

import ServiceList from './ServiceList'
import {  getAllPriceCategories, 
          GetServicesParameters, 
          SERVICE_SEARCH_METHOD  } from '../../components';
import ContentfulApi from '../../services/contentful';

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

    
  it('should render successfully', async () => {
    const client = new ContentfulApi();

    const pageContent = await client.fetchStaticPageBySlug('services', 'is-IS');
    const { baseElement } = render(<ServiceList parameters={params} prevCursor={null} nextCursor={null} pageContent={pageContent} />);
    expect(baseElement).toBeTruthy();
  })
  
})
