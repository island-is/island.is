import {
  CardLoader,
  IntroWrapperV2,
  m,
  MMS_SLUG,
} from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Accordion, AccordionItem, Box } from '@island.is/island-ui/core'
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

  const assessmentHistory = data?.primarySchoolStudent?.assessmentHistory ?? []

  return (
    <IntroWrapperV2
      title={psm.assessmentTitle}
      intro={psm.assessmentIntro}
      serviceProvider={{ slug: MMS_SLUG, tooltip: formatMessage(m.mmsTooltip) }}
    >
      {loading && !error && <CardLoader />}
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!loading && !error && !assessmentHistory.length && (
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
      {!loading && !error && assessmentHistory.length > 1 && (
        <Accordion dividerOnTop={false} dividerOnBottom={false}>
          {assessmentHistory.map((assessment) => {
            if (!assessment.id) return null
            return (
              <AccordionItem
                key={assessment.id}
                id={assessment.id}
                label={assessment.name ?? ''}
              >
                <AssessmentTable
                  results={assessment.resultHistory ?? []}
                />
              </AccordionItem>
            )
          })}
        </Accordion>
      )}
      {!loading && !error && assessmentHistory.length === 1 && (
        <AssessmentTable results={assessmentHistory[0]?.resultHistory ?? []} />
      )}
    </IntroWrapperV2>
  )
}

export default PrimarySchoolAssessment
