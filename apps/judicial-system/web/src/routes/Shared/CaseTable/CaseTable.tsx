import { ReactNode, useContext } from 'react'
import { useRouter } from 'next/router'

import { Box, Tag, TagVariant, Text } from '@island.is/island-ui/core'
import { caseTables, getCaseTableType } from '@island.is/judicial-system/types'
import {
  Logo,
  PageHeader,
  SectionHeading,
  SharedPageLayout,
  useContextMenu,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { GenericTable } from '@island.is/judicial-system-web/src/components/Table'
import {
  CaseTableCell,
  StringGroupValue,
  TagValue,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCaseList } from '@island.is/judicial-system-web/src/utils/hooks'
import { compareLocaleIS } from '@island.is/judicial-system-web/src/utils/sortHelper'

import { useCaseTableQuery } from './caseTable.generated'
import * as styles from './CaseTable.css'

const hasCellValue = (cell: CaseTableCell): boolean => {
  return cell.value !== null && cell.value !== undefined
}

const compareStringGroup = (a: StringGroupValue, b: StringGroupValue) => {
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

const compareTag = (a: TagValue, b: TagValue) => {
  return compareLocaleIS(a.text, b.text)
}

const compare = (a: CaseTableCell, b: CaseTableCell): number => {
  if (!hasCellValue(a)) {
    return hasCellValue(b) ? -1 : 0
  } else if (!hasCellValue(b)) {
    return 1
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const aValue = a.value!
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const bValue = b.value!

  // Cannot compare different types
  if (aValue.__typename !== bValue.__typename) {
    return 0
  }

  switch (aValue.__typename) {
    case 'StringGroupValue':
      return compareStringGroup(aValue, bValue as StringGroupValue)
    case 'TagValue':
      return compareTag(aValue, bValue as TagValue)
    default:
      return 0
  }
}

const renderStringGroup = (value: StringGroupValue) => {
  const strings = value.s.filter((v) => v !== '')
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

const renderTag = (value: { color: string; text: string }) => {
  return (
    <Tag variant={value.color as TagVariant} outlined disabled truncate>
      {value.text}
    </Tag>
  )
}

const render = (cell: CaseTableCell): ReactNode => {
  if (!cell.value) {
    return null
  }

  const value = cell.value

  switch (value.__typename) {
    case 'StringGroupValue':
      return renderStringGroup(value)
    case 'TagValue':
      return renderTag(value)
    default:
      return null
  }
}

const CaseTable = () => {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const { openCaseInNewTabMenuItem } = useContextMenu()
  const { isOpeningCaseId, handleOpenCase, LoadingIndicator, showLoading } =
    useCaseList()

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

  return (
    <SharedPageLayout>
      <PageHeader title="Málatafla" />
      <div className={styles.logoContainer}>
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
              generateContextMenuItems={(id) => {
                return [openCaseInNewTabMenuItem(id)]
              }}
              loadingIndicator={LoadingIndicator}
              rowIdBeingOpened={isOpeningCaseId}
              showLoading={showLoading}
              onClick={(id) => {
                handleOpenCase(id)
              }}
            />
          )}
        </>
      )}
    </SharedPageLayout>
  )
}

export default CaseTable
