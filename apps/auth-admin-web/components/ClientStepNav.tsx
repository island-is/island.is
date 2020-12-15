import React from 'react';
import Link from 'next/link'
import { Step } from '../models/common/Step';

interface Props {
    handleStepChange: (step: Step) => void;
    activeStep?: Step;
}

const ClientStepNav: React.FC<Props> = ({ handleStepChange, children }) => {
    return <div><nav className="client-step-nav">
        <ul>
            <li><a onClick={() => handleStepChange(Step.Client)}>Client Basics</a></li>
            <li><a onClick={() => handleStepChange(Step.ClientIdpRestrictions)}>Idp Restricions</a></li>
            <li><a onClick={() => handleStepChange(Step.ClientPostLogoutRedirectUri)}>Post Logout Uris</a></li>
            <li><a onClick={() => handleStepChange(Step.ClientRedirectUri)}>Redirect Uri</a></li>
            <li><a onClick={() => handleStepChange(Step.ClientAllowedCorsOrigin)}>Allowed Cors Origins</a></li>
            <li><a onClick={() => handleStepChange(Step.ClientAllowedScopes)}>Allowed Scopes</a></li>
            <li><a onClick={() => handleStepChange(Step.ClientClaims)}>Client claims</a></li>
            <li><a onClick={() => handleStepChange(Step.ClientGrantTypes)}>Grant types</a></li>
            <li><a onClick={() => handleStepChange(Step.ClientSecret)}>Client secret</a></li>
        </ul>
    </nav>
    <div className="client-step-nav__container__content">{children}</div>
    </div>
}

export default ClientStepNav;