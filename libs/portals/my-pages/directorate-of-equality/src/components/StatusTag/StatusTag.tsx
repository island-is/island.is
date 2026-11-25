import { DirectorateOfEqualitySubmissionStatus } from '@island.is/api/schema'
import { Tag } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { getStatusTag } from '../../lib/status'

export const StatusTag = ({
  status,
}: {
  status: DirectorateOfEqualitySubmissionStatus
}) => {
  const { formatMessage } = useLocale()
  const tag = getStatusTag(status, formatMessage)
  return tag ? (
    <Tag variant={tag.variant} outlined disabled>
      {tag.label}
    </Tag>
  ) : null
}
