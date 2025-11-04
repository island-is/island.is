import { MyPagesApplication } from '../types/myPagesApplication'

const getBaseUrl = (localhostPath: string, path: string) => {
  const basePath = window.location.origin
  const isLocalhost = basePath.includes('localhost')
  return isLocalhost ? localhostPath : `${basePath}/${path}`
}

export const useOpenApplication = (
  application: Pick<
    MyPagesApplication,
    'id' | 'localhostPath' | 'path' | 'slug'
  >,
) => {
  if (!application.localhostPath || !application.path || !application.slug) {
    throw new Error('Application is missing path information')
  }

  const baseUrl = getBaseUrl(application.localhostPath, application.path)
  const slug = application.slug
  const url = `${baseUrl}/${slug}/${application.id}`

  const openApplication = () => {
    window.open(url)
  }

  return { openApplication, url, slug }
}
