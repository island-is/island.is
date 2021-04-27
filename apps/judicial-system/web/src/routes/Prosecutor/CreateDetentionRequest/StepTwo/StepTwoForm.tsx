import React from 'react'
import {
  Case,
  CaseType,
  NotificationType,
} from '@island.is/judicial-system/types'
import { Box, Select, Text, Tooltip } from '@island.is/island-ui/core'
import {
  newSetAndSendDateToServer,
  setAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { ValueType } from 'react-select'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import {
  DateTime,
  FormContentContainer,
  FormFooter,
  Modal,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { NextRouter } from 'next/router'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  prosecutors: ReactSelectOption[]
  defaultProsecutor: ReactSelectOption
  courts: ReactSelectOption[]
  defaultCourt: ReactSelectOption[]
  arrestDateIsValid: boolean
  setArrestDateIsValid: React.Dispatch<React.SetStateAction<boolean>>
  requestedCourtDateIsValid: boolean
  setRequestedCourtDateIsValid: React.Dispatch<React.SetStateAction<boolean>>
  handleNextButtonClick: () => Promise<void>
  transitionLoading: boolean
  modalVisible: boolean
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  router: NextRouter
  sendNotification: (
    id: string,
    notificationType: NotificationType,
  ) => Promise<any>
  isSendingNotification: boolean
}

const StepTwoForm: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    prosecutors,
    defaultProsecutor,
    courts,
    defaultCourt,
    arrestDateIsValid,
    setArrestDateIsValid,
    requestedCourtDateIsValid,
    setRequestedCourtDateIsValid,
    handleNextButtonClick,
    transitionLoading,
    modalVisible,
    setModalVisible,
    router,
    sendNotification,
    isSendingNotification,
  } = props

  const { updateCase } = useCase()

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Óskir um fyrirtöku
          </Text>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              Ákærandi{' '}
              <Box component="span" data-testid="prosecutor-tooltip">
                <Tooltip text="Sá saksóknari sem valinn er hér er skráður fyrir kröfunni í öllum upplýsingaskeytum og skjölum sem tengjast kröfunni, og flytur málið fyrir dómstólum fyrir hönd síns embættis." />
              </Box>
            </Text>
          </Box>
          <Select
            name="prosecutor"
            label="Veldu saksóknara"
            defaultValue={defaultProsecutor}
            options={prosecutors}
            onChange={(selectedOption: ValueType<ReactSelectOption>) =>
              setAndSendToServer(
                'prosecutorId',
                (selectedOption as ReactSelectOption).value.toString(),
                workingCase,
                setWorkingCase,
                updateCase,
              )
            }
            required
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              Dómstóll
            </Text>
          </Box>
          <Select
            name="court"
            label="Veldu dómstól"
            defaultValue={{
              label:
                defaultCourt.length > 0
                  ? defaultCourt[0].label
                  : courts[0].label,
              value:
                defaultCourt.length > 0
                  ? defaultCourt[0].value
                  : courts[0].value,
            }}
            options={courts}
            onChange={(selectedOption: ValueType<ReactSelectOption>) =>
              setAndSendToServer(
                'court',
                (selectedOption as ReactSelectOption).label,
                workingCase,
                setWorkingCase,
                updateCase,
              )
            }
          />
        </Box>
        {!workingCase.parentCase && (
          <Box component="section" marginBottom={5}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                Tími handtöku
              </Text>
            </Box>
            <DateTime
              name="arrestDate"
              selectedDate={
                workingCase.arrestDate
                  ? new Date(workingCase.arrestDate)
                  : undefined
              }
              onChange={(date: Date | undefined, valid: boolean) => {
                newSetAndSendDateToServer(
                  'arrestDate',
                  date,
                  valid,
                  workingCase,
                  setWorkingCase,
                  setArrestDateIsValid,
                  updateCase,
                )
              }}
            />
          </Box>
        )}
        <Box component="section" marginBottom={10}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              Ósk um fyrirtökudag og tíma{' '}
              <Box data-testid="requested-court-date-tooltip" component="span">
                <Tooltip text="Dómstóll hefur þennan tíma til hliðsjónar þegar fyrirtökutíma er úthlutað og mun leitast við að taka málið fyrir í tæka tíð en ekki fyrir þennan tíma." />
              </Box>
            </Text>
          </Box>
          <DateTime
            name="reqCourtDate"
            selectedDate={
              workingCase.requestedCourtDate
                ? new Date(workingCase.requestedCourtDate)
                : undefined
            }
            onChange={(date: Date | undefined, valid: boolean) =>
              newSetAndSendDateToServer(
                'requestedCourtDate',
                date,
                valid,
                workingCase,
                setWorkingCase,
                setRequestedCourtDateIsValid,
                updateCase,
              )
            }
            timeLabel="Ósk um tíma (kk:mm)"
            locked={workingCase.courtDate !== null}
            minDate={new Date()}
            required
          />
          {workingCase.courtDate && (
            <Box marginTop={1}>
              <Text variant="eyebrow">
                Fyrirtökudegi og tíma hefur verið úthlutað
              </Text>
            </Box>
          )}
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.STEP_ONE_ROUTE}/${workingCase.id}`}
          onNextButtonClick={async () => await handleNextButtonClick()}
          nextIsDisabled={
            transitionLoading ||
            !arrestDateIsValid ||
            !requestedCourtDateIsValid
          }
          nextIsLoading={transitionLoading}
        />
      </FormContentContainer>
      {modalVisible && (
        <Modal
          title="Viltu senda tilkynningu?"
          text={`Með því að senda tilkynningu á dómara á vakt um að krafa um ${
            workingCase.type === CaseType.CUSTODY ? 'gæsluvarðhald' : 'farbann'
          } sé í vinnslu flýtir það fyrir málsmeðferð og allir aðilar eru upplýstir um stöðu mála.`}
          primaryButtonText="Senda tilkynningu"
          secondaryButtonText="Halda áfram með kröfu"
          handleClose={() => setModalVisible(false)}
          handleSecondaryButtonClick={() =>
            router.push(`${Constants.STEP_THREE_ROUTE}/${workingCase.id}`)
          }
          handlePrimaryButtonClick={async () => {
            const notificationSent = await sendNotification(
              workingCase.id,
              NotificationType.HEADS_UP,
            )

            if (notificationSent) {
              router.push(`${Constants.STEP_THREE_ROUTE}/${workingCase.id}`)
            }
          }}
          isPrimaryButtonLoading={isSendingNotification}
        />
      )}
    </>
  )
}

export default StepTwoForm
