import { Footer } from '@island.is/web/components'
import { ProjectPage } from '@island.is/web/graphql/schema'

interface ProjectFooterProps {
  projectPage: ProjectPage
}

export const ProjectFooter = ({ projectPage }: ProjectFooterProps) => {
  const footerItems = projectPage.footerItems ?? []
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
