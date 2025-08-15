import { FC } from 'react'
import { useRouter } from 'next/router'

import {
  CasesLayout,
  PageHeader,
} from '@island.is/judicial-system-web/src/components'
import CasesCard from '@island.is/judicial-system-web/src/components/Cards/CasesCard'
import CasesDashboardLayout from '@island.is/judicial-system-web/src/components/Layouts/CasesDashboardLayout'

const StatisticsOverview: FC = () => {
  const router = useRouter()

  const statistics = {
    title: 'Tölfræði',
    pages: [
      {
        route: 'rannsoknarmal',
        title: 'Rannsóknarnarmál',
        description: 'Tölfræði úr rannsóknarmálum.',
      },
      {
        route: 'sakamal',
        title: 'Sakamál',
        description: 'Tölfræði úr sakamálum.',
      },
    ],
  }

  return (
    <CasesLayout>
      <PageHeader title="Tölfræði" />
      {
        <CasesDashboardLayout title={statistics.title}>
          {statistics.pages.map((t, idx) => (
            <CasesCard
              title={t.title}
              description={t.description}
              href={`${router.asPath}/${t.route}`}
              key={idx}
            />
          ))}
        </CasesDashboardLayout>
      }
    </CasesLayout>
  )
}

export default StatisticsOverview
