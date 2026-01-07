import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useUserInfo } from '@island.is/react-spa/bff'
import { getValueViaPath } from '@island.is/application/core'
import { nationalIdsMatch } from '../../lib/utils/helpers'
import { EstateMember } from '../../types'

export const AssigneeCard: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()
  const heirs = getValueViaPath<EstateMember[]>(
    application.answers,
    'heirs.data',
    [],
  )

  const currentUserHeir = heirs?.find((heir) =>
    nationalIdsMatch(heir.nationalId, userInfo?.profile?.nationalId),
  )

  const hasApproved = currentUserHeir?.approved

  if (hasApproved) {
    return (
      <Box marginBottom={2}>
        <AlertMessage
          type="success"
          title={formatMessage(m.assigneeApprovedTitle)}
          message={formatMessage(m.assigneeApprovedDescription)}
        />
      </Box>
    )
  }

  return (
    <Box marginBottom={2}>
      <AlertMessage
        type="info"
        title={formatMessage(m.assigneeInReviewInfoTitle)}
        message={formatMessage(m.assigneeInReviewInfoDescription)}
      />
    </Box>
  )
}

export default AssigneeCard
