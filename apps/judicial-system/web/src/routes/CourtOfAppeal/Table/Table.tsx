import { useRouter } from 'next/router'

import {
  Logo,
  PageHeader,
  SectionHeading,
  SharedPageLayout,
} from '@island.is/judicial-system-web/src/components'
import { GenericTable } from '@island.is/judicial-system-web/src/components/Table'
import { CaseTableType } from '@island.is/judicial-system-web/src/graphql/schema'

import { useCourtOfAppealsCasesInProgressQuery } from './caseTable.generated'
import { logoContainer } from '../../Shared/Cases/Cases.css'

const Tables = () => {
  const router = useRouter()

  const { data, loading } = useCourtOfAppealsCasesInProgressQuery({
    variables: {
      input: {
        type: CaseTableType.COURT_OF_APPEALS_IN_PROGRESS,
      },
    },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const table = data?.caseTable

  return (
    <SharedPageLayout>
      <PageHeader title="Titillinn minn" />
      <div className={logoContainer}>
        <Logo />
      </div>
      <SectionHeading title="Mál í vinnslu" />
      {table && <GenericTable columns={table?.columns} rows={table.rows} />}
    </SharedPageLayout>
  )
}

export default Tables
