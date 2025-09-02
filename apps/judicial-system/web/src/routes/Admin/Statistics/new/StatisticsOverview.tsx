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
        title: 'Rannsóknarmál',
        description: 'Einföld tölfræðigreining úr rannsóknarmálum.',
      },
      {
        route: 'sakamal',
        title: 'Sakamál',
        description: 'Einföld tölfræðigreining úr sakamálum.',
      },
    ],
  }

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
          <CasesCard
            title={t.title}
            description={t.description}
            href={`${router.asPath}/${t.route}`}
            key={idx}
          />
        ))}
      </CasesDashboardLayout>
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
    </CasesLayout>
  )
}

export default StatisticsOverview
