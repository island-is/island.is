import UsersList from '../../components/User/lists/UsersList';
import React from 'react';
import ContentWrapper from './../../components/Layout/ContentWrapper';
import { GetServerSideProps } from 'next';
import { withAuthentication } from './../../utils/auth.utils';

const Index: React.FC = () => {
  return (
    <ContentWrapper>
      <UsersList></UsersList>
    </ContentWrapper>
  );
};
export default Index;

export const getServerSideProps: GetServerSideProps = withAuthentication(
  async (context: any) => {
    return {
      props: {},
    };
  }
);
