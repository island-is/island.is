import React, { useState } from 'react'
import { ApiScopeStep } from '../../../entities/common/ApiScopeStep'
import LocalizationUtils from '../../../utils/localization.utils'
import { Localization } from '../../../entities/common/Localization'

interface Props {
  handleStepChange: (step: ApiScopeStep) => void
  activeStep?: ApiScopeStep
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
      <nav className="api-scope-step-nav">
        <ul>
          <li>
            <button
              type="button"
              onClick={() => handleStepChange(ApiScopeStep.ApiScope)}
              className={activeStep === ApiScopeStep.ApiScope ? 'active' : ''}
            >
              {localization.navigations['apiScopeSteps'].items['apiScope'].text}
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleStepChange(ApiScopeStep.Claims)}
              className={activeStep === ApiScopeStep.Claims ? 'active' : ''}
            >
              {localization.navigations['apiScopeSteps'].items['claims'].text}
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleStepChange(ApiScopeStep.ApiResource)}
              className={
                activeStep === ApiScopeStep.ApiResource ? 'active' : ''
              }
            >
              {
                localization.navigations['apiScopeSteps'].items['apiResource']
                  .text
              }
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() =>
                handleStepChange(ApiScopeStep.PersonalRepresentativePermissions)
              }
              className={
                activeStep === ApiScopeStep.PersonalRepresentativePermissions
                  ? 'active'
                  : ''
              }
            >
              {
                localization.navigations['apiScopeSteps'].items[
                  'personalRepresentativePermissions'
                ].text
              }
            </button>
          </li>
        </ul>
      </nav>
      <div className="api-scope__container__content">{children}</div>
    </div>
  )
}

export default IdentityResourceStepNav
