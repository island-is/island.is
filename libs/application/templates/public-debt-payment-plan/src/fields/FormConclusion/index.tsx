import { FieldBaseProps, formatText } from '@island.is/application/core'
import {
  AccordionCard,
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { Illustration } from '../../assets'
import { conclusion, betaTest } from '../../lib/messages'

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
      <Box paddingTop="gutter">
        <AccordionCard
          id="conclusion.betaTest"
          label={formatText(betaTest.title, application, formatMessage)}
          labelVariant="h3"
        >
          <Box paddingTop="smallGutter">
            <Box component="span" display="block" paddingTop={'smallGutter'}>
              <Text>
                {`${formatText(
                  betaTest.descriptionFirstPart,
                  application,
                  formatMessage,
                )} `}
                <Link
                  href={formatText(betaTest.email, application, formatMessage)}
                >
                  <span>{` ${formatText(
                    betaTest.emailText,
                    application,
                    formatMessage,
                  )}`}</span>
                </Link>
                {formatText(
                  betaTest.descriptionSecondPart,
                  application,
                  formatMessage,
                )}
              </Text>
            </Box>
          </Box>
        </AccordionCard>
      </Box>
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
