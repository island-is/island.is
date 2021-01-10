import ContentWrapper from '../../../components/Layout/ContentWrapper';
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav';
import React from 'react';
import IdentityResourcesList from '../../../components/Resource/lists/IdentityResourcesList';
import { GetServerSideProps } from 'next';
import { withAuthentication } from 'apps/auth-admin-web/utils/auth.utils';

export default function Index() {
  return (
    <ContentWrapper>
      <ResourcesTabsNav />
      <IdentityResourcesList />
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
