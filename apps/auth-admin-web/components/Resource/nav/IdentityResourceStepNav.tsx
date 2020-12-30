import React from 'react';
import { IdentityResourceStep } from '../../../entities/common/IdentityResourcesStep';

interface Props {
  handleStepChange: (step: IdentityResourceStep) => void;
  activeStep?: IdentityResourceStep;
}

const IdentityResourceStepNav: React.FC<Props> = ({
  handleStepChange,
  activeStep,
  children,
}) => {
  return (
    <div>
      <nav className="identity-resource-step-nav">
        <ul>
          <li>
            <a
              onClick={() =>
                handleStepChange(IdentityResourceStep.IdentityResource)
              }
              className={activeStep === IdentityResourceStep.IdentityResource ? 'active' : ''}
            >
              Identity Resource
            </a>
          </li>
          <li>
            <a
              onClick={() => handleStepChange(IdentityResourceStep.Claims)}
              className={
                activeStep === IdentityResourceStep.Claims ? 'active' : ''
              }
            >
              Claims
            </a>
          </li>
        </ul>
      </nav>
      <div className="identity-resource__container__content">{children}</div>
    </div>
  );
};

export default IdentityResourceStepNav;
