import React from 'react'
import { defineMessage } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { withClientLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/service-portal/core'
import { DegreeCards } from './components/DegreeCards'

function EducationDegree(): JSX.Element {
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
      />
      <DegreeCards />
    </Box>
  )
}

export default withClientLocale('sp.education-degree')(EducationDegree)
