import {
  ApplicationConfigurations,
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import {
  Box,
  AlertMessage,
  AccordionCard,
  Text,
  Divider,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { conclusion } from '../../lib/messages'
import { ReviewScreenProps } from '../../shared'
import { isLastReviewer } from '../../utils'
import { CopyLink } from '@island.is/application/ui-components'
import { MessageWithLinkButtonFormField } from '@island.is/application/ui-fields'
import { coreMessages } from '@island.is/application/core'

export const ReviewConclusion: FC<
  React.PropsWithChildren<FieldBaseProps & ReviewScreenProps>
> = (props) => {
  const {
    refetch,
    reviewerNationalId = '',
    application,
    coOwnersAndOperators = [],
  } = props
  const { formatMessage } = useLocale()
  const isLast = isLastReviewer(
    reviewerNationalId,
    application.answers,
    coOwnersAndOperators,
  )

  const onForwardButtonClick = () => {
    refetch?.()
  }

  return (
    <Box>
      <Text variant="h2" marginBottom={4}>
        {formatMessage(
          isLast ? conclusion.general.approvedTitle : conclusion.general.title,
        )}
      </Text>
      <Box marginBottom={5}>
        <AlertMessage
          type="success"
          title={formatMessage(conclusion.default.alertMessage)}
        />
      </Box>

      <AccordionCard
        id="conclustion-card"
        label={formatMessage(conclusion.default.accordionTitle)}
        startExpanded={true}
      >
        <Text>
          {formatMessage(
            isLast
              ? conclusion.approved.accordionText
              : conclusion.review.accordionText,
          )}
        </Text>
      </AccordionCard>
      <Box marginTop={3}>
        <Text variant="h4">{formatMessage(conclusion.default.shareLink)}</Text>
        <Box marginTop={2}>
          <CopyLink
            linkUrl={`${document.location.origin}/umsoknir/${ApplicationConfigurations.TransferOfVehicleOwnership.slug}/${application.id}`}
            buttonTitle={formatMessage(conclusion.default.copyLink)}
          />
        </Box>
      </Box>

      <Divider />

      <Box marginTop={3} marginBottom={5}>
        <MessageWithLinkButtonFormField
          application={application}
          field={{
            ...props.field,
            type: FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD,
            component: FieldComponents.MESSAGE_WITH_LINK_BUTTON_FIELD,
            url: '/minarsidur/umsoknir',
            buttonTitle: coreMessages.openServicePortalButtonTitle,
            message: coreMessages.openServicePortalMessageText,
          }}
        />
      </Box>

      <Box display="flex" justifyContent="flexEnd" paddingY={5}>
        <Button icon="arrowForward" onClick={onForwardButtonClick}>
          {formatMessage(conclusion.default.goToStatusButton)}
        </Button>
      </Box>
    </Box>
  )
}
