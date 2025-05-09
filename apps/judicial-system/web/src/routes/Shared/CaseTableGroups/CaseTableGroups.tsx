import { useContext } from 'react'
import { useRouter } from 'next/router'

import { Box, Text } from '@island.is/island-ui/core'
import { getCaseTableGroups } from '@island.is/judicial-system/types'
import {
  Logo,
  PageHeader,
  SharedPageLayout,
  TableGroup,
  UserContext,
} from '@island.is/judicial-system-web/src/components'

import { logoContainer } from '../Cases/Cases.css'

const CaseTableGroups = () => {
  const router = useRouter()

  const { user } = useContext(UserContext)

  const groups = getCaseTableGroups(user)

  return (
    <SharedPageLayout>
      <PageHeader title="Málatöfluflokkar" />
      <div className={logoContainer}>
        <Logo />
      </div>
      {groups.map((group, idx) => (
        <TableGroup title={group.title} key={idx}>
          {group.tables.map((t, idx) => (
            <Box
              key={idx}
              marginBottom={2}
              onClick={() => router.push(`${router.asPath}/${t.route}`)}
            >
              <Text variant="h4">{t.title}</Text>
              <Text>{t.description}</Text>
            </Box>
          ))}
        </TableGroup>
      ))}
    </SharedPageLayout>
  )
}

export default CaseTableGroups
