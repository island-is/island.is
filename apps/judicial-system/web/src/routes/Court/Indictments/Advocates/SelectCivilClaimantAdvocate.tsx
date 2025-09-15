import { FC, useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import {
  BlueBox,
  FormContext,
  InputAdvocate,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import {
  CivilClaimant,
  UpdateCivilClaimantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCivilClaimants } from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './Advocates.strings'

interface Props {
  civilClaimant: CivilClaimant
}

interface UpdateCivilClaimant
  extends Omit<UpdateCivilClaimantInput, 'caseId' | 'civilClaimantId'> {}

const SelectCivilClaimantAdvocate: FC<Props> = ({ civilClaimant }) => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const {
    updateCivilClaimantState,
    updateCivilClaimant,
    setAndSendCivilClaimantToServer,
  } = useCivilClaimants()

  const [displayModal, setDisplayModal] = useState<boolean>(false)

  const handleUpdateCivilClaimantState = (update: UpdateCivilClaimant) => {
    updateCivilClaimantState(
      { caseId: workingCase.id, civilClaimantId: civilClaimant.id, ...update },
      setWorkingCase,
    )
  }

  const handleUpdateCivilClaimant = (update: UpdateCivilClaimant) => {
    updateCivilClaimant({
      caseId: workingCase.id,
      civilClaimantId: civilClaimant.id,
      ...update,
    })
  }

  const handleSetAndSendCivilClaimantToServer = (
    update: UpdateCivilClaimant,
  ) => {
    setAndSendCivilClaimantToServer(
      { caseId: workingCase.id, civilClaimantId: civilClaimant.id, ...update },
      setWorkingCase,
    )
  }

  return (
    <BlueBox>
      <Box marginBottom={2}>
        <Text variant="h4">{civilClaimant.name}</Text>
      </Box>
      {civilClaimant.hasSpokesperson ? (
        <>
          <Box display="flex" marginY={2}>
            <Box width="half" marginRight={1}>
              <RadioButton
                name="civilClaimantAdvocateType"
                id={`civil_claimant_lawyer-${civilClaimant.id}`}
                label={formatMessage(strings.lawyer)}
                large
                backgroundColor="white"
                checked={civilClaimant.spokespersonIsLawyer === true}
                onChange={() =>
                  handleSetAndSendCivilClaimantToServer({
                    spokespersonIsLawyer: true,
                  })
                }
                disabled={Boolean(civilClaimant.isSpokespersonConfirmed)}
              />
            </Box>
            <Box width="half" marginLeft={1}>
              <RadioButton
                name="civilClaimantAdvocateType"
                id={`civil_claimant_legal_rights_protector-${civilClaimant.id}`}
                label={formatMessage(strings.legalRightsProtector)}
                large
                backgroundColor="white"
                checked={civilClaimant.spokespersonIsLawyer === false}
                onChange={() =>
                  handleSetAndSendCivilClaimantToServer({
                    spokespersonIsLawyer: false,
                  })
                }
                disabled={Boolean(civilClaimant.isSpokespersonConfirmed)}
              />
            </Box>
          </Box>
          <Box marginBottom={2}>
            <InputAdvocate
              advocateType={
                civilClaimant.spokespersonIsLawyer
                  ? 'lawyer'
                  : 'legalRightsProtector'
              }
              name={civilClaimant.spokespersonName}
              email={civilClaimant.spokespersonEmail}
              phoneNumber={civilClaimant.spokespersonPhoneNumber}
              onAdvocateChange={(
                spokespersonName: string | null,
                spokespersonNationalId: string | null,
                spokespersonEmail: string | null,
                spokespersonPhoneNumber: string | null,
              ) =>
                handleSetAndSendCivilClaimantToServer({
                  spokespersonName,
                  spokespersonNationalId,
                  spokespersonEmail,
                  spokespersonPhoneNumber,
                  caseFilesSharedWithSpokesperson: spokespersonNationalId
                    ? civilClaimant.caseFilesSharedWithSpokesperson
                    : null,
                })
              }
              onEmailChange={(spokespersonEmail: string | null) =>
                handleUpdateCivilClaimantState({ spokespersonEmail })
              }
              onEmailSave={(spokespersonEmail: string | null) =>
                handleUpdateCivilClaimant({ spokespersonEmail })
              }
              onPhoneNumberChange={(spokespersonPhoneNumber: string | null) =>
                handleUpdateCivilClaimantState({ spokespersonPhoneNumber })
              }
              onPhoneNumberSave={(spokespersonPhoneNumber: string | null) =>
                handleUpdateCivilClaimant({ spokespersonPhoneNumber })
              }
              disabled={
                civilClaimant.spokespersonIsLawyer === null ||
                civilClaimant.spokespersonIsLawyer === undefined ||
                civilClaimant.isSpokespersonConfirmed
              }
            />
          </Box>
          <Checkbox
            name={`shareFilesWithCivilClaimantAdvocate-${civilClaimant.id}`}
            label={formatMessage(strings.shareFilesWithCivilClaimantAdvocate, {
              defenderIsLawyer: civilClaimant.spokespersonIsLawyer,
            })}
            checked={Boolean(civilClaimant.caseFilesSharedWithSpokesperson)}
            disabled={
              civilClaimant.spokespersonIsLawyer === null ||
              civilClaimant.spokespersonIsLawyer === undefined
            }
            onChange={() => {
              handleSetAndSendCivilClaimantToServer({
                caseFilesSharedWithSpokesperson:
                  !civilClaimant.caseFilesSharedWithSpokesperson,
              })
            }}
            tooltip={formatMessage(
              strings.shareFilesWithCivilClaimantAdvocateTooltip,
              {
                defenderIsLawyer: civilClaimant.spokespersonIsLawyer,
              },
            )}
            backgroundColor="white"
            large
            filled
          />
        </>
      ) : (
        <AlertMessage
          message={formatMessage(strings.noCivilClaimantAdvocate)}
          type="info"
        />
      )}
      <Box display="flex" justifyContent="flexEnd" marginTop={2}>
        {civilClaimant.hasSpokesperson && (
          <Box marginRight={2}>
            <Button
              variant="text"
              colorScheme={
                civilClaimant.isSpokespersonConfirmed
                  ? 'destructive'
                  : 'default'
              }
              onClick={() => {
                setDisplayModal(true)
              }}
            >
              {civilClaimant.isSpokespersonConfirmed
                ? formatMessage(strings.changeSpokespersonChoice, {
                    spokespersonIsLawyer: civilClaimant.spokespersonIsLawyer,
                  })
                : formatMessage(strings.confirmSpokespersonChoice, {
                    spokespersonIsLawyer: civilClaimant.spokespersonIsLawyer,
                  })}
            </Button>
          </Box>
        )}

        <Box>
          <Button
            variant="text"
            colorScheme={
              civilClaimant.hasSpokesperson ? 'destructive' : 'default'
            }
            onClick={() => {
              handleSetAndSendCivilClaimantToServer({
                hasSpokesperson: !civilClaimant.hasSpokesperson,
                spokespersonEmail: null,
                spokespersonPhoneNumber: null,
                spokespersonName: null,
                spokespersonIsLawyer: null,
                spokespersonNationalId: null,
                caseFilesSharedWithSpokesperson: null,
                isSpokespersonConfirmed: false,
              })
            }}
          >
            {civilClaimant.hasSpokesperson
              ? formatMessage(strings.removeCivilClaimantAdvocate, {
                  defenderIsLawyer: civilClaimant.spokespersonIsLawyer,
                })
              : formatMessage(strings.addCivilClaimantAdvocate)}
          </Button>
        </Box>
      </Box>
      {displayModal && (
        <Modal
          title={formatMessage(strings.confirmSpokespersonModalTitle, {
            isSpokespersonConfirmed: civilClaimant.isSpokespersonConfirmed,
            spokespersonIsLawyer: civilClaimant.spokespersonIsLawyer,
          })}
          text={formatMessage(strings.confirmSpokespersonModalText, {
            isSpokespersonConfirmed: civilClaimant.isSpokespersonConfirmed,
            spokespersonIsLawyer: civilClaimant.spokespersonIsLawyer,
          })}
          primaryButton={{
            text: formatMessage(strings.confirmModalPrimaryButtonText, {
              isConfirming: !civilClaimant.isSpokespersonConfirmed,
            }),
            onClick: () => {
              handleSetAndSendCivilClaimantToServer({
                isSpokespersonConfirmed: !civilClaimant.isSpokespersonConfirmed,
              })

              setDisplayModal(false)
            },
          }}
          secondaryButton={{
            text: formatMessage(strings.confirmModalSecondaryButtonText),
            onClick: () => setDisplayModal(false),
          }}
        />
      )}
    </BlueBox>
  )
}

export default SelectCivilClaimantAdvocate
