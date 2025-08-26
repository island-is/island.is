import { ChangeEvent, FC, useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Button, Checkbox, Text } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  FormContext,
  InputAdvocate,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import {
  Defendant,
  DefenderChoice,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useDefendants } from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './Advocates.strings'

interface UpdateDefendant extends Omit<UpdateDefendantInput, 'caseId'> {}

interface Props {
  defendant: Defendant
}

const SelectDefender: FC<Props> = ({ defendant }) => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const { updateDefendantState, updateDefendant, setAndSendDefendantToServer } =
    useDefendants()

  const [displayModal, setDisplayModal] = useState<boolean>(false)

  const gender = defendant.gender || 'NONE'

  const handleUpdateDefendantState = (update: UpdateDefendant) => {
    updateDefendantState({ caseId: workingCase.id, ...update }, setWorkingCase)
  }

  const handleUpdateDefendant = (update: UpdateDefendant) => {
    updateDefendant({ caseId: workingCase.id, ...update })
  }

  const handleSetAndSendDefendantToServer = (update: UpdateDefendant) => {
    setAndSendDefendantToServer(
      { caseId: workingCase.id, ...update },
      setWorkingCase,
    )
  }

  const toggleDefendantWaivesRightToCounsel = (
    defendant: Defendant,
    defendantWaivesRightToCounsel: boolean,
  ) => {
    const update: UpdateDefendant = {
      defendantId: defendant.id,
      defenderNationalId: defendantWaivesRightToCounsel
        ? null
        : defendant.defenderNationalId || null,
      defenderName: defendantWaivesRightToCounsel
        ? null
        : defendant.defenderName,
      defenderEmail: defendantWaivesRightToCounsel
        ? null
        : defendant.defenderEmail,
      defenderPhoneNumber: defendantWaivesRightToCounsel
        ? null
        : defendant.defenderPhoneNumber,
      defenderChoice:
        defendantWaivesRightToCounsel === true
          ? DefenderChoice.WAIVE
          : DefenderChoice.DELAY,
    }

    handleSetAndSendDefendantToServer(update)
  }

  const toggleDefenderChoiceConfirmed = (
    defendant: Defendant,
    isDefenderChoiceConfirmed: boolean,
  ) => {
    const { defenderChoice, defenderName } = defendant

    const isDelaying =
      !defenderName &&
      (!defenderChoice || defenderChoice === DefenderChoice.CHOOSE)
    const isChoosing =
      defenderName &&
      (!defenderChoice || defenderChoice === DefenderChoice.DELAY)

    const defenderChoiceUpdate = isDelaying
      ? DefenderChoice.DELAY
      : isChoosing
      ? DefenderChoice.CHOOSE
      : defenderChoice

    const update: UpdateDefendant = {
      defendantId: defendant.id,
      isDefenderChoiceConfirmed,
      defenderChoice: defenderChoiceUpdate,
    }

    handleSetAndSendDefendantToServer(update)
    setDisplayModal(false)
  }

  const toggleCaseFilesSharedWithDefender = (
    defendant: Defendant,
    caseFilesSharedWithDefender: boolean,
  ) => {
    const update: UpdateDefendant = {
      defendantId: defendant.id,
      caseFilesSharedWithDefender,
    }

    handleSetAndSendDefendantToServer(update)
  }

  return (
    <Box component="section" marginBottom={5}>
      <BlueBox>
        <Box marginBottom={2}>
          <Text variant="h4">
            {`${capitalize(
              formatMessage(core.indictmentDefendant, { gender }),
            )} ${defendant.name}`}
          </Text>
        </Box>
        <Box marginBottom={2}>
          <Checkbox
            dataTestId={`defendantWaivesRightToCounsel-${defendant.id}`}
            name={`defendantWaivesRightToCounsel-${defendant.id}`}
            label={capitalize(
              formatMessage(strings.defendantWaivesRightToCounsel, {
                accused: formatMessage(core.indictmentDefendant, { gender }),
              }),
            )}
            checked={Boolean(defendant.defenderChoice === DefenderChoice.WAIVE)}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              toggleDefendantWaivesRightToCounsel(
                defendant,
                event.target.checked,
              )
            }}
            filled
            large
            disabled={defendant.isDefenderChoiceConfirmed === true}
          />
        </Box>
        <InputAdvocate
          advocateType="litigator"
          name={defendant.defenderName}
          email={defendant.defenderEmail}
          phoneNumber={defendant.defenderPhoneNumber}
          onAdvocateChange={(
            defenderName: string | null,
            defenderNationalId: string | null,
            defenderEmail: string | null,
            defenderPhoneNumber: string | null,
          ) =>
            handleSetAndSendDefendantToServer({
              defendantId: defendant.id,
              defenderName,
              defenderNationalId,
              defenderEmail,
              defenderPhoneNumber,
            })
          }
          onEmailChange={(defenderEmail: string | null) =>
            handleUpdateDefendantState({
              defendantId: defendant.id,
              defenderEmail,
            })
          }
          onEmailSave={(defenderEmail: string | null) =>
            handleUpdateDefendant({
              defendantId: defendant.id,
              defenderEmail,
            })
          }
          onPhoneNumberChange={(defenderPhoneNumber: string | null) =>
            handleUpdateDefendantState({
              defendantId: defendant.id,
              defenderPhoneNumber,
            })
          }
          onPhoneNumberSave={(defenderPhoneNumber: string | null) =>
            handleUpdateDefendant({
              defendantId: defendant.id,
              defenderPhoneNumber,
            })
          }
          disabled={
            defendant.defenderChoice === DefenderChoice.WAIVE ||
            defendant.isDefenderChoiceConfirmed
          }
        />
        <Box marginTop={2}>
          <Checkbox
            name={`shareFilesWithDefender-${defendant.id}`}
            label={formatMessage(strings.shareFilesWithDefender)}
            checked={Boolean(defendant.caseFilesSharedWithDefender)}
            disabled={!defendant.defenderName && !defendant.defenderEmail}
            onChange={() => {
              toggleCaseFilesSharedWithDefender(
                defendant,
                !defendant.caseFilesSharedWithDefender,
              )
            }}
            tooltip={formatMessage(strings.shareFilesWithDefenderTooltip)}
            backgroundColor="white"
            large
            filled
          />
        </Box>
        <Box display="flex" justifyContent="flexEnd" marginTop={2}>
          <Button
            variant="text"
            colorScheme={
              defendant.isDefenderChoiceConfirmed ? 'destructive' : 'default'
            }
            onClick={() => {
              setDisplayModal(true)
            }}
          >
            {defendant.isDefenderChoiceConfirmed
              ? formatMessage(strings.changeDefenderChoice)
              : formatMessage(strings.confirmDefenderChoice)}
          </Button>
        </Box>
      </BlueBox>
      {displayModal && (
        <Modal
          title={formatMessage(strings.confirmDefenderChoiceModalTitle, {
            isDefenderChoiceConfirmed: defendant.isDefenderChoiceConfirmed,
          })}
          text={formatMessage(
            defendant.isDefenderChoiceConfirmed
              ? strings.changeDefenderChoiceModalText
              : defendant.defenderChoice === DefenderChoice.WAIVE
              ? strings.confirmDefenderWaivedModalText
              : !defendant.defenderName
              ? strings.confirmDefenderDelayModalText
              : strings.confirmDefenderChoiceModalText,
            { defenderName: defendant?.defenderName },
          )}
          primaryButtonText={formatMessage(
            strings.confirmModalPrimaryButtonText,
            { isConfirming: !defendant.isDefenderChoiceConfirmed },
          )}
          onPrimaryButtonClick={() =>
            toggleDefenderChoiceConfirmed(
              defendant,
              !defendant.isDefenderChoiceConfirmed,
            )
          }
          secondaryButtonText={formatMessage(
            strings.confirmModalSecondaryButtonText,
          )}
          onSecondaryButtonClick={() => setDisplayModal(false)}
        />
      )}
    </Box>
  )
}

export default SelectDefender
