import React, { FC } from 'react'
import { formatText } from '@island.is/application/core'
import { Box, Bullet, BulletList, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MissingInfoType, ReviewFieldProps } from '../../types'
import AgentComment from '../AgentComment/AgentComment'
import MissingInfoRemarks from '../MissingInfoRemarks/MissingInfoRemarks'
import { m } from '../../forms/messages'

interface Props extends ReviewFieldProps {
  missingInfo: MissingInfoType
}

const ReviewMissingInfo: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
  isEditable,
  missingInfo = {},
  index: missingInfoIndex,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingY={2}>
      <Stack space={4}>
        <AgentComment application={application} field={field} />
        <Stack space={1}>
          <Text variant="h5">
            {formatText(m.missingInfoAnswersTitle, application, formatMessage)}
          </Text>
          <MissingInfoRemarks
            application={application}
            field={field}
            isEditable={isEditable}
            index={missingInfoIndex}
          />
        </Stack>
        {missingInfo.files && missingInfo.files?.length > 0 && (
          <Stack space={1}>
            <Text variant="h5">
              {formatText(m.attachedFilesTitle, application, formatMessage)}
            </Text>
            <BulletList type={'ul'}>
              {missingInfo.files.map((file: string, fileIndex: number) => (
                <Bullet key={`${missingInfo.date}_file${fileIndex}`}>
                  {file}
                </Bullet>
              ))}
            </BulletList>
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

export default ReviewMissingInfo
