import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import {
  CaseState,
  CaseTransition,
  NotificationType,
  UserRole,
} from '@island.is/judicial-system/types'
import {
  ProsecutorSubsections,
  Sections,
  ReactSelectOption,
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
  setAndSendDateToServer,
  setAndSendToServer,
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

  const [substituteProsecutorId, setSubstituteProsecutorId] = useState<string>()
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
  } = useCase()

  const { data: userData, loading: userLoading } = useQuery(UsersQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const { courts, loading: institutionLoading } = useInstitution()

  const prosecutors = userData?.users
    .filter(
      (aUser: User) =>
        aUser.role === UserRole.PROSECUTOR &&
        (!workingCase?.creatingProsecutor ||
          aUser.institution?.id ===
            workingCase?.creatingProsecutor?.institution?.id),
    )
    .map((prosecutor: User, _: number) => {
      return { label: prosecutor.name, value: prosecutor.id }
    })

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

  const setProsecutor = async (prosecutorId: string) => {
    if (workingCase) {
      return setAndSendToServer(
        'prosecutorId',
        prosecutorId,
        workingCase,
        setWorkingCase,
        updateCase,
      )
    }
  }

  const handleCourtChange = (courtId: string) => {
    if (workingCase) {
      setAndSendToServer(
        'courtId',
        courtId,
        workingCase,
        setWorkingCase,
        updateCase,
      )

      return true
    }

    return false
  }

  const handleProsecutorChange = (
    selectedOption: ValueType<ReactSelectOption>,
  ) => {
    if (!workingCase) return false

    const option = selectedOption as ReactSelectOption
    const isRemovingCaseAccessFromSelf =
      user?.id !== workingCase.creatingProsecutor?.id

    if (workingCase.isHeightenedSecurityLevel && isRemovingCaseAccessFromSelf) {
      setSubstituteProsecutorId(option.value.toString())
      setIsProsecutorAccessModalVisible(true)

      return false
    } else {
      setProsecutor(option.value.toString())

      return true
    }
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
                    user?.id !==
                      (((workingCase as unknown) as { prosecutorId: string })
                        .prosecutorId ?? workingCase.prosecutor?.id)
                  }
                  checked={workingCase.isHeightenedSecurityLevel}
                  onChange={(event) =>
                    setAndSendToServer(
                      'isHeightenedSecurityLevel',
                      event.target.checked,
                      workingCase,
                      setWorkingCase,
                      updateCase,
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
                onChange={(date: Date | undefined, valid: boolean) =>
                  setAndSendDateToServer(
                    'requestedCourtDate',
                    date,
                    valid,
                    workingCase,
                    setWorkingCase,
                    updateCase,
                  )
                }
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
                if (substituteProsecutorId) {
                  await setProsecutor(substituteProsecutorId)
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
