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
  const [translation] = useState<Translation>(TranslationUtils.getTranslation())
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
              {translation.navigations['clientSteps'].items['client'].text}
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
              {
                translation.navigations['clientSteps'].items[
                  'clientRedirectUri'
                ].text
              }
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
              {
                translation.navigations['clientSteps'].items[
                  'clientIdpRestrictions'
                ].text
              }
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
              {
                translation.navigations['clientSteps'].items[
                  'clientPostLogoutRedirectUri'
                ].text
              }
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
              {
                translation.navigations['clientSteps'].items[
                  'clientAllowedCorsOrigin'
                ].text
              }
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
              {
                translation.navigations['clientSteps'].items['clientGrantTypes']
                  .text
              }
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
              {
                translation.navigations['clientSteps'].items[
                  'clientAllowedScopes'
                ].text
              }
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleStepChange(ClientStep.ClientClaims)}
              className={activeStep === ClientStep.ClientClaims ? 'active' : ''}
            >
              {
                translation.navigations['clientSteps'].items['clientClaims']
                  .text
              }
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleStepChange(ClientStep.ClientSecret)}
              className={activeStep === ClientStep.ClientSecret ? 'active' : ''}
            >
              {
                translation.navigations['clientSteps'].items['clientSecret']
                  .text
              }
            </button>
          </li>
        </ul>
      </nav>
      <div className="client-step-nav__container__content">{children}</div>
    </div>
  )
}

export default ClientStepNav
