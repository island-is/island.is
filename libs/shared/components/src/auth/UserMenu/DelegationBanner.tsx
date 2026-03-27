import {
  Box,
  Button,
  GridContainer,
  Hidden,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useAuth, useUserInfo } from '@island.is/react-spa/bff'
import { userMessages } from '@island.is/shared/translations'
import { checkDelegation } from '@island.is/shared/utils'
import * as styles from './DelegationBanner.css'

export const DelegationBanner = () => {
  const user = useUserInfo()
  const { formatMessage } = useLocale()
  const { switchUser } = useAuth()

  const isDelegation = checkDelegation(user)
  const actor = user?.profile?.actor

  if (!isDelegation || !actor || !user) {
    return null
  }

  return (
    <div className={styles.banner}>
      <GridContainer>
        <Box display="flex" alignItems="center" width="full">
          <Box flexGrow={1} />
          <Text color="white" variant="eyebrow" as="span">
            {formatMessage(userMessages.delegationBannerText, {
              name: user.profile.name,
            })}
          </Text>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flexEnd"
            flexGrow={1}
          >
            <Hidden below="md">
              <Box style={{ marginBottom: 4 }}>
                <Button
                  variant="text"
                  size="small"
                  colorScheme="negative"
                  onClick={() => switchUser(actor.nationalId)}
                  icon="logOut"
                  iconType="outline"
                >
                  {formatMessage(userMessages.exitDelegation)}
                </Button>
              </Box>
            </Hidden>
          </Box>
        </Box>
      </GridContainer>
    </div>
  )
}
