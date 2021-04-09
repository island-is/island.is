import React, { useState } from 'react'
import { ClientStep } from '../../../entities/common/ClientStep'
import TranslationUtils from './../../../utils/translation.utils'
import { Translation } from './../../../entities/common/Translation'

interface Props {
  handleStepChange: (step: ClientStep) => void
  activeStep?: ClientStep
}

const ClientStepNav: React.FC<Props> = ({
  handleStepChange,
  activeStep,
  children,
}) => {
  const [translation, setTranslation] = useState<Translation>(
    TranslationUtils.getTranslation(),
  )
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
              {translation.clientSteps['client'].text}
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
              {translation.clientSteps['clientRedirectUri'].text}
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
              {translation.clientSteps['clientIdpRestrictions'].text}
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
              {translation.clientSteps['clientPostLogoutRedirectUri'].text}
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
              {translation.clientSteps['clientAllowedCorsOrigin'].text}
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
              {translation.clientSteps['clientGrantTypes'].text}
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
              {translation.clientSteps['clientAllowedScopes'].text}
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleStepChange(ClientStep.ClientClaims)}
              className={activeStep === ClientStep.ClientClaims ? 'active' : ''}
            >
              {translation.clientSteps['clientClaims'].text}
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleStepChange(ClientStep.ClientSecret)}
              className={activeStep === ClientStep.ClientSecret ? 'active' : ''}
            >
              {translation.clientSteps['clientSecret'].text}
            </button>
          </li>
        </ul>
      </nav>
      <div className="client-step-nav__container__content">{children}</div>
    </div>
  )
}

export default ClientStepNav
