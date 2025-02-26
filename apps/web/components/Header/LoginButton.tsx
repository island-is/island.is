import React from 'react'
import { useWindowSize } from 'react-use'

import { Button, ButtonTypes } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { ProjectBasePath } from '@island.is/shared/constants'
import { useI18n } from '@island.is/web/i18n'

export const LoginButton = (props: {
  colorScheme: ButtonTypes['colorScheme']
}) => {
  const { t } = useI18n()
  const { width } = useWindowSize()

  const isMobile = width < theme.breakpoints.md

  return (
    <a href={ProjectBasePath.ServicePortal} tabIndex={-1}>
      <Button
        colorScheme={props.colorScheme}
        variant="utility"
        icon="person"
        title={isMobile ? t.login : undefined}
        as="span"
      >
        {!isMobile && t.login}
      </Button>
    </a>
  )
}
