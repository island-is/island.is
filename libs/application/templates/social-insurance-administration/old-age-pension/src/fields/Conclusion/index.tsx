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

  const { hasIncomePlanStatus } = getApplicationExternalData(
    application.externalData,
  )

  return (
    <Box marginTop={2}>
      <Box marginBottom={5}>
        <AlertMessage
          type={hasIncomePlanStatus ? 'success' : 'warning'}
          title={
            hasIncomePlanStatus
              ? formatMessage(
                  socialInsuranceAdministrationMessage.conclusionScreen
                    .alertTitle,
                )
              : formatMessage(
                  socialInsuranceAdministrationMessage.conclusionScreen
                    .receivedAwaitingIncomePlanTitle,
                )
          }
          message={
            hasIncomePlanStatus
              ? formatMessage(
                  oldAgePensionFormMessage.conclusionScreen.alertMessage,
                )
              : formatMessage(
                  socialInsuranceAdministrationMessage.conclusionScreen
                    .incomePlanAlertMessage,
                )
          }
        />
      </Box>

      <AccordionCard
        id="conclusion-card"
        label={formatMessage(oldAgePensionFormMessage.conclusionScreen.title)}
        startExpanded={true}
      >
        <Box marginBottom={4}>
          <Markdown>
            {formatMessage(
              oldAgePensionFormMessage.conclusionScreen.nextStepsText,
            )}
          </Markdown>
        </Box>
        <BulletList space="gutter" type="ul">
          <Markdown>
            {formatMessage(
              oldAgePensionFormMessage.conclusionScreen.bulletList,
            )}
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
            url: hasIncomePlanStatus
              ? 'https://island.is/minarsidur/umsoknir'
              : 'https://island.is/umsoknir/tekjuaaetlun',
            buttonTitle: hasIncomePlanStatus
              ? coreMessages.openServicePortalButtonTitle
              : socialInsuranceAdministrationMessage.conclusionScreen
                  .incomePlanCardLabel,
            message: hasIncomePlanStatus
              ? coreMessages.openServicePortalMessageText
              : socialInsuranceAdministrationMessage.conclusionScreen
                  .incomePlanCardText,
          }}
        />
      </Box>
    </Box>
  )
}
