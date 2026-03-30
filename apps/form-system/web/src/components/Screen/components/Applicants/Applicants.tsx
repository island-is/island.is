import { useQuery } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import { IDENTITY_QUERY } from '@island.is/form-system/graphql'
import {
  ApplicantTypesEnum,
  getValue,
  IndividualApplicant,
  LegalEntity,
} from '@island.is/form-system/ui'
import { USER_PROFILE } from '@island.is/portals/my-pages/graphql'
import { useEffect, useState } from 'react'
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

export const Applicants = ({ applicantField }: Props) => {
  const { dispatch } = useApplicationContext()
  const { applicantType } = applicantField.fieldSettings ?? {}
  const isLegalEntity =
    applicantType === ApplicantTypesEnum.LEGAL_ENTITY ||
    applicantType === ApplicantTypesEnum.LEGAL_ENTITY_OF_PROCURATION_HOLDER
  const nationalId = applicantField.values?.[0]?.json?.nationalId ?? ''

  const hasEmail =
    getValue(applicantField, 'email') &&
    getValue(applicantField, 'email') !== ''
  const hasPhoneNumber =
    getValue(applicantField, 'phoneNumber') &&
    getValue(applicantField, 'phoneNumber') !== ''

  // Ensures we only hydrate from USER_PROFILE once (so clearing the field later won't re-populate)
  const [didHydrateFromProfile, setDidHydrateFromProfile] = useState(false)

  // Reset when switching to a different applicant field
  useEffect(() => {
    setDidHydrateFromProfile(false)
  }, [applicantField.id])

  // If both values already exist, permanently disable hydration for this applicant
  useEffect(() => {
    if (!didHydrateFromProfile && hasEmail && hasPhoneNumber) {
      setDidHydrateFromProfile(true)
    }
  }, [didHydrateFromProfile, hasEmail, hasPhoneNumber])

  const { data: userProfileData, error: userProfileError } = useQuery(
    USER_PROFILE,
    {
      fetchPolicy: 'cache-first',
      skip: didHydrateFromProfile || (hasEmail && hasPhoneNumber),
    },
  )

  useEffect(() => {
    if (didHydrateFromProfile) return

    if (userProfileError) {
      setDidHydrateFromProfile(true)
      return
    }

    const profile = userProfileData?.getUserProfile
    if (!profile) return

    const currentHasEmail =
      getValue(applicantField, 'email') &&
      getValue(applicantField, 'email') !== ''
    const currentHasPhoneNumber =
      getValue(applicantField, 'phoneNumber') &&
      getValue(applicantField, 'phoneNumber') !== ''

    const { mobilePhoneNumber, email } = profile

    if (mobilePhoneNumber && !currentHasPhoneNumber) {
      dispatch({
        type: 'SET_PHONE_NUMBER',
        payload: { id: applicantField.id, value: mobilePhoneNumber },
      })
    }
    if (email && !currentHasEmail) {
      dispatch({
        type: 'SET_EMAIL',
        payload: { id: applicantField.id, value: email },
      })
    }

    setDidHydrateFromProfile(true)
  }, [
    didHydrateFromProfile,
    userProfileData,
    userProfileError,
    applicantField,
    dispatch,
  ])

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
        <LegalEntity applicant={applicantField} nationalId={nationalId} />
      )}
    </>
  )
}
