import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { Markdown } from '@island.is/shared/components'
import {
  Box,
  AlertMessage,
  AccordionCard,
  BulletList,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { MessageWithLinkButtonFormField } from '@island.is/application/ui-fields'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { getApplicationExternalData } from '../../lib/oldAgePensionUtils'
import { oldAgePensionFormMessage } from '../../lib/messages'
import { coreMessages } from '@island.is/application/core'

export const Conclusion: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const { formatMessage } = useLocale()

  const { hasIncomePlanStatus } = getApplicationExternalData(application.externalData)

  if (!hasIncomePlanStatus) {
    return (
      <Box marginTop={2}>
        <Box marginBottom={5}>
          <AlertMessage
            type="warning"
            title={formatMessage(socialInsuranceAdministrationMessage.conclusionScreen.receivedAwaitingIncomePlanTitle)}
            message={formatMessage(socialInsuranceAdministrationMessage.conclusionScreen.incomePlanAlertMessage)}
          />
        </Box>

        <AccordionCard
          id="conclusion-card"
          label={formatMessage(oldAgePensionFormMessage.conclusionScreen.title)}
          startExpanded={true}
        >
          <Box marginBottom={4}>
            <Markdown>
              {formatMessage(oldAgePensionFormMessage.conclusionScreen.nextStepsText)}
            </Markdown>
          </Box>
          <BulletList space="gutter" type="ul">
            <Markdown>
              {formatMessage(oldAgePensionFormMessage.conclusionScreen.bulletList)}
            </Markdown>
          </BulletList>
        </AccordionCard>

        <Box marginTop={3} marginBottom={5}>
          <MessageWithLinkButtonFormField
            application={application}
            field={{
              ...props.field,
              type: FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD,
              component: FieldComponents.MESSAGE_WITH_LINK_BUTTON_FIELD,
              url: 'https://island.is/umsoknir/tekjuaaetlun',
              buttonTitle: socialInsuranceAdministrationMessage.conclusionScreen
              .incomePlanCardLabel,
              message: socialInsuranceAdministrationMessage.conclusionScreen
              .incomePlanCardText,
            }}
          />
        </Box>
      </Box>
    )
  } else {
    return (
      <Box marginTop={2}>
        <Box marginBottom={5}>
          <AlertMessage
            type="success"
            title={formatMessage(socialInsuranceAdministrationMessage.conclusionScreen.alertTitle)}
            message={formatMessage(oldAgePensionFormMessage.conclusionScreen.alertMessage)}
          />
        </Box>

        <AccordionCard
          id="conclusion-card"
          label={formatMessage(oldAgePensionFormMessage.conclusionScreen.title)}
          startExpanded={true}
        >
          <Box marginBottom={4}>
            <Markdown>
              {formatMessage(oldAgePensionFormMessage.conclusionScreen.nextStepsText)}
            </Markdown>
          </Box>
          <BulletList space="gutter" type="ul">
            <Markdown>
              {formatMessage(oldAgePensionFormMessage.conclusionScreen.bulletList)}
            </Markdown>
          </BulletList>
        </AccordionCard>

        <Box marginTop={3} marginBottom={5}>
          <MessageWithLinkButtonFormField
            application={application}
            field={{
              ...props.field,
              type: FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD,
              component: FieldComponents.MESSAGE_WITH_LINK_BUTTON_FIELD,
              url: 'https://island.is/minarsidur/umsoknir',
              buttonTitle: coreMessages.openServicePortalButtonTitle,
              message: coreMessages.openServicePortalMessageText,
            }}
          />
        </Box>
      </Box>
    )
  }
}
