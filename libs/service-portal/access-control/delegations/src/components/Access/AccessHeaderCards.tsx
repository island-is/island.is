import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatNationalId } from '@island.is/service-portal/core'
import { User } from '@island.is/shared/types'
import { IdentityCard } from '../IdentityCard'

type AccessHeaderCardsProps = {
  userInfo: User
  domain: {
    title: string
    imgSrc: string
  }
}

export const AccessHeaderCards = ({
  userInfo,
  domain,
}: AccessHeaderCardsProps) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      width="full"
      display="flex"
      flexDirection={['column', 'row']}
      rowGap={[3, 0]}
      columnGap={[0, 3]}
    >
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
          id: 'sp.access-control-delegations:domain',
          defaultMessage: 'Kerfi',
        })}
        title={domain.title}
        imgSrc={domain.imgSrc}
      />
    </Box>
  )
}
