import { FC } from 'react'
import { useRouter } from 'next/router'

import {
  CasesLayout,
  PageHeader,
} from '@island.is/judicial-system-web/src/components'
import CasesCard from '@island.is/judicial-system-web/src/components/Cards/CasesCard'
import CasesDashboardLayout from '@island.is/judicial-system-web/src/components/Layouts/CasesDashboardLayout'
import { CaseTableType } from '@island.is/judicial-system-web/src/graphql/schema'

const StatisticsOverview: FC = () => {
  const router = useRouter()

  const statistics = {
    title: 'Tölfræði',
    pages: [
      {
        route: 'rannsoknarmal',
        title: 'Rannsóknarmál',
        description: 'Einföld tölfræðigreining úr rannsóknarmálum.',
        type: CaseTableType.STATISTICS,
      },
      {
        route: 'sakamal',
        title: 'Sakamál',
        description: 'Einföld tölfræðigreining úr sakamálum.',
        type: CaseTableType.STATISTICS,
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
        type: CaseTableType.STATISTICS,
      },
      {
        route: 'gogn/sakamal',
        title: 'Sakamál',
        description: 'Gögn úr sakamálum fyrir tölfræðigreiningu.',
        type: CaseTableType.STATISTICS,
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
            type={t.type}
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
            type={t.type}
          />
        ))}
      </CasesDashboardLayout>
    </CasesLayout>
  )
}

export default StatisticsOverview
