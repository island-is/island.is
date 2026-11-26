import type { FC } from 'react'
import { useRouter } from 'next/router'

import { Button } from '@island.is/island-ui/core'
import {
  CasesLayout,
  Logo,
  PageHeader,
} from '@island.is/judicial-system-web/src/components'
import type { CaseTableRow } from '@island.is/judicial-system-web/src/graphql/schema'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import BulkCompleteCaseLists from './BulkCompleteCaseLists'

const rows: CaseTableRow[] = []
const columns: { title: string }[] = []

const completeCases = async (): Promise<void> => undefined

const BulkCompleteCases: FC = () => {
  const router = useRouter()

  return (
    <CasesLayout>
      <PageHeader title="Mál í dómsuppkvaðningu" />
      <div className={stack({ gap: 5 })}>
        <div>
          <Button
            colorScheme="default"
            iconType="filled"
            onClick={() => router.push('/landsrettur/malalistar')}
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
        <BulkCompleteCaseLists
          rows={rows}
          columns={columns}
          onComplete={completeCases}
        />
      </div>
    </CasesLayout>
  )
}

export default BulkCompleteCases
