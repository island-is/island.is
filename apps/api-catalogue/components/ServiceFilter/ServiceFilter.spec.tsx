
import React from 'react';
import { render } from '@testing-library/react';

import { ServiceFilter } from './ServiceFilter';
import ContentfulApi from '../../services/contentful';

describe(' ServiceFilter ', () => {

  it('should render successfully', async () => {
    const client = new ContentfulApi();

    const parameters = {
      cursor: null,
      limit: 6,
      query: '',
      pricing: [],
      data: [],
      type: [],
      access: [],
    };
    const filterStrings = await client.fetchPageBySlug('service-filter', 'is-IS');

    const { baseElement } = render(
    <ServiceFilter
      iconVariant="default"
      rootClasses={null}
      isLoading={true}
      parameters={parameters}
      onInputChange={null}
      onClear={null}
      onCheckCategoryChanged={null}
      strings={filterStrings.strings}
    />
       )
    expect(baseElement).toBeTruthy();
  })
})
