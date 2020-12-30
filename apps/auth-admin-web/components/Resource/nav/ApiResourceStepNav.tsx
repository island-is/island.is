import React from 'react';
import { ApiResourceStep } from '../../../entities/common/ApiResourceStep';

interface Props {
  handleStepChange: (step: ApiResourceStep) => void;
  activeStep: ApiResourceStep;
}

const ApiResourceStepNav: React.FC<Props> = ({
  handleStepChange,
  activeStep,
  children,
}) => {
  return (
    <div>
      <nav className="api-resource-step-nav">
        <ul>
          <li>
            <a
              onClick={() =>
                handleStepChange(ApiResourceStep.ApiResourceBasics)
              }
              className={
                activeStep === ApiResourceStep.ApiResourceBasics ? 'active' : ''
              }
            >
              Api resource basics
            </a>
          </li>
          <li>
            <a
              onClick={() =>
                handleStepChange(ApiResourceStep.ApiResourceScopes)
              }
              className={
                activeStep === ApiResourceStep.ApiResourceScopes ? 'active' : ''
              }
            >
              Api resource scopes
            </a>
          </li>
          <li>
            <a
              onClick={() =>
                handleStepChange(ApiResourceStep.ApiResourceSecrets)
              }
              className={
                activeStep === ApiResourceStep.ApiResourceSecrets
                  ? 'active'
                  : ''
              }
            >
              Api resource secrets
            </a>
          </li>
          <li>
            <a
              onClick={() =>
                handleStepChange(ApiResourceStep.ApiResourceUserClaims)
              }
              className={
                activeStep === ApiResourceStep.ApiResourceUserClaims
                  ? 'active'
                  : ''
              }
            >
              Api resource user claims
            </a>
          </li>
        </ul>
      </nav>
      <div className="api-resource__container__content">{children}</div>
    </div>
  );
};

export default ApiResourceStepNav;
