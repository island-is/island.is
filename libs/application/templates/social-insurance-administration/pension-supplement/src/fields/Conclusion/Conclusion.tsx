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
import { pensionSupplementFormMessage } from '../../lib/messages'
import RetirementIllustration from '../../assets/Images/Retirement'
import * as styles from './Conclusion.css'
import Markdown from 'markdown-to-jsx'
import { MessageWithLinkButtonFormField } from '@island.is/application/ui-fields'
import { coreMessages } from '@island.is/application/core'

const Conclusion: FC<FieldBaseProps> = ({ application, field }) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const handleRefresh = () => {
    navigate(`/${ApplicationConfigurations.PensionSupplement.slug}`)
    navigate(
      `/${ApplicationConfigurations.PensionSupplement.slug}/${application.id}`,
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
            pensionSupplementFormMessage.conclusionScreen.alertTitle,
          )}
        />
        <AccordionCard
          startExpanded={true}
          id={`conclusion-card-${field.id}`}
          label={formatMessage(
            pensionSupplementFormMessage.conclusionScreen.nextStepsLabel,
          )}
        >
          <Text marginBottom={4}>
            {formatMessage(
              pensionSupplementFormMessage.conclusionScreen.nextStepsText,
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
                pensionSupplementFormMessage.conclusionScreen.bulletList,
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
                pensionSupplementFormMessage.conclusionScreen
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
