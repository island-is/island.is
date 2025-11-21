import { ApplicationCardFields } from '../components/ApplicationCard/types'

export const useOpenApplication = (
  application: Pick<
    ApplicationCardFields,
    'id' | 'typeId' | 'slug' | 'applicationPath'
  >,
) => {
  const path = window.location.origin
  const isLocalhost = path.includes('localhost')
  const localUrl = `${
    application.applicationPath?.startsWith('umsoknir/')
      ? 'http://localhost:4242'
      : 'http://localhost:4201'
  }/${application.applicationPath}`
  const url = isLocalhost ? localUrl : `${path}/${application.applicationPath}`

  const openApplication = () => {
    window.open(url)
  }

  return { openApplication, url, slug: application.slug }
}
