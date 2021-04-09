import React, { useState } from 'react'
import { ApiScopeStep } from '../../../entities/common/ApiScopeStep'
import TranslationUtils from './../../../utils/translation.utils'
import { Translation } from './../../../entities/common/Translation'

interface Props {
  handleStepChange: (step: ApiScopeStep) => void
  activeStep?: ApiScopeStep
}

const IdentityResourceStepNav: React.FC<Props> = ({
  handleStepChange,
  activeStep,
  children,
}) => {
  const [translation, setTranslation] = useState<Translation>(
    TranslationUtils.getTranslation(),
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
              {translation.apiScopeSteps['apiScope'].text}
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleStepChange(ApiScopeStep.Claims)}
              className={activeStep === ApiScopeStep.Claims ? 'active' : ''}
            >
              {translation.apiScopeSteps['claims'].text}
            </button>
          </li>
        </ul>
      </nav>
      <div className="api-scope__container__content">{children}</div>
    </div>
  )
}

export default IdentityResourceStepNav
