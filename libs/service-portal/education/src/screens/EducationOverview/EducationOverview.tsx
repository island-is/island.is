import React from 'react'
import {
  NavigationOverviewScreen,
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { useNamespaces } from '@island.is/localization'

export const EducationOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.education')

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
      navigation={[
        {
          title: defineMessage({
            id: 'sp.education:license-title',
            defaultMessage: 'Starfsleyfi',
          }),
          intro: defineMessage({
            id: 'sp.education:license-intro',
            defaultMessage:
              'Hér getur þú fundið yfirlit yfir leyfisbréf og vottorð til starfsréttinda.',
          }),
          image: './assets/images/education.svg',
          link: {
            title: defineMessage({
              id: 'sp.education:license-link-title',
              defaultMessage: 'Skoða starfsleyfin mín',
            }),
            href: ServicePortalPath.EducationLicense,
          },
        },
        {
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
      ]}
    />
  )
}

export default EducationOverview
