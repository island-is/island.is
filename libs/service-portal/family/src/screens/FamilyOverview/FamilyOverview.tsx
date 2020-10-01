import { Box, Hidden, Icon, Stack, Typography } from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import React from 'react'
import { Link } from 'react-router-dom'
import * as styles from './FamilyOverview.treat'

const FamilyOverview: ServicePortalModuleComponent = ({ userInfo }) => {
  return (
    <>
      <Box marginBottom={[2, 3, 4]}>
        <Typography variant="h1">Fjölskyldan</Typography>
      </Box>

      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        paddingY={[2, 3]}
        paddingX={[3, 4]}
        border="standard"
        borderRadius="large"
      >
        <div>
          <Typography variant="h3">{userInfo.profile.name}</Typography>
          <div>Kennitala: {userInfo.profile.natreg}</div>
          <Box marginTop={2}>
            <Link to={ServicePortalPath.MinarUpplysingar}>Gera breytingar</Link>
          </Box>
        </div>
        <Hidden below="sm">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius="circle"
            background="purple200"
            className={styles.avatar}
          >
            <Icon type="user" color="purple400" width={40} height={40} />
          </Box>
        </Hidden>
      </Box>
    </>
  )
}

export default FamilyOverview
