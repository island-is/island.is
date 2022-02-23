import { FieldBaseProps } from '@island.is/application/core'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { AccidentNotification } from '../../lib/dataSchema'
import { isInjuredAndRepresentativeOfCompanyOrInstitute } from '../../utils'

interface HiddenInformationProps {
  field: {
    props: {
      id: string
    }
  }
}

export const HiddenInformation: FC<FieldBaseProps & HiddenInformationProps> = ({
  application,
  field,
}) => {
  const { register } = useFormContext()
  const { id } = field.props

  const answers = application.answers as AccidentNotification

  return !isInjuredAndRepresentativeOfCompanyOrInstitute(
    application.answers,
  ) ? null : (
    <>
      <input
        type="hidden"
        value={answers.applicant.name}
        ref={register({ required: true })}
        name={`${id}.name`}
      />
      <input
        type="hidden"
        value={answers.applicant.email}
        ref={register({ required: true })}
        name={`${id}.email`}
      />
    </>
  )
}
