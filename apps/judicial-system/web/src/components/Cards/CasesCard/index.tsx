import { FC } from 'react'

import { Box, LinkV2, LoadingDots, Text } from '@island.is/island-ui/core'
import { CaseTableType } from '@island.is/judicial-system/types'
import { useCaseTableQuery } from '@island.is/judicial-system-web/src/routes/Shared/CaseTable/caseTable.generated'

import * as styles from './index.css'

interface CasesCardProps {
  title: string
  description: string
  href: string
  type: CaseTableType
  includeCounter?: boolean
}

const TitleWithCounter: FC<Pick<CasesCardProps, 'title' | 'type'>> = (
  props,
) => {
  const { data, loading, error } = useCaseTableQuery({
    variables: { input: { type: props.type } },
    skip: !props.type,
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })
  const counter = data?.caseTable.rowCount || 0

  return (
    <Text variant="h4" color="blue400" marginBottom={1}>
      {props.title} (
      {loading || error ? (
        <span className={styles.loadingDots}>
          <LoadingDots size="small" />
        </span>
      ) : (
        counter
      )}
      )
    </Text>
  )
}

const CasesCard: FC<CasesCardProps> = (props) => (
  <LinkV2 href={props.href}>
    <Box
      borderRadius="large"
      border="standard"
      paddingX={4}
      paddingY={3}
      height="full"
      className={styles.container}
    >
      {props.includeCounter && props.type !== CaseTableType.STATISTICS ? (
        <TitleWithCounter title={props.title} type={props.type} />
      ) : (
        <Text variant="h4" color="blue400" marginBottom={1}>
          {props.title}
        </Text>
      )}
      <Text>{props.description}</Text>
    </Box>
  </LinkV2>
)

export default CasesCard
