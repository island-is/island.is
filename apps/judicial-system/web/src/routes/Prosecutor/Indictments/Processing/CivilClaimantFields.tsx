import { useContext, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  Box,
  Button,
  Checkbox,
  InputFileUpload,
  RadioButton,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { fileExtensionWhitelist } from '@island.is/island-ui/core/types'
import { core } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  FormContext,
  InputAdvocate,
  InputName,
  InputNationalId,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseFileCategory,
  CivilClaimant,
  Defendant,
  UpdateCivilClaimantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCivilClaimants,
  useNationalRegistry,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { TUploadFile } from '@island.is/judicial-system-web/src/utils/hooks/useS3Upload/useS3Upload'
import { FileWithPreviewURL } from '@island.is/judicial-system-web/src/components/UploadFiles/UploadFiles'

import { strings } from './processing.strings'

interface UpdateCivilClaimant
  extends Omit<UpdateCivilClaimantInput, 'caseId'> {}

export const CivilClaimantFields = ({
  caseId,
  civilClaimant,
  civilClaimantIndex,
  removeCivilClaimantById,
  policeCaseNumbers,
  defendants,
  uploadFiles,
  addUploadFiles,
  updateUploadFile,
  removeUploadFile,
  handleUpload,
  handleRetry,
  handleRemove,
  onOpenFile,
}: {
  caseId: string
  civilClaimant: CivilClaimant
  civilClaimantIndex: number
  removeCivilClaimantById: (id: string) => void
  policeCaseNumbers: string[]
  defendants: Defendant[]
  uploadFiles: TUploadFile[]
  addUploadFiles: (
    files: FileWithPreviewURL[],
    overRides?: Partial<TUploadFile>,
  ) => TUploadFile[]
  updateUploadFile: (file: TUploadFile, newId?: string) => void
  removeUploadFile: (file: TUploadFile) => void
  handleUpload: (
    files: TUploadFile[],
    updateFile: (file: TUploadFile, newId?: string) => void,
  ) => Promise<string>
  handleRetry: (
    file: TUploadFile,
    callback: (file: TUploadFile, newId?: string) => void,
  ) => Promise<string>
  handleRemove: (
    file: TUploadFile,
    callback?: (file: TUploadFile) => void,
  ) => Promise<void>
  onOpenFile: (file: TUploadFile) => void
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

  const applyNationalIdLookupFromInput = (
    value: string,
    civilClaimantId: string,
  ) => {
    const cleanNationalId = value.replace('-', '')
    setLookupNationalId(cleanNationalId || null)

    if (cleanNationalId.length === 10) {
      setCivilClaimantNationalIdUpdate({
        nationalId: cleanNationalId,
        civilClaimantId,
      })
    }
  }

  const handleInputNationalIdChange = (value: string) => {
    const civilClaimantId = civilClaimant.id
    if (!civilClaimantId) {
      return
    }

    if (civilClaimant.noNationalId) {
      handleUpdateCivilClaimantState({
        civilClaimantId,
        nationalId: value,
      })
    } else {
      applyNationalIdLookupFromInput(value, civilClaimantId)
    }
  }

  const handleInputNationalIdBlur = (value: string) => {
    const civilClaimantId = civilClaimant.id
    if (!civilClaimantId) {
      return
    }

    if (civilClaimant.noNationalId) {
      handleSetAndSendCivilClaimantToServer({
        civilClaimantId,
        nationalId: value,
      })
    } else {
      applyNationalIdLookupFromInput(value, civilClaimantId)
    }
  }

  useEffect(() => {
    if (
      !civilClaimantNationalIdUpdate ||
      civilClaimantNationalIdUpdate.nationalId?.length !== 10
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

  const availableDefendants = useMemo(() => {
    if (!civilClaimant.policeCaseNumbers?.length) {
      return []
    }
    return defendants.filter((defendant) =>
      defendant.policeCaseNumbers?.some((pcn) =>
        civilClaimant.policeCaseNumbers?.includes(pcn),
      ),
    )
  }, [civilClaimant.policeCaseNumbers, defendants])

  const handlePoliceCaseNumbersChange = (
    newPoliceCaseNumbers: string[],
  ) => {
    const newAvailableDefendantIds = new Set(
      defendants
        .filter((d) =>
          d.policeCaseNumbers?.some((pcn) =>
            newPoliceCaseNumbers.includes(pcn),
          ),
        )
        .map((d) => d.id),
    )

    const prunedDefendantIds = (civilClaimant.defendantIds ?? []).filter(
      (id) => newAvailableDefendantIds.has(id),
    )

    handleSetAndSendCivilClaimantToServer({
      civilClaimantId: civilClaimant.id,
      policeCaseNumbers: newPoliceCaseNumbers,
      defendantIds: prunedDefendantIds,
    })
  }

  const handleDefendantToggle = (defendantId: string) => {
    const currentIds = civilClaimant.defendantIds ?? []
    const newIds = currentIds.includes(defendantId)
      ? currentIds.filter((id) => id !== defendantId)
      : [...currentIds, defendantId]

    handleSetAndSendCivilClaimantToServer({
      civilClaimantId: civilClaimant.id,
      defendantIds: newIds,
    })
  }

  const claimantFiles = uploadFiles.filter(
    (file) =>
      file.category === CaseFileCategory.CIVIL_CLAIM &&
      file.civilClaimantId === civilClaimant.id,
  )

  return (
    <>
      {civilClaimantIndex > 0 && (
        <Box display="flex" justifyContent="flexEnd" marginBottom={3}>
          <Button
            variant="text"
            colorScheme="destructive"
            size="small"
            icon="trash"
            onClick={() => removeCivilClaimantById(civilClaimant.id)}
          >
            Eyða
          </Button>
        </Box>
      )}
      <BlueBox>
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
            onChange={handleInputNationalIdChange}
            onBlur={handleInputNationalIdBlur}
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
            <Button
              colorScheme="destructive"
              variant="text"
              size="small"
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
            >
              Eyða
            </Button>
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
                onPhoneNumberChange={(
                  spokespersonPhoneNumber: string | null,
                ) =>
                  handleUpdateCivilClaimantState({
                    civilClaimantId: civilClaimant.id,
                    spokespersonPhoneNumber,
                  })
                }
                onPhoneNumberSave={(
                  spokespersonPhoneNumber: string | null,
                ) =>
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
              label={formatMessage(
                strings.civilClaimantShareFilesWithDefender,
                {
                  defenderIsLawyer: civilClaimant.spokespersonIsLawyer,
                },
              )}
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
      </BlueBox>
      <Box marginTop={3}>
        <SectionHeading
          title="Hvaða máli tengist krafan?"
          heading="h4"
          marginBottom={2}
        />
        <BlueBox>
          <Select
            name={`civilClaimantPoliceCaseNumbers-${civilClaimant.id}`}
            label="LÖKE málsnúmer"
            placeholder="Veldu málsnúmer"
            isMulti
            required
            options={policeCaseNumbers.map((pcn) => ({
              label: pcn,
              value: pcn,
            }))}
            value={(civilClaimant.policeCaseNumbers ?? []).map((pcn) => ({
              label: pcn,
              value: pcn,
            }))}
            onChange={(selectedOptions) =>
              handlePoliceCaseNumbersChange(
                selectedOptions.map((o) => o.value),
              )
            }
          />
          {availableDefendants.length > 0 && (
            <Box marginTop={3}>
              <SectionHeading
                title="Hverjum beinist krafan gegn?"
                heading="h4"
                marginBottom={2}
              />
              {availableDefendants.map((defendant) => (
                <Box marginBottom={1} key={defendant.id}>
                  <Checkbox
                    name={`civilClaimant-${civilClaimant.id}-defendant-${defendant.id}`}
                    label={defendant.name ?? ''}
                    checked={(civilClaimant.defendantIds ?? []).includes(
                      defendant.id,
                    )}
                    onChange={() => handleDefendantToggle(defendant.id)}
                    large
                    filled
                  />
                </Box>
              ))}
            </Box>
          )}
        </BlueBox>
      </Box>
      <Box marginTop={3}>
        <SectionHeading
          title="Bótakrafa"
          heading="h4"
          marginBottom={2}
        />
        <InputFileUpload
          name={`civilClaim-${civilClaimant.id}`}
          files={claimantFiles}
          accept={Object.values(fileExtensionWhitelist)}
          title="Dragðu gögn hingað til að hlaða upp"
          buttonLabel="Velja gögn til að hlaða upp"
          onChange={(files) =>
            handleUpload(
              addUploadFiles(files, {
                category: CaseFileCategory.CIVIL_CLAIM,
                civilClaimantId: civilClaimant.id,
              }),
              updateUploadFile,
            )
          }
          onOpenFile={(file) => onOpenFile(file as TUploadFile)}
          onRemove={(file) =>
            handleRemove(file as TUploadFile, removeUploadFile)
          }
          onRetry={(file) =>
            handleRetry(file as TUploadFile, updateUploadFile)
          }
        />
      </Box>
    </>
  )
}
