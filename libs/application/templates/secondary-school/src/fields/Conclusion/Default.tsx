import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { FC } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { ApplicationType, ConclusionView } from '../../shared'
import { useLocale } from '@island.is/localization'
import { conclusion } from '../../lib/messages'
import {
  AlertMessageFormField,
  ExpandableDescriptionFormField,
  MessageWithLinkButtonFormField,
} from '@island.is/application/ui-fields'
import { coreMessages, getValueViaPath } from '@island.is/application/core'

interface Props {
  setView: (view: ConclusionView) => void
}

export const ConclusionDefault: FC<
  React.PropsWithChildren<Props & FieldBaseProps>
> = (props) => {
  const { application } = props
  const { formatMessage } = useLocale()

  const isFreshman =
    getValueViaPath<ApplicationType>(
      application.answers,
      'applicationType.type',
    ) === ApplicationType.FRESHMAN

  return (
    <Box>
      <Text variant="h1" marginBottom={2}>
        {formatMessage(conclusion.general.pageTitle)}
      </Text>

      <Box marginBottom={2} display="flex" justifyContent="flexEnd">
        <Button
          colorScheme="default"
          iconType="filled"
          size="small"
          type="button"
          variant="text"
          onClick={() => props.setView(ConclusionView.OVERVIEW)}
        >
          {formatMessage(conclusion.buttons.overview)}
        </Button>
      </Box>

      <AlertMessageFormField
        application={application}
        field={{
          ...props.field,
          type: FieldTypes.ALERT_MESSAGE,
          component: FieldComponents.ALERT_MESSAGE,
          alertType: 'success',
          title: conclusion.general.alertTitle,
          message: isFreshman
            ? conclusion.general.alertMessageFreshman
            : conclusion.general.alertMessageGeneral,
        }}
      />

      <ExpandableDescriptionFormField
        application={application}
        field={{
          ...props.field,
          type: FieldTypes.EXPANDABLE_DESCRIPTION,
          component: FieldComponents.EXPANDABLE_DESCRIPTION,
          title: conclusion.general.accordionTitle,
          description: isFreshman
            ? conclusion.general.accordionTextFreshman
            : conclusion.general.accordionTextGeneral,
          startExpanded: true,
        }}
      />

      <MessageWithLinkButtonFormField
        application={application}
        field={{
          ...props.field,
          type: FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD,
          component: FieldComponents.MESSAGE_WITH_LINK_BUTTON_FIELD,
          url: '/minarsidur/umsoknir',
          buttonTitle: coreMessages.openServicePortalButtonTitle,
          message: coreMessages.openServicePortalMessageText,
          marginBottom: [4, 4, 12],
        }}
      />
    </Box>
  )
}
