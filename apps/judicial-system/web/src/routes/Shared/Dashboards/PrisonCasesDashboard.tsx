import { FC } from 'react'

import {
  CasesLayout,
  Logo,
} from '@island.is/judicial-system-web/src/components'
import CasesCard from '@island.is/judicial-system-web/src/components/Cards/CasesCard'
import CasesDashboardLayout from '@island.is/judicial-system-web/src/components/Layouts/CasesDashboardLayout'

const PrisonCasesDashboard: FC = () => {
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
