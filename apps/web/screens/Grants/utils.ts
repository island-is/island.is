import { TagVariant } from '@island.is/island-ui/core'
import { FormatMessage } from '@island.is/localization'
import { GrantStatus } from '@island.is/web/graphql/schema'
import { m } from './messages'

export const generateStatusTag = (
  status: GrantStatus,
  formatMessage: FormatMessage,
): { label: string; variant: TagVariant } | undefined => {
  switch (status) {
    case GrantStatus.Open:
      return {
        label: formatMessage(m.search.applicationOpen),
        variant: 'mint',
      }
    case GrantStatus.Closed:
      return {
        label: formatMessage(m.search.applicationClosed),
        variant: 'rose',
      }
    case GrantStatus.SeeDescription:
      return {
        label: formatMessage(m.search.applicationSeeDescription),
        variant: 'purple',
      }
    default:
      return
  }
}
