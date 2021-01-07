import ContentWrapper from '../../../components/Layout/ContentWrapper';
import ApiScopeList from '../../../components/Resource/lists/ApiScopeList';
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav';
import React from 'react';

export default function Index() {
  return (
    <ContentWrapper>
      <ResourcesTabsNav />
      <ApiScopeList />
    </ContentWrapper>
  );
}
