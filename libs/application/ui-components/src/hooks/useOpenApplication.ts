import { getSlugFromType } from '@island.is/application/core'
import { ApplicationTypes } from '@island.is/application/types'
import { MyPagesApplication } from '@island.is/shared/types'
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
  application: Pick<MyPagesApplication, 'id' | 'typeId' | 'formSystemFormSlug'>,
) => {
  const baseUrl = application.formSystemFormSlug
    ? getFormSystemBaseUrl()
    : getBaseUrl()
  const slug = application.formSystemFormSlug
    ? application.formSystemFormSlug
    : getSlugFromType(application.typeId ?? ApplicationTypes.EXAMPLE_INPUTS)
  const url = `${baseUrl}/${slug}/${application.id}`
  const openApplication = () => {
    window.open(url)
  }

  return { openApplication, url, slug }
}
