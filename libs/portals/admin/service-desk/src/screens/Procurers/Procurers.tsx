import { useLoaderData, useNavigate } from 'react-router-dom'

import { formatNationalId, IntroHeader } from '@island.is/portals/core'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { BackButton } from '@island.is/portals/admin/core'

import { m } from '../../lib/messages'
import { ServiceDeskPaths } from '../../lib/paths'
import { CompanyRelationshipResult } from './Procurers.loader'
import { Card } from '../../components/Card'

const Procurers = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const company = useLoaderData() as CompanyRelationshipResult
  const formattedNationalId = formatNationalId(company.nationalId)

  return (
    <Stack space="containerGutter">
      <BackButton onClick={() => navigate(ServiceDeskPaths.Root)} />
      <div>
        <IntroHeader title={company.name} intro={formattedNationalId} />
        <Box marginTop={[3, 3, 6]}>
          {company.companyInfo?.relationships?.length === 0 ? (
            <Card
              description={formatMessage(m.noContentRelationsProcurers)}
              bgGrey
            />
          ) : (
            <>
              <Text marginBottom={2} variant="h4">
                {formatMessage(m.listProcurers)}
              </Text>
              <Stack space={3}>
                {company.companyInfo?.relationships?.map(
                  ({ nationalId, name }) => (
                    <Card
                      key={nationalId}
                      title={name}
                      description={formatNationalId(nationalId)}
                    />
                  ),
                )}
              </Stack>
            </>
          )}
        </Box>
      </div>
    </Stack>
  )
}

export default Procurers
