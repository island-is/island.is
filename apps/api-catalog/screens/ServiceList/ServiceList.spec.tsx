
import React from 'react'
import { render } from '@testing-library/react'

import ServiceList from './ServiceList'
import {  getAllPriceCategories, 
          GetServicesParameters  } from '../../components';
import ContentfulApi from '../../services/contentful';

describe(' ServiceList ', () => {

  it('should render successfully', async () => {
    const client = new ContentfulApi();

    const pageContent = await client.fetchPageBySlug('services', 'is-IS');
    const filterStrings = await client.fetchPageBySlug('services-filter', 'is-IS');

    const { baseElement } = render(<ServiceList pageContent={pageContent} filterStrings={filterStrings} />);
    expect(baseElement).toBeTruthy();
  })
  
})
