import React, { useState } from 'react'
import { IdentityResourceStep } from '../../../entities/common/IdentityResourcesStep'
import TranslationUtils from './../../../utils/translation.utils'
import { Translation } from './../../../entities/common/Translation'

interface Props {
  handleStepChange: (step: IdentityResourceStep) => void
  activeStep?: IdentityResourceStep
}

const IdentityResourceStepNav: React.FC<Props> = ({
  handleStepChange,
  activeStep,
  children,
}) => {
  const [translation] = useState<Translation>(TranslationUtils.getTranslation())
  return (
    <div>
      <nav className="identity-resource-step-nav">
        <ul>
          <li>
            <button
              type="button"
              onClick={() =>
                handleStepChange(IdentityResourceStep.IdentityResource)
              }
              className={
                activeStep === IdentityResourceStep.IdentityResource
                  ? 'active'
                  : ''
              }
            >
              {
                translation.navigations['identityResourceSteps'].items[
                  'identityResource'
                ].text
              }
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleStepChange(IdentityResourceStep.Claims)}
              className={
                activeStep === IdentityResourceStep.Claims ? 'active' : ''
              }
            >
              {
                translation.navigations['identityResourceSteps'].items['claims']
                  .text
              }
            </button>
          </li>
        </ul>
      </nav>
      <div className="identity-resource__container__content">{children}</div>
    </div>
  )
}

export default IdentityResourceStepNav
