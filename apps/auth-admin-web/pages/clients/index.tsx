import React from 'react';
import ContentWrapper from './../../components/Layout/ContentWrapper';
import ClientsList from '../../components/Client/lists/ClientsList';
import { GetServerSideProps } from 'next';
import { withAuthentication } from './../../utils/auth.utils';

function Index() {
  return (
    <ContentWrapper>
      <ClientsList />
    </ContentWrapper>
  );
}

export const getServerSideProps: GetServerSideProps = withAuthentication(
  async (context: any) => {
    return {
      props: {},
    };
  }
);

export default Index;
