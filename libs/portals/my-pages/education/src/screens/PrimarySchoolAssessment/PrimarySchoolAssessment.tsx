import { CardLoader, IntroWrapper, m, MMS_SLUG } from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Accordion, AccordionItem, Box, Table } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { useParams } from 'react-router-dom'
import { primarySchoolMessages as psm } from '../../lib/messages'
import { usePrimarySchoolAssessmentSubjectsQuery } from './PrimarySchoolAssessment.generated'

export const PrimarySchoolAssessment = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const { studentId } = useParams<{ studentId: string }>()

  const { data, loading, error } = usePrimarySchoolAssessmentSubjectsQuery({
    variables: { studentId: studentId ?? '' },
    skip: !studentId,
  })

  const subjects = data?.primarySchoolAssessmentSubjects ?? []

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
              key={subject.id}
              id={subject.id}
              label={subject.name ?? subject.id}
            >
              {subject.assessmentTypes && subject.assessmentTypes.length > 0 ? (
                <Table.Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.HeadData>Heiti</Table.HeadData>
                      <Table.HeadData>Auðkenni</Table.HeadData>
                      <Table.HeadData>Tegund</Table.HeadData>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {subject.assessmentTypes.map((type) => (
                      <Table.Row key={type.id}>
                        <Table.Data>{type.name ?? ''}</Table.Data>
                        <Table.Data>{type.identifier ?? ''}</Table.Data>
                        <Table.Data>{type.testType ?? ''}</Table.Data>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Table>
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
