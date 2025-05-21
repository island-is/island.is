import { useContext } from 'react'
import { useRouter } from 'next/router'

import { getCaseTableGroups } from '@island.is/judicial-system/types'
import {
  CasesLayout,
  Logo,
  PageHeader,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import CasesCard from '@island.is/judicial-system-web/src/components/Cards/CasesCard'
import CasesDashboardLayout from '@island.is/judicial-system-web/src/components/Layouts/CasesDashboardLayout'

import { logoContainer } from '../Cases/Cases.css'

const CaseTableGroups = () => {
  const router = useRouter()

  const { user } = useContext(UserContext)

  const groups = getCaseTableGroups(user)

  return (
    <CasesLayout>
      <PageHeader title="Málatöfluflokkar" />
      <div className={logoContainer}>
        <Logo />
      </div>
      {groups.map((group, idx) => (
        <CasesDashboardLayout title={group.title} key={idx}>
          {group.tables.map((t, idx) => (
            <CasesCard
              title={t.title}
              description={t.description}
              href={`${router.asPath}/${t.route}`}
              key={idx}
            />
          ))}
        </CasesDashboardLayout>
      ))}
    </CasesLayout>
  )
}

export default CaseTableGroups
