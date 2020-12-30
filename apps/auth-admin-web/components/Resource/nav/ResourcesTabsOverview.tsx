import React from 'react';
import { ResourceTabs } from '../../../entities/common/ResourceTabs';
import IdentityResourcesList from '../lists/IdentityResourcesList';
import ApiResourcesList from '../lists/ApiResourcesList'
import ApiScopeList from '../lists/ApiScopeList'

interface Props {
  activeTab: ResourceTabs;
}

const ResourcesTabsOverview: React.FC<Props> = ({ activeTab, children }) => {
  switch (activeTab) {
    case ResourceTabs.ApiScopes:
      return <ApiScopeList />;
    case ResourceTabs.ApiResourceScopes:
      return <ApiResourcesList />;
    case ResourceTabs.IdentityResource:
      return <IdentityResourcesList />;
    default:
     return <div></div>
  }
};

export default ResourcesTabsOverview;
