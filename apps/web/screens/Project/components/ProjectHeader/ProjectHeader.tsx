import {
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
  namespace: Record<string, string>
}

export const ProjectHeader = ({
  projectPage,
  namespace,
}: ProjectHeaderProps) => {
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
      return (
        <GrindavikProjectHeader
          projectPage={projectPage}
          namespace={namespace}
        />
      )
    default:
      return <DefaultProjectHeader projectPage={projectPage} />
  }
}

export default ProjectHeader
