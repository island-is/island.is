import { useMutation, useQuery } from '@apollo/client'
import { Accordion, Box, Button, Tag, Text } from '@island.is/island-ui/core'
import {
  TIME_FORMAT,
  formatDate,
  getShortRestrictionByValue,
} from '@island.is/judicial-system/formatters'
import {
  Case,
  CaseAppealDecision,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseType,
  UserRole,
} from '@island.is/judicial-system/types'
import React, { useContext, useEffect, useState } from 'react'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import {
  FormFooter,
  PdfButton,
  PageLayout,
  InfoCard,
  PoliceRequestAccordionItem,
  RulingAccordionItem,
  CourtRecordAccordionItem,
  FormContentContainer,
} from '@island.is/judicial-system-web/src/shared-components'
import { getRestrictionTagVariant } from '@island.is/judicial-system-web/src/utils/stepHelper'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { ExtendCaseMutation } from '@island.is/judicial-system-web/src/utils/mutations'
import AppealSection from './Components/AppealSection/AppealSection'
import { useRouter } from 'next/router'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'

interface CaseData {
  case?: Case
}

export const SignedVerdictOverview: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()

  const router = useRouter()
  const id = router.query.id
  const { user } = useContext(UserContext)
  const { updateCase } = useCase()

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const [extendCaseMutation, { loading: isCreatingExtension }] = useMutation(
    ExtendCaseMutation,
  )

  useEffect(() => {
    document.title = 'Yfirlit staðfestrar kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data])

  const handleNextButtonClick = async () => {
    if (workingCase?.childCase) {
      router.push(`${Constants.STEP_ONE_ROUTE}/${workingCase.childCase.id}`)
    } else {
      const { data } = await extendCaseMutation({
        variables: {
          input: {
            id: workingCase?.id,
          },
        },
      })

      if (data) {
        router.push(`${Constants.STEP_ONE_ROUTE}/${data.extendCase.id}`)
      }
    }
  }

  /**
   * If the case is not rejected it must be accepted because
   * this screen is only rendered if the case is either accepted
   * or rejected. Here we are first handling the case where a case
   * is rejected, then the case where a case is accepted and the
   * custody end date is in the past and then we assume that
   * the case is accepted and the custody end date has not come yet.
   * For accepted cases, we first handle the case where the judge
   * decided only accept an alternative travel ban and finally we
   * assume that the actual custody was accepted.
   */

  const titleForCase = (theCase: Case) => {
    if (theCase.decision === CaseDecision.REJECTING) {
      return 'Kröfu hafnað'
    }

    const isTravelBan =
      theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
      theCase.type === CaseType.TRAVEL_BAN

    if (theCase.isCustodyEndDateInThePast) {
      return isTravelBan ? 'Farbanni lokið' : 'Gæsluvarðhaldi lokið'
    }

    return isTravelBan ? 'Farbann virkt' : 'Gæsluvarðhald virkt'
  }

  const subtitleForCase = (theCase: Case) => {
    if (theCase.decision === CaseDecision.REJECTING) {
      return `Úrskurðað ${formatDate(
        theCase.courtEndTime,
        'PPP',
      )} kl. ${formatDate(theCase.courtEndTime, TIME_FORMAT)}`
    }

    const isTravelBan =
      theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
      theCase.type === CaseType.TRAVEL_BAN

    if (theCase.isCustodyEndDateInThePast) {
      return `${
        isTravelBan ? 'Farbann' : 'Gæsla' // ACCEPTING
      } rann út ${formatDate(theCase.custodyEndDate, 'PPP')} kl. ${formatDate(
        theCase.custodyEndDate,
        TIME_FORMAT,
      )}`
    }

    return `${
      theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
        ? 'Farbann'
        : 'Gæsla' // ACCEPTING
    } til ${formatDate(theCase.custodyEndDate, 'PPP')} kl. ${formatDate(
      theCase.custodyEndDate,
      TIME_FORMAT,
    )}`
  }

  const getInfoText = (workingCase: Case): string | undefined => {
    if (user?.role !== UserRole.PROSECUTOR) {
      // Only prosecutors should see the explanation.
      return undefined
    } else if (workingCase.decision === CaseDecision.REJECTING) {
      return `Ekki hægt að framlengja ${
        workingCase.type === CaseType.CUSTODY ? 'gæsluvarðhald' : 'farbann'
      } sem var hafnað.`
    } else if (
      workingCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
    ) {
      return 'Ekki hægt að framlengja kröfu þegar dómari hefur úrskurðað um annað en dómkröfur sögðu til um.'
    } else if (workingCase.childCase) {
      return 'Framlengingarkrafa hefur þegar verið útbúin.'
    } else if (workingCase.isCustodyEndDateInThePast) {
      // This must be after the rejected and alternatice decision cases as the custody
      // end date only applies to cases that were accepted by the judge. This must also
      // be after the already extended case as the custody end date may expire after
      // the case has been extended.
      return `Ekki hægt að framlengja ${
        workingCase.type === CaseType.CUSTODY ? 'gæsluvarðhald' : 'farbann'
      } sem er lokið.`
    } else {
      return undefined
    }
  }

  const handleAccusedAppeal = () => {
    if (workingCase) {
      setWorkingCase({
        ...workingCase,
        accusedAppealDecision: CaseAppealDecision.APPEAL,
      })

      updateCase(
        workingCase.id,
        parseString('accusedAppealDecision', CaseAppealDecision.APPEAL),
      )
    }
  }

  const handleProsecutorAppeal = () => {
    if (workingCase) {
      setWorkingCase({
        ...workingCase,
        prosecutorAppealDecision: CaseAppealDecision.APPEAL,
      })

      updateCase(
        workingCase.id,
        parseString('prosecutorAppealDecision', CaseAppealDecision.APPEAL),
      )
    }
  }

  /**
   * We assume that the signed verdict page is only opened for
   * cases in state REJECTED or ACCEPTED.
   *
   * Based on the judge's decision the signed verdict page can
   * be in one of five states:
   *
   * 1. Rejected
   *    - state === REJECTED and decision === REJECTING
   * 2. Alternative travel ban accepted and the travel ban end date is in the past
   *    - state === ACCEPTED and decision === ACCEPTING_ALTERNATIVE_TRAVEL_BAN and custodyEndDate < today
   * 3. Accepted and the custody end date is in the past
   *    - state === ACCEPTED and decision === ACCEPTING and custodyEndDate < today
   * 5. Alternative travel ban accepted and the travel ban end date is not in the past
   *    - state === ACCEPTED and decision === ACCEPTING_ALTERNATIVE_TRAVEL_BAN and custodyEndDate > today
   * 3. Accepted and the custody end date is not in the past
   *    - state === ACCEPTED and decision === ACCEPTING and custodyEndDate > today
   */
  return (
    <PageLayout
      activeSection={2}
      isLoading={loading}
      notFound={data?.case === undefined}
      isCustodyEndDateInThePast={workingCase?.isCustodyEndDateInThePast}
      decision={data?.case?.decision}
      caseType={workingCase?.type}
    >
      {workingCase ? (
        <>
          <FormContentContainer>
            <Box marginBottom={5}>
              <Box marginBottom={3}>
                <Button
                  variant="text"
                  preTextIcon="arrowBack"
                  onClick={() => router.push(Constants.REQUEST_LIST_ROUTE)}
                >
                  Til baka
                </Button>
              </Box>
              <Box display="flex" justifyContent="spaceBetween">
                <Box>
                  <Box marginBottom={1}>
                    <Text as="h1" variant="h1">
                      {titleForCase(workingCase)}
                    </Text>
                  </Box>
                  <Text as="h5" variant="h5">
                    {subtitleForCase(workingCase)}
                  </Text>
                </Box>
                <Box display="flex" flexDirection="column">
                  {
                    // Custody restrictions
                    workingCase.decision === CaseDecision.ACCEPTING &&
                      workingCase.type === CaseType.CUSTODY &&
                      workingCase.custodyRestrictions
                        ?.filter((restriction) =>
                          [
                            CaseCustodyRestrictions.ISOLATION,
                            CaseCustodyRestrictions.VISITAION,
                            CaseCustodyRestrictions.COMMUNICATION,
                            CaseCustodyRestrictions.MEDIA,
                          ].includes(restriction),
                        )
                        ?.map((custodyRestriction, index) => (
                          <Box marginTop={index > 0 ? 1 : 0} key={index}>
                            <Tag
                              variant={getRestrictionTagVariant(
                                custodyRestriction,
                              )}
                              outlined
                              disabled
                            >
                              {getShortRestrictionByValue(custodyRestriction)}
                            </Tag>
                          </Box>
                        ))
                  }
                  {
                    // Alternative travel ban restrictions
                    (workingCase.decision ===
                      CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
                      (CaseType.TRAVEL_BAN &&
                        workingCase.decision === CaseDecision.ACCEPTING)) &&
                      workingCase.custodyRestrictions
                        ?.filter((restriction) =>
                          [
                            CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
                            CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT,
                          ].includes(restriction),
                        )
                        ?.map((custodyRestriction, index) => (
                          <Box marginTop={index > 0 ? 1 : 0} key={index}>
                            <Tag
                              variant={getRestrictionTagVariant(
                                custodyRestriction,
                              )}
                              outlined
                              disabled
                            >
                              {getShortRestrictionByValue(custodyRestriction)}
                            </Tag>
                          </Box>
                        ))
                  }
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
                  {
                    title: 'Embætti',
                    value: `${
                      workingCase.prosecutor?.institution?.name || 'Ekki skráð'
                    }`,
                  },
                  { title: 'Dómstóll', value: workingCase.court },
                  { title: 'Ákærandi', value: workingCase.prosecutor?.name },
                  { title: 'Dómari', value: workingCase.judge?.name },
                ]}
                accusedName={workingCase.accusedName}
                accusedNationalId={workingCase.accusedNationalId}
                accusedAddress={workingCase.accusedAddress}
                defender={{
                  name: workingCase.defenderName || '',
                  email: workingCase.defenderEmail,
                }}
              />
            </Box>
            {/* {workingCase.isCaseAppealable && ( */}
            <Box marginBottom={9}>
              {workingCase.rulingDate && workingCase.accusedGender && (
                <AppealSection
                  rulingDate={workingCase.rulingDate}
                  accusedGender={workingCase.accusedGender}
                  accusedCanAppeal={
                    workingCase.accusedAppealDecision ===
                    CaseAppealDecision.POSTPONE
                  }
                  prosecutorCanAppeal={
                    workingCase.prosecutorAppealDecision ===
                    CaseAppealDecision.POSTPONE
                  }
                  handleAccusedAppeal={handleAccusedAppeal}
                  handleProsecutorAppeal={handleProsecutorAppeal}
                />
              )}
            </Box>
            {/* )} */}
            <Box marginBottom={5}>
              <Accordion>
                <PoliceRequestAccordionItem workingCase={workingCase} />
                <CourtRecordAccordionItem workingCase={workingCase} />
                <RulingAccordionItem workingCase={workingCase} />
              </Accordion>
            </Box>
            <Box marginBottom={15}>
              <Box marginBottom={3}>
                <PdfButton
                  caseId={workingCase.id}
                  title="Opna PDF kröfu"
                  pdfType="request"
                />
              </Box>
              <PdfButton
                caseId={workingCase.id}
                title="Opna PDF þingbók og úrskurð"
                pdfType="ruling"
              />
            </Box>
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={Constants.REQUEST_LIST_ROUTE}
              hideNextButton={
                user?.role !== UserRole.PROSECUTOR ||
                workingCase.decision ===
                  CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
                workingCase.decision === CaseDecision.REJECTING ||
                workingCase.isCustodyEndDateInThePast ||
                (workingCase.childCase && true)
              }
              nextButtonText={`Framlengja ${
                workingCase.type === CaseType.CUSTODY ? 'gæslu' : 'farbann'
              }`}
              onNextButtonClick={() => handleNextButtonClick()}
              nextIsLoading={isCreatingExtension}
              infoBoxText={getInfoText(workingCase)}
            />
          </FormContentContainer>
        </>
      ) : null}
    </PageLayout>
  )
}

export default SignedVerdictOverview
