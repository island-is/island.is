import { FC, useContext } from 'react'
import Link from 'next/link'

import { Box, Icon, SkeletonLoader, Text } from '@island.is/island-ui/core'
import { getCaseTableGroups } from '@island.is/judicial-system/types'

import { useCaseTableMembershipQuery } from '../../utils/hooks/useCaseTableMembership/caseTableMembership.generated'
import { FormContext } from '../FormProvider/FormProvider'
import { UserContext } from '../UserProvider/UserProvider'
import * as styles from './BreadCrumbs.css'

const BreadCrumbs: FC = () => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)

  const { data, loading, error } = useCaseTableMembershipQuery({
    variables: {
      caseId: workingCase?.id || '',
    },
  })

  const caseTableGroups = getCaseTableGroups(user)
  const caseTableTypes = data?.caseTableMembership?.caseTableTypes ?? []
  const caseTableEntries = caseTableTypes.flatMap((type) =>
    caseTableGroups.flatMap((group) =>
      group.tables
        .filter((table) => table.type === type)
        .map((table) => ({ title: table.title, route: table.route })),
    ),
  )

  return (
    <Box display="flex" alignItems="center">
      <Link href="/malalistar" className={styles.link}>
        <Icon icon="home" size="small" color="purple300" />
      </Link>
      <Box marginX={1}>
        <Text color="purple300" variant="eyebrow">{`•`}</Text>
      </Box>
      {loading && (
        <SkeletonLoader
          width={120}
          height={16}
          display="flex"
          borderRadius="standard"
          background="purple200"
        />
      )}
      {!loading &&
        !error &&
        caseTableEntries.map((entry, index) => (
          <Box key={entry.route} display="flex" alignItems="center">
            {index > 0 && (
              <Box marginX={1}>
                <Text color="purple300" variant="eyebrow">{`/`}</Text>
              </Box>
            )}
            <Link href={`/malalistar/${entry.route}`} className={styles.link}>
              <Text variant="eyebrow" className={styles.linkText}>
                {entry.title}
              </Text>
            </Link>
          </Box>
        ))}
    </Box>
  )
}

export default BreadCrumbs
