import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import {
  CaseState,
  CaseTransition,
  Institution,
  NotificationType,
  UserRole,
} from '@island.is/judicial-system/types'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  BlueBox,
  CaseInfo,
  FormContentContainer,
  FormFooter,
  Modal,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { Box, Input, Text, Checkbox } from '@island.is/island-ui/core'
import {
  useCase,
  useInstitution,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  errors,
  rcRequestedHearingArrangements,
  titles,
} from '@island.is/judicial-system-web/messages'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { isHearingArrangementsStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import type { User } from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'

import SelectCourt from '../../SharedComponents/SelectCourt/SelectCourt'
import ArrestDate from './ArrestDate'
import RequestCourtDate from '../../SharedComponents/RequestCourtDate/RequestCourtDate'
import SelectProsecutor from '../../SharedComponents/SelectProsecutor/SelectProsecutor'
import { formatDateForServer } from '@island.is/judicial-system-web/src/utils/hooks/useCase'

export const HearingArrangements: React.FC = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const [substituteProsecutor, setSubstituteProsecutor] = useState<User>()
  const [
    isProsecutorAccessModalVisible,
    setIsProsecutorAccessModalVisible,
  ] = useState<boolean>(false)
  const { user } = useContext(UserContext)
  const {
    sendNotification,
    isSendingNotification,
    sendNotificationError,
    transitionCase,
    isTransitioningCase,
    updateCase,
    autofill,
  } = useCase()

  const { data: userData, loading: userLoading } = useQuery(UsersQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const { courts, loading: institutionLoading } = useInstitution()

  const prosecutors = userData?.users.filter(
    (aUser: User) =>
      aUser.role === UserRole.PROSECUTOR &&
      (!workingCase?.creatingProsecutor ||
        aUser.institution?.id ===
          workingCase?.creatingProsecutor?.institution?.id),
  )

  const handleNextButtonClick = async () => {
    if (!workingCase) {
      return
    }

    const caseOpened =
      workingCase.state === CaseState.NEW
        ? await transitionCase(workingCase, CaseTransition.OPEN, setWorkingCase)
        : true

    if (caseOpened) {
      if (
        (workingCase.state !== CaseState.NEW &&
          workingCase.state !== CaseState.DRAFT) ||
        // TODO: Ignore failed notifications
        workingCase.notifications?.find(
          (notification) => notification.type === NotificationType.HEADS_UP,
        )
      ) {
        router.push(`${constants.STEP_THREE_ROUTE}/${workingCase.id}`)
      } else {
        setModalVisible(true)
      }
    } else {
      // TODO: Handle error
    }
  }

  const setProsecutor = async (prosecutor: User) => {
    if (workingCase) {
      return autofill(
        [
          {
            prosecutorId: prosecutor.id,
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )
    }
  }

  const handleCourtChange = (court: Institution) => {
    if (workingCase) {
      autofill(
        [
          {
            courtId: court.id,
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )

      return true
    }

    return false
  }

  const handleProsecutorChange = (prosecutor: User) => {
    if (!workingCase) {
      return false
    }

    const isRemovingCaseAccessFromSelf =
      user?.id !== workingCase.creatingProsecutor?.id

    if (workingCase.isHeightenedSecurityLevel && isRemovingCaseAccessFromSelf) {
      setSubstituteProsecutor(prosecutor)
      setIsProsecutorAccessModalVisible(true)

      return false
    }

    setProsecutor(prosecutor)

    return true
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.STEP_TWO}
      isLoading={isLoadingWorkingCase || userLoading || institutionLoading}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(
          titles.prosecutor.restrictionCases.hearingArrangements,
        )}
      />
      {prosecutors && !institutionLoading ? (
        <>
          <FormContentContainer>
            <Box marginBottom={7}>
              <Text as="h1" variant="h1">
                {formatMessage(rcRequestedHearingArrangements.heading)}
              </Text>
            </Box>
            <Box component="section" marginBottom={7}>
              <CaseInfo workingCase={workingCase} userRole={user?.role} />
            </Box>
            <Box component="section" marginBottom={5}>
              <BlueBox>
                <Box marginBottom={2}>
                  <SelectProsecutor
                    workingCase={workingCase}
                    prosecutors={prosecutors}
                    onChange={handleProsecutorChange}
                  />
                </Box>
                <Checkbox
                  name="isHeightenedSecurityLevel"
                  label={formatMessage(
                    rcRequestedHearingArrangements.sections.prosecutor
                      .heightenSecurityLevelLabel,
                  )}
                  tooltip={formatMessage(
                    rcRequestedHearingArrangements.sections.prosecutor
                      .heightenSecurityLevelInfo,
                  )}
                  disabled={
                    user?.id !== workingCase.creatingProsecutor?.id &&
                    user?.id !== workingCase.prosecutor?.id
                  }
                  checked={workingCase.isHeightenedSecurityLevel}
                  onChange={(event) =>
                    autofill(
                      [
                        {
                          isHeightenedSecurityLevel: event.target.checked,
                          force: true,
                        },
                      ],
                      workingCase,
                      setWorkingCase,
                    )
                  }
                  large
                  filled
                />
              </BlueBox>
            </Box>
            <Box component="section" marginBottom={5}>
              <SelectCourt
                workingCase={workingCase}
                courts={courts}
                onChange={handleCourtChange}
              />
            </Box>
            {!workingCase.parentCase && (
              <ArrestDate
                title={formatMessage(
                  rcRequestedHearingArrangements.sections.arrestDate.heading,
                )}
                workingCase={workingCase}
                setWorkingCase={setWorkingCase}
              />
            )}
            <Box component="section" marginBottom={5}>
              <RequestCourtDate
                workingCase={workingCase}
                onChange={(date: Date | undefined, valid: boolean) => {
                  if (date && valid) {
                    autofill(
                      [
                        {
                          requestedCourtDate: formatDateForServer(date),
                          force: true,
                        },
                      ],
                      workingCase,
                      setWorkingCase,
                    )
                  }
                }}
              />
            </Box>
            <Box component="section" marginBottom={10}>
              <Box marginBottom={3}>
                <Text as="h3" variant="h3">
                  {formatMessage(
                    rcRequestedHearingArrangements.sections.translator.heading,
                  )}
                </Text>
              </Box>
              <Input
                data-testid="translator"
                name="translator"
                autoComplete="off"
                label={formatMessage(
                  rcRequestedHearingArrangements.sections.translator.label,
                )}
                placeholder={formatMessage(
                  rcRequestedHearingArrangements.sections.translator
                    .placeholder,
                )}
                value={workingCase.translator || ''}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'translator',
                    event.target.value,
                    [],
                    workingCase,
                    setWorkingCase,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'translator',
                    event.target.value,
                    [],
                    workingCase,
                    updateCase,
                  )
                }
              />
            </Box>
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={`${constants.STEP_ONE_ROUTE}/${workingCase.id}`}
              onNextButtonClick={async () => await handleNextButtonClick()}
              nextIsDisabled={
                !isHearingArrangementsStepValidRC(workingCase) ||
                isTransitioningCase
              }
              nextIsLoading={isTransitioningCase}
            />
          </FormContentContainer>
          {modalVisible && (
            <Modal
              title={formatMessage(
                rcRequestedHearingArrangements.modal.heading,
              )}
              text={formatMessage(rcRequestedHearingArrangements.modal.textV2, {
                caseType: workingCase.type,
              })}
              primaryButtonText="Senda tilkynningu"
              secondaryButtonText="Halda áfram með kröfu"
              handleClose={() => setModalVisible(false)}
              handleSecondaryButtonClick={() =>
                router.push(`${constants.STEP_THREE_ROUTE}/${workingCase.id}`)
              }
              errorMessage={
                sendNotificationError
                  ? formatMessage(errors.sendNotification)
                  : undefined
              }
              handlePrimaryButtonClick={async () => {
                const notificationSent = await sendNotification(
                  workingCase.id,
                  NotificationType.HEADS_UP,
                )

                if (notificationSent) {
                  router.push(`${constants.STEP_THREE_ROUTE}/${workingCase.id}`)
                }
              }}
              isPrimaryButtonLoading={isSendingNotification}
            />
          )}
          {isProsecutorAccessModalVisible && (
            <Modal
              title={formatMessage(
                rcRequestedHearingArrangements.prosecutorAccessModal.heading,
              )}
              text={formatMessage(
                rcRequestedHearingArrangements.prosecutorAccessModal.text,
              )}
              primaryButtonText={formatMessage(
                rcRequestedHearingArrangements.prosecutorAccessModal
                  .primaryButtonText,
              )}
              secondaryButtonText={formatMessage(
                rcRequestedHearingArrangements.prosecutorAccessModal
                  .secondaryButtonText,
              )}
              handlePrimaryButtonClick={async () => {
                if (substituteProsecutor) {
                  await setProsecutor(substituteProsecutor)
                  router.push(constants.CASE_LIST_ROUTE)
                }
              }}
              handleSecondaryButtonClick={() => {
                setIsProsecutorAccessModalVisible(false)
              }}
            />
          )}
        </>
      ) : null}
    </PageLayout>
  )
}

export default HearingArrangements
