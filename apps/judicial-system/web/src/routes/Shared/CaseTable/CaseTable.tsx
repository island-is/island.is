import { useContext } from 'react'
import { useRouter } from 'next/router'

import { caseTables, getCaseTableType } from '@island.is/judicial-system/types'
import {
  Logo,
  PageHeader,
  SectionHeading,
  SharedPageLayout,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { GenericTable } from '@island.is/judicial-system-web/src/components/Table'
import { CaseTableType } from '@island.is/judicial-system-web/src/graphql/schema'

import { useCaseTableQuery } from './caseTable.generated'
import { logoContainer } from '../Cases/Cases.css'

const CaseTable = () => {
  const router = useRouter()
  const { user } = useContext(UserContext)

  const type = getCaseTableType(user, router.asPath.split('/').pop())

  const { data, loading } = useCaseTableQuery({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { input: { type: type! } },
    skip: !type,
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const table = caseTables[CaseTableType.COURT_OF_APPEALS_IN_PROGRESS]
  const caseTableData = data?.caseTable

  return (
    <SharedPageLayout>
      <PageHeader title="Málatafla" />
      <div className={logoContainer}>
        <Logo />
      </div>
      <SectionHeading title={table.title} />
      {user && type && !loading && caseTableData && (
        <GenericTable
          tableId={type}
          columns={table.columns}
          rows={caseTableData.rows.map((row) => ({
            id: row.caseId,
            cells: row.cells,
          }))}
        />
      )}
    </SharedPageLayout>
  )
}

export default CaseTable
