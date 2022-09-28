import dynamic from 'next/dynamic'
import { ProjectPage } from '@island.is/web/graphql/schema'

const OpinberNyskopunFooter = dynamic(() =>
  import('./themes/OpinberNyskopun/OpinberNyskopunFooter').then(
    (mod) => mod.OpinberNyskopunFooter,
  ),
)

interface ProjectFooterProps {
  projectPage: ProjectPage
}

export const ProjectFooter = ({ projectPage }: ProjectFooterProps) => {
  const footerItems = projectPage.footerItems ?? []

  switch (projectPage.theme) {
    case 'opinber-nyskopun':
      return <OpinberNyskopunFooter footerItems={footerItems} />
    default:
      return null
  }
}
