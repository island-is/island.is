import type { FC } from 'react'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { AlertMessage, Button } from '@island.is/island-ui/core'
import { CASE_TABLE_GROUPS_ROUTE } from '@island.is/judicial-system/consts'
import {
  caseTables,
  CaseTableType,
  getCaseTableType,
} from '@island.is/judicial-system/types'
import {
  CasesLayout,
  Logo,
  PageHeader,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { TableSkeleton } from '@island.is/judicial-system-web/src/components/Table'
import type { CaseTableRow } from '@island.is/judicial-system-web/src/graphql/schema'
import * as caseTableStyles from '@island.is/judicial-system-web/src/routes/Shared/CaseTable/CaseTable.css'
import { useCaseTableQuery } from '@island.is/judicial-system-web/src/routes/Shared/CaseTable/caseTable.generated'
import { useCompleteVerdictAppealsMutation } from '@island.is/judicial-system-web/src/utils/hooks/useAppealCase/completeVerdictAppeals.generated'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import BulkCompleteCaseLists from './BulkCompleteCaseLists'
import { getAppealCaseIds, getTableRoute } from './BulkCompleteCases.logic'

const BulkCompleteCases: FC = () => {
  const router = useRouter()
  const { user, hasError } = useContext(UserContext)

  const type = getCaseTableType(user, getTableRoute(router.asPath))

  const { data, loading, error, refetch } = useCaseTableQuery({
    variables: {
      input: {
        // Never sent without a type: the query is skipped.
        type:
          type ??
          CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_READY_TO_COMPLETE,
      },
    },
    skip: !type,
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const [completeVerdictAppealsMutation] = useCompleteVerdictAppealsMutation({
    errorPolicy: 'all',
  })

  // The rows last loaded. A reload that fails leaves them on the page, with
  // whatever the lists are showing over them, rather than an error in their
  // place.
  const [loadedRows, setLoadedRows] = useState<CaseTableRow[]>()

  useEffect(() => {
    if (data?.caseTable) {
      setLoadedRows(data.caseTable.rows)
    }
  }, [data])

  const table = type && caseTables[type]
  const rows = data?.caseTable.rows ?? loadedRows

  // A failed reload is not reported: whether or not the appeals were
  // completed is what the lists report.
  const reloadRows = async () => {
    try {
      await refetch()
    } catch {
      // The list keeps the rows it had until the page is reloaded.
    }
  }

  // Rejects when nothing was completed, which the lists report as a failure
  // and keep the cases staged for another try. The list is reloaded either
  // way: the appeals are completed all or none, so an appeal completed
  // elsewhere fails every try until it has left the list.
  const completeCases = async (stagedRows: CaseTableRow[]): Promise<void> => {
    let isCompleted = false

    try {
      const { data: completed, errors } = await completeVerdictAppealsMutation({
        variables: {
          input: { appealCaseIds: getAppealCaseIds(stagedRows) },
        },
      })

      isCompleted =
        (!errors || errors.length === 0) &&
        Boolean(completed?.completeVerdictAppeals)
    } finally {
      await reloadRows()
    }

    if (!isCompleted) {
      throw new Error('Failed to complete verdict appeals')
    }
  }

  const errorMessage = (
    <div className={caseTableStyles.infoContainer}>
      <AlertMessage
        type="error"
        title="Ekki tókst að sækja málalista"
        message="Ekki tókst að ná sambandi við Réttarvörslugátt. Atvikið hefur verið skráð og viðeigandi aðilar látnir vita. Vinsamlega reynið aftur síðar."
      />
    </div>
  )

  return (
    <CasesLayout>
      <PageHeader title="Mál í dómsuppkvaðningu" />
      <div className={stack({ gap: 5 })}>
        <div>
          <Button
            colorScheme="default"
            iconType="filled"
            onClick={() => router.push(CASE_TABLE_GROUPS_ROUTE)}
            preTextIcon="arrowBack"
            preTextIconType="filled"
            type="button"
            variant="text"
          >
            Til baka á yfirlitsskjá
          </Button>
        </div>
        <div>
          <Logo />
        </div>
        {/* Without the user the table cannot be determined */}
        {hasError && errorMessage}
        {user &&
          (table ? (
            rows ? (
              <BulkCompleteCaseLists
                rows={rows}
                columns={table.columns}
                onComplete={completeCases}
                title={table.title}
              />
            ) : !loading && error ? (
              /* The load error shows only while there are no rows to show */
              errorMessage
            ) : (
              <TableSkeleton />
            )
          ) : (
            /* A route that resolves to no table is one the user has no access to */
            <div className={caseTableStyles.infoContainer}>
              <AlertMessage
                type="error"
                title="Þú hefur ekki aðgang að þessum málalista"
              />
            </div>
          ))}
      </div>
    </CasesLayout>
  )
}

export default BulkCompleteCases
