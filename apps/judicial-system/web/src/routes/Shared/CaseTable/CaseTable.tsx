import { ReactNode, useContext } from 'react'
import { useRouter } from 'next/router'

import { Box, Text } from '@island.is/island-ui/core'
import { caseTables, getCaseTableType } from '@island.is/judicial-system/types'
import {
  Logo,
  PageHeader,
  SectionHeading,
  SharedPageLayout,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { GenericTable } from '@island.is/judicial-system-web/src/components/Table'
import { CaseTableCell } from '@island.is/judicial-system-web/src/graphql/schema'
import { compareLocaleIS } from '@island.is/judicial-system-web/src/utils/sortHelper'

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

  const table = type && caseTables[type]

  const caseTableData = data?.caseTable

  const compare = (a: CaseTableCell, b: CaseTableCell): number => {
    const aValue = a.value
    const bValue = b.value

    for (let i = 0; i < aValue.length; i++) {
      if (aValue[i] === bValue[i]) {
        continue
      }

      return compareLocaleIS(aValue[i], bValue[i])
    }

    return 0
  }

  const render = (cell: CaseTableCell): ReactNode => {
    const value = cell.value.filter((v) => v !== '')
    const length = value.length

    return (
      <Box display="flex" flexDirection="column">
        {value.map((value, index) =>
          length < 3 && index === 0 ? (
            <Text key={index}>{value}</Text>
          ) : (
            <Text key={index} as="span" variant="small">
              {value}
            </Text>
          ),
        )}
      </Box>
    )
  }

  return (
    <SharedPageLayout>
      <PageHeader title="Málatafla" />
      <div className={logoContainer}>
        <Logo />
      </div>
      {table && (
        <>
          <SectionHeading title={table.title} />
          {!loading && caseTableData && (
            <GenericTable
              tableId={type}
              columns={table.columns.map((column) => ({
                title: column.title,
                compare,
                render,
              }))}
              rows={caseTableData.rows.map((row) => ({
                id: row.caseId,
                cells: row.cells,
              }))}
            />
          )}
        </>
      )}
    </SharedPageLayout>
  )
}

export default CaseTable
