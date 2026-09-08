import React, { ReactNode } from 'react'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import { Box, Select, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'
import { authAdminEnvironments } from '../../utils/environments'
import * as styles from './TenantEnvironmentHeader.css'

interface TenantEnvironmentHeaderProps {
  title: string
  selectedEnvironment: AuthAdminEnvironment
  /**
   * Environments the tenant currently exists in. Used to decide whether
   * picking an option switches view (already exists) or opens the publish
   * flow (not yet published).
   */
  availableEnvironments: AuthAdminEnvironment[]
  /**
   * All environments the system is configured for. Iteration source for the
   * dropdown – so a tenant that only exists in Development still gets
   * "Publish to Staging" as an option when Staging is configured.
   */
  configuredEnvironments: AuthAdminEnvironment[]
  onChange(value: AuthAdminEnvironment): void
  preHeader?: ReactNode
  postHeader?: ReactNode
}

const formatOption = (
  label: AuthAdminEnvironment | string,
  value: AuthAdminEnvironment,
) => ({
  label,
  value,
})

export const TenantEnvironmentHeader = ({
  title,
  selectedEnvironment,
  availableEnvironments,
  configuredEnvironments,
  onChange,
  preHeader,
  postHeader,
}: TenantEnvironmentHeaderProps) => {
  const { formatMessage } = useLocale()

  const options = authAdminEnvironments
    .filter((env) => configuredEnvironments.includes(env))
    .map((env) => {
      const isAvailable = availableEnvironments.includes(env)
      const label = isAvailable
        ? env
        : formatMessage(m.publishEnvironment, { environment: env })
      return formatOption(label, env)
    })

  return (
    <Box
      display="flex"
      columnGap={2}
      rowGap={2}
      justifyContent="spaceBetween"
      flexDirection={['column', 'row']}
    >
      <Box display="flex" flexDirection="column" rowGap={1}>
        {preHeader}
        <Text as="h1" variant="h2">
          {title}
        </Text>
        {postHeader}
      </Box>
      <div className={styles.selectWrapper}>
        <Select
          name="env"
          icon="chevronDown"
          size="sm"
          backgroundColor="blue"
          label={formatMessage(m.environment)}
          onChange={(opt) => {
            if (opt) {
              onChange(opt.value)
            }
          }}
          value={formatOption(selectedEnvironment, selectedEnvironment)}
          options={options}
        />
      </div>
    </Box>
  )
}
