import React, { useEffect, useCallback } from 'react'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import { FormikValues, FormikHelpers } from 'formik'

import { ContentLoader } from '@island.is/gjafakort-web/components'

import { MobileForm, ConfirmCodeForm } from '../'

interface PropTypes {
  mobileNumber?: string
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<FormikValues>,
  ) => void
}

const ConfirmMobileMutation = gql`
  mutation ConfirmMobileMutation($input: ConfirmMobileInput!) {
    confirmMobile(input: $input) {
      success
      mobile
    }
  }
`

function ConfirmMobile({ onSubmit, mobileNumber }: PropTypes) {
  const [confirmMobile, { data, loading }] = useMutation(ConfirmMobileMutation)
  const {
    confirmMobile: { mobile },
  } = data || { confirmMobile: {} }

  const sendConfirmationSMS = useCallback(
    async (phoneNumber) => {
      await confirmMobile({
        variables: {
          input: {
            mobile: phoneNumber,
          },
        },
      })
    },
    [confirmMobile],
  )

  const sendConfirmation = async ({ phoneNumber }, { setSubmitting }) => {
    await sendConfirmationSMS(phoneNumber)
    setSubmitting(false)
  }

  const phoneNumber = mobile || mobileNumber

  const onConfirmSubmit = ({ confirmCode }, helpers) => {
    onSubmit({ mobile: phoneNumber, confirmCode }, helpers)
  }

  useEffect(() => {
    if (mobileNumber) {
      sendConfirmationSMS(mobileNumber)
    }
  }, [mobileNumber, sendConfirmationSMS])

  if (loading && !phoneNumber) {
    return <ContentLoader />
  } else if (!mobile && !mobileNumber) {
    return <MobileForm onSubmit={sendConfirmation} />
  } else {
    return (
      <ConfirmCodeForm
        onSubmit={onConfirmSubmit}
        sendConfirmationSMS={() => {
          sendConfirmationSMS(phoneNumber)
        }}
      />
    )
  }
}

export default ConfirmMobile
