import React, { useState } from 'react'
import { IdentityResourceStep } from '../../../entities/common/IdentityResourcesStep'
import LocalizationUtils from '../../../utils/localization.utils'
import { Localization } from '../../../entities/common/Localization'

interface Props {
  handleStepChange: (step: IdentityResourceStep) => void
  activeStep?: IdentityResourceStep
}

const IdentityResourceStepNav: React.FC<React.PropsWithChildren<Props>> = ({
  handleStepChange,
  activeStep,
  children,
}) => {
  const [localization] = useState<Localization>(
    LocalizationUtils.getLocalization(),
  )
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
                localization.navigations['identityResourceSteps'].items[
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
                localization.navigations['identityResourceSteps'].items[
                  'claims'
                ].text
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
