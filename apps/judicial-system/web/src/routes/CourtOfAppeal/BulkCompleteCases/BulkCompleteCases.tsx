import type { FC } from 'react'
import { useContext } from 'react'
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
import { getAppealCaseIds } from './BulkCompleteCases.logic'

const BulkCompleteCases: FC = () => {
  const router = useRouter()
  const { user, hasError } = useContext(UserContext)

  const type = getCaseTableType(user, router.asPath.split('/').pop())

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

  const table = type && caseTables[type]
  const rows = data?.caseTable.rows ?? []

  // Rejects when nothing was completed, which the lists report as a failure
  // and keep the cases staged for another try.
  const completeCases = async (stagedRows: CaseTableRow[]): Promise<void> => {
    const { data: completed, errors } = await completeVerdictAppealsMutation({
      variables: {
        input: { appealCaseIds: getAppealCaseIds(stagedRows) },
      },
    })

    if ((errors && errors.length > 0) || !completed?.completeVerdictAppeals) {
      throw new Error('Failed to complete verdict appeals')
    }

    // The appeals are completed whether or not the list can be reloaded, so a
    // failed reload must not be reported as a failure to complete them.
    try {
      await refetch()
    } catch {
      // The list keeps the rows it had until the page is reloaded.
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
            loading ? (
              <TableSkeleton />
            ) : error ? (
              errorMessage
            ) : (
              <BulkCompleteCaseLists
                rows={rows}
                columns={table.columns}
                onComplete={completeCases}
                title={table.title}
              />
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
