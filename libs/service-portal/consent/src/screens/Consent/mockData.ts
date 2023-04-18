import React, { useState } from 'react'

interface MData {
  tenant: string
  client: string
  items: {
    provider: string
    providerLogo: string
    permissions: {
      title: string
      description: string
      hasConsent: boolean
    }[]
  }[]
}

export const mock: MData[] = [
  {
    tenant: 'Reykjavíkurborg',
    client: 'Mínar síður Reykjavíkurborgar',
    items: [
      {
        provider: 'Ísland.is',
        providerLogo: 'Ísland.is',
        permissions: [
          {
            title: 'Netfang',
            description: 'Netfang þitt á Ísland.is',
            hasConsent: false,
          },
          {
            title: 'Sími',
            description:
              'Símanúmer þitt á Ísland.is ásamt símanúmerinu sem var notað til að auðkenna þig með rafrænu skilríki.',
            hasConsent: true,
          },
        ],
      },
      {
        provider: 'Annað',
        providerLogo: 'Ísland.is',
        permissions: [
          {
            title: 'Netfang',
            description: 'Netfang þitt á Ísland.is',
            hasConsent: false,
          },
          {
            title: 'Sími',
            description:
              'Símanúmer þitt á Ísland.is ásamt símanúmerinu sem var notað til að auðkenna þig með rafrænu skilríki.',
            hasConsent: true,
          },
        ],
      },
    ],
  },
  {
    tenant: 'Skatturinn',
    client: 'Mínar síður RSK',
    items: [
      {
        provider: 'Stafraent Ísland',
        providerLogo: 'Stafraent Ísland',
        permissions: [
          {
            title: 'Sími',
            description:
              'Símanúmer þitt á Ísland.is ásamt símanúmerinu sem var notað til að auðkenna þig með rafrænu skilríki.',
            hasConsent: true,
          },
        ],
      },
    ],
  },
  {
    tenant: 'Skatturinn?',
    client: 'Mínar síður RSK',
    items: [
      {
        provider: 'Stafraent Ísland',
        providerLogo: 'Stafraent Ísland',
        permissions: [
          {
            title: 'Sími',
            description:
              'Símanúmer þitt á Ísland.is ásamt símanúmerinu sem var notað til að auðkenna þig með rafrænu skilríki.',
            hasConsent: true,
          },
        ],
      },
    ],
  },
]

interface MockData<T> {
  data: T | undefined
  isLoading: boolean
}

export function useMockData<T>(mock: T, time: number): MockData<T> {
  const [isLoaded, setIsLoaded] = useState(false)
  const hasStarted = React.useRef(false)

  if (!hasStarted.current) {
    hasStarted.current = true
    setTimeout(() => {
      setIsLoaded(true)
    }, time)
  }

  return isLoaded
    ? { data: mock, isLoading: false }
    : { data: undefined, isLoading: true }
}
