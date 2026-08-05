import {
  Box,
  UserAvatar,
  Text,
  IconProps,
  Icon,
} from '@island.is/island-ui/core'

import { formatNationalId } from '@island.is/portals/core'

import * as styles from './IdentityInfo.css'

export const IdentityInfo = ({
  identity,
  isExpanded,
  icon,
}: {
  isExpanded: boolean
  identity: { nationalId: string; name: string }
  icon?: IconProps['icon']
}) => {
  return (
    <Box display="flex" alignItems="center" columnGap={2}>
      {icon ? (
        <div className={styles.iconContainer}>
          <Icon icon={icon} color="blue400" className={styles.icon} />
        </div>
      ) : (
        <UserAvatar
          color={isExpanded ? 'white' : 'blue'}
          username={identity?.name}
        />
      )}

      <Box>
        <Text variant="medium">{identity?.name}</Text>
        <Text variant="small">{formatNationalId(identity?.nationalId)}</Text>
      </Box>
    </Box>
  )
}
