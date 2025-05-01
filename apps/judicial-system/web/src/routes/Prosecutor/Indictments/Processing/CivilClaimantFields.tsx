import { Dispatch, SetStateAction } from 'react'
import { useIntl } from 'react-intl'

import { Box, Button, Checkbox, Text } from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'
import {
  InputName,
  InputNationalId,
} from '@island.is/judicial-system-web/src/components'
import {
  CivilClaimant,
  UpdateCivilClaimantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './processing.strings'

interface UpdateCivilClaimant
  extends Omit<UpdateCivilClaimantInput, 'caseId'> {}

export const CivilClaimantFields = ({
  civilClaimant,
  civilClaimantIndex,
  removeCivilClaimantById,
  handleSetAndSendCivilClaimantToServer,
  nationalIdNotFound,
  setNationalIdNotFound,
  handleCivilClaimantNationalIdBlur,
  handleUpdateCivilClaimantState,
  handleCivilClaimantNameBlur,
}: {
  civilClaimant: CivilClaimant
  civilClaimantIndex: number
  removeCivilClaimantById: (id: string) => void
  handleSetAndSendCivilClaimantToServer: (update: UpdateCivilClaimant) => void
  nationalIdNotFound: boolean
  setNationalIdNotFound: Dispatch<SetStateAction<boolean>>
  handleCivilClaimantNationalIdBlur: (
    nationalId: string,
    noNationalId?: boolean | null,
    civilClaimantId?: string | null,
  ) => void
  handleUpdateCivilClaimantState: (update: UpdateCivilClaimant) => void
  handleCivilClaimantNameBlur: (
    name: string,
    civilClaimantId?: string | null,
  ) => void
}) => {
  const { formatMessage } = useIntl()

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
    </>
  )
}
