import { useLoaderData, useNavigate } from 'react-router-dom'

import { Stack } from '@island.is/island-ui/core'
import { BackButton } from '@island.is/portals/admin/core'
import { IntroHeader, formatNationalId } from '@island.is/portals/core'

import { DelegationsResults } from '../../components/DelegationsResults'
import { DelegationAdminPaths } from '../../lib/paths'
import { DelegationOverviewResult } from './DelegationOverview.loader'

const DelegationOverviewScreen = () => {
  const navigate = useNavigate()
  const overview = useLoaderData() as DelegationOverviewResult

  return (
    <Stack space={4}>
      <BackButton onClick={() => navigate(DelegationAdminPaths.Root)} />
      <IntroHeader
        marginBottom={0}
        title={overview.name ?? ''}
        intro={formatNationalId(overview.nationalId)}
      />
      <DelegationsResults
        outgoing={overview.outgoing}
        incoming={overview.incoming}
        clients={overview.clients}
      />
    </Stack>
  )
}

export default DelegationOverviewScreen
