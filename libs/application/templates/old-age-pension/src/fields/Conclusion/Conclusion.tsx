import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ApplicationConfigurations,
  FieldBaseProps,
} from '@island.is/application/types'
import {
  Box,
  Bullet,
  BulletList,
  Button,
  AlertMessage,
  ActionCard,
  AccordionCard,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { oldAgePensionFormMessage } from '../../lib/messages'
import RetirementIllustration from '../../assets/Images/Retirement'
import * as styles from './Conclusion.css'
import Markdown from 'markdown-to-jsx'

const Conclusion: FC<FieldBaseProps> = ({ application, field }) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const handleRefresh = () => {
    navigate(`/${ApplicationConfigurations.OldAgePension.slug}`)
    navigate(
      `/${ApplicationConfigurations.OldAgePension.slug}/${application.id}`,
    )
    navigate(0)
  }

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="column"
        rowGap={[4, 4, 5]}
        marginTop={[4, 4, 5]}
      >
        <AlertMessage
          type="warning"
          title={formatMessage(
            oldAgePensionFormMessage.conclusionScreen.alertTitle,
          )}
        />
        <ActionCard
          cta={{
            label: formatMessage(
              oldAgePensionFormMessage.conclusionScreen.incomePlanCardLabel,
            ),
            onClick: () => console.log('Click! - Not implemented'), // TODO: Implement when Income plan is ready?
          }}
          heading={formatMessage(
            oldAgePensionFormMessage.conclusionScreen.incomePlanCardHeading,
          )}
          text={formatMessage(
            oldAgePensionFormMessage.conclusionScreen.incomePlanCardText,
          )}
          backgroundColor="blue"
        />
        <AccordionCard
          startExpanded={true}
          id={`conclusion-card-${field.id}`}
          label={formatMessage(
            oldAgePensionFormMessage.conclusionScreen.nextStepsLabel,
          )}
        >
          <Text marginBottom={4}>
            {formatMessage(
              oldAgePensionFormMessage.conclusionScreen.nextStepsText,
            )}
          </Text>
          <BulletList space="gutter" type="ul">
            <Markdown
              options={{
                overrides: {
                  li: {
                    component: Bullet,
                  },
                },
              }}
            >
              {formatMessage(
                oldAgePensionFormMessage.conclusionScreen.bulletList,
              )}
            </Markdown>
          </BulletList>
        </AccordionCard>
        <RetirementIllustration />
      </Box>
      <Box marginTop={7} className={styles.buttonContainer}>
        <Box
          display="flex"
          flexDirection="rowReverse"
          alignItems="center"
          justifyContent="spaceBetween"
          paddingTop={[1, 4]}
        >
          <Box display="inlineFlex" padding={2} paddingRight="none">
            <Button icon="arrowForward" onClick={handleRefresh} type="submit">
              {formatMessage(
                oldAgePensionFormMessage.conclusionScreen
                  .buttonsViewApplication,
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Conclusion
