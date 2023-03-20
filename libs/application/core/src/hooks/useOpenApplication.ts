import { getSlugFromType } from '@island.is/application/core'
import { Application } from '@island.is/application/types'

const getBaseUrl = () => {
  const path = window.location.origin
  const isLocalhost = path.includes('localhost')
  return isLocalhost ? 'http://localhost:4242/umsoknir' : `${path}/umsoknir`
}

export const useOpenApplication = (
  application: Pick<Application, 'id' | 'typeId'>,
) => {
  const baseUrl = getBaseUrl()
  const slug = getSlugFromType(application.typeId)

  const openApplication = () => {
    window.open(`${baseUrl}/${slug}/${application.id}`)
  }

  return openApplication
}
