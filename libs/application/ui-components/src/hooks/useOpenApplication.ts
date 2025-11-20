import { getSlugFromType } from '@island.is/application/core'
import { Application } from '@island.is/application/types'

const getBaseUrl = () => {
  const path = window.location.origin
  const isLocalhost = path.includes('localhost')
  return isLocalhost ? 'http://localhost:4242/umsoknir' : `${path}/umsoknir`
}

const getFormSystemBaseUrl = () => {
  const path = window.location.origin
  const isLocalhost = path.includes('localhost')
  return isLocalhost ? 'http://localhost:4201/form' : `${path}/form`
}

export const useOpenApplication = (
  application: Pick<Application, 'id' | 'typeId' | 'formSystemFormSlug'>,
) => {
  const baseUrl = application.formSystemFormSlug
    ? getFormSystemBaseUrl()
    : getBaseUrl()
  const slug = application.formSystemFormSlug
    ? application.formSystemFormSlug
    : getSlugFromType(application.typeId)
  const url = `${baseUrl}/${slug}/${application.id}`
  const openApplication = () => {
    window.open(url)
  }

  return { openApplication, url, slug }
}
