import { FieldBaseProps, formatText } from '@island.is/application/core'
import {
  AccordionCard,
  AlertMessage,
  Box,
  Bullet,
  Link,
  BulletList,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { FamilyIllustration } from '../../assets'
import { conclusion, betaTest } from '../../lib/messages'
import * as styles from '../DescriptionWithLink/descriptionWithLink.css'

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
                  <span className={styles.link}>{` ${formatText(
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
