import {
  DefaultHeader,
  DefaultHeaderProps,
  DefaultProjectHeader,
  DirectorateOfHealthDashboardHeader,
  EntryProjectHeader,
  FiskistofaDashboardHeader,
  GrindavikProjectHeader,
  UkraineProjectHeader,
} from '@island.is/web/components'
import { ProjectPage as ProjectPageSchema } from '@island.is/web/graphql/schema'

interface ProjectHeaderProps {
  projectPage: ProjectPageSchema
}

export const ProjectHeader = ({ projectPage }: ProjectHeaderProps) => {
  switch (projectPage.theme) {
    case 'traveling-to-iceland':
      return <EntryProjectHeader projectPage={projectPage} />
    case 'ukraine':
      return <UkraineProjectHeader projectPage={projectPage} />
    case 'opinbernyskopun':
      return (
        <DefaultProjectHeader
          projectPage={projectPage}
          headerImageObjectFit="contain"
        />
      )
    case 'gagnasidur-fiskistofu':
      return <FiskistofaDashboardHeader projectPage={projectPage} />
    case 'directorate-of-health':
      return <DirectorateOfHealthDashboardHeader projectPage={projectPage} />
    case 'grindavik':
      return <GrindavikProjectHeader projectPage={projectPage} />
    default:
      return (
        <DefaultHeader
          title={projectPage.title}
          background={projectPage.defaultHeaderBackgroundColor}
          titleColor={
            (projectPage.themeProperties
              ?.textColor as DefaultHeaderProps['titleColor']) || 'dark400'
          }
          fullWidth={projectPage.themeProperties?.fullWidth ?? false}
          image={projectPage.defaultHeaderImage?.url}
          imageIsFullHeight={
            projectPage.themeProperties?.imageIsFullHeight ?? true
          }
          imagePadding={projectPage.themeProperties?.imagePadding || '20px'}
        />
      )
  }
}

export default ProjectHeader
