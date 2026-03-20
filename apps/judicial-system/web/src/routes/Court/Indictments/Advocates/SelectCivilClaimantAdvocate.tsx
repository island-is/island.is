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
  IconButton,
  InputAdvocate,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseState,
  CivilClaimant,
  UpdateCivilClaimantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCivilClaimants } from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import { strings } from './Advocates.strings'
import * as styles from './Advocates.css'

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
    <BlueBox className={grid({ gap: 2 })}>
      <Box display="flex" justifyContent="spaceBetween">
        <Text variant="h4">{civilClaimant.name}</Text>
        {civilClaimant.hasSpokesperson && (
          <div className={styles.gridVariants['small']}>
            <IconButton
              icon="pencil"
              colorScheme="blue"
              disabled={
                workingCase.state === CaseState.CORRECTING ||
                !civilClaimant.isSpokespersonConfirmed
              }
              onClick={() => setDisplayModal(true)}
            />
            <IconButton
              icon="trash"
              colorScheme="blue"
              disabled={workingCase.state === CaseState.CORRECTING}
              onClick={() =>
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
              }
            />
          </div>
        )}
      </Box>
      {civilClaimant.hasSpokesperson ? (
        <>
          <div className={styles.gridVariants['medium']}>
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
              disabled={Boolean(
                civilClaimant.isSpokespersonConfirmed ||
                  workingCase.state === CaseState.CORRECTING,
              )}
            />
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
              disabled={Boolean(
                civilClaimant.isSpokespersonConfirmed ||
                  workingCase.state === CaseState.CORRECTING,
              )}
            />
          </div>
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
                caseFilesSharedWithSpokesperson: Boolean(
                  spokespersonNationalId,
                ),
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
              civilClaimant.isSpokespersonConfirmed ||
              workingCase.state === CaseState.CORRECTING
            }
          />
          <Checkbox
            name={`shareFilesWithCivilClaimantAdvocate-${civilClaimant.id}`}
            label={formatMessage(strings.shareFilesWithCivilClaimantAdvocate, {
              defenderIsLawyer: civilClaimant.spokespersonIsLawyer,
            })}
            checked={Boolean(civilClaimant.caseFilesSharedWithSpokesperson)}
            disabled={
              civilClaimant.spokespersonIsLawyer === null ||
              civilClaimant.spokespersonIsLawyer === undefined ||
              civilClaimant.isSpokespersonConfirmed ||
              workingCase.state === CaseState.CORRECTING
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
      {civilClaimant.isSpokespersonConfirmed &&
        civilClaimant.spokespersonName && (
          <AlertMessage
            title={`${
              civilClaimant.spokespersonIsLawyer
                ? 'Lögmaður'
                : 'Réttargæslumaður'
            } staðfestur`}
            message={`${
              civilClaimant.spokespersonName
            } hefur fengið tilkynningu um skráningu í tölvupósti${
              civilClaimant.caseFilesSharedWithSpokesperson
                ? ' og aðgang að gögnum málsins.'
                : '.'
            }`}
            type="success"
          />
        )}
      {civilClaimant.hasSpokesperson && !civilClaimant.isSpokespersonConfirmed && (
        <Box display="flex" justifyContent="flexEnd">
          <Button
            variant="text"
            colorScheme="default"
            onClick={() => {
              setDisplayModal(true)
            }}
            disabled={workingCase.state === CaseState.CORRECTING}
          >
            {formatMessage(strings.confirmSpokespersonChoice, {
              spokespersonIsLawyer: civilClaimant.spokespersonIsLawyer,
            })}
          </Button>
        </Box>
      )}
      {!civilClaimant.hasSpokesperson && (
        <Box display="flex" justifyContent="flexEnd">
          <Button
            variant="text"
            colorScheme="default"
            onClick={() =>
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
            }
            disabled={workingCase.state === CaseState.CORRECTING}
          >
            {formatMessage(strings.addCivilClaimantAdvocate)}
          </Button>
        </Box>
      )}
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
