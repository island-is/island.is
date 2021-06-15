import React from 'react'
import { defineMessage } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { IntroHeader } from '@island.is/service-portal/core'
import { CareerCards } from './components/CareerCards'

function EducationCareer(): JSX.Element {
  useNamespaces('sp.education-career')

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={defineMessage({
          id: 'service.portal:education-career-title',
          defaultMessage: 'Námsferill',
        })}
        intro={defineMessage({
          id: 'service.portal:education-career-intro',
          defaultMessage: 'Hér getur þú fundið yfirlit yfir námsmat.',
        })}
        img="./assets/images/educationGrades.svg"
      />
      <CareerCards />
    </Box>
  )
}

export default EducationCareer
