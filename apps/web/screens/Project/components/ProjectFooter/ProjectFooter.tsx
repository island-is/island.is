import dynamic from 'next/dynamic'

import {
  FiskistofaFooter,
  Footer,
  LandskjorstjornFooter,
} from '@island.is/web/components'
import { ProjectPage } from '@island.is/web/graphql/schema'

const OpinberNyskopunFooter = dynamic(() =>
  import('./themes/OpinberNyskopun/OpinberNyskopunFooter').then(
    (mod) => mod.OpinberNyskopunFooter,
  ),
)

interface ProjectFooterProps {
  projectPage: ProjectPage
  namespace: Record<string, string>
}

export const ProjectFooter = ({
  projectPage,
  namespace,
}: ProjectFooterProps) => {
  const footerItems = projectPage.footerItems ?? []

  switch (projectPage.theme) {
    case 'opinbernyskopun':
      return (
        <OpinberNyskopunFooter
          footerItems={footerItems}
          namespace={namespace}
        />
      )
    case 'gagnasidur-fiskistofu':
      return (
        <FiskistofaFooter footerItems={footerItems} namespace={namespace} />
      )
    case 'election':
      return (
        <LandskjorstjornFooter
          footerItems={footerItems}
          namespace={namespace}
        />
      )
    default:
      return (
        footerItems.length > 0 && (
          <Footer
            columns={footerItems}
            heading={projectPage.title}
            background={projectPage.footerConfig?.background}
            color={projectPage.footerConfig?.textColor}
          />
        )
      )
  }
}
