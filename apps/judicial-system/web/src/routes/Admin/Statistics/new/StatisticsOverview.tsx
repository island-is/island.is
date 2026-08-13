import { FC } from 'react'
import { useRouter } from 'next/router'

import {
  CasesLayout,
  PageHeader,
} from '@island.is/judicial-system-web/src/components'
import StatisticsCard from '@island.is/judicial-system-web/src/components/Cards/StatisticsCard/StatisticsCard'
import CasesDashboardLayout from '@island.is/judicial-system-web/src/components/Layouts/CasesDashboardLayout'

const StatisticsOverview: FC = () => {
  const router = useRouter()

  const data = {
    title: 'Gögn',
    pages: [
      {
        route: 'gogn/rannsoknarmal',
        title: 'Rannsóknarmál',
        description: 'Gögn úr rannsóknarmálum fyrir tölfræðigreiningu.',
      },
      {
        route: 'gogn/sakamal',
        title: 'Sakamál',
        description: 'Gögn úr sakamálum fyrir tölfræðigreiningu.',
      },
    ],
  }

  return (
    <CasesLayout>
      <PageHeader title="Tölfræði" />
      <CasesDashboardLayout title={data.title}>
        {data.pages.map((t, idx) => (
          <StatisticsCard
            title={t.title}
            description={t.description}
            href={`${router.asPath}/${t.route}`}
            key={idx}
          />
        ))}
      </CasesDashboardLayout>
    </CasesLayout>
  )
}

export default StatisticsOverview
