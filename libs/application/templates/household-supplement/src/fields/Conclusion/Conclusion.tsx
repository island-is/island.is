import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ApplicationConfigurations,
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import {
  Box,
  Bullet,
  BulletList,
  Button,
  AlertMessage,
  AccordionCard,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { householdSupplementFormMessage } from '../../lib/messages'
import MovingIllustration from '../../assets/Images/Moving'
import * as styles from './Conclusion.css'
import Markdown from 'markdown-to-jsx'
import { MessageWithLinkButtonFormField } from '@island.is/application/ui-fields'
import { coreMessages } from '@island.is/application/core'

const Conclusion: FC<FieldBaseProps> = ({ application, field }) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const handleRefresh = () => {
    navigate(`/${ApplicationConfigurations.HouseholdSupplement.slug}`)
    navigate(
      `/${ApplicationConfigurations.HouseholdSupplement.slug}/${application.id}`,
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
          type="success"
          title={formatMessage(
            householdSupplementFormMessage.conclusionScreen.alertTitle,
          )}
        />
        <AccordionCard
          startExpanded={true}
          id={`conclusion-card-${field.id}`}
          label={formatMessage(
            householdSupplementFormMessage.conclusionScreen.nextStepsLabel,
          )}
        >
          <Text marginBottom={4}>
            {formatMessage(
              householdSupplementFormMessage.conclusionScreen.nextStepsText,
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
                householdSupplementFormMessage.conclusionScreen.bulletList,
              )}
            </Markdown>
          </BulletList>
        </AccordionCard>
        <MessageWithLinkButtonFormField
          application={application}
          field={{
            ...field,
            type: FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD,
            component: FieldComponents.MESSAGE_WITH_LINK_BUTTON_FIELD,
            url: '/minarsidur/umsoknir',
            buttonTitle: coreMessages.openServicePortalButtonTitle,
            message: coreMessages.openServicePortalMessageText,
          }}
        />
        <MovingIllustration />
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
                householdSupplementFormMessage.conclusionScreen
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
