import { FieldBaseProps } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
import { AccidentNotification } from '../../lib/dataSchema'
import { isInjuredAndRepresentativeOfCompanyOrInstitute } from '../../utils/miscUtils'

type Props = {
  field: {
    props: {
      id: string
    }
  }
}

export const HiddenInformation = ({
  application,
  field,
}: Props & FieldBaseProps) => {
  const { register, setValue } = useFormContext()
  const { id } = field.props

  const answers = application.answers as AccidentNotification

  if (isInjuredAndRepresentativeOfCompanyOrInstitute(application.answers)) {
    setValue(`${id}.name`, answers?.applicant?.name)
    setValue(`${id}.email`, answers?.applicant?.email)
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
