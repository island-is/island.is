import React from 'react'
import { Box, BulletList, Bullet } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { CopyLink } from '@island.is/application/ui-components'
import { formatText } from '@island.is/application/core'
import { Individual } from '../../types'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

export const NextSteps = ({ application }: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()
  const spouseName =
    (application.answers.spouse as Individual).person.name ?? ''

  const bullets = [m.bullet2, m.bullet3, m.bullet4]

  return (
    <Box>
      <Text variant="h3" marginBottom={2}>
        {formatMessage(m.nextSteps)}
      </Text>
      <BulletList type={'ul'} space={2}>
        <Bullet>
          {spouseName} {formatText(m.bullet1, application, formatMessage)}
        </Bullet>
        {bullets.map((bullet, i) => (
          <Bullet key={i}>
            {formatText(bullet, application, formatMessage)}
          </Bullet>
        ))}
      </BulletList>

      <Box marginTop={3}>
        <Text variant="h4">{formatMessage(m.shareLink)}</Text>
        <Box marginTop={2}>
          <CopyLink
            linkUrl={
              `${document.location.origin}/hjonavigsla/` + application.id
            }
            buttonTitle={formatMessage(m.copyLink)}
          />
        </Box>
      </Box>
    </Box>
  )
}
