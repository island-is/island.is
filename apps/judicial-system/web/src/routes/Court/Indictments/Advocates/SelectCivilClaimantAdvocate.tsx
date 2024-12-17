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
import { AdvocateType } from '@island.is/judicial-system/types'
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

const SelectCivilClaimantAdvocate: FC<Props> = ({ civilClaimant }) => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const { setAndSendCivilClaimantToServer } = useCivilClaimants()

  const [displayModal, setDisplayModal] = useState<boolean>(false)

  const updateCivilClaimant = (update: UpdateCivilClaimantInput) => {
    setAndSendCivilClaimantToServer(
      {
        ...update,
        caseId: workingCase.id,
        civilClaimantId: civilClaimant.id,
      },
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
                  updateCivilClaimant({
                    spokespersonIsLawyer: true,
                  } as UpdateCivilClaimantInput)
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
                  updateCivilClaimant({
                    spokespersonIsLawyer: false,
                  } as UpdateCivilClaimantInput)
                }
                disabled={Boolean(civilClaimant.isSpokespersonConfirmed)}
              />
            </Box>
          </Box>
          <Box marginBottom={2}>
            <InputAdvocate
              clientId={civilClaimant.id}
              advocateType={
                civilClaimant.spokespersonIsLawyer
                  ? AdvocateType.LAWYER
                  : AdvocateType.LEGAL_RIGHTS_PROTECTOR
              }
              disabled={
                civilClaimant.spokespersonIsLawyer === null ||
                civilClaimant.spokespersonIsLawyer === undefined ||
                civilClaimant.isSpokespersonConfirmed
              }
              isCivilClaim={true}
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
              updateCivilClaimant({
                caseFilesSharedWithSpokesperson:
                  !civilClaimant.caseFilesSharedWithSpokesperson,
              } as UpdateCivilClaimantInput)
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
              updateCivilClaimant({
                hasSpokesperson: !civilClaimant.hasSpokesperson,
                spokespersonEmail: null,
                spokespersonPhoneNumber: null,
                spokespersonName: null,
                spokespersonIsLawyer: null,
                spokespersonNationalId: null,
                caseFilesSharedWithSpokesperson: null,
                isSpokespersonConfirmed: false,
              } as UpdateCivilClaimantInput)
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
          primaryButtonText={formatMessage(
            strings.confirmModalPrimaryButtonText,
            { isConfirming: !civilClaimant.isSpokespersonConfirmed },
          )}
          onPrimaryButtonClick={() => {
            updateCivilClaimant({
              isSpokespersonConfirmed: !civilClaimant.isSpokespersonConfirmed,
            } as UpdateCivilClaimantInput)
            setDisplayModal(false)
          }}
          secondaryButtonText={formatMessage(
            strings.confirmModalSecondaryButtonText,
          )}
          onSecondaryButtonClick={() => setDisplayModal(false)}
        />
      )}
    </BlueBox>
  )
}

export default SelectCivilClaimantAdvocate
