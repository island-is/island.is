import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Text } from '@island.is/island-ui/core'
import { FC } from 'react'

export const OverviewOtherDocuments: FC<
React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { answers } = application
  const files = getValueViaPath<{key: string, name: string}[]>(
    answers,
    'heirsAdditionalInfoFilesOtherDocuments',
  )
  return (
    files?.map((file) => (
      <Text key={file.key}>{file.name}</Text>
    ))
  )
}

export default OverviewOtherDocuments
