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

export const HiddenInformation: FC<
  React.PropsWithChildren<FieldBaseProps & HiddenInformationProps>
> = ({ application, field }) => {
  const { register, setValue } = useFormContext()
  const { id } = field.props

  const answers = application.answers as AccidentNotification

  if (isInjuredAndRepresentativeOfCompanyOrInstitute(application.answers)) {
    setValue(`${id}.name`, answers.applicant.name)
    setValue(`${id}.email`, answers.applicant.email)
  }

  return !isInjuredAndRepresentativeOfCompanyOrInstitute(
    application.answers,
  ) ? null : (
    <>
      <input type="hidden" {...register(`${id}.name`, { required: true })} />
      <input type="hidden" {...register(`${id}.email`, { required: true })} />
    </>
  )
}
