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
import {
  CaseTableCell,
  StringGroup,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { compareLocaleIS } from '@island.is/judicial-system-web/src/utils/sortHelper'

import { useCaseTableQuery } from './caseTable.generated'
import { logoContainer } from '../Cases/Cases.css'

const compareStringGroup = (a: StringGroup, b: StringGroup) => {
  const aValue = a.s
  const bValue = b.s

  for (let i = 0; i < aValue.length; i++) {
    if (aValue[i] === bValue[i]) {
      continue
    }

    return compareLocaleIS(aValue[i], bValue[i])
  }

  return 0
}

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
    switch (a.value.__typename) {
      case 'StringGroup':
        return compareStringGroup(a.value, b.value)
      default:
        return 0
    }
  }

  const render = (cell: CaseTableCell): ReactNode => {
    const strings = cell.value.s.filter((v) => v !== '')
    const length = strings.length

    return (
      <Box display="flex" flexDirection="column">
        {strings.map((s, idx) =>
          length < 3 && idx === 0 ? (
            <Text key={idx}>{s}</Text>
          ) : (
            <Text key={idx} as="span" variant="small">
              {s}
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
