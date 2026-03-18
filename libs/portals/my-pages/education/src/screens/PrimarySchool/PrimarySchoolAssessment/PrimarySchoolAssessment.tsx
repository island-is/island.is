import {
  CardLoader,
  IntroWrapper,
  m,
  MMS_SLUG,
} from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  Accordion,
  AccordionItem,
  Box,
  Table,
  Text,
} from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { useParams } from 'react-router-dom'
import { primarySchoolMessages as psm } from '../../../lib/messages'
import { usePrimarySchoolAssessmentDataQuery } from './PrimarySchoolAssessment.generated'

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
    <IntroWrapper
      title={psm.assessmentTitle}
      intro={psm.assessmentIntro}
      serviceProviderSlug={MMS_SLUG}
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
      {subjects.length > 0 && (
        <Accordion>
          {subjects.map((subject) => (
            <AccordionItem
              key={subject?.id ?? subject?.name}
              id={subject?.id ?? subject?.name ?? ''}
              label={subject?.name ?? subject?.id ?? ''}
            >
              {subject?.assessmentTypes &&
              subject.assessmentTypes.length > 0 ? (
                subject.assessmentTypes.map((assessmentType) => {
                  const results = assessmentType?.results ?? []
                  const rows = results.flatMap((r, rIdx) =>
                    (r?.assignmentResults ?? []).map((ar, arIdx) => ({
                      key: ar?.id ?? `${rIdx}-${arIdx}`,
                      schoolYear: r?.schoolYear,
                      gradeLevel: r?.gradeLevel,
                      batchNumber: ar?.batchNumber,
                    })),
                  )
                  const hasFyrilögn = rows.some(
                    (row) => row.batchNumber != null,
                  )

                  return (
                    <Box
                      key={assessmentType?.id ?? assessmentType?.name}
                      marginBottom={3}
                    >
                      <Box marginBottom={2}>
                        <Text variant="h5">{assessmentType?.name}</Text>
                      </Box>
                      {rows.length === 0 ? (
                        <Box paddingY={2}>
                          <Problem
                            type="no_data"
                            noBorder
                            title={formatMessage(m.noData)}
                            message={formatMessage(m.noDataFoundDetail)}
                          />
                        </Box>
                      ) : (
                        <Table.Table>
                          <Table.Head>
                            <Table.Row>
                              <Table.HeadData>
                                {formatMessage(psm.schoolYear)}
                              </Table.HeadData>
                              <Table.HeadData>
                                {formatMessage(psm.gradeLevel)}
                              </Table.HeadData>
                              {hasFyrilögn && (
                                <Table.HeadData>
                                  {formatMessage(psm.examSitting)}
                                </Table.HeadData>
                              )}
                            </Table.Row>
                          </Table.Head>
                          <Table.Body>
                            {rows.map((row) => (
                              <Table.Row key={row.key}>
                                <Table.Data>{row.schoolYear ?? ''}</Table.Data>
                                <Table.Data>
                                  {row.gradeLevel != null
                                    ? `${row.gradeLevel}.`
                                    : ''}
                                </Table.Data>
                                {hasFyrilögn && (
                                  <Table.Data>
                                    {row.batchNumber ?? ''}
                                  </Table.Data>
                                )}
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table.Table>
                      )}
                    </Box>
                  )
                })
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
    </IntroWrapper>
  )
}

export default PrimarySchoolAssessment
