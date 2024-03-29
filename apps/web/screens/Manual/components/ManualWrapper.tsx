import { PropsWithChildren } from 'react'

import {
  Box,
  Button,
  GridContainer,
  Hidden,
  LinkV2,
  Stack,
} from '@island.is/island-ui/core'
import { HeadWithSocialSharing } from '@island.is/web/components'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'

import SidebarLayout from '../../Layouts/SidebarLayout'
import { ManualType } from '../utils'
import { ManualHeader } from './ManualHeader'

interface ManualWrapperProps extends PropsWithChildren {
  manual: ManualType
  namespace: Record<string, string>
  socialTitle?: string
}

export const ManualWrapper = ({
  manual,
  namespace,
  socialTitle,
  children,
}: ManualWrapperProps) => {
  const n = useNamespace(namespace)
  const { activeLocale } = useI18n()

  return (
    <>
      <HeadWithSocialSharing
        title={socialTitle ?? `${manual?.title} | Ísland.is`}
      />
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
                    {n(
                      'goBack',
                      activeLocale === 'is' ? 'Til baka' : 'Go back',
                    )}
                  </Button>
                </LinkV2>
              </Box>
            </Hidden>

            <SidebarLayout
              flexDirection="rowReverse"
              paddingTop={0}
              sidebarContent={null}
            >
              <Stack space={3}>
                <ManualHeader manual={manual} namespace={namespace} />
                {children}
              </Stack>
            </SidebarLayout>
          </Stack>
        </Box>
      </GridContainer>
    </>
  )
}
