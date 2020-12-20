import React from 'react';
import { ResourceStep } from './../../../entities/common/ResourceStep';

interface Props {
    handleStepChange: (step: ResourceStep) => void;
    activeStep: ResourceStep;
}

const ResourceStepNav: React.FC<Props> = ({ handleStepChange, activeStep, children }) => {
    return <div><nav className="client-step-nav">
        <ul>
            <li><a onClick={() => handleStepChange(ResourceStep.ApiScopes)}  className={activeStep === ResourceStep.ApiScopes ? 'active' : ''}>Api scopes</a></li>
            <li><a onClick={() => handleStepChange(ResourceStep.ApiResourceScopes)} className={activeStep === ResourceStep.ApiResourceScopes ? 'active' : ''}>Api resources</a></li>
            <li><a onClick={() => handleStepChange(ResourceStep.IdentityResource)} className={activeStep === ResourceStep.IdentityResource ? 'active' : ''}>Identity Resource</a></li>
        </ul>
    </nav>
    <div className="client-step-nav__container__content">{children}</div>
    </div>
}

export default ResourceStepNav;