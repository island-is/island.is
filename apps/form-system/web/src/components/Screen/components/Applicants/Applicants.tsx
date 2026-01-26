import { useQuery } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import { IDENTITY_QUERY } from '@island.is/form-system/graphql'
import {
  ApplicantTypesEnum,
  getValue,
  IndividualApplicant,
  m,
  NationalIdField,
} from '@island.is/form-system/ui'
import { Box, Input, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { USER_PROFILE } from '@island.is/portals/my-pages/graphql'
import { useUserInfo } from '@island.is/react-spa/bff'
import { useEffect } from 'react'
import { useApplicationContext } from '../../../../context/ApplicationProvider'

interface Props {
  applicantField: FormSystemField
}

const individuals: ApplicantTypesEnum[] = [
  ApplicantTypesEnum.INDIVIDUAL,
  ApplicantTypesEnum.INDIVIDUAL_GIVING_DELEGATION,
  ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_INDIVIDUAL,
  ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY,
  ApplicantTypesEnum.INDIVIDUAL_WITH_PROCURATION,
]

// This needs to be reworked!!!!
const getNationalId = (
  userNationalId: string,
  actor: string | undefined,
  applicantType: ApplicantTypesEnum,
) => {
  if (applicantType === ApplicantTypesEnum.INDIVIDUAL) {
    return actor ? actor : userNationalId
  }
  if (applicantType === ApplicantTypesEnum.LEGAL_ENTITY) {
    return userNationalId
  }
  if (
    applicantType ===
    ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_INDIVIDUAL
  ) {
    return actor ?? ''
  }
  if (
    applicantType ===
    ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY
  ) {
    return actor ?? ''
  }
  if (applicantType === ApplicantTypesEnum.INDIVIDUAL_WITH_PROCURATION) {
    return actor ?? ''
  }
  if (applicantType === ApplicantTypesEnum.LEGAL_ENTITY_OF_PROCURATION_HOLDER) {
    return userNationalId
  }

  return actor ?? userNationalId
}

export const Applicants = ({ applicantField }: Props) => {
  const { dispatch } = useApplicationContext()
  const { formatMessage, lang } = useLocale()
  const userInfo = useUserInfo()
  const { applicantType } = applicantField.fieldSettings ?? {}
  const isLegalEntity =
    applicantType === ApplicantTypesEnum.LEGAL_ENTITY ||
    applicantType === ApplicantTypesEnum.LEGAL_ENTITY_OF_PROCURATION_HOLDER
  const nationalId = getNationalId(
    userInfo?.profile?.nationalId,
    userInfo?.profile?.actor?.nationalId,
    applicantType as ApplicantTypesEnum,
  )

  useQuery(USER_PROFILE, {
    fetchPolicy: 'cache-first',
    onCompleted: (data) => {
      console.log('USER_PROFILE data', data)
      const { mobilePhoneNumber, email } = data.getUserProfile
      dispatch({
        type: 'SET_PHONE_NUMBER',
        payload: { id: applicantField.id, value: mobilePhoneNumber },
      })
      dispatch({
        type: 'SET_EMAIL',
        payload: { id: applicantField.id, value: email },
      })
    },
  })

  useQuery(IDENTITY_QUERY, {
    variables: { input: { nationalId } },
    fetchPolicy: 'cache-first',
    skip: !nationalId,
    onCompleted: (data) => {
      const { name, address } = data.identity
      dispatch({
        type: 'SET_NAME',
        payload: {
          id: applicantField.id,
          value: name,
        },
      })
      dispatch({
        type: 'SET_ADDRESS',
        payload: {
          id: applicantField.id,
          address: address.streetAddress,
          postalCode: address.postalCode,
        },
      })
    },
  })

  const isIndividualType =
    typeof applicantType === 'string' &&
    individuals.includes(applicantType as ApplicantTypesEnum)

  useEffect(() => {
    dispatch({
      type: 'SET_NATIONAL_ID',
      payload: { id: applicantField.id, value: nationalId },
    })
  }, [dispatch, applicantField.id, nationalId])

  return (
    <>
      {isIndividualType && (
        <IndividualApplicant
          applicant={applicantField}
          nationalId={nationalId}
          dispatch={dispatch}
        />
      )}
      {isLegalEntity && (
        <Box marginTop={4}>
          <Text variant="h2" as="h2" marginBottom={3}>
            {applicantField?.name?.[lang]}
          </Text>
          <Stack space={2}>
            <NationalIdField
              disabled={false}
              legalEntity
              nationalId={nationalId}
              name={getValue(applicantField, 'name')}
            />
            <Input
              label={formatMessage(m.address)}
              name="address"
              placeholder={formatMessage(m.address)}
              backgroundColor="white"
              value={getValue(applicantField, 'address') || ''}
            />
            <Input
              label={formatMessage(m.postalCode)}
              name="postalCode"
              placeholder={formatMessage(m.postalCode)}
              backgroundColor="white"
              value={getValue(applicantField, 'postalCode') || ''}
            />
          </Stack>
        </Box>
      )}
    </>
  )
}
