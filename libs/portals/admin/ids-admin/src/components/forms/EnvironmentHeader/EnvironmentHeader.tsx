import React, { ReactNode } from 'react'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import { Text, Box, Select, Option } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useRouteLoaderData } from 'react-router-dom'

import { m } from '../../../lib/messages'
import { authAdminEnvironments } from '../../../shared/utils/environments'
import * as styles from './EnvironmentHeader.css'

interface EnvironmentHeaderProps {
  title: string
  selectedEnvironment: AuthAdminEnvironment
  availableEnvironments: AuthAdminEnvironment[]
  onChange(value: AuthAdminEnvironment): void
  preHeader?: ReactNode
}

const formatOption = (
  label: AuthAdminEnvironment | string,
  value: AuthAdminEnvironment,
) => ({
  label,
  value,
})

export const EnvironmentHeader = ({
  title,
  selectedEnvironment,
  availableEnvironments,
  onChange,
  preHeader,
}: EnvironmentHeaderProps) => {
  const { formatMessage } = useLocale()

  const options = authAdminEnvironments.map((env) =>
    formatOption(
      availableEnvironments.includes(env)
        ? env
        : formatMessage(m.publishEnvironment, {
            environment: env,
          }),
      env,
    ),
  )

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
      </Box>
      <div className={styles.selectWrapper}>
        <Select
          name="env"
          icon="chevronDown"
          size="sm"
          backgroundColor="blue"
          label={formatMessage(m.environment)}
          onChange={(opt) => {
            const { value } = opt as Option

            if (value) {
              onChange(value as AuthAdminEnvironment)
            }
          }}
          value={formatOption(selectedEnvironment, selectedEnvironment)}
          options={options}
        />
      </div>
    </Box>
  )
}
