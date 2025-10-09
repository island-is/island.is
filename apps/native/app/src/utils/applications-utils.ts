import { ApplicationConfigurations } from '@island.is/application/types'
import { getConfig } from '../config'
import {
  Application,
  SearchArticleFragmentFragment,
} from '../graphql/types/schema'

export const getSlugFromType = (type: string) => {
  for (const [key, value] of Object.entries(ApplicationConfigurations)) {
    if (type === key) {
      return value.slug
    }
  }

  return undefined
}

export const getApplicationUrl = (
  application: Pick<Application, 'typeId' | 'id' | 'formSystemSlug'>,
) => {
  const slug = getSlugFromType(application.typeId)
  const uri = `${getConfig().apiUrl.replace(/api$/, 'umsoknir')}/${slug}/${
    application.id
  }`
  console.log('applications-utils getApplicationUrl', application)
  return uri
}

export const getApplicationOverviewUrl = (
  application: Pick<SearchArticleFragmentFragment, 'slug'>,
) => {
  const uri = `${getConfig().apiUrl.replace(/api$/, '')}${application.slug}`
  return uri
}
