import { getSlugFromType } from '@island.is/application/core'
import { Application } from '@island.is/application/types'

const getBaseUrl = () => {
  const path = window.location.origin
  const isLocalhost = path.includes('localhost')
  return isLocalhost ? 'http://localhost:4242/umsoknir' : `${path}/umsoknir`
}

export const useOpenApplication = (
  application: Pick<Application, 'id' | 'typeId' | 'formSystemSlug'>,
) => {
  console.log('application in useOpenApplication', application)
  const baseUrl = getBaseUrl()
  const slug = application.formSystemSlug
    ? application.formSystemSlug
    : getSlugFromType(application.typeId)
  const url = application.formSystemSlug
    ? `form/${slug}/${application.id}`
    : `${baseUrl}/${slug}/${application.id}`

  const openApplication = () => {
    window.open(url)
  }

  return { openApplication, url, slug }
}
