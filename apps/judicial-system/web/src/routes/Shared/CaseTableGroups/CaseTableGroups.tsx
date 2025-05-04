import { useContext } from 'react'
import { useRouter } from 'next/router'

import { Box, Text } from '@island.is/island-ui/core'
import { getCaseTableGroups } from '@island.is/judicial-system/types'
import {
  Logo,
  PageHeader,
  SectionHeading,
  SharedPageLayout,
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
      {groups.map((group, index) => (
        <Box key={index}>
          <SectionHeading title={group.title} />
          {group.tables.map((table, index) => (
            <Box
              key={index}
              marginBottom={2}
              onClick={() => router.push(`${router.asPath}/${table.route}`)}
            >
              <Text variant="h4">{table.title}</Text>
              <Text>{table.description}</Text>
            </Box>
          ))}
        </Box>
      ))}
    </SharedPageLayout>
  )
}

export default CaseTableGroups
