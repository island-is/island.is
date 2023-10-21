import React from 'react'
import { defineMessage } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { FootNote, IntroHeader } from '@island.is/service-portal/core'
import { DegreeCards } from './components/DegreeCards'
import { MENNTAMALASTOFNUN_ID } from '@island.is/service-portal/core'

function EducationDegree() {
  useNamespaces('sp.education-degree')

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={defineMessage({
          id: 'sp.education-degree:education-degree-title',
          defaultMessage: 'Prófskírteini',
        })}
        intro={defineMessage({
          id: 'sp.education-degree:education-degree-intro',
          defaultMessage:
            'Hér getur þú fundið yfirlit yfir prófskírteini og lokapróf á öllum námsstigum.',
        })}
        img="./assets/images/educationGrades.svg"
        serviceProviderID={MENNTAMALASTOFNUN_ID}
      />
      <DegreeCards />
      <FootNote serviceProviderID={MENNTAMALASTOFNUN_ID} />
    </Box>
  )
}

export default EducationDegree
