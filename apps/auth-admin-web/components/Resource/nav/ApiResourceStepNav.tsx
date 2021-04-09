import React, { useState } from 'react'
import { ApiResourceStep } from '../../../entities/common/ApiResourceStep'
import TranslationUtils from './../../../utils/translation.utils'
import { Translation } from './../../../entities/common/Translation'

interface Props {
  handleStepChange: (step: ApiResourceStep) => void
  activeStep: ApiResourceStep
}

const ApiResourceStepNav: React.FC<Props> = ({
  handleStepChange,
  activeStep,
  children,
}) => {
  const [translation, setTranslation] = useState<Translation>(
    TranslationUtils.getTranslation(),
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
              {translation.apiResourceSteps['apiResourceBasics'].text}
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
              {translation.apiResourceSteps['apiResourceScopes'].text}
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
              {translation.apiResourceSteps['apiResourceSecrets'].text}
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
              {translation.apiResourceSteps['apiResourceUserClaims'].text}
            </button>
          </li>
        </ul>
      </nav>
      <div className="api-resource__container__content">{children}</div>
    </div>
  )
}

export default ApiResourceStepNav
