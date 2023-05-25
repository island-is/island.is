import { m } from '../../lib/messages'
import React from 'react'
import {
  Box,
  Divider,
  DropdownMenu,
  Icon,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import * as styles from './DropdownSync.css'

type DropdownSyncProps = {
  isInSync: boolean
  isDirty: boolean
  isLoading: boolean
  intent: string
}

export const DropdownSync = ({
  isInSync,
  isDirty,
  isLoading = false,
  intent,
}: DropdownSyncProps) => {
  const { formatMessage } = useLocale()

  return (
    <DropdownMenu
      title={isInSync ? formatMessage(m.synced) : formatMessage(m.outOfSync)}
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
                  icon={isInSync ? 'checkmark' : 'warning'}
                  color={isInSync ? 'blue400' : 'red400'}
                  size="small"
                  type="outline"
                />
                <Text variant="small" color="blue400">
                  {isInSync
                    ? formatMessage(m.syncedAcrossAllEnvironments)
                    : formatMessage(m.notInSyncAcrossAllEnvironments)}
                </Text>
              </Box>
              <Divider />
            </div>
          ),
        },
        ...(isInSync || isDirty
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
                      <LoadingDots large />
                    ) : (
                      <button
                        className={styles.syncButton}
                        type="submit"
                        value={`${intent}-sync`}
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
