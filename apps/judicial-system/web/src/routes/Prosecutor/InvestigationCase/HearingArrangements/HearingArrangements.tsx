import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import {
  BlueBox,
  CaseInfo,
  FormContentContainer,
  FormFooter,
  Modal,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  CaseState,
  CaseTransition,
  Institution,
  NotificationType,
  UserRole,
} from '@island.is/judicial-system/types'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import {
  useCase,
  useInstitution,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  errors,
  icRequestedHearingArrangements as m,
  titles,
} from '@island.is/judicial-system-web/messages'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { Box, Input, Checkbox, Text } from '@island.is/island-ui/core'
import { isHearingArrangementsStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'
import { formatDateForServer } from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import type { User } from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'

import RequestCourtDate from '../../SharedComponents/RequestCourtDate/RequestCourtDate'
import SelectCourt from '../../SharedComponents/SelectCourt/SelectCourt'
import SelectProsecutor from '../../SharedComponents/SelectProsecutor/SelectProsecutor'

const HearingArrangements = () => {
  const router = useRouter()
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { courts } = useInstitution()
  const { formatMessage } = useIntl()
  const {
    sendNotification,
    isSendingNotification,
    sendNotificationError,
    transitionCase,
    isTransitioningCase,
    updateCase,
    setAndSendToServer,
  } = useCase()

  const { data: userData } = useQuery<{ users: User[] }>(UsersQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const [prosecutors, setProsecutors] = useState<User[]>()
  const [
    isNotificationModalVisible,
    setIsNotificationModalVisible,
  ] = useState<boolean>(false)
  const [
    isProsecutorAccessModalVisible,
    setIsProsecutorAccessModalVisible,
  ] = useState<boolean>(false)
  const [substituteProsecutor, setSubstituteProsecutor] = useState<User>()

  useEffect(() => {
    if (userData?.users && workingCase) {
      setProsecutors(
        userData.users.filter(
          (aUser: User) =>
            aUser.role === UserRole.PROSECUTOR &&
            (!workingCase.creatingProsecutor ||
              aUser.institution?.id ===
                workingCase.creatingProsecutor?.institution?.id),
        ),
      )
    }
  }, [userData, workingCase, workingCase?.creatingProsecutor?.institution?.id])

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
        router.push(`${constants.IC_POLICE_DEMANDS_ROUTE}/${workingCase.id}`)
      } else {
        setIsNotificationModalVisible(true)
      }
    } else {
      // TODO: Handle error
    }
  }

  const setProsecutor = async (prosecutor: User) => {
    if (workingCase) {
      return setAndSendToServer(
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
      setAndSendToServer(
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
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isExtension={workingCase?.parentCase && true}
    >
      <PageHeader
        title={formatMessage(
          titles.prosecutor.investigationCases.hearingArrangements,
        )}
      />
      {user && prosecutors && courts && (
        <>
          <FormContentContainer>
            <Box marginBottom={7}>
              <Text as="h1" variant="h1">
                {formatMessage(m.heading)}
              </Text>
            </Box>
            <Box component="section" marginBottom={7}>
              <CaseInfo workingCase={workingCase} userRole={user.role} />
            </Box>
            {prosecutors && (
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
                      m.sections.prosecutor.heightenSecurityLevelLabel,
                    )}
                    tooltip={formatMessage(
                      m.sections.prosecutor.heightenSecurityLevelInfo,
                    )}
                    disabled={
                      user.id !== workingCase.creatingProsecutor?.id &&
                      user.id !== workingCase.prosecutor?.id
                    }
                    checked={workingCase.isHeightenedSecurityLevel}
                    onChange={(event) =>
                      setAndSendToServer(
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
            )}
            {courts && (
              <Box component="section" marginBottom={5}>
                <SelectCourt
                  workingCase={workingCase}
                  courts={courts}
                  onChange={handleCourtChange}
                />
              </Box>
            )}
            <Box component="section" marginBottom={5}>
              <RequestCourtDate
                workingCase={workingCase}
                onChange={(date: Date | undefined, valid: boolean) => {
                  if (date && valid) {
                    setAndSendToServer(
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
                  {formatMessage(m.sections.translator.heading)}
                </Text>
              </Box>
              <Input
                data-testid="translator"
                name="translator"
                autoComplete="off"
                label={formatMessage(m.sections.translator.label)}
                placeholder={formatMessage(m.sections.translator.placeholder)}
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
              previousUrl={`${constants.IC_DEFENDANT_ROUTE}/${workingCase.id}`}
              onNextButtonClick={async () => await handleNextButtonClick()}
              nextIsDisabled={!isHearingArrangementsStepValidIC(workingCase)}
              nextIsLoading={isLoadingWorkingCase || isTransitioningCase}
            />
          </FormContentContainer>
          {isNotificationModalVisible && (
            <Modal
              title={formatMessage(m.modal.heading)}
              text={formatMessage(m.modal.text)}
              primaryButtonText={formatMessage(m.modal.primaryButtonText)}
              secondaryButtonText={formatMessage(m.modal.secondaryButtonText)}
              handleClose={() => setIsNotificationModalVisible(false)}
              handleSecondaryButtonClick={() =>
                router.push(
                  `${constants.IC_POLICE_DEMANDS_ROUTE}/${workingCase.id}`,
                )
              }
              handlePrimaryButtonClick={async () => {
                const notificationSent = await sendNotification(
                  workingCase.id,
                  NotificationType.HEADS_UP,
                )

                if (notificationSent) {
                  router.push(
                    `${constants.IC_POLICE_DEMANDS_ROUTE}/${workingCase.id}`,
                  )
                }
              }}
              isPrimaryButtonLoading={isSendingNotification}
              errorMessage={
                sendNotificationError
                  ? formatMessage(errors.sendNotification)
                  : undefined
              }
            />
          )}
          {isProsecutorAccessModalVisible && (
            <Modal
              title={formatMessage(m.prosecutorAccessModal.heading)}
              text={formatMessage(m.prosecutorAccessModal.text)}
              primaryButtonText={formatMessage(
                m.prosecutorAccessModal.primaryButtonText,
              )}
              secondaryButtonText={formatMessage(
                m.prosecutorAccessModal.secondaryButtonText,
              )}
              handlePrimaryButtonClick={async () => {
                if (substituteProsecutor) {
                  await setProsecutor(substituteProsecutor)
                  router.push(constants.CASES_ROUTE)
                }
              }}
              handleSecondaryButtonClick={() => {
                setIsProsecutorAccessModalVisible(false)
              }}
            />
          )}
        </>
      )}
    </PageLayout>
  )
}

export default HearingArrangements
