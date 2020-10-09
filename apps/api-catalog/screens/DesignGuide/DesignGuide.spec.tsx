
import React from 'react';
import { render } from '@testing-library/react';

import DesignGuide from './DesignGuide';
import ContentfulApi from '../../services/contentful';

describe(' DesignGuide ', () => {

  it('should render successfully', async () => {
    const client = new ContentfulApi();

    const pageContent = await client.fetchPageBySlug('design-guide', 'is-IS');
    const { baseElement } = render(<DesignGuide pageContent={pageContent} />);
    expect(baseElement).toBeTruthy();
  })
  
})
