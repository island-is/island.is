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
  IconButton,
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

  const [civilClaimantNationalIdUpdate, setCivilClaimantNationalIdUpdate] =
    useState<{ nationalId: string | null; civilClaimantId: string }>()
  const [lookupNationalId, setLookupNationalId] = useState<string | null>(
    civilClaimant.nationalId ?? null,
  )

  const { personData, businessData, notFound } =
    useNationalRegistry(lookupNationalId)
  const {
    updateCivilClaimant,
    updateCivilClaimantState,
    setAndSendCivilClaimantToServer,
  } = useCivilClaimants()

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
      setLookupNationalId(cleanNationalId || null)

      if (cleanNationalId.length === 11) {
        setCivilClaimantNationalIdUpdate({
          nationalId: cleanNationalId || null,
          civilClaimantId,
        })
      }
    }
  }

  useEffect(() => {
    if (
      !civilClaimantNationalIdUpdate ||
      civilClaimantNationalIdUpdate.nationalId?.length !== 11
    ) {
      return
    }

    let name: string | undefined

    // Separately handle person and business data in order to populate
    // name correctly for companies as well.
    if (personData) {
      const person = personData.items?.[0]
      name = person?.name
    } else if (businessData) {
      const business = businessData.items?.[0]
      name = business?.full_name
    }

    const update: UpdateCivilClaimant = {
      civilClaimantId: civilClaimantNationalIdUpdate.civilClaimantId || '',
      nationalId: civilClaimantNationalIdUpdate.nationalId,
      ...(name ? { name } : {}),
    }

    handleSetAndSendCivilClaimantToServer(update)
    // We want this hook to run exclusively when personData or businessData changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personData, businessData])

  const legalProtectorCheckboxId = `defender_type_legal_rights_protector-${civilClaimant.id}`
  const lawyerCheckboxId = `defender_type_lawyer-${civilClaimant.id}`

  return (
    <>
      {civilClaimantIndex > 0 && (
        <Box display="flex" justifyContent="flexEnd" marginBottom={2}>
          <IconButton
            icon="trash"
            colorScheme="blue"
            onClick={() => removeCivilClaimantById(civilClaimant.id)}
            tooltipText="Eyða kröfuhafa"
          />
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
            handleCivilClaimantNationalIdBlur(
              val,
              civilClaimant.noNationalId,
              civilClaimant.id,
            )
          }}
          onBlur={(val) =>
            handleCivilClaimantNationalIdBlur(
              val,
              civilClaimant.noNationalId,
              civilClaimant.id,
            )
          }
        />
        {notFound && (
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
        {civilClaimant.hasSpokesperson ? (
          <IconButton
            icon="trash"
            colorScheme="blue"
            onClick={() =>
              handleSetAndSendCivilClaimantToServer({
                civilClaimantId: civilClaimant.id,
                hasSpokesperson: false,
                spokespersonEmail: null,
                spokespersonPhoneNumber: null,
                spokespersonName: null,
                spokespersonIsLawyer: null,
                spokespersonNationalId: null,
                caseFilesSharedWithSpokesperson: null,
              })
            }
          />
        ) : (
          <Button
            variant="text"
            onClick={() =>
              handleSetAndSendCivilClaimantToServer({
                civilClaimantId: civilClaimant.id,
                hasSpokesperson: true,
                spokespersonEmail: null,
                spokespersonPhoneNumber: null,
                spokespersonName: null,
                spokespersonIsLawyer: null,
                spokespersonNationalId: null,
                caseFilesSharedWithSpokesperson: null,
              })
            }
          >
            {formatMessage(strings.addDefender)}
          </Button>
        )}
      </Box>
      {civilClaimant.hasSpokesperson && (
        <>
          <Box display="flex" marginY={2}>
            <Box width="half" marginRight={1}>
              <RadioButton
                name={lawyerCheckboxId}
                id={lawyerCheckboxId}
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
                name={legalProtectorCheckboxId}
                id={legalProtectorCheckboxId}
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
                  caseFilesSharedWithSpokesperson: Boolean(
                    spokespersonNationalId,
                  ),
                })

                // handleSetAndSendCivilClaimantToServer({
                //   civilClaimantId: civilClaimant.id,
                //   caseFilesSharedWithSpokesperson: Boolean(spokespersonName),
                // })
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
