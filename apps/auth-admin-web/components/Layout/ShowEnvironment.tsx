import React, { useState, useEffect } from 'react'
import LocalizationUtils from '../../utils/localization.utils'
import { Localization } from '../../entities/common/Localization'
import { Environment } from '../../entities/common/Environment'
import { EnvironmentUtils } from './../../utils/environment.utils'

const ShowEnvironment: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [localization] = useState<Localization>(
    LocalizationUtils.getLocalization(),
  )
  const [activeEnv, setActiveEnv] = useState(Environment.LOCAL)
  useEffect(() => {
    setActiveEnv(EnvironmentUtils.getEnvironment(document.URL))
  }, [])

  return (
    <div className={`environment ${activeEnv}`}>
      <div className={`environment__title`}>
        {localization.environment[activeEnv].title}
      </div>
      <div className="environment__description">
        {localization.environment[activeEnv].description}
      </div>
      <div className="environment__help__text">
        {localization.environment[activeEnv].helpText}
      </div>
    </div>
  )
}

export default ShowEnvironment
