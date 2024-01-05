import React, { useState } from 'react'
import { ClientStep } from '../../../entities/common/ClientStep'
import LocalizationUtils from '../../../utils/localization.utils'
import { Localization } from '../../../entities/common/Localization'

interface Props {
  handleStepChange: (step: ClientStep) => void
  activeStep?: ClientStep
}

const ClientStepNav: React.FC<React.PropsWithChildren<Props>> = ({
  handleStepChange,
  activeStep,
  children,
}) => {
  const [localization] = useState<Localization>(
    LocalizationUtils.getLocalization(),
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
              {localization.navigations['clientSteps'].items['client'].text}
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
                localization.navigations['clientSteps'].items[
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
                localization.navigations['clientSteps'].items[
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
                localization.navigations['clientSteps'].items[
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
                localization.navigations['clientSteps'].items[
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
                localization.navigations['clientSteps'].items[
                  'clientGrantTypes'
                ].text
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
                localization.navigations['clientSteps'].items[
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
                localization.navigations['clientSteps'].items['clientClaims']
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
                localization.navigations['clientSteps'].items['clientSecret']
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
