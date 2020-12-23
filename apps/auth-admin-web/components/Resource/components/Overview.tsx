import React from 'react';
import { ResourceTabs } from '../../../entities/common/ResourceTabs';
import IdentityResourcesList from '../IdentityResourcesList';
import ApiResourcesList from '../ApiResourcesList'
import ApiScopeList from '../ApiScopeList'
import StepEnd from '../../Common/StepEnd';

interface Props {
  activeStep: ResourceTabs;
}



const Overview: React.FC<Props> = ({ activeStep, children }) => {

  const finishedPushed = () => {
    // TODO: What should happen now?
  }

  switch (activeStep) {
    case ResourceTabs.ApiScopes:
      return <ApiScopeList />;
    case ResourceTabs.ApiResourceScopes:
      return <ApiResourcesList />;
    case ResourceTabs.IdentityResource:
      return <IdentityResourcesList />;
    default:
     return <StepEnd buttonText="Go back" title="Steps completed" handleButtonFinishedClick={() => finishedPushed()}>The steps needed, to create a client, have been completed</StepEnd>
      
  }
};

export default Overview;
