import { FieldExtensionSDK } from '@contentful/app-sdk'
import { useSDK } from '@contentful/react-apps-toolkit'

import {
  ProjectParentSubpageSlugField,
  ProjectSubpageSlugField,
} from '../../components/project-slug-fields'

// One app serves the slug field of both project subpages and project parent
// subpages, to save on the number of apps installed in Contentful
const ProjectSlugField = () => {
  const sdk = useSDK<FieldExtensionSDK>()

  if (sdk.contentType.sys.id === 'projectParentSubpage') {
    return <ProjectParentSubpageSlugField />
  }

  return <ProjectSubpageSlugField />
}

export default ProjectSlugField
