import React, { useState } from 'react'
import { Text, Box } from '@island.is/island-ui/core'

import {
  OptionsModal,
  AcceptModal,
  EmailFormatInputModal,
} from '@island.is/financial-aid-web/veita/src/components'

import {
  Application,
  ApplicationState,
  Amount,
  eventTypeFromApplicationState,
  HomeCircumstances,
  FamilyStatus,
  getMonth,
  Municipality,
} from '@island.is/financial-aid/shared/lib'
import { useApplicationState } from '../../utils/useApplicationState'
import StateModalContainer from './StateModalContainer'

import * as styles from './StateModal.css'

interface Props {
  isVisible: boolean
  onVisibilityChange: React.Dispatch<React.SetStateAction<boolean>>
  applicationId: string
  currentState: ApplicationState
  setApplication: React.Dispatch<React.SetStateAction<Application | undefined>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  homeCircumstances: HomeCircumstances
  familyStatus: FamilyStatus
  applicationCreated: string
  applicationMunicipality: Municipality
}

const StateModal = ({
  isVisible,
  onVisibilityChange,
  applicationId,
  currentState,
  setApplication,
  setIsLoading,
  homeCircumstances,
  familyStatus,
  applicationCreated,
  applicationMunicipality,
}: Props) => {
  const [selected, setSelected] = useState<ApplicationState | undefined>()

  const changeApplicationState = useApplicationState()

  const saveStateApplication = async (
    applicationId: string,
    state: ApplicationState,
    rejection?: string,
    comment?: string,
    amount?: Amount,
  ) => {
    setIsLoading(true)

    onVisibilityChange((isVisible) => !isVisible)

    await changeApplicationState(
      applicationId,
      state,
      eventTypeFromApplicationState[state],
      rejection,
      comment,
      amount,
    )
      .then((updatedApplication) => {
        setIsLoading(false)
        setApplication(updatedApplication)
      })
      .catch(() => {
        //TODO ERROR STATE
        setIsLoading(false)
      })
  }

  const closeModal = (): void => {
    onVisibilityChange(false)
  }

  const onClickCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setSelected(undefined)
  }

  const stateNeedInput = [
    {
      state: ApplicationState.REJECTED,
      modalHeader: 'Synja umsókn',
    },
    {
      state: ApplicationState.APPROVED,
      modalHeader: 'Samþykkja umsókn',
    },
    {
      state: ApplicationState.DATANEEDED,
      modalHeader: 'Vantar upplýsingar',
    },
  ]

  const headingText = (state?: ApplicationState): string => {
    const header =
      stateNeedInput.find((item) => state === item.state)?.modalHeader ??
      'Stöðubreyting'

    return header
  }

  const saveOrNextWindow = (stateOption: ApplicationState) => {
    const goToNextWindow = stateNeedInput.find(
      (item) => stateOption === item.state,
    )
    if (goToNextWindow) {
      setSelected(stateOption)
      return
    }

    saveStateApplication(applicationId, stateOption)
  }
  return (
    <StateModalContainer
      isVisible={isVisible}
      onVisibilityChange={onVisibilityChange}
      closeModal={closeModal}
    >
      <Box
        paddingLeft={4}
        paddingY={2}
        background="blue400"
        className={styles.modalHeadline}
      >
        <Text fontWeight="semiBold" color="white">
          {headingText(selected)}
        </Text>
      </Box>

      <Box padding={4}>
        <OptionsModal
          isModalVisable={selected === undefined}
          activeState={currentState}
          onClick={(e, stateOption) => {
            e.stopPropagation()

            saveOrNextWindow(stateOption)
          }}
        />

        <EmailFormatInputModal
          onCancel={onClickCancel}
          isModalVisable={selected === ApplicationState.DATANEEDED}
          state={ApplicationState.DATANEEDED}
          onSaveApplication={(comment?: string) => {
            if (!selected) {
              return
            }
            saveStateApplication(applicationId, selected, undefined, comment)
          }}
          headline="Skrifaðu hvaða upplýsingar og/eða gögn vantar"
          submitButtonText="Senda á umsækjanda"
          defaultErrorMessage="Þú þarft að gera grein fyrir hvaða upplýsingar og/eða gögn vantar í umsóknina"
          prefixText="Til þess að hægt sé að ljúka afgreiðslu umsóknarinnar þurfa eftirfarandi upplýsingar að liggja fyrir."
          postfixText="Upplýsingarnar sendir þú inn á stöðusíðu umsóknarinnar."
          municipalityEmail={applicationMunicipality?.email}
        />
        <AcceptModal
          isModalVisable={selected === ApplicationState.APPROVED}
          onCancel={onClickCancel}
          onSaveApplication={(amount: Amount, comment: string) => {
            if (!selected) {
              return
            }
            saveStateApplication(
              applicationId,
              selected,
              undefined,
              `Samþykkt upphæð: kr. ${amount?.finalAmount.toLocaleString(
                'de-DE',
              )}.-${comment ? '\n' + comment : comment}`,
              amount,
            )
          }}
          homeCircumstances={homeCircumstances}
          familyStatus={familyStatus}
          applicationMunicipality={applicationMunicipality}
        />
        <EmailFormatInputModal
          onCancel={onClickCancel}
          isModalVisable={selected === ApplicationState.REJECTED}
          state={ApplicationState.REJECTED}
          onSaveApplication={(reasonForRejection?: string) => {
            if (!selected) {
              return
            }
            saveStateApplication(applicationId, selected, reasonForRejection)
          }}
          headline="Skrifaðu ástæðu synjunar"
          submitButtonText="Synja og senda á umsækjanda"
          defaultErrorMessage="Þú þarft að greina frá ástæðu synjunar"
          prefixText={`Umsókn þinni um fjárhagsaðstoð í ${getMonth(
            new Date(applicationCreated).getMonth(),
          )} hefur verið synjað.`}
          postfixText="Þú getur kynnt þér nánar reglur um fjárhagsaðstoð."
          municipalityEmail={applicationMunicipality?.email}
        />
      </Box>
    </StateModalContainer>
  )
}

export default StateModal
