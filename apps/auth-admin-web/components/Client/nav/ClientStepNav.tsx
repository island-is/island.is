import React from 'react'
import { ClientStep } from '../../../entities/common/ClientStep'

interface Props {
  handleStepChange: (step: ClientStep) => void
  activeStep?: ClientStep
}

const ClientStepNav: React.FC<Props> = ({
  handleStepChange,
  activeStep,
  children,
}) => {
  return (
    <div>
      <nav className="client-step-nav">
        <ul>
          <li>
            <button
              type="button"
              onClick={() => handleStepChange(ClientStep.Client)}
              className={activeStep === ClientStep.Client ? 'active' : ''}
            >
              Client Settings
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleStepChange(ClientStep.ClientRedirectUri)}
              className={
                activeStep === ClientStep.ClientRedirectUri ? 'active' : ''
              }
            >
              Redirect Uri
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleStepChange(ClientStep.ClientIdpRestrictions)}
              className={
                activeStep === ClientStep.ClientIdpRestrictions ? 'active' : ''
              }
            >
              Idp Restricions
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() =>
                handleStepChange(ClientStep.ClientPostLogoutRedirectUri)
              }
              className={
                activeStep === ClientStep.ClientPostLogoutRedirectUri
                  ? 'active'
                  : ''
              }
            >
              Post Logout Uris
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() =>
                handleStepChange(ClientStep.ClientAllowedCorsOrigin)
              }
              className={
                activeStep === ClientStep.ClientAllowedCorsOrigin
                  ? 'active'
                  : ''
              }
            >
              Allowed Cors Origins
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleStepChange(ClientStep.ClientGrantTypes)}
              className={
                activeStep === ClientStep.ClientGrantTypes ? 'active' : ''
              }
            >
              Grant types
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleStepChange(ClientStep.ClientAllowedScopes)}
              className={
                activeStep === ClientStep.ClientAllowedScopes ? 'active' : ''
              }
            >
              Allowed Scopes
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleStepChange(ClientStep.ClientClaims)}
              className={activeStep === ClientStep.ClientClaims ? 'active' : ''}
            >
              Client claims
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleStepChange(ClientStep.ClientSecret)}
              className={activeStep === ClientStep.ClientSecret ? 'active' : ''}
            >
              Client secret
            </button>
          </li>
        </ul>
      </nav>
      <div className="client-step-nav__container__content">{children}</div>
    </div>
  )
}

export default ClientStepNav
