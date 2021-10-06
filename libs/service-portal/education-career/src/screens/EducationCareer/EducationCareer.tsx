import React from 'react'
import { defineMessage } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { IntroHeader, m } from '@island.is/service-portal/core'
import { CareerCards } from './components/CareerCards'

function EducationCareer(): JSX.Element {
  useNamespaces('sp.education-career')

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={m.educationCareer}
        intro={defineMessage({
          id: 'sp.education-career:education-career-intro',
          defaultMessage: 'Hér getur þú fundið yfirlit yfir námsmat.',
          description: 'education career intro',
        })}
        img="./assets/images/educationGrades.svg"
      />
      <CareerCards />
    </Box>
  )
}

export default EducationCareer
