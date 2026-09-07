import type { FC, PropsWithChildren } from 'react'
import { createContext, useEffect, useState } from 'react'

import { Feature } from '@island.is/judicial-system/types'
import { getFeature } from '@island.is/judicial-system-web/src/services/api'

interface FeatureProvider {
  // The features that are not hidden in this environment. Empty until the
  // first round trip completes, so it cannot tell "hidden" from "not loaded
  // yet" on its own - read it together with isLoading.
  features: Feature[]
  // True until every feature has been asked for once. Anything that must not
  // treat "not loaded yet" as "hidden" - a route guard on a deep link - waits on
  // this; anything that may appear a moment late - a menu item - need not.
  isLoading: boolean
}

const availableFeatures = Object.values(Feature)

export const FeatureContext = createContext<FeatureProvider>({
  features: [],
  isLoading: true,
})

// A feature whose request fails is treated as hidden - the safe default - so
// that loading still completes instead of leaving every consumer waiting.
const isFeatureProvided = async (feature: Feature): Promise<boolean> => {
  try {
    return await getFeature(feature)
  } catch {
    return false
  }
}

const FeatureProvider: FC<PropsWithChildren> = ({ children }) => {
  const [features, setFeatures] = useState<Feature[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let isCancelled = false

    const provideFeatures = async () => {
      const provided = await Promise.all(
        availableFeatures.map(isFeatureProvided),
      )

      if (isCancelled) {
        return
      }

      setFeatures(availableFeatures.filter((_, index) => provided[index]))
      setIsLoading(false)
    }

    provideFeatures()

    return () => {
      isCancelled = true
    }
  }, [])

  return (
    <FeatureContext.Provider value={{ features, isLoading }}>
      {children}
    </FeatureContext.Provider>
  )
}

export default FeatureProvider
