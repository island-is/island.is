import ContentWrapper from '../../../components/Layout/ContentWrapper';
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav';
import React from 'react';
import ApiResourcesList from '../../../components/Resource/lists/ApiResourcesList';

export default function Index() {
  return (
    <ContentWrapper>
        <ResourcesTabsNav />         
        <ApiResourcesList />
    </ContentWrapper>
  );
}
