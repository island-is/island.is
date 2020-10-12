
import React from 'react'
import { render } from '@testing-library/react'

import ServiceList from './ServiceList'
import ContentfulApi from '../../services/contentful';
import { ApolloProvider } from 'react-apollo';
import initApollo from '../../graphql/client';

describe(' ServiceList ', () => {

  it('should render successfully', async () => {
    const apolloClient = initApollo({});
    const client = new ContentfulApi();

    const pageContent = await client.fetchPageBySlug('services', 'is-IS');
    const filterStrings = await client.fetchPageBySlug('service-filter', 'is-IS');

    const { baseElement } = render(
      <ApolloProvider client={apolloClient}>
        <ServiceList pageContent={pageContent} filterStrings={filterStrings} />
      </ApolloProvider>
    );
    expect(baseElement).toBeTruthy();
  })
  
})
