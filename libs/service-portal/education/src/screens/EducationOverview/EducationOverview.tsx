import React, { useEffect, useState } from 'react'
import { defineMessage } from 'react-intl'
import {
  NavigationOverviewScreen,
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { useNamespaces } from '@island.is/localization'
import { createClient } from '@island.is/feature-flags'
import { environment } from '../../environments'

const featureFlagClient = createClient({
  sdkKey: environment.featureFlagSdkKey,
})

const navigation = [
  {
    key: 'EducationLicense',
    title: defineMessage({
      id: 'sp.education:license-title',
      defaultMessage: 'Starfsleyfi',
    }),
    intro: defineMessage({
      id: 'sp.education:license-intro',
      defaultMessage:
        'Hér getur þú fundið yfirlit yfir leyfisbréf og vottorð til starfsréttinda.',
    }),
    image: './assets/images/educationLicense.svg',
    link: {
      title: defineMessage({
        id: 'sp.education:license-link-title',
        defaultMessage: 'Skoða starfsleyfin mín',
      }),
      href: ServicePortalPath.EducationLicense,
    },
  },
  {
    key: 'EducationCareer',
    title: defineMessage({
      id: 'sp.education:grades-title',
      defaultMessage: 'Námsferill',
    }),
    intro: defineMessage({
      id: 'sp.education:grades-intro',
      defaultMessage:
        'Hér getur þú fundið yfirlit yfir einkunnir, námsmat og niðurstöður úr samræmdum könnunarprófum.',
    }),
    image: './assets/images/educationGrades.svg',
    link: {
      title: defineMessage({
        id: 'sp.education:grades-link-title',
        defaultMessage: 'Skoða námsferilinn minn',
      }),
      href: ServicePortalPath.EducationCareer,
    },
  },
]

export const EducationOverview: ServicePortalModuleComponent = ({
  userInfo,
}) => {
  useNamespaces('sp.education')
  const [nav, setNav] = useState<typeof navigation>([])

  const getNav = async () => {
    const nav = await Promise.all(
      navigation.map(async (item) => {
        const capKey = item.key.charAt(0).toUpperCase() + item.key.slice(1)
        const shouldShow = await featureFlagClient.getValue(
          `isServicePortal${capKey}ModuleEnabled`,
          false,
          userInfo && userInfo.profile.sid
            ? {
                id: userInfo.profile.sid,
                attributes: {
                  nationalId: userInfo.profile.nationalId,
                },
              }
            : undefined,
        )
        return shouldShow ? item : null
      }),
    )
    return nav.filter(Boolean) as typeof navigation
  }

  useEffect(() => {
    getNav().then((res) => setNav(res))
  }, [])

  return (
    <NavigationOverviewScreen
      title={defineMessage({
        id: 'sp.education:navigation-title',
        defaultMessage: 'Menntunin mín',
      })}
      intro={defineMessage({
        id: 'sp.education:navigation-intro',
        defaultMessage: `Yfirlit yfir menntun og starfsréttindi.`,
      })}
      navigation={nav}
    />
  )
}

export default EducationOverview
