import React from 'react';
import ContentWrapper from './../../components/Layout/ContentWrapper';
import ClientsList from '../../components/Client/lists/ClientsList';

export default function Index() {
  return (
    <ContentWrapper>
      <ClientsList />
    </ContentWrapper>
  );
}
