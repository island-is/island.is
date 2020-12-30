import React from 'react';
import { ApiScopeStep } from '../../../entities/common/ApiScopeStep';

interface Props {
  handleStepChange: (step: ApiScopeStep) => void;
  activeStep?: ApiScopeStep;
}

const IdentityResourceStepNav: React.FC<Props> = ({
  handleStepChange,
  activeStep,
  children,
}) => {
  return (
    <div>
      <nav className="api-scope-step-nav">
        <ul>
          <li>
            <a
              onClick={() =>
                handleStepChange(ApiScopeStep.ApiScope)
              }
              className={activeStep === ApiScopeStep.ApiScope ? 'active' : ''}
            >
              Api Scope
            </a>
          </li>
          <li>
            <a
              onClick={() => handleStepChange(ApiScopeStep.Claims)}
              className={
                activeStep === ApiScopeStep.Claims ? 'active' : ''
              }
            >
              Claims
            </a>
          </li>
        </ul>
      </nav>
      <div className="api-scope__container__content">{children}</div>
    </div>
  );
};

export default IdentityResourceStepNav;
