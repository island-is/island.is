import { FC, useContext } from 'react'
import Link from 'next/link'

import { Box, Icon, Text } from '@island.is/island-ui/core'
import { useCaseTableMembershipQuery } from '../../utils/hooks/useCaseTableMembership/caseTableMembership.generated'
import { FormContext } from '../FormProvider/FormProvider'
import { getCaseTableGroups } from '@island.is/judicial-system/types'
import { UserContext } from '../UserProvider/UserProvider'

export interface BreadcrumbLink {
  label: string
  href: string
}

type Segment = BreadcrumbLink | BreadcrumbLink[]

interface Props {
  links: Segment[]
}

/**
 * Groups consecutive BreadcrumbLink[] items in the links array together so they
 * render side-by-side with a "/" separator, while single BreadcrumbLink items
 * always start a new segment separated by "•".
 *
 * Example: [[link1], [link2], link3] → [[link1, link2], [link3]]
 */
const groupSegments = (links: Segment[]): BreadcrumbLink[][] => {
  const result: BreadcrumbLink[][] = []
  let lastWasArray = false

  for (const item of links) {
    if (Array.isArray(item)) {
      if (lastWasArray && result.length > 0) {
        result[result.length - 1].push(...item)
      } else {
        result.push([...item])
      }
      lastWasArray = true
    } else {
      result.push([item])
      lastWasArray = false
    }
  }

  return result
}

const BreadCrumbs: FC<Props> = ({ links }) => {
  const segments = groupSegments(links)
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
      <Icon icon="home" size="small" color="purple300" />
      {caseTableEntries.map((entry, index) => (
        <Box key={entry.route} display="flex" alignItems="center">
          <Text color="purple300">{` • `}</Text>
          {index > 0 && <Text color="purple300">{` / `}</Text>}
          <Link href={`/malalistar/${entry.route}`} replace>
            <Text color="purple300">{entry.title}</Text>
          </Link>
        </Box>
      ))}
    </Box>
  )
}

export default BreadCrumbs
