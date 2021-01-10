import ContentWrapper from '../../../components/Layout/ContentWrapper';
import ApiScopeList from '../../../components/Resource/lists/ApiScopeList';
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav';
import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuthentication } from 'apps/auth-admin-web/utils/auth.utils';

export default function Index() {
  return (
    <ContentWrapper>
      <ResourcesTabsNav />
      <ApiScopeList />
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
