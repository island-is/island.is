import { FC, useContext } from 'react'
import { useRouter } from 'next/router'

import { AlertMessage } from '@island.is/island-ui/core'
import { getCaseTableGroups } from '@island.is/judicial-system/types'
import {
  CasesLayout,
  Logo,
  PageHeader,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import CasesCard from '@island.is/judicial-system-web/src/components/Cards/CasesCard'
import CasesDashboardLayout from '@island.is/judicial-system-web/src/components/Layouts/CasesDashboardLayout'

import * as styles from './CaseTableGroups.css'

const CaseTableGroups: FC = () => {
  const router = useRouter()

  const { user, hasError } = useContext(UserContext)

  const groups = getCaseTableGroups(user)

  return (
    <CasesLayout>
      <PageHeader title="Málatöfluflokkar" />
      {hasError ? (
        <div className={styles.infoContainer}>
          <AlertMessage
            type="error"
            title="Ekki tókst að sækja málalista"
            message="Ekki tókst að ná sambandi við Réttarvörslugátt. Atvikið hefur verið skráð og viðeigandi aðilar látnir vita. Vinsamlega reynið aftur síðar."
          />
        </div>
      ) : (
        <>
          <div className={styles.logoContainer}>
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
        </>
      )}
    </CasesLayout>
  )
}

export default CaseTableGroups
