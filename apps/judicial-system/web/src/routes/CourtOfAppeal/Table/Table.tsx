import { useRouter } from 'next/router'

import { caseTables } from '@island.is/judicial-system/types'
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

  const table = caseTables[CaseTableType.COURT_OF_APPEALS_IN_PROGRESS]
  const caseTableData = data?.caseTable

  return (
    <SharedPageLayout>
      <PageHeader title="Titillinn minn" />
      <div className={logoContainer}>
        <Logo />
      </div>
      <SectionHeading title={table.title} />
      {caseTableData && (
        <GenericTable
          tableId={CaseTableType.COURT_OF_APPEALS_IN_PROGRESS}
          columns={table.columns}
          rows={caseTableData.rows}
        />
      )}
    </SharedPageLayout>
  )
}

export default Tables
