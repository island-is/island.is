import { FieldBaseProps, formatText } from '@island.is/application/core'
import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { Illustration } from '../../assets'
import { conclusion } from '../../lib/messages'

export const FormConclusion: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box marginY={5}>
        <AlertMessage
          type="success"
          title={formatText(
            conclusion.general.alertTitle,
            application,
            formatMessage,
          )}
        />
      </Box>
      <Text variant="h3" marginBottom={2}>
        {formatText(conclusion.information.title, application, formatMessage)}
      </Text>
      <BulletList space={2} type="ul">
        <Bullet>
          {formatText(
            conclusion.information.bulletOne,
            application,
            formatMessage,
          )}
        </Bullet>
        <Bullet>
          {formatText(
            conclusion.information.bulletTwo,
            application,
            formatMessage,
          )}
        </Bullet>
        <Bullet>
          {formatText(
            conclusion.information.bulletThree,
            application,
            formatMessage,
          )}
        </Bullet>
      </BulletList>
      <Box
        marginTop={[5, 5, 10]}
        marginBottom={5}
        display="flex"
        justifyContent="center"
      >
        <Illustration />
      </Box>
    </Box>
  )
}
