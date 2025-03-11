import {
  ApplicationConfigurations,
  FieldBaseProps,
} from '@island.is/application/types'
import { Box, Text, Tooltip } from '@island.is/island-ui/core'
import { CopyLink } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { summary } from '../../lib/messages'

export const CopyApplicationLink: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ ...props }) => {
  const { formatMessage } = useLocale()
  const { application } = props
  return (
    <Box marginTop={3}>
      <Text variant="h5" as="h3">
        {formatMessage(summary.shareLinkLabel)}
        <Tooltip text={formatMessage(summary.shareLinkTooltip)} />
      </Text>

      <CopyLink
        linkUrl={`${document.location.origin}/umsoknir/${ApplicationConfigurations.RentalAgreement.slug}/${application.id}`}
        buttonTitle={formatMessage(summary.shareLinkbuttonLabel)}
      />
    </Box>
  )
}
