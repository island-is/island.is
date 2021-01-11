import UsersList from '../../components/User/lists/UsersList';
import React from 'react';
import ContentWrapper from './../../components/Layout/ContentWrapper';
import { GetServerSideProps } from 'next';
import { withAuthentication } from 'apps/auth-admin-web/utils/auth.utils';

export default function Index() {
  return (
    <ContentWrapper>
      <UsersList></UsersList>
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
