import React, { createContext, useEffect, useState } from 'react'

import { Feature } from '@island.is/judicial-system/types'
import { getFeature } from '@island.is/judicial-system-web/src/services/api'

interface FeatureProvider {
  features: Feature[]
}

const availableFeatures = Object.values(Feature)

export const FeatureContext = createContext<FeatureProvider>({ features: [] })

const FeatureProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [features, setFeatures] = useState<Feature[]>([])

  useEffect(() => {
    const tryToProvideFeatures = async () => {
      let providedFeatures: Feature[] = []

      for (let i = 0; i < availableFeatures.length; i++) {
        const shouldProvide = await getFeature(availableFeatures[i])
        if (shouldProvide) {
          providedFeatures = [...providedFeatures, availableFeatures[i]]
        }
      }

      setFeatures(providedFeatures)
    }

    tryToProvideFeatures()
  }, [setFeatures])

  return (
    <FeatureContext.Provider value={{ features }}>
      {children}
    </FeatureContext.Provider>
  )
}

export default FeatureProvider
