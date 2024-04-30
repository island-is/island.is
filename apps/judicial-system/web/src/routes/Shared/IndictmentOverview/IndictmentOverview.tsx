import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, RadioButton, toast } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  isCompletedCase,
  isDefenceUser,
  isDistrictCourtUser,
} from '@island.is/judicial-system/types'
import { core, errors, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
  IndictmentsLawsBrokenAccordionItem,
  InfoCardActiveIndictment,
  InfoCardClosedIndictment,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
  useIndictmentsLawsBroken,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import InfoCardCaseScheduled from '@island.is/judicial-system-web/src/components/InfoCard/InfoCardCaseScheduled'
import {
  CaseState,
  ServiceRequirement,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useDefendants } from '@island.is/judicial-system-web/src/utils/hooks'

import ReturnIndictmentModal from '../../Court/Indictments/ReturnIndictmentCaseModal/ReturnIndictmentCaseModal'
import { strings } from './IndictmentOverview.strings'

const IndictmentOverview = () => {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const { workingCase, isLoadingWorkingCase, caseNotFound, setWorkingCase } =
    useContext(FormContext)
  const { formatMessage } = useIntl()
  const lawsBroken = useIndictmentsLawsBroken(workingCase)
  const { updateDefendant, updateDefendantState } = useDefendants()
  const [modalVisible, setModalVisible] = useState<
    'RETURN_INDICTMENT' | 'SEND_TO_PUBLIC_PROSECUTOR'
  >()

  const caseIsClosed = isCompletedCase(workingCase.state)

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [router, workingCase.id],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={true}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={
          caseIsClosed
            ? formatMessage(titles.shared.closedCaseOverview, {
                courtCaseNumber: workingCase.courtCaseNumber,
              })
            : formatMessage(titles.court.indictments.overview)
        }
      />
      <FormContentContainer>
        <PageTitle>
          {caseIsClosed
            ? formatMessage(strings.completedTitle)
            : formatMessage(strings.inProgressTitle)}
        </PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        {workingCase.state === CaseState.RECEIVED &&
          workingCase.arraignmentDate?.date &&
          workingCase.court && (
            <Box component="section" marginBottom={5}>
              <InfoCardCaseScheduled
                court={workingCase.court}
                courtDate={workingCase.arraignmentDate.date}
                courtRoom={workingCase.arraignmentDate.location}
              />
            </Box>
          )}
        <Box component="section" marginBottom={5}>
          {caseIsClosed ? (
            <InfoCardClosedIndictment />
          ) : (
            <InfoCardActiveIndictment />
          )}
        </Box>
        {lawsBroken.size > 0 && (
          <Box marginBottom={5}>
            <IndictmentsLawsBrokenAccordionItem workingCase={workingCase} />
          </Box>
        )}
        {workingCase.caseFiles && (
          <Box component="section" marginBottom={caseIsClosed ? 5 : 10}>
            <IndictmentCaseFilesList workingCase={workingCase} />
          </Box>
        )}
        {caseIsClosed &&
          isDistrictCourtUser(user) &&
          workingCase.defendants?.map((defendant, index) => {
            return (
              <Box
                component="section"
                marginBottom={
                  workingCase.defendants &&
                  workingCase.defendants?.length - 1 === index
                    ? 10
                    : 3
                }
              >
                <BlueBox>
                  <SectionHeading
                    title={defendant.name || ''}
                    marginBottom={2}
                    heading="h4"
                    required
                  />
                  <Box marginBottom={2}>
                    <RadioButton
                      id={`defendant-${defendant.id}-service-requirement-not-applicable`}
                      name={`defendant-${defendant.id}-service-requirement`}
                      checked={
                        defendant.serviceRequirement ===
                        ServiceRequirement.NOT_APPLICABLE
                      }
                      onChange={() => {
                        updateDefendantState(
                          {
                            defendantId: defendant.id,
                            caseId: workingCase.id,
                            serviceRequirement:
                              ServiceRequirement.NOT_APPLICABLE,
                          },
                          setWorkingCase,
                        )
                      }}
                      large
                      backgroundColor="white"
                      label={formatMessage(
                        strings.serviceRequirementNotApplicable,
                      )}
                    />
                  </Box>
                  <Box marginBottom={2}>
                    <RadioButton
                      id={`defendant-${defendant.id}-service-requirement-required`}
                      name={`defendant-${defendant.id}-service-requirement`}
                      checked={
                        defendant.serviceRequirement ===
                        ServiceRequirement.REQUIRED
                      }
                      onChange={() => {
                        updateDefendantState(
                          {
                            defendantId: defendant.id,
                            caseId: workingCase.id,
                            serviceRequirement: ServiceRequirement.REQUIRED,
                          },
                          setWorkingCase,
                        )
                      }}
                      large
                      backgroundColor="white"
                      label={formatMessage(strings.serviceRequirementRequired)}
                    />
                  </Box>
                  <RadioButton
                    id={`defendant-${defendant.id}-service-requirement-not-required`}
                    name={`defendant-${defendant.id}-service-requirement`}
                    checked={
                      defendant.serviceRequirement ===
                      ServiceRequirement.NOT_REQUIRED
                    }
                    onChange={() => {
                      updateDefendantState(
                        {
                          defendantId: defendant.id,
                          caseId: workingCase.id,
                          serviceRequirement: ServiceRequirement.NOT_REQUIRED,
                        },
                        setWorkingCase,
                      )
                    }}
                    large
                    backgroundColor="white"
                    label={formatMessage(strings.serviceRequirementNotRequired)}
                  />
                </BlueBox>
              </Box>
            )
          })}
      </FormContentContainer>
      {!caseIsClosed && !isDefenceUser(user) && (
        <FormContentContainer isFooter>
          <FormFooter
            nextButtonIcon="arrowForward"
            previousUrl={`${constants.CASES_ROUTE}`}
            nextIsLoading={isLoadingWorkingCase}
            onNextButtonClick={() =>
              handleNavigationTo(
                constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE,
              )
            }
            nextButtonText={formatMessage(core.continue)}
            actionButtonText={formatMessage(strings.returnIndictmentButtonText)}
            actionButtonColorScheme={'destructive'}
            actionButtonIsDisabled={!workingCase.courtCaseNumber}
            onActionButtonClick={() => setModalVisible('RETURN_INDICTMENT')}
          />
        </FormContentContainer>
      )}
      {caseIsClosed && isDistrictCourtUser(user) && (
        <FormContentContainer isFooter>
          <FormFooter
            nextButtonIcon="arrowForward"
            previousUrl={`${constants.CASES_ROUTE}`}
            nextIsLoading={isLoadingWorkingCase}
            onNextButtonClick={async () => {
              const promises = workingCase.defendants
                ? workingCase.defendants.map(async (defendant) => {
                    const updatedDefendant = await updateDefendant({
                      caseId: workingCase.id,
                      defendantId: defendant.id,
                      serviceRequirement: defendant.serviceRequirement,
                    })

                    return updatedDefendant
                  })
                : []

              const allDefendantsUpdated = await Promise.all(promises)

              if (allDefendantsUpdated.length > 0) {
                setModalVisible('SEND_TO_PUBLIC_PROSECUTOR')
              } else {
                toast.error(formatMessage(errors.updateDefendant))
              }
            }}
            nextButtonText={formatMessage(
              strings.sendToPublicProsecutorModalNextButtonText,
            )}
          />
        </FormContentContainer>
      )}
      {isDistrictCourtUser(user) && modalVisible === 'RETURN_INDICTMENT' && (
        <ReturnIndictmentModal
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          onClose={() => setModalVisible(undefined)}
          onComplete={() => router.push(constants.CASES_ROUTE)}
        />
      )}
      {isDistrictCourtUser(user) &&
        modalVisible === 'SEND_TO_PUBLIC_PROSECUTOR' && (
          <Modal
            title={formatMessage(strings.sendToPublicProsecutorModalTitle)}
            text={formatMessage(strings.sendToPublicProsecutorModalText)}
            primaryButtonText={formatMessage(core.closeModal)}
            onPrimaryButtonClick={() => setModalVisible(undefined)}
          />
        )}
    </PageLayout>
  )
}

export default IndictmentOverview
