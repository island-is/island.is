import React from 'react'
import { Box, BulletList, Bullet } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { formatText } from '@island.is/application/core'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

export const SpouseDone = ({ application }: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()
  const bullets = [m.spouseBullet1, m.spouseBullet2, m.spouseBullet3]

  return (
    <Box>
      <Text variant="h3" marginBottom={2}>
        {formatMessage(m.nextSteps)}
      </Text>
      <BulletList type={'ul'} space={2}>
        {bullets.map((bullet, i) => (
          <Bullet key={i}>
            {formatText(bullet, application, formatMessage)}
          </Bullet>
        ))}
      </BulletList>
    </Box>
  )
}
