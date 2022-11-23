import dynamic from 'next/dynamic'
import { ProjectPage } from '@island.is/web/graphql/schema'

const OpinberNyskopunFooter = dynamic(() =>
  import('./themes/OpinberNyskopun/OpinberNyskopunFooter').then(
    (mod) => mod.OpinberNyskopunFooter,
  ),
)

const FiskistofaFooter = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.FiskistofaFooter),
)

interface ProjectFooterProps {
  projectPage: ProjectPage
}

export const ProjectFooter = ({ projectPage }: ProjectFooterProps) => {
  const footerItems = projectPage.footerItems ?? []

  switch (projectPage.theme) {
    case 'opinbernyskopun':
      return <OpinberNyskopunFooter footerItems={footerItems} />
    case 'maelabord-fiskistofu':
      return <FiskistofaFooter footerItems={footerItems} />
    default:
      return null
  }
}
