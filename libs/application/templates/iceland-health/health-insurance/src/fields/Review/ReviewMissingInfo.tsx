import { formatText, getValueViaPath } from '@island.is/application/core'
import { Box, Bullet, BulletList, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MissingInfoType, ReviewFieldProps } from '../../utils/types'
import { MissingInfoRemarks } from '../MissingInfoRemarks/MissingInfoRemarks'
import { m } from '../../lib/messages/messages'

interface Props extends ReviewFieldProps {
  missingInfo: MissingInfoType
}

export const ReviewMissingInfo = ({
  application,
  field,
  isEditable,
  missingInfo = { date: '', remarks: '' },
  index: missingInfoIndex,
}: Props) => {
  const { formatMessage } = useLocale()

  const agentComments = getValueViaPath(
    application.answers,
    'agentComments',
  ) as string

  return (
    <Box paddingY={2}>
      <Stack space={4}>
        <Stack space={1}>
          <Text variant="h4">
            {formatText(m.agentCommentsTitle, application, formatMessage)}
          </Text>
          <Text>
            {agentComments
              ? agentComments
              : formatText(m.agentCommentsEmpty, application, formatMessage)}
          </Text>
        </Stack>
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
