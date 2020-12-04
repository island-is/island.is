import { useQuery } from '@apollo/client'
import { Accordion, Box, Tag, Text } from '@island.is/island-ui/core'
import {
  TIME_FORMAT,
  formatDate,
  getShortRestrictionByValue,
} from '@island.is/judicial-system/formatters'
import { Case, CaseState } from '@island.is/judicial-system/types'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CaseQuery } from '../../../graphql'
import CourtRecordAccordionItem from '../../../shared-components/CourtRecordAccordionItem/CourtRecordAccordionItem'
import { FormFooter } from '../../../shared-components/FormFooter'
import InfoCard from '../../../shared-components/InfoCard/InfoCard'
import { PageLayout } from '../../../shared-components/PageLayout/PageLayout'
import PoliceRequestAccordionItem from '../../../shared-components/PoliceRequestAccordionItem/PoliceRequestAccordionItem'
import RulingAccordionItem from '../../../shared-components/RulingAccordionItem/RulingAccordionItem'
import { getRestrictionTagVariant } from '../../../utils/stepHelper'

interface CaseData {
  case?: Case
}

export const SignedVerdictOverview: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()

  const { id } = useParams<{ id: string }>()

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    document.title = 'Yfirlit staðfestrar kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data])

  /**
   * The signed verdict page can be in one of three states
   *
   * 1. Rejected
   * 2. Accepted or rejected and the custody end date is in the past
   * 3. Accpted and the custody end date is not in the past
   */
  return (
    <PageLayout
      activeSection={2}
      isLoading={loading}
      notFound={data?.case === undefined}
      isCustodyEndDateInThePast={workingCase?.isCustodyEndDateInThePast}
      rejectedCase={data?.case?.state === CaseState.REJECTED}
    >
      {workingCase ? (
        <>
          <Box marginBottom={5}>
            <Box display="flex" justifyContent="spaceBetween">
              <Box>
                <Box marginBottom={1}>
                  <Text as="h1" variant="h1">
                    {/**
                     * If the case is not rejected it must be accepted because
                     * this screen is only rendered if the case is either accepted
                     * or rejected. Here we are first handling the case where a case
                     * is rejected, then the case where a case is accepted and the
                     * custody end date is in the past and finally we assume that
                     * the case is accepted and the custody end date has not come yet.
                     */}
                    {workingCase.state === CaseState.REJECTED
                      ? 'Gæsluvarðhaldi hafnað'
                      : workingCase.isCustodyEndDateInThePast
                      ? 'Gæsluvarðhaldi lokið'
                      : 'Gæsluvarðhald virkt'}
                  </Text>
                </Box>
                <Text as="h5" variant="h5">
                  {workingCase.state === CaseState.REJECTED
                    ? `Úrskurðað ${formatDate(
                        workingCase.courtEndTime,
                        'PPP',
                      )} kl. ${formatDate(
                        workingCase.courtEndTime,
                        TIME_FORMAT,
                      )}`
                    : workingCase.isCustodyEndDateInThePast
                    ? `Gæsla rann út ${formatDate(
                        workingCase.custodyEndDate,
                        'PPP',
                      )} kl. ${formatDate(
                        workingCase.custodyEndDate,
                        TIME_FORMAT,
                      )}`
                    : `Gæsla til ${formatDate(
                        workingCase.custodyEndDate,
                        'PPP',
                      )} kl. ${formatDate(
                        workingCase.custodyEndDate,
                        TIME_FORMAT,
                      )}`}
                </Text>
              </Box>
              <Box display="flex" flexDirection="column">
                {workingCase.state === CaseState.ACCEPTED &&
                  workingCase.custodyRestrictions?.map(
                    (custodyRestriction, index) => (
                      <Box marginTop={index > 0 ? 1 : 0} key={index}>
                        <Tag
                          variant={getRestrictionTagVariant(custodyRestriction)}
                          outlined
                        >
                          {getShortRestrictionByValue(custodyRestriction)}
                        </Tag>
                      </Box>
                    ),
                  )}
              </Box>
            </Box>
          </Box>
          <Box marginBottom={5}>
            <InfoCard
              data={[
                {
                  title: 'LÖKE málsnúmer',
                  value: workingCase.policeCaseNumber,
                },
                {
                  title: 'Málsnúmer héraðsdóms',
                  value: workingCase.courtCaseNumber,
                },
                { title: 'Embætti', value: 'Lögreglan á Höfuðborgarsvæðinu' },
                { title: 'Dómstóll', value: workingCase.court },
                { title: 'Ákærandi', value: workingCase.prosecutor?.name },
                { title: 'Dómari', value: workingCase.judge?.name },
              ]}
              accusedName={workingCase.accusedName}
              accusedGender={workingCase.accusedGender}
              accusedNationalId={workingCase.accusedNationalId}
              accusedAddress={workingCase.accusedAddress}
            />
          </Box>
          <Box marginBottom={15}>
            <Accordion>
              <PoliceRequestAccordionItem workingCase={workingCase} />
              <CourtRecordAccordionItem workingCase={workingCase} />
              <RulingAccordionItem workingCase={workingCase} />
            </Accordion>
          </Box>
          <FormFooter hideNextButton />
        </>
      ) : null}
    </PageLayout>
  )
}

export default SignedVerdictOverview
