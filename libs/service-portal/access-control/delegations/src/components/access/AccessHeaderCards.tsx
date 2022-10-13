import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatNationalId } from '@island.is/service-portal/core'
import { IdentityCard } from '../IdentityCard'

type AccessHeaderCardsProps = {
  identity: {
    name: string | undefined
    nationalId: string | undefined
  }
  domain: {
    name: string | undefined
    imgSrc: string | undefined
  }
}

export const AccessHeaderCards = ({
  identity,
  domain,
}: AccessHeaderCardsProps) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      width="full"
      display="flex"
      flexDirection={['column', 'column', 'column', 'row']}
      rowGap={[3, 3, 3, 0]}
      columnGap={[0, 0, 0, 3]}
    >
      {identity?.name && identity?.nationalId ? (
        <IdentityCard
          label={formatMessage({
            id: 'sp.access-control-delegations:signed-in-user',
            defaultMessage: 'Aðgangshafi',
          })}
          title={identity.name}
          description={formatNationalId(identity.nationalId)}
          color="purple"
        />
      ) : (
        <SkeletonLoader width="100%" height={148} />
      )}
      {domain?.name && domain?.imgSrc ? (
        <IdentityCard
          label={formatMessage({
            id: 'sp.access-control-delegations:domain',
            defaultMessage: 'Kerfi',
          })}
          title={domain.name}
          imgSrc={domain.imgSrc}
        />
      ) : (
        <SkeletonLoader width="100%" height={148} />
      )}
    </Box>
  )
}
