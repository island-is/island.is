import React from 'react'
import { defineMessage } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { FootNote, m } from '@island.is/service-portal/core'
import { IntroHeader } from '@island.is/service-portal/core'
import { LicenseCards } from './components/LicenseCards'
import { ICELAND_ID } from '@island.is/service-portal/core'

function EducationLicense() {
  useNamespaces('sp.education-license')
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={m.educationLicense}
        intro={defineMessage({
          id: 'sp.education-license:education-license-intro',
          defaultMessage:
            'Hér er markmiðið að þú getir fundið yfirlit yfir leyfisbréf og vottorð til starfsréttinda. Unnið er að því að koma öllum leyfisbréfum og vottorðum um starfsréttindi á einn stað. Núna birtast leyfisbréf kennara sem hafa verið útskrifaðir frá 1988 sem sótt eru til Menntamálastofnunar.',
        })}
        serviceProviderID={ICELAND_ID}
        serviceProviderTooltip={formatMessage(m.occupationalLicenseTooltip)}
      />
      <LicenseCards />
      <FootNote serviceProviderID={ICELAND_ID} />
    </Box>
  )
}

export default EducationLicense
