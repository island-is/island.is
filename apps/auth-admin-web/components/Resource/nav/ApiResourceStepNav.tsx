import React, { useState } from 'react'
import { ApiResourceStep } from '../../../entities/common/ApiResourceStep'
import LocalizationUtils from '../../../utils/localization.utils'
import { Localization } from '../../../entities/common/Localization'

interface Props {
  handleStepChange: (step: ApiResourceStep) => void
  activeStep: ApiResourceStep
}

const ApiResourceStepNav: React.FC<React.PropsWithChildren<Props>> = ({
  handleStepChange,
  activeStep,
  children,
}) => {
  const [localization] = useState<Localization>(
    LocalizationUtils.getLocalization(),
  )

  return (
    <div>
      <nav className="api-resource-step-nav">
        <ul>
          <li>
            <button
              type="button"
              onClick={() =>
                handleStepChange(ApiResourceStep.ApiResourceBasics)
              }
              className={
                activeStep === ApiResourceStep.ApiResourceBasics ? 'active' : ''
              }
            >
              {
                localization.navigations['apiResourceSteps'].items[
                  'apiResourceBasics'
                ].text
              }
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() =>
                handleStepChange(ApiResourceStep.ApiResourceScopes)
              }
              className={
                activeStep === ApiResourceStep.ApiResourceScopes ? 'active' : ''
              }
            >
              {
                localization.navigations['apiResourceSteps'].items[
                  'apiResourceScopes'
                ].text
              }
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() =>
                handleStepChange(ApiResourceStep.ApiResourceSecrets)
              }
              className={
                activeStep === ApiResourceStep.ApiResourceSecrets
                  ? 'active'
                  : ''
              }
            >
              {
                localization.navigations['apiResourceSteps'].items[
                  'apiResourceSecrets'
                ].text
              }
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() =>
                handleStepChange(ApiResourceStep.ApiResourceUserClaims)
              }
              className={
                activeStep === ApiResourceStep.ApiResourceUserClaims
                  ? 'active'
                  : ''
              }
            >
              {
                localization.navigations['apiResourceSteps'].items[
                  'apiResourceUserClaims'
                ].text
              }
            </button>
          </li>
        </ul>
      </nav>
      <div className="api-resource__container__content">{children}</div>
    </div>
  )
}

export default ApiResourceStepNav
