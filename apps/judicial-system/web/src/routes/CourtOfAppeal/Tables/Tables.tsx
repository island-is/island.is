import { useRouter } from 'next/router'

import { Box, LoadingDots, Text } from '@island.is/island-ui/core'
import {
  Logo,
  PageHeader,
  SectionHeading,
  SharedPageLayout,
} from '@island.is/judicial-system-web/src/components'

import { useCourtOfAppealsCaseTablesQuery } from './caseTables.generated'
import { logoContainer } from '../../Shared/Cases/Cases.css'

const Tables = () => {
  const router = useRouter()

  const { data, loading } = useCourtOfAppealsCaseTablesQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const groups = data?.caseTables?.groups || []

  return (
    <SharedPageLayout>
      <PageHeader title="Titillinn minn" />
      <div className={logoContainer}>
        <Logo />
      </div>
      {loading ? (
        <LoadingDots />
      ) : (
        groups.map((group) => (
          <>
            <SectionHeading title={group.title} />
            {group.tables.map((table) => (
              <Box
                marginBottom={2}
                onClick={() =>
                  router.push(`/landsrettur/malalisti/${table.type}`)
                }
              >
                <Text variant="h4">{table.title}</Text>
                <Text>{table.description}</Text>
              </Box>
            ))}
          </>
        ))
      )}
    </SharedPageLayout>
  )
}

export default Tables
