import { Box, Button, Stack, Tabs } from '@island.is/island-ui/core'
import { BackButton } from '@island.is/portals/admin/core'
import { useLocale } from '@island.is/localization'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { DelegationAdminResult } from './DelegationAdmin.loader'
import { DelegationAdminPaths } from '../../lib/paths'
import { IntroHeader } from '@island.is/portals/core'
import { m } from '../../lib/messages'
import React from 'react'
import DelegationList from '../../components/DelegationList'
import { AuthCustomDelegation } from '@island.is/api/schema'

const DelegationAdminScreen = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const delegationAdmin = useLoaderData() as DelegationAdminResult

  // const openCreateClientModal = () => {
  //   navigate(DelegationAdminPaths.DelegationAdminCreate)
  // }

  return (
    <Stack space="containerGutter">
      <BackButton onClick={() => navigate(DelegationAdminPaths.Root)} />
      <Box width="full" display="flex" justifyContent="spaceBetween">
        <IntroHeader
          title={delegationAdmin.name}
          intro={delegationAdmin.nationalId}
        />
        {/*Uncomment when ready for create delegation module*/}
        {/*<Box>*/}
        {/*  <Button size={'small'} onClick={openCreateClientModal}>*/}
        {/*    {formatMessage(m.createNewDelegation)}*/}
        {/*  </Button>*/}
        {/*</Box>*/}
      </Box>
      <Tabs
        contentBackground="white"
        label={'Delegation Admin'}
        tabs={[
          {
            label: formatMessage(m.delegationFrom),
            content:
              delegationAdmin.incoming.length > 0 ? (
                <DelegationList
                  direction="incoming"
                  delegationsList={
                    delegationAdmin.incoming as AuthCustomDelegation[]
                  }
                />
              ) : (
                'Noting to show'
              ),
          },
          {
            label: formatMessage(m.delegationTo),
            content:
              delegationAdmin.outgoing.length > 0 ? (
                <DelegationList
                  direction="outgoing"
                  delegationsList={
                    delegationAdmin.outgoing as AuthCustomDelegation[]
                  }
                />
              ) : (
                'Noting to show'
              ),
          },
        ]}
      />
    </Stack>
  )
}

export default DelegationAdminScreen
