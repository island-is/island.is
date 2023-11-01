import { PropsWithChildren } from 'react'

import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  Hidden,
  LinkV2,
  Stack,
} from '@island.is/island-ui/core'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'

import { ManualType } from '../utils'
import { ManualHeader } from './ManualHeader'

interface ManualWrapperProps extends PropsWithChildren {
  manual: ManualType
  namespace: Record<string, string>
}

export const ManualWrapper = ({
  manual,
  namespace,
  children,
}: ManualWrapperProps) => {
  const n = useNamespace(namespace)
  const { activeLocale } = useI18n()

  return (
    <GridContainer>
      <Box paddingBottom={6}>
        <Stack space={2}>
          <Hidden below="xl">
            <Box flexGrow={1} marginRight={6} overflow={'hidden'}>
              <LinkV2 href="/">
                <Button
                  preTextIcon="arrowBack"
                  preTextIconType="filled"
                  size="small"
                  type="button"
                  variant="text"
                  truncate
                >
                  {n('goBack', activeLocale === 'is' ? 'Til baka' : 'Go back')}
                </Button>
              </LinkV2>
            </Box>
          </Hidden>

          <GridColumn
            offset={['0', '0', '0', '0', '1/9']}
            span={['9/9', '9/9', '9/9', '9/9', '7/9']}
          >
            <Stack space={3}>
              <ManualHeader manual={manual} namespace={namespace} />
              {children}
            </Stack>
          </GridColumn>
        </Stack>
      </Box>
    </GridContainer>
  )
}
