import React from 'react'
import DescriptionText from '../../components/DescriptionText'
import { applicant } from '../../lib/messages'

export const DescriptionInlineLink = () => {
  return (
    <DescriptionText
      text={applicant.labels.permanent.description}
      textProps={{
        as: 'p',
        fontWeight: 'light',
        marginBottom: 0,
      }}
    />
  )
}
