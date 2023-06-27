import { Breadcrumbs, Layout } from '../../../../components'
import { ReactNode } from 'react'
import localization from '../../Case.json'

interface Props {
  children: ReactNode
  caseNumber: string
  caseId: number
}

const CaseSkeleton = ({ children, caseNumber, caseId }: Props) => {
  const loc = localization['caseSkeleton']
  return (
    <Layout
      seo={{
        title: `${loc.seo.title}: S-${caseNumber}`,
        url: `${loc.seo.url}${caseId}`,
      }}
    >
      <Breadcrumbs
        items={[
          {
            title: loc.breadcrumbs.parent.title,
            href: loc.breadcrumbs.parent.href,
          },
          {
            title: `${loc.breadcrumbs.current.title} S-${caseNumber}`,
          },
        ]}
      />
      {children}
    </Layout>
  )
}

export default CaseSkeleton
