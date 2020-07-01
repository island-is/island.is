import React from 'react'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'

import { ContentLoader } from '@island.is/gjafakort-web/components'

import MobileForm from './MobileForm'
import ConfirmCodeForm from './ConfirmCodeForm'

interface PropTypes {
  mobileNumber?: string
  onSubmit: (mobile: string, confirmCode: string) => void
}

const ConfirmMobileMutation = gql`
  mutation ConfirmMobileMutation($input: ConfirmMobileInput!) {
    confirmMobile(input: $input) {
      success
      mobile
    }
  }
`

function MobileSteps({ onSubmit, mobileNumber }: PropTypes) {
  const [confirmMobile, { data, loading }] = useMutation(ConfirmMobileMutation)
  const {
    confirmMobile: { mobile },
  } = data || { confirmMobile: {} }

  const sendConfirmation = async ({ phoneNumber }, { setSubmitting }) => {
    setSubmitting(true)
    await confirmMobile({
      variables: {
        input: {
          mobile: phoneNumber,
        },
      },
    })
    setSubmitting(false)
  }

  const onConfirmSubmit = ({ confirmCode }) => {
    onSubmit(mobile || mobileNumber, confirmCode)
  }

  console.log(loading, data, mobile, mobileNumber)
  if (loading) {
    return <ContentLoader />
  } else if (!mobile && !mobileNumber) {
    return <MobileForm onSubmit={sendConfirmation} />
  } else {
    return <ConfirmCodeForm onSubmit={onConfirmSubmit} />
  }
}

export default MobileSteps
