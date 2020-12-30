import React from 'react';
import { ClientStep } from '../../../entities/common/ClientStep';

interface Props {
    handleStepChange: (step: ClientStep) => void;
    activeStep?: ClientStep;
}

const ClientStepNav: React.FC<Props> = ({ handleStepChange, activeStep, children }) => {
    return <div><nav className="client-step-nav">
        <ul>
            <li><a onClick={() => handleStepChange(ClientStep.Client)} className={activeStep === ClientStep.Client ? 'active' : ''}>Client Basics</a></li>
            <li><a onClick={() => handleStepChange(ClientStep.ClientRedirectUri)}  className={activeStep === ClientStep.ClientRedirectUri ? 'active' : ''}>Redirect Uri</a></li>
            <li><a onClick={() => handleStepChange(ClientStep.ClientIdpRestrictions)} className={activeStep === ClientStep.ClientIdpRestrictions ? 'active' : ''}>Idp Restricions</a></li>
            <li><a onClick={() => handleStepChange(ClientStep.ClientPostLogoutRedirectUri)}  className={activeStep === ClientStep.ClientPostLogoutRedirectUri ? 'active' : ''}>Post Logout Uris</a></li>
            <li><a onClick={() => handleStepChange(ClientStep.ClientAllowedCorsOrigin)} className={activeStep === ClientStep.ClientAllowedCorsOrigin ? 'active' : ''}>Allowed Cors Origins</a></li>
            <li><a onClick={() => handleStepChange(ClientStep.ClientGrantTypes)} className={activeStep === ClientStep.ClientGrantTypes ? 'active' : ''}>Grant types</a></li>
            <li><a onClick={() => handleStepChange(ClientStep.ClientAllowedScopes)} className={activeStep === ClientStep.ClientAllowedScopes ? 'active' : ''}>Allowed Scopes</a></li>
            <li><a onClick={() => handleStepChange(ClientStep.ClientClaims)} className={activeStep === ClientStep.ClientClaims ? 'active' : ''}>Client claims</a></li>
            <li><a onClick={() => handleStepChange(ClientStep.ClientSecret)} className={activeStep === ClientStep.ClientSecret ? 'active' : ''}>Client secret</a></li>
        </ul>
    </nav>
    <div className="client-step-nav__container__content">{children}</div>
    </div>
}

export default ClientStepNav;