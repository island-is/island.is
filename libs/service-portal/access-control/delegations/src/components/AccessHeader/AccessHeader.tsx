import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatNationalId } from '@island.is/service-portal/core'
import { User } from '@island.is/shared/types'
import { IdentityCard } from '../IdentityCard'

type AccessHeaderProps = {
  userInfo: User
}

export const AccessHeader = ({ userInfo }: AccessHeaderProps) => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box width="full" display="flex" columnGap={3}>
        <IdentityCard
          label={formatMessage({
            id: 'sp.access-control-delegations:signed-in-user',
            defaultMessage: 'Innskráður notandi',
          })}
          title={userInfo.profile.name}
          description={formatNationalId(userInfo.profile.nationalId)}
          color="purple"
        />
        <IdentityCard
          label={formatMessage({
            id: 'sp.access-control-delegations:system',
            defaultMessage: 'Kerfi',
          })}
          title={userInfo.profile.name}
          imgSrc="./assets/images/educationDegree.svg"
        />
      </Box>
    </Box>
  )
}
