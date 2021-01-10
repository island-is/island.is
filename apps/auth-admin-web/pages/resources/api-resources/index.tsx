import ContentWrapper from '../../../components/Layout/ContentWrapper';
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav';
import React from 'react';
import ApiResourcesList from '../../../components/Resource/lists/ApiResourcesList';
import { GetServerSideProps } from 'next';
import { withAuthentication } from 'apps/auth-admin-web/utils/auth.utils';

export default function Index() {
  return (
    <ContentWrapper>
      <ResourcesTabsNav />
      <ApiResourcesList />
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
