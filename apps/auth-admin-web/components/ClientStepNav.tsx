import React from 'react';
import Link from 'next/link'
import { Step } from '../models/common/Step';

interface Props {
    handleStepChange: (step: Step) => void;
    activeStep?: Step;
}

const ClientStepNav: React.FC<Props> = ({ handleStepChange, activeStep, children }) => {
    return <div><nav className="client-step-nav">
        <ul>
            <li><a onClick={() => handleStepChange(Step.Client)} className={activeStep === Step.Client ? 'active' : ''}>Client Basics</a></li>
            <li><a onClick={() => handleStepChange(Step.ClientIdpRestrictions)} className={activeStep === Step.ClientIdpRestrictions ? 'active' : ''}>Idp Restricions</a></li>
            <li><a onClick={() => handleStepChange(Step.ClientPostLogoutRedirectUri)}  className={activeStep === Step.ClientPostLogoutRedirectUri ? 'active' : ''}>Post Logout Uris</a></li>
            <li><a onClick={() => handleStepChange(Step.ClientRedirectUri)}  className={activeStep === Step.ClientRedirectUri ? 'active' : ''}>Redirect Uri</a></li>
            <li><a onClick={() => handleStepChange(Step.ClientAllowedCorsOrigin)} className={activeStep === Step.ClientAllowedCorsOrigin ? 'active' : ''}>Allowed Cors Origins</a></li>
            <li><a onClick={() => handleStepChange(Step.ClientAllowedScopes)} className={activeStep === Step.ClientAllowedScopes ? 'active' : ''}>Allowed Scopes</a></li>
            <li><a onClick={() => handleStepChange(Step.ClientClaims)} className={activeStep === Step.ClientClaims ? 'active' : ''}>Client claims</a></li>
            <li><a onClick={() => handleStepChange(Step.ClientGrantTypes)} className={activeStep === Step.ClientGrantTypes ? 'active' : ''}>Grant types</a></li>
            <li><a onClick={() => handleStepChange(Step.ClientSecret)} className={activeStep === Step.ClientSecret ? 'active' : ''}>Client secret</a></li>
        </ul>
    </nav>
    <div className="client-step-nav__container__content">{children}</div>
    </div>
}

export default ClientStepNav;