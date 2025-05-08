import { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  Box,
  Button,
  Checkbox,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'
import {
  FormContext,
  InputAdvocate,
  InputName,
  InputNationalId,
} from '@island.is/judicial-system-web/src/components'
import {
  CivilClaimant,
  UpdateCivilClaimantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCivilClaimants,
  useNationalRegistry,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './processing.strings'

interface UpdateCivilClaimant
  extends Omit<UpdateCivilClaimantInput, 'caseId'> {}

export const CivilClaimantFields = ({
  caseId,
  civilClaimant,
  civilClaimantIndex,
  removeCivilClaimantById,
}: {
  caseId: string
  civilClaimant: CivilClaimant
  civilClaimantIndex: number
  removeCivilClaimantById: (id: string) => void
}) => {
  const { formatMessage } = useIntl()
  const { setWorkingCase } = useContext(FormContext)
  const { personData } = useNationalRegistry(civilClaimant.nationalId)
  const {
    updateCivilClaimant,
    updateCivilClaimantState,
    setAndSendCivilClaimantToServer,
  } = useCivilClaimants()

  const [civilClaimantNationalIdUpdate, setCivilClaimantNationalIdUpdate] =
    useState<{ nationalId: string | null; civilClaimantId: string }>()
  const [nationalIdNotFound, setNationalIdNotFound] = useState<boolean>(false)

  const handleUpdateCivilClaimant = (update: UpdateCivilClaimant) => {
    updateCivilClaimant({ caseId, ...update })
  }

  const handleUpdateCivilClaimantState = (update: UpdateCivilClaimant) => {
    updateCivilClaimantState({ caseId, ...update }, setWorkingCase)
  }

  const handleSetAndSendCivilClaimantToServer = (
    update: UpdateCivilClaimant,
  ) => {
    setAndSendCivilClaimantToServer({ caseId, ...update }, setWorkingCase)
  }

  const handleCivilClaimantNameBlur = async (
    name: string,
    civilClaimantId?: string | null,
  ) => {
    if (!civilClaimantId) {
      return
    }

    updateCivilClaimant({ name, civilClaimantId, caseId })
  }

  const handleCivilClaimantNationalIdBlur = (
    nationalId: string,
    noNationalId?: boolean | null,
    civilClaimantId?: string | null,
  ) => {
    if (!civilClaimantId) {
      return
    }

    if (noNationalId) {
      handleSetAndSendCivilClaimantToServer({
        civilClaimantId,
        nationalId: nationalId || null,
      })
    } else {
      const cleanNationalId = nationalId ? nationalId.replace('-', '') : ''
      setCivilClaimantNationalIdUpdate({
        nationalId: cleanNationalId || null,
        civilClaimantId,
      })
    }
  }

  useEffect(() => {
    if (!civilClaimantNationalIdUpdate) {
      return
    }

    const items = personData?.items || []
    const person = items[0]

    setNationalIdNotFound(items.length === 0)

    const update: UpdateCivilClaimant = {
      civilClaimantId: civilClaimantNationalIdUpdate.civilClaimantId || '',
      nationalId: civilClaimantNationalIdUpdate.nationalId,
      ...(person?.name ? { name: person.name } : {}),
    }

    handleSetAndSendCivilClaimantToServer(update)
    // We want this hook to run exclusively when personData changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personData])

  return (
    <>
      {civilClaimantIndex > 0 && (
        <Box display="flex" justifyContent="flexEnd" marginBottom={2}>
          <Button
            variant="text"
            colorScheme="destructive"
            onClick={() => {
              removeCivilClaimantById(civilClaimant.id)
            }}
          >
            {formatMessage(strings.remove)}
          </Button>
        </Box>
      )}
      <Box marginBottom={2}>
        <Checkbox
          name={`civilClaimantNoNationalId-${civilClaimant.id}`}
          label={formatMessage(strings.civilClaimantNoNationalId)}
          checked={Boolean(civilClaimant.noNationalId)}
          onChange={() => {
            handleSetAndSendCivilClaimantToServer({
              civilClaimantId: civilClaimant.id,
              nationalId: null,
              noNationalId: !civilClaimant.noNationalId,
            })
          }}
          backgroundColor="white"
          large
          filled
        />
      </Box>
      <Box marginBottom={2}>
        <InputNationalId
          isDateOfBirth={Boolean(civilClaimant.noNationalId)}
          value={civilClaimant.nationalId ?? undefined}
          required={Boolean(!civilClaimant.noNationalId)}
          onChange={(val) => {
            if (val.length < 11) {
              setNationalIdNotFound(false)
            } else if (val.length === 11) {
              handleCivilClaimantNationalIdBlur(
                val,
                civilClaimant.noNationalId,
                civilClaimant.id,
              )
            }

            handleUpdateCivilClaimantState({
              civilClaimantId: civilClaimant.id ?? '',
              nationalId: val,
            })
          }}
          onBlur={(val) =>
            handleCivilClaimantNationalIdBlur(
              val,
              civilClaimant.noNationalId,
              civilClaimant.id,
            )
          }
        />
        {civilClaimant.nationalId?.length === 11 && nationalIdNotFound && (
          <Text color="red600" variant="eyebrow" marginTop={1}>
            {formatMessage(core.nationalIdNotFoundInNationalRegistry)}
          </Text>
        )}
      </Box>
      <InputName
        value={civilClaimant.name ?? undefined}
        onChange={(val) =>
          handleUpdateCivilClaimantState({
            civilClaimantId: civilClaimant.id ?? '',
            name: val,
          })
        }
        onBlur={(val) => handleCivilClaimantNameBlur(val, civilClaimant.id)}
        required
      />
      <Box display="flex" justifyContent="flexEnd" marginTop={2}>
        <Button
          variant="text"
          colorScheme={
            civilClaimant.hasSpokesperson ? 'destructive' : 'default'
          }
          onClick={() => {
            handleSetAndSendCivilClaimantToServer({
              civilClaimantId: civilClaimant.id,
              hasSpokesperson: !civilClaimant.hasSpokesperson,
              spokespersonEmail: null,
              spokespersonPhoneNumber: null,
              spokespersonName: null,
              spokespersonIsLawyer: null,
              spokespersonNationalId: null,
              caseFilesSharedWithSpokesperson: null,
            })
          }}
        >
          {formatMessage(
            civilClaimant.hasSpokesperson
              ? strings.removeDefender
              : strings.addDefender,
          )}
        </Button>
      </Box>
      {civilClaimant.hasSpokesperson && (
        <>
          <Box display="flex" marginY={2}>
            <Box width="half" marginRight={1}>
              <RadioButton
                name={`defender_type_lawyer-${civilClaimant.id}`}
                id={`defender_type_lawyer-${civilClaimant.id}`}
                label={formatMessage(strings.lawyer)}
                large
                backgroundColor="white"
                onChange={() =>
                  handleSetAndSendCivilClaimantToServer({
                    civilClaimantId: civilClaimant.id,
                    spokespersonIsLawyer: true,
                  })
                }
                checked={Boolean(civilClaimant.spokespersonIsLawyer)}
              />
            </Box>
            <Box width="half" marginLeft={1}>
              <RadioButton
                name={`defender_type_legal_rights_protector-${civilClaimant.id}`}
                id={`defender_type_legal_rights_protector-${civilClaimant.id}`}
                label={formatMessage(strings.legalRightsProtector)}
                large
                backgroundColor="white"
                onChange={() =>
                  handleSetAndSendCivilClaimantToServer({
                    civilClaimantId: civilClaimant.id,
                    spokespersonIsLawyer: false,
                  })
                }
                checked={civilClaimant.spokespersonIsLawyer === false}
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
              ) => {
                handleSetAndSendCivilClaimantToServer({
                  civilClaimantId: civilClaimant.id,
                  spokespersonName,
                  spokespersonNationalId,
                  spokespersonEmail,
                  spokespersonPhoneNumber,
                  caseFilesSharedWithSpokesperson: spokespersonNationalId
                    ? civilClaimant.caseFilesSharedWithSpokesperson
                    : null,
                })
              }}
              onEmailChange={(spokespersonEmail: string | null) =>
                handleUpdateCivilClaimantState({
                  civilClaimantId: civilClaimant.id,
                  spokespersonEmail,
                })
              }
              onEmailSave={(spokespersonEmail: string | null) =>
                handleUpdateCivilClaimant({
                  civilClaimantId: civilClaimant.id,
                  spokespersonEmail,
                })
              }
              onPhoneNumberChange={(spokespersonPhoneNumber: string | null) =>
                handleUpdateCivilClaimantState({
                  civilClaimantId: civilClaimant.id,
                  spokespersonPhoneNumber,
                })
              }
              onPhoneNumberSave={(spokespersonPhoneNumber: string | null) =>
                handleUpdateCivilClaimant({
                  civilClaimantId: civilClaimant.id,
                  spokespersonPhoneNumber,
                })
              }
              disabled={
                civilClaimant.spokespersonIsLawyer === null ||
                civilClaimant.spokespersonIsLawyer === undefined
              }
            />
          </Box>
          <Checkbox
            name={`civilClaimantShareFilesWithDefender-${civilClaimant.id}`}
            label={formatMessage(strings.civilClaimantShareFilesWithDefender, {
              defenderIsLawyer: civilClaimant.spokespersonIsLawyer,
            })}
            checked={Boolean(civilClaimant.caseFilesSharedWithSpokesperson)}
            onChange={() => {
              handleSetAndSendCivilClaimantToServer({
                civilClaimantId: civilClaimant.id,
                caseFilesSharedWithSpokesperson:
                  !civilClaimant.caseFilesSharedWithSpokesperson,
              })
            }}
            disabled={
              civilClaimant.spokespersonIsLawyer === null ||
              civilClaimant.spokespersonIsLawyer === undefined
            }
            tooltip={formatMessage(
              strings.civilClaimantShareFilesWithDefenderTooltip,
              {
                defenderIsLawyer: civilClaimant.spokespersonIsLawyer,
              },
            )}
            backgroundColor="white"
            large
            filled
          />
        </>
      )}
    </>
  )
}
