import { Box, Hidden, Icon, Typography } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useNationalRegistryFamilyInfo } from '@island.is/service-portal/graphql'
import React from 'react'
import * as styles from './FamilyOverview.treat'

const FamilyOverview: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()
  const { data: natRegFamilyInfo } = useNationalRegistryFamilyInfo(
    userInfo.profile.natreg,
  )
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
      {natRegFamilyInfo?.map((familyMember) => (
        <Box
          display="flex"
          alignItems="center"
          paddingY={[2, 3]}
          paddingX={[3, 4]}
          border="standard"
          borderRadius="large"
          marginBottom={[2, 3, 4]}
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
              <Icon
                type="outline"
                icon="person"
                color="purple400"
                size="large"
              />
            </Box>
          </Hidden>

          <div>
            <Typography variant="h3" color="blue400">
              {familyMember.fullName}
            </Typography>
            <div>
              {formatMessage({
                id: 'service.portal:natreg',
                defaultMessage: 'Kennitala',
              })}
              : {familyMember.nationalId}
            </div>
          </div>
        </Box>
      ))}
    </>
  )
}
export default FamilyOverview
