import { formatText, getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  Box,
  Bullet,
  BulletList,
  Divider,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { institutionApplicationMessages as m } from '../../lib/messages'

interface Props {
  application: Application
}

export const Attachments: FC<React.PropsWithChildren<Props>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()

  const attachments = getValueViaPath(
    application.answers,
    'attachments',
  ) as Array<{ key: string; name: string }>

  const hasattachments = attachments && attachments?.length > 0

  return hasattachments ? (
    <>
      <Box>
        <Text variant="h5">
          {formatText(
            m.project.attachmentsSubtitle,
            application,
            formatMessage,
          )}
        </Text>
        <Box marginTop={3} paddingBottom={3}>
          <BulletList type="ul">
            {attachments.map(({ key = '', name = '' }) => (
              <Bullet key={key}>{name}</Bullet>
            ))}
          </BulletList>
        </Box>
      </Box>
      <Divider />
    </>
  ) : null
}
