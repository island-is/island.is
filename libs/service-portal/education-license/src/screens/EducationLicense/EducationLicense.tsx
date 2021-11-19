import React from 'react'
import { defineMessage } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { IntroHeader } from '@island.is/service-portal/core'
import { LicenseCards } from './components/LicenseCards'

function EducationLicense(): JSX.Element {
  useNamespaces('sp.education-license')

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={m.educationLicense}
        intro={defineMessage({
          id: 'sp.education-license:education-license-intro',
          defaultMessage:
            'Hér getur þú fundið yfirlit yfir leyfisbréf og vottorð til starfsréttinda.',
        })}
      />
      <LicenseCards />
    </Box>
  )
}

export default EducationLicense
