import {
  CardLoader,
  IntroWrapperV2,
  m,
  MMS_SLUG,
  formSubmit,
} from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  Table,
  Text,
} from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { useParams } from 'react-router-dom'
import { primarySchoolMessages as psm } from '../../../lib/messages'
import { usePrimarySchoolAssessmentDataQuery } from './PrimarySchoolAssessment.generated'
import { AssessmentTable } from './AssessmentTable'

export const PrimarySchoolAssessment = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const { studentId } = useParams<{ studentId: string }>()

  const { data, loading, error } = usePrimarySchoolAssessmentDataQuery({
    variables: { studentId: studentId ?? '' },
    skip: !studentId,
  })

  const subjects = data?.primarySchoolStudent?.assessmentSubjects ?? []

  return (
    <IntroWrapperV2
      title={psm.assessmentTitle}
      intro={psm.assessmentIntro}
      serviceProvider={{ slug: MMS_SLUG, tooltip: formatMessage(m.mmsTooltip) }}
    >
      {loading && !error && <CardLoader />}
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!loading && !error && !subjects.length && (
        <Box marginTop={8}>
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(m.noData)}
            message={formatMessage(m.noDataFoundDetail)}
            imgSrc="./assets/images/sofa.svg"
          />
        </Box>
      )}
      {subjects.length > 1 && studentId !== undefined && (
        <Accordion dividerOnTop={false} dividerOnBottom={false}>
          {subjects.map((subject) => (
            <AccordionItem
              key={subject?.id ?? subject?.name}
              id={subject?.id ?? subject?.name ?? ''}
              label={subject?.name ?? subject?.id ?? ''}
            >
              {subject?.assessmentTypes &&
              subject.assessmentTypes.length > 0 ? (
                subject.assessmentTypes.map((assessmentType) => (
                  <AssessmentTable
                    assessment={assessmentType}
                    studentId={studentId}
                  />
                ))
              ) : (
                <Box paddingY={2}>
                  <Problem
                    type="no_data"
                    noBorder
                    title={formatMessage(m.noData)}
                    message={formatMessage(m.noDataFoundDetail)}
                  />
                </Box>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      )}
      {subjects.length === 1 &&
        studentId !== undefined &&
        subjects[0]?.assessmentTypes?.[0] && (
          <AssessmentTable
            assessment={subjects[0].assessmentTypes[0]}
            studentId={studentId}
          />
        )}
    </IntroWrapperV2>
  )
}

export default PrimarySchoolAssessment
