import { FieldBaseProps, formatText } from '@island.is/application/core'
import {
  AccordionCard,
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { FamilyIllustration } from '../../assets'
import { conclusion } from '../../lib/messages'

export const FormConclusion: FC<FieldBaseProps> = ({ application, field }) => {
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
      <AccordionCard
        id="conclusion.information"
        label={formatText(
          conclusion.information.title,
          application,
          formatMessage,
        )}
        labelVariant="h3"
        startExpanded
      >
        <Text marginBottom={[3, 3, 4]}>
          {formatText(
            conclusion.information.description,
            application,
            formatMessage,
          )}
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
          <Bullet>
            {formatText(
              conclusion.information.bulletFour,
              application,
              formatMessage,
            )}
          </Bullet>
        </BulletList>
      </AccordionCard>
      <Box
        marginTop={[5, 5, 6]}
        marginBottom={[5, 8, 10]}
        display="flex"
        justifyContent="center"
      >
        <FamilyIllustration />
      </Box>
    </Box>
  )
}
