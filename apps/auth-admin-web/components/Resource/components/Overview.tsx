import React from 'react';
import { ResourceStep } from './../../../entities/common/ResourceStep';
import IdentityResourcesList from '../IdentityResourcesList';
import ApiResourcesList from '../ApiResourcesList'
import ApiScopeList from '../ApiScopeList'

interface Props {
  activeStep: ResourceStep;
}

const Overview: React.FC<Props> = ({ activeStep, children }) => {
  switch (activeStep) {
    case ResourceStep.ApiScopes:
      return <ApiScopeList />;
    case ResourceStep.ApiResourceScopes:
      return <ApiResourcesList />;
    case ResourceStep.IdentityResource:
      return <IdentityResourcesList />;
    default:
      // TODO: Temp
      return <div>Step not found</div>;
  }
};

export default Overview;
