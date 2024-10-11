import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Input, Box } from '@island.is/island-ui/core'
import { useFormContext } from 'react-hook-form'
import { MissingInfoType } from '../../utils/types'

export const HiddenDateField = ({ application }: FieldBaseProps) => {
  const { register } = useFormContext()
  const missingInfo =
    (getValueViaPath(
      application.answers,
      'missingInfo',
    ) as MissingInfoType[]) || []

  let index = 0

  if (missingInfo.length > 0) {
    index = missingInfo.length
  }

  return (
    <Box hidden>
      <Input
        id={`missingInfo[${index}].date`}
        {...register(`missingInfo[${index}].date`)}
        defaultValue={`${new Date()}`}
      />
    </Box>
  )
}
