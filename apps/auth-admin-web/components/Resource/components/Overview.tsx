import React from 'react';
import { ResourceTabs } from '../../../entities/common/ResourceTabs';
import IdentityResourcesList from '../IdentityResourcesList';
import ApiResourcesList from '../ApiResourcesList'
import ApiScopeList from '../ApiScopeList'
import StepEnd from '../../Common/StepEnd';

interface Props {
  activeTab: ResourceTabs;
}



const Overview: React.FC<Props> = ({ activeTab, children }) => {
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

export default Overview;
