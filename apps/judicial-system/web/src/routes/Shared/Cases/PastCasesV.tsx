import React, { useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import parseISO from 'date-fns/parseISO'
import { Row } from 'react-table'

import { theme } from '@island.is/island-ui/theme'
import { Box, Text } from '@island.is/island-ui/core'
import {
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseDecision,
  CaseState,
  Defendant,
  isExtendedCourtRole,
} from '@island.is/judicial-system/types'
import {
  TempCase as Case,
  TempCaseListEntry as CaseListEntry,
} from '@island.is/judicial-system-web/src/types'
import {
  capitalize,
  displayFirstPlusRemaining,
  formatDate,
  formatDOB,
} from '@island.is/judicial-system/formatters'
import {
  useFilterCases,
  useSortCases,
  useViewport,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  Table,
  TagAppealState,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { core, tables } from '@island.is/judicial-system-web/messages'
import { CaseType } from '@island.is/judicial-system-web/src/graphql/schema'
import TagCaseState from '@island.is/judicial-system-web/src/components/TagCaseState/TagCaseState'
import BigTextSmallText from '@island.is/judicial-system-web/src/components/BigTextSmallText/BigTextSmallText'

import { displayCaseType } from './utils'
import * as styles from './Cases.css'
import MobileCase from './MobileCase'
import { cases as m } from './Cases.strings'

interface Props {
  cases: CaseListEntry[]
  onRowClick: (id: string) => void
}

const PastCasesV: React.FC<Props> = (props) => {
  const { cases, onRowClick } = props

  return (
    <div>
      <Text>asdkaksdak</Text>
    </div>
  )
}

export default PastCasesV
