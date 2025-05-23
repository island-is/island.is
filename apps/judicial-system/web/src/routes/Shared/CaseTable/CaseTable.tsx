import { FC, ReactNode, useContext } from 'react'
import { useRouter } from 'next/router'

import {
  AlertMessage,
  Box,
  Tag,
  TagVariant,
  Text,
} from '@island.is/island-ui/core'
import { caseTables, getCaseTableType } from '@island.is/judicial-system/types'
import {
  CasesLayout,
  Logo,
  PageHeader,
  SectionHeading,
  useContextMenu,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  GenericTable,
  TableSkeleton,
} from '@island.is/judicial-system-web/src/components/Table'
import TagContainer from '@island.is/judicial-system-web/src/components/Tags/TagContainer/TagContainer'
import {
  CaseTableCell,
  StringGroupValue,
  StringValue,
  TagPairValue,
  TagValue,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCaseList } from '@island.is/judicial-system-web/src/utils/hooks'
import { compareLocaleIS } from '@island.is/judicial-system-web/src/utils/sortHelper'

import { useCaseTableQuery } from './caseTable.generated'
import * as styles from './CaseTable.css'

const hasCellValue = (cell: CaseTableCell): boolean => {
  return cell.value !== null && cell.value !== undefined
}

const compareString = (a: StringValue, b: StringValue) => {
  return compareLocaleIS(a.sortValue, b.sortValue)
}

const compareStringGroup = (a: StringGroupValue, b: StringGroupValue) => {
  const aValue = a.strList
  const bValue = b.strList

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

const compareTagPair = (a: TagPairValue, b: TagPairValue) => {
  const comp = compareTag(a.firstTag, b.firstTag)

  if (comp !== 0) {
    return comp
  }

  const aSecondTag = a.secondTag
  const bSecondTag = b.secondTag

  if (!aSecondTag) {
    return bSecondTag ? -1 : 0
  } else if (!bSecondTag) {
    return 1
  }

  return compareTag(aSecondTag, bSecondTag)
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
    case 'StringValue':
      return compareString(aValue, bValue as StringValue)
    case 'StringGroupValue':
      return compareStringGroup(aValue, bValue as StringGroupValue)
    case 'TagValue':
      return compareTag(aValue, bValue as TagValue)
    case 'TagPairValue':
      return compareTagPair(aValue, bValue as TagPairValue)
    // This should never happen, but if it does, we return 0
    default:
      return 0
  }
}

const renderString = (value: StringValue) => {
  return (
    <Text as="span" variant="small">
      {value.str}
    </Text>
  )
}

const renderStringGroup = (value: StringGroupValue) => {
  const strings = value.strList.filter((v) => v !== '')
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

const renderTagPair = (value: TagPairValue) => {
  const firstTag = value.firstTag
  const secondTag = value.secondTag

  return (
    <TagContainer>
      {renderTag(firstTag)}
      {secondTag && renderTag(secondTag)}
    </TagContainer>
  )
}

const render = (cell: CaseTableCell): ReactNode => {
  if (!cell.value) {
    return null
  }

  const value = cell.value

  switch (value.__typename) {
    case 'StringValue':
      return renderString(value)
    case 'StringGroupValue':
      return renderStringGroup(value)
    case 'TagValue':
      return renderTag(value)
    case 'TagPairValue':
      return renderTagPair(value)
    // This should never happen, but if it does, we return null
    default:
      return null
  }
}

const CaseTable: FC = () => {
  const router = useRouter()
  const { user, hasError } = useContext(UserContext)
  const { openCaseInNewTabMenuItem } = useContextMenu()
  const { isOpeningCaseId, handleOpenCase, LoadingIndicator, showLoading } =
    useCaseList()

  const type = getCaseTableType(user, router.asPath.split('/').pop())

  const { data, loading, error } = useCaseTableQuery({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { input: { type: type! } },
    skip: !type,
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const table = type && caseTables[type]

  const caseTableData = data?.caseTable

  const errorMessage = (
    <div className={styles.infoContainer}>
      <AlertMessage
        type="error"
        title="Ekki tókst að sækja málalista"
        message="Ekki tókst að ná sambandi við Réttarvörslugátt. Atvikið hefur verið skráð og viðeigandi aðilar látnir vita. Vinsamlega reynið aftur síðar."
      />
    </div>
  )

  return (
    <CasesLayout>
      <PageHeader title="Málatafla" />
      <div className={styles.logoContainer}>
        <Logo />
      </div>
      {/* If we cannot get the user, then we cannot determine which table to show and only show an error message */}
      {hasError && errorMessage}
      {user && // Wait until we have a user
        (table ? (
          <>
            <SectionHeading title={table.title} />
            {loading ? (
              <TableSkeleton />
            ) : error ? (
              /* If we cannot get the table contents, then we show an error message after the table title */
              errorMessage
            ) : (
              caseTableData &&
              (caseTableData.rows.length > 0 ? (
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
              ) : (
                <div className={styles.infoContainer}>
                  <AlertMessage
                    type="info"
                    title="Engin mál fundust"
                    message="Engin mál fundust í þessum flokki"
                  />
                </div>
              ))
            )}
          </>
        ) : (
          /* If we cannot determine which table to show, then the user does not have access to the current route */
          <div className={styles.infoContainer}>
            <AlertMessage
              type="error"
              title="Þú hefur ekki aðgang að þessum málalista"
            />
          </div>
        ))}
    </CasesLayout>
  )
}

export default CaseTable
