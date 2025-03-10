import { FormSystemFormApplicant } from '@island.is/api/schema'
import { Dispatch, SetStateAction, useContext } from 'react'
import {
  Box,
  GridColumn as Column,
  GridRow as Row,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { ControlContext } from '../../../../../context/ControlContext'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICANT } from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'

interface Props {
  formApplicantsTypes: FormSystemFormApplicant[]
  setFormApplicantTypes: Dispatch<SetStateAction<FormSystemFormApplicant[]>>
}

export const FormApplicantTypes = ({
  formApplicantsTypes,
  setFormApplicantTypes,
}: Props) => {
  const { formatMessage } = useIntl()
  const { focus, setFocus, applicantTypes } = useContext(ControlContext)
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

  const getApplicantTypeLabel = (type?: string) => {
    if (!type) return ''
    const applicantType = applicantTypes?.find(
      (applicant) => applicant?.id === type,
    )
    return applicantType?.description?.is ?? ''
  }

  return (
    <Stack space={5}>
      {formApplicantsTypes.map((applicantType, index) => {
        return (
          <Box key={index}>
            <Row>
              <Column>
                <Box marginBottom={1}>
                  <Text variant="h4">
                    {getApplicantTypeLabel(
                      applicantType?.applicantTypeId as string,
                    )}
                  </Text>
                </Box>
              </Column>
            </Row>
            <Row>
              <Column span="5/10">
                <Input
                  label={formatMessage(m.name)}
                  name="name"
                  value={applicantType?.name?.is ?? ''}
                  backgroundColor="blue"
                  onFocus={(e) => setFocus(e.target.value)}
                  onBlur={(e) => onBlurHandler(e.target.value, applicantType)}
                  onChange={(e) => {
                    const updatedFormApplicantTypes = [...formApplicantsTypes]
                    updatedFormApplicantTypes[index] = {
                      ...updatedFormApplicantTypes[index],
                      name: {
                        ...updatedFormApplicantTypes[index].name,
                        is: e.target.value,
                      },
                    }
                    setFormApplicantTypes(updatedFormApplicantTypes)
                  }}
                />
              </Column>
              <Column span="5/10">
                <Input
                  label={formatMessage(m.nameEnglish)}
                  name="nameEn"
                  value={applicantType?.name?.en ?? ''}
                  backgroundColor="blue"
                  onFocus={(e) => setFocus(e.target.value)}
                  onBlur={(e) => onBlurHandler(e.target.value, applicantType)}
                  onChange={(e) => {
                    const updatedFormApplicantTypes = [...formApplicantsTypes]
                    updatedFormApplicantTypes[index] = {
                      ...updatedFormApplicantTypes[index],
                      name: {
                        ...updatedFormApplicantTypes[index].name,
                        en: e.target.value,
                      },
                    }
                    setFormApplicantTypes(updatedFormApplicantTypes)
                  }}
                />
              </Column>
            </Row>
          </Box>
        )
      })}
    </Stack>
  )
}
