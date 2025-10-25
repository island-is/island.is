import {
  Box,
  Divider,
  DropdownMenu,
  Icon,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'
import { SYNC_SUFFIX } from '../../utils/getIntent'

import * as styles from './DropdownSync.css'

type DropdownSyncProps<Intent> = {
  inSync: boolean
  isDirty: boolean
  isLoading: boolean
  intent: Intent
}

export const DropdownSync = <Intent,>({
  inSync,
  isDirty,
  isLoading = false,
  intent,
}: DropdownSyncProps<Intent>) => {
  const { formatMessage } = useLocale()

  return (
    <DropdownMenu
      title={inSync ? formatMessage(m.synced) : formatMessage(m.outOfSync)}
      menuLabel={formatMessage(m.synced)}
      icon="chevronDown"
      menuClassName={styles.menu}
      items={[
        {
          title: '',
          render: () => (
            <div key={`${intent}-syncText`}>
              <Box
                justifyContent="center"
                alignItems="center"
                display="flex"
                columnGap={1}
                className={styles.menuItem}
              >
                <Icon
                  icon={inSync ? 'checkmark' : 'warning'}
                  color={inSync ? 'blue400' : 'red400'}
                  size="small"
                  type="outline"
                />
                <Text variant="small" color="blue400">
                  {inSync
                    ? formatMessage(m.syncedAcrossAllEnvironments)
                    : formatMessage(m.notInSyncAcrossAllEnvironments)}
                </Text>
              </Box>
              <Divider />
            </div>
          ),
        },
        ...(inSync || isDirty
          ? []
          : [
              {
                title: '',
                render: () => (
                  <Box
                    key={`${intent}-syncButton`}
                    display="flex"
                    justifyContent="center"
                    padding={2}
                  >
                    {isLoading ? (
                      <LoadingDots size="large" />
                    ) : (
                      <button
                        className={styles.syncButton}
                        type="submit"
                        value={`${intent}${SYNC_SUFFIX}`}
                        name="intent"
                      >
                        <Text
                          variant="small"
                          fontWeight="semiBold"
                          color={'blue400'}
                        >
                          {formatMessage(m.syncSettings)}
                        </Text>
                      </button>
                    )}
                  </Box>
                ),
              },
            ]),
      ]}
    />
  )
}
