import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import {
  Box,
  Button,
  Checkbox,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import {
  BlueBox,
  InputName,
  InputNationalId,
  RequiredStar,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  RequestSharedWhen,
  Victim,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useVictim } from '@island.is/judicial-system-web/src/utils/hooks'
import { useNationalRegistry } from '@island.is/judicial-system-web/src/utils/hooks'

import { LegalRightsProtectorInputFields } from './LegalRightsProtectorInputFields'

interface Props {
  victim: Victim
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
  onDelete: (victim: Victim) => void
}

export const VictimInfo: React.FC<Props> = ({
  victim,
  workingCase,
  setWorkingCase,
  onDelete,
}) => {
  const { updateVictimAndSetState, updateVictimState } = useVictim()

  const [victimNationalIdUpdate, setVictimNationalIdUpdate] = useState<
    string | null
  >(null)
  const [nationalIdNotFound, setNationalIdNotFound] = useState<boolean>(false)
  const { personData, personLoading } = useNationalRegistry(
    victimNationalIdUpdate,
  )

  const handleNationalIdBlur = (nationalId: string) => {
    const normalizedNationalId = normalizeAndFormatNationalId(nationalId)[0]

    setVictimNationalIdUpdate(normalizedNationalId || null)
  }

  useEffect(
    () => {
      if (!victimNationalIdUpdate) return

      const items = personData?.items || []
      const person = items[0]
      setNationalIdNotFound(!personLoading && items.length === 0)

      updateVictimAndSetState(
        {
          caseId: workingCase.id,
          victimId: victim.id,
          nationalId: victimNationalIdUpdate,
          ...(person?.name ? { name: person.name } : {}),
        },
        setWorkingCase,
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [personData, personLoading],
  )

  return (
    <Box marginBottom={3}>
      <BlueBox>
        <Box>
          <Box marginBottom={2} display="flex" justifyContent="flexEnd">
            <Button
              onClick={() => onDelete(victim)}
              colorScheme="destructive"
              variant="text"
              size="small"
              data-testid="deleteVictimButton"
            >
              Eyða
            </Button>
          </Box>
          <Box marginBottom={2}>
            <Checkbox
              name={`hasNationalId-${victim.id}`}
              label={'Brotaþoli er ekki með íslenska kennitölu'}
              checked={victim.hasNationalId === false}
              onChange={(event) => {
                setVictimNationalIdUpdate(null)
                setNationalIdNotFound(false)
                updateVictimAndSetState(
                  {
                    caseId: workingCase.id,
                    victimId: victim.id,
                    hasNationalId: !event.target.checked,
                    nationalId: null,
                  },
                  setWorkingCase,
                )
              }}
              filled
              large
            />
          </Box>

          <Box marginBottom={2}>
            <Box marginBottom={2}>
              <InputNationalId
                isDateOfBirth={victim.hasNationalId === false}
                value={victim.nationalId ?? ''}
                onBlur={(value) => handleNationalIdBlur(value)}
                onChange={(value) => {
                  if (value.length < 11) {
                    setNationalIdNotFound(false)
                  } else if (value.length === 11) {
                    handleNationalIdBlur(value)
                  }
                }}
                required={victim.hasNationalId !== false}
              />
              {victim.nationalId?.length === 10 &&
                nationalIdNotFound &&
                !personLoading && (
                  <Text color="red600" variant="eyebrow" marginTop={1}>
                    Ekki tókst að fletta upp kennitölu
                  </Text>
                )}
            </Box>

            <Box marginBottom={2}>
              <InputName
                value={victim.name ?? ''}
                onBlur={(value) =>
                  updateVictimAndSetState(
                    {
                      caseId: workingCase.id,
                      victimId: victim.id,
                      name: value,
                    },
                    setWorkingCase,
                  )
                }
                onChange={(value) =>
                  updateVictimState(
                    {
                      caseId: workingCase.id,
                      victimId: victim.id,
                      name: value,
                    },
                    setWorkingCase,
                  )
                }
                required
              />
            </Box>
          </Box>
        </Box>
        <Box marginTop={4}>
          <LegalRightsProtectorInputFields
            victim={victim}
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
          />
          <>
            <Text variant="h4" marginTop={2} marginBottom={2}>
              Aðgangur réttargæslumanns að kröfu
              <RequiredStar />
            </Text>
            <Box>
              <RadioButton
                name={`lawyer-access-${victim.id}`}
                id={`lawyer-access-${victim.id}-ready-for-court`}
                label="Gefa réttargæslumanni aðgang að kröfu þegar krafa er send á dómstól"
                checked={
                  victim.lawyerAccessToRequest ===
                  RequestSharedWhen.READY_FOR_COURT
                }
                onChange={() =>
                  updateVictimAndSetState(
                    {
                      caseId: workingCase.id,
                      victimId: victim.id,
                      lawyerAccessToRequest: RequestSharedWhen.READY_FOR_COURT,
                    },
                    setWorkingCase,
                  )
                }
                large
                backgroundColor="white"
                disabled={!victim.lawyerName}
              />
            </Box>
            <Box marginTop={2}>
              <RadioButton
                name={`lawyer-access-${victim.id}`}
                id={`lawyer-access-${victim.id}-arraignment-date`}
                label="Gefa réttargæslumanni aðgang að kröfu við úthlutun fyrirtökutíma"
                checked={
                  victim.lawyerAccessToRequest ===
                  RequestSharedWhen.ARRAIGNMENT_DATE_ASSIGNED
                }
                onChange={() =>
                  updateVictimAndSetState(
                    {
                      caseId: workingCase.id,
                      victimId: victim.id,
                      lawyerAccessToRequest:
                        RequestSharedWhen.ARRAIGNMENT_DATE_ASSIGNED,
                    },
                    setWorkingCase,
                  )
                }
                large
                backgroundColor="white"
                disabled={!victim.lawyerName}
              />
            </Box>
            <Box marginTop={2}>
              <RadioButton
                name={`lawyer-access-${victim.id}`}
                id={`lawyer-access-${victim.id}-when-obligated`}
                label="Ekki gefa réttargæslumanni aðgang að kröfu"
                checked={
                  victim.lawyerAccessToRequest === RequestSharedWhen.OBLIGATED
                }
                onChange={() =>
                  updateVictimAndSetState(
                    {
                      caseId: workingCase.id,
                      victimId: victim.id,
                      lawyerAccessToRequest: RequestSharedWhen.OBLIGATED,
                    },
                    setWorkingCase,
                  )
                }
                large
                backgroundColor="white"
                disabled={!victim.lawyerName}
              />
            </Box>
          </>
        </Box>
      </BlueBox>
    </Box>
  )
}
