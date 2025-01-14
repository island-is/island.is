import { PropsWithChildren } from 'react'

import { Box, GridContainer, Stack } from '@island.is/island-ui/core'
import { HeadWithSocialSharing } from '@island.is/web/components'

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
  return (
    <>
      <HeadWithSocialSharing
        title={socialTitle ?? `${manual?.title} | Ísland.is`}
      />
      <GridContainer>
        <Box paddingBottom={6}>
          <Stack space={2}>
            <Box />
            <SidebarLayout
              flexDirection="rowReverse"
              paddingTop={0}
              sidebarContent={null}
            >
              <Stack space={5}>
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
