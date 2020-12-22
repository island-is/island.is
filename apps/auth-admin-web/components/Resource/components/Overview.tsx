import React from 'react';
import { ResourceStep } from './../../../entities/common/ResourceStep';
import IdentityResourcesList from '../IdentityResourcesList';
import ApiResourcesList from '../ApiResourcesList'
import ApiScopeList from '../ApiScopeList'
import StepEnd from '../../Common/StepEnd';

interface Props {
  activeStep: ResourceStep;
}



const Overview: React.FC<Props> = ({ activeStep, children }) => {

  const finishedPushed = () => {
    // TODO: What should happen now?
  }

  switch (activeStep) {
    case ResourceStep.ApiScopes:
      return <ApiScopeList />;
    case ResourceStep.ApiResourceScopes:
      return <ApiResourcesList />;
    case ResourceStep.IdentityResource:
      return <IdentityResourcesList />;
    default:
     return <StepEnd buttonText="Go back" title="Steps completed" handleButtonFinishedClick={() => finishedPushed()}>The steps needed, to create a client, have been completed</StepEnd>
      
  }
};

export default Overview;
