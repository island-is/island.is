import { FieldBaseProps } from '@island.is/application/types'
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
        {...register(`${id}.name`, { required: true })}
      />
      <input
        type="hidden"
        value={answers.applicant.email}
        {...register(`${id}.email`, { required: true })}
      />
    </>
  )
}
