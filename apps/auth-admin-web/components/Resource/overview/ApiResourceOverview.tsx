import React from 'react';
import { ApiResourceStep } from './../../../entities/common/ApiResourceStep';
import ApiResourceData from '../components/ApiResourceData';
import ApiResourceScopes from '../api-resource-connection-tables/ApiResourceScopes';
import ApiResourceSecrets from '../api-resource-connection-tables/ApiResourceSecrets';
import ApiResourceUserClaims from '../api-resource-connection-tables/ApiResourceUserClaims';

interface Props {
  activeStep: ApiResourceStep;
  apiResourceId: string;
}

const ApiResourceOverview: React.FC<Props> = ({
  activeStep,
  apiResourceId,
}) => {
  switch (activeStep) {
    case ApiResourceStep.ApiResourceBasics:
      return <ApiResourceData apiResourceId={apiResourceId} />;
    case ApiResourceStep.ApiResourceScopes:
      return <ApiResourceScopes apiResourceId={apiResourceId}/>;
    case ApiResourceStep.ApiResourceSecrets:
        return <ApiResourceSecrets apiResourceId={apiResourceId}/>;
    case ApiResourceStep.ApiResourceUserClaims:
        return <ApiResourceUserClaims apiResourceId={apiResourceId}/>;
    default:
      return <div>Step not found</div>;
  }
};

export default ApiResourceOverview;
