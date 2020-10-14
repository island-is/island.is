import {
  Box,
  Hidden,
  IconDeprecated as Icon,
  Stack,
  Typography,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import React from 'react'
import * as styles from './FamilyOverview.treat'

const FamilyOverview: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Box marginBottom={[2, 3, 4]}>
        <Typography variant="h1">
          {formatMessage({
            id: 'service.portal:family',
            defaultMessage: 'Fjölskyldan',
          })}
        </Typography>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        paddingY={[2, 3]}
        paddingX={[3, 4]}
        border="standard"
        borderRadius="large"
      >
        <Hidden below="sm">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginRight={2}
            borderRadius="circle"
            background="purple200"
            className={styles.avatar}
          >
            <Icon type="user" color="purple400" width={40} height={40} />
          </Box>
        </Hidden>
        <div>
          <Typography variant="h3" color="blue400">
            {userInfo.profile.name}
          </Typography>
          <div>
            {formatMessage({
              id: 'service.portal:natreg',
              defaultMessage: 'Kennitala',
            })}
            : {userInfo.profile.natreg}
          </div>
        </div>
      </Box>
    </>
  )
}

export default FamilyOverview
