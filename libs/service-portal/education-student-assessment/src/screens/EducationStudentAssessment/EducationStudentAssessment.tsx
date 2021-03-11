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
import { StudentAssessmentTable } from './components/StudentAssessmentTable'

function EducationStudentAssessment(): JSX.Element {
  const { formatMessage } = useLocale()
  useNamespaces('sp.education-student-assessment')

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={defineMessage({
          id: 'service.portal:education-student-assessment-title',
          defaultMessage: 'Námsmat',
        })}
        intro={defineMessage({
          id: 'service.portal:education-student-assessment-intro',
          defaultMessage: 'Hér getur þú skoðað námsmat.',
        })}
        img="/assets/images/educationGrades.svg"
      />
      <StudentAssessmentTable />
    </Box>
  )
}

export default EducationStudentAssessment
