import { ChangeEvent, FC, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Button, Checkbox, Text } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  DefenderNotFound,
  FormContext,
  InputAdvocate,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import {
  Defendant,
  DefenderChoice,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useDefendants } from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './Advocates.strings'

interface Props {
  defendant: Defendant
}

const SelectDefender: FC<Props> = ({ defendant }) => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const { setAndSendDefendantToServer } = useDefendants()

  const [displayModal, setDisplayModal] = useState<boolean>(false)

  const [defenderNotFound, setDefenderNotFound] = useState<boolean>(false)
  const gender = defendant.gender || 'NONE'

  const toggleDefendantWaivesRightToCounsel = useCallback(
    (
      caseId: string,
      defendant: Defendant,
      defendantWaivesRightToCounsel: boolean,
    ) => {
      const updateDefendantInput = {
        caseId,
        defendantId: defendant.id,
        defenderNationalId: defendantWaivesRightToCounsel
          ? ''
          : defendant.defenderNationalId,
        defenderName: defendantWaivesRightToCounsel
          ? ''
          : defendant.defenderName,
        defenderEmail: defendantWaivesRightToCounsel
          ? ''
          : defendant.defenderEmail,
        defenderPhoneNumber: defendantWaivesRightToCounsel
          ? ''
          : defendant.defenderPhoneNumber,
        defenderChoice:
          defendantWaivesRightToCounsel === true
            ? DefenderChoice.WAIVE
            : DefenderChoice.DELAY,
      }

      setAndSendDefendantToServer(updateDefendantInput, setWorkingCase)
    },
    [setWorkingCase, setAndSendDefendantToServer],
  )

  const toggleDefenderChoiceConfirmed = useCallback(
    (
      caseId: string,
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

      const updateDefendantInput = {
        caseId,
        defendantId: defendant.id,
        isDefenderChoiceConfirmed,
        defenderChoice: defenderChoiceUpdate,
      }

      setAndSendDefendantToServer(updateDefendantInput, setWorkingCase)
      setDisplayModal(false)
    },
    [setWorkingCase, setAndSendDefendantToServer],
  )

  const toggleCaseFilesSharedWithDefender = useCallback(
    (
      caseId: string,
      defendant: Defendant,
      caseFilesSharedWithDefender: boolean,
    ) => {
      if (defendant) {
        defendant.caseFilesSharedWithDefender = caseFilesSharedWithDefender

        const updateDefendantInput = {
          caseId: caseId,
          defendantId: defendant.id,
          caseFilesSharedWithDefender,
        }
        setAndSendDefendantToServer(updateDefendantInput, setWorkingCase)
      }
    },
    [setWorkingCase, setAndSendDefendantToServer],
  )

  return (
    <Box component="section" marginBottom={5}>
      {defenderNotFound && !workingCase.defendantWaivesRightToCounsel && (
        <DefenderNotFound />
      )}
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
                workingCase.id,
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
          disabled={
            defendant.defenderChoice === DefenderChoice.WAIVE ||
            defendant.isDefenderChoiceConfirmed === true
          }
          onAdvocateNotFound={setDefenderNotFound}
          clientId={defendant.id}
        />
        <Box marginTop={2}>
          <Checkbox
            name={`shareFilesWithDefender-${defendant.id}`}
            label={formatMessage(strings.shareFilesWithDefender)}
            checked={Boolean(defendant.caseFilesSharedWithDefender)}
            disabled={!defendant.defenderName}
            onChange={() => {
              toggleCaseFilesSharedWithDefender(
                workingCase.id,
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
          )}
          onPrimaryButtonClick={() =>
            toggleDefenderChoiceConfirmed(
              workingCase.id,
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
