import { FC, useContext } from 'react'
import { useRouter } from 'next/router'

import { AlertMessage } from '@island.is/island-ui/core'
import {
  getCaseTableGroups,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import {
  CasesLayout,
  Logo,
  PageHeader,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import CasesCard from '@island.is/judicial-system-web/src/components/Cards/CasesCard'
import CasesDashboardLayout from '@island.is/judicial-system-web/src/components/Layouts/CasesDashboardLayout'

import { CreateCaseButton } from '../CreateCaseButton/CreateCaseButton'
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
                  type={t.type}
                  key={idx}
                  includeCounter={t.includeCounter}
                />
              ))}
            </CasesDashboardLayout>
          ))}
          {isProsecutionUser(user) ? (
            <>
              <SectionHeading
                title="Stofna mál"
                description="Ef ekki er hægt að stofna mál í kerfi lögreglunnar er hægt að
                stofna nýtt mál hér."
                marginBottom={3}
              />
              <CreateCaseButton />
            </>
          ) : null}
        </>
      )}
    </CasesLayout>
  )
}

export default CaseTableGroups
