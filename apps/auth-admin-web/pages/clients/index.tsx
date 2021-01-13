import React from 'react';
import ContentWrapper from './../../components/Layout/ContentWrapper';
import ClientsList from '../../components/Client/lists/ClientsList';
import { GetServerSideProps, NextPageContext } from 'next';
import { withAuthentication } from './../../utils/auth.utils';

const Index: React.FC = () => {
  return (
    <ContentWrapper>
      <ClientsList />
    </ContentWrapper>
  );
}


export const getServerSideProps: GetServerSideProps = withAuthentication(
  async (context: NextPageContext) => {
    return {
      props: {},
    };
  }
);

export default Index;
