import React from 'react';
import Link from 'next/link'
import { Steps } from '../models/utils/Steps';

interface Props {
    handleStepChange: (step: Steps) => void;
}

const ClientStepNav: React.FC<Props> = ({ handleStepChange, children }) => {
    return <div><nav className="client-step-nav">
        <ul>
            <li className="nav__container"><a onClick={() => handleStepChange(Steps.Client)}>Client Basics</a></li>
            <li className="nav__container"><a onClick={() => handleStepChange(Steps.ClientIdpRestrictions)}>Idp Restricions</a></li>
            <li className="nav__container"><a onClick={() => handleStepChange(Steps.ClientPostLogoutRedirectUri)}>Post Logout Uris</a></li>
            <li className="nav__container"><a onClick={() => handleStepChange(Steps.ClientRedirectUri)}>Redirect Uri</a></li>
            <li className="nav__container"><a onClick={() => handleStepChange(Steps.ClientAllowedCorsOrigin)}>Allowed Cors Origins</a></li>
            <li className="nav__container"><a onClick={() => handleStepChange(Steps.ClientAllowedScopes)}>Allowed Scopes</a></li>
            <li className="nav__container"><a onClick={() => handleStepChange(Steps.ClientClaims)}>Client claims</a></li>
            <li className="nav__container"><a onClick={() => handleStepChange(Steps.ClientGrantTypes)}>Grant types</a></li>
            <li className="nav__container"><a onClick={() => handleStepChange(Steps.ClientSecret)}>Client secret</a></li>
        </ul>
    </nav>
    <div className="client-step-nav__container__content">{children}</div>
    </div>
}

export default ClientStepNav;