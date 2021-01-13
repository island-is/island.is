import ContentWrapper from '../../../components/Layout/ContentWrapper';
import ApiScopeList from '../../../components/Resource/lists/ApiScopeList';
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav';
import React from 'react';
import { GetServerSideProps, NextPageContext } from 'next';
import { withAuthentication } from './../../../utils/auth.utils';

const Index: React.FC = () => {
  return (
    <ContentWrapper>
      <ResourcesTabsNav />
      <ApiScopeList />
    </ContentWrapper>
  );
};
export default Index;

export const getServerSideProps: GetServerSideProps = withAuthentication(
  async (context: NextPageContext ) => {
    return {
      props: {},
    };
  }
);
