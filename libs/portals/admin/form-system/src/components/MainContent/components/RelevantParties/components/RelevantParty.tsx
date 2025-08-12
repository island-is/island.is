import { useMutation } from '@apollo/client'
import { FormSystemFormApplicant } from '@island.is/api/schema'
import { UPDATE_APPLICANT } from '@island.is/form-system/graphql'
import { Box, GridColumn, GridRow, Input } from '@island.is/island-ui/core'
import { ControlContext } from 'libs/portals/admin/form-system/src/context/ControlContext'
import { Dispatch, SetStateAction, useContext } from 'react'
import { m } from '@island.is/form-system/ui'
import { useIntl } from 'react-intl'

interface Props {
  applicantType: FormSystemFormApplicant
  relevantApplicant: FormSystemFormApplicant
  setFormApplicantTypes: Dispatch<SetStateAction<FormSystemFormApplicant[]>>
}

export const RelevantParty = ({
  applicantType,
  relevantApplicant,
  setFormApplicantTypes,
}: Props) => {
  const { formatMessage } = useIntl()
  const { setFocus, focus, getTranslation } = useContext(ControlContext)
  const [updateApplicant] = useMutation(UPDATE_APPLICANT)

  const onBlurHandler = (
    currentString: string,
    applicant: FormSystemFormApplicant,
  ) => {
    if (currentString !== focus) {
      try {
        updateApplicant({
          variables: {
            input: {
              id: applicant.id,
              updateFormApplicantTypeDto: {
                name: applicant.name,
              },
            },
          },
        })
        setFocus('')
      } catch (e) {
        console.error('Error updating applicant', e)
      }
    }
  }

  return (
    <Box paddingLeft={4} paddingTop={2}>
      <GridRow>
        <GridColumn span="5/10">
          <Input
            label={applicantType.description?.is ?? ''}
            name={relevantApplicant.applicantTypeId ?? ''}
            backgroundColor="blue"
            value={relevantApplicant.name?.is ?? ''}
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => onBlurHandler(e.target.value, relevantApplicant)}
            onChange={(e) =>
              setFormApplicantTypes((prev) =>
                prev.map((applicant) => {
                  return applicant.applicantTypeId ===
                    relevantApplicant.applicantTypeId
                    ? {
                        ...applicant,
                        name: { ...applicant.name, is: e.target.value },
                      }
                    : applicant
                }),
              )
            }
          />
        </GridColumn>
        <GridColumn span="5/10">
          <Input
            label={formatMessage(m.englishTranslation)}
            name={'en-' + relevantApplicant.applicantTypeId}
            backgroundColor="blue"
            value={relevantApplicant.name?.en ?? ''}
            onFocus={async (e) => {
              if (
                !relevantApplicant.name?.en &&
                relevantApplicant.name?.is !== ''
              ) {
                const translation = await getTranslation(
                  relevantApplicant.name?.is ?? '',
                )
                setFormApplicantTypes((prev) =>
                  prev.map((applicant) => {
                    return applicant.applicantTypeId ===
                      relevantApplicant.applicantTypeId
                      ? {
                          ...applicant,
                          name: {
                            ...applicant.name,
                            en: translation.translation,
                          },
                        }
                      : applicant
                  }),
                )
              }
              setFocus(e.target.value)
            }}
            onChange={(e) =>
              setFormApplicantTypes((prev) =>
                prev.map((applicant) => {
                  return applicant.applicantTypeId ===
                    relevantApplicant.applicantTypeId
                    ? {
                        ...applicant,
                        name: { ...applicant.name, en: e.target.value },
                      }
                    : applicant
                }),
              )
            }
            onBlur={(e) => onBlurHandler(e.target.value, relevantApplicant)}
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
