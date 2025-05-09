import { FC } from 'react'

import { Box, LinkV2, Text } from '@island.is/island-ui/core'
import {
  CasesLayout,
  Logo,
} from '@island.is/judicial-system-web/src/components'
import CasesDashboardLayout from '@island.is/judicial-system-web/src/components/Layouts/CasesDashboardLayout'

interface CasesCardProps {
  title: string
  description: string
}

const CasesCard: FC<CasesCardProps> = (props) => (
  <LinkV2 href={'/fangelsi/krofur'}>
    <Box borderRadius="large" border="standard" paddingX={4} paddingY={3}>
      <Text variant="h4" color="blue400" marginBottom={1}>
        {props.title}
      </Text>
      <Text>{props.description}</Text>
    </Box>
  </LinkV2>
)

const PrisonCasesDashboard = () => {
  return (
    <CasesLayout>
      <Logo marginBottom={[5, 5, 10]} />
      <CasesDashboardLayout title="Rannsóknarmál">
        <CasesCard
          title="Virk mál"
          description="Virk gæsluvarðhöld og farbönn."
        />
        <CasesCard
          title="Lokið"
          description="Lokin gæsluvarðhöld og farbönn."
        />
      </CasesDashboardLayout>
      <CasesDashboardLayout title="Sakamál">
        <CasesCard
          title="Mál til fullnustu"
          description="Ný og móttekin mál."
        />
        <CasesCard
          title="Skráðir dómar"
          description="Mál sem hafa verið skráð."
        />
      </CasesDashboardLayout>
    </CasesLayout>
  )
}

export default PrisonCasesDashboard
