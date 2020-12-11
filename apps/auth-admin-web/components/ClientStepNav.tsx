import React from 'react';
import Link from 'next/link'
import { Steps } from '../models/Steps';

interface Props {
    handleStepChange: (step: Steps) => void;
}

export default function ClientStepNav (props: Props) {
    return <nav className="client-step-nav">
        <ul>
            <li className="nav__container"><a onClick={() => props.handleStepChange(Steps.Client)}>Client Basics</a></li>
            <li className="nav__container"><a onClick={() => props.handleStepChange(Steps.ClientIdpRestrictions)}><a>Idp Restricions</a></li>
            <li className="nav__container"><a onClick={() => props.handleStepChange(Steps.ClientPostLogoutRedirectUri)}><a>Post Logout Uris</a></li>
            <li className="nav__container"><a onClick={() => props.handleStepChange(Steps.ClientRedirectUri)}>Redirect Uri</a></li>
            <li className="nav__container"><a onClick={() => props.handleStepChange(Steps.ClientAllowedCorsOrigin)}>Allowed Cors Origins</a></li>
            <li className="nav__container"><a onClick={() => props.handleStepChange(Steps.ClientAllowedScopes)}>Allowed Scopes</a></li>
            <li className="nav__container"><a onClick={() => props.handleStepChange(Steps.ClientClaims)}>Client claims</a></li>
            <li className="nav__container"><a onClick={() => props.handleStepChange(Steps.ClientGrantTypes)}>Grant types</a></li>
            <li className="nav__container"><a onClick={() => props.handleStepChange(Steps.ClientSecret)}>Client secret</a></li>
        </ul>
    </nav>
}