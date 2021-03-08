import React from 'react'
import { Link } from 'react-router-dom'
import { MessageDescriptor, defineMessage } from 'react-intl'

import { Box, GridRow, GridColumn, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
  IntroHeader,
} from '@island.is/service-portal/core'
import { LicenseCards } from './components/LicenseCards'

function EducationLicense(): JSX.Element {
  const { formatMessage } = useLocale()
  useNamespaces('sp.education-license')

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={defineMessage({
          id: 'service.portal:education-license-title',
          defaultMessage: 'Starfsleyfi',
        })}
        intro={defineMessage({
          id: 'service.portal:education-license-intro',
          defaultMessage:
            'Hér getur þú fundið yfirlit yfir leyfisbréf og vottorð til starfsréttinda.',
        })}
        img="/assets/images/educationLicense.svg"
      />
      <LicenseCards />
    </Box>
  )
}

export default EducationLicense
