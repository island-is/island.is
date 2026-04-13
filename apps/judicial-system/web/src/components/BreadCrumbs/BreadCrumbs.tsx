import { FC, useContext } from 'react'
import Link from 'next/link'

import { Box, Icon, Text } from '@island.is/island-ui/core'
import { getCaseTableGroups } from '@island.is/judicial-system/types'

import { useCaseTableMembershipQuery } from '../../utils/hooks/useCaseTableMembership/caseTableMembership.generated'
import { FormContext } from '../FormProvider/FormProvider'
import { UserContext } from '../UserProvider/UserProvider'

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
      <Link href="/malalistar">
        <Icon icon="home" size="small" color="purple300" />
      </Link>
      {caseTableEntries.map((entry, index) => (
        <Box key={entry.route} display="flex" alignItems="center">
          <Text color="purple300">{` • `}</Text>
          {index > 0 && <Text color="purple300">{` / `}</Text>}
          <Link href={`/malalistar/${entry.route}`}>
            <Text color="purple300">{entry.title}</Text>
          </Link>
        </Box>
      ))}
    </Box>
  )
}

export default BreadCrumbs
