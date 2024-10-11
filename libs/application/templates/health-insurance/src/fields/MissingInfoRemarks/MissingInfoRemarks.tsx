import { formatText, getValueViaPath } from '@island.is/application/core'
import { Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { m } from '../../lib/messages/messages'
import { MissingInfoType, ReviewFieldProps } from '../../utils/types'

export const MissingInfoRemarks = ({
  application,
  isEditable = true,
  index = 0,
}: ReviewFieldProps) => {
  const { register } = useFormContext()
  const { formatMessage } = useLocale()

  const missingInfo =
    (getValueViaPath(
      application.answers,
      'missingInfo',
    ) as MissingInfoType[]) || []

  if (missingInfo.length > 0 && isEditable) {
    index = missingInfo.length
  }

  return (
    <Input
      id={`missingInfo[${index}].remarks`}
      {...register(`missingInfo[${index}].remarks`)}
      label={formatText(m.additionalRemarks, application, formatMessage)}
      placeholder={formatText(
        m.additionalRemarksPlaceholder,
        application,
        formatMessage,
      )}
      backgroundColor={'blue'}
      disabled={!isEditable}
      textarea
    />
  )
}
