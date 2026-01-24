import React, { useEffect,useState } from 'react'
import { useWindowSize } from 'react-use'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  GridContainer,
  Hidden,
  Link,
  Navigation,
  NavigationItem,
  SkeletonLoader,
  Stack,
  Table as T,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  Webreader,
} from '@island.is/web/components'
import {
  GetNamespaceQuery,
  QueryGetNamespaceArgs,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'

import SidebarLayout from '../../Layouts/SidebarLayout'
import { GET_NAMESPACE_QUERY } from '../../queries/Namespace'
import { GET_OPEN_DATA_DATASET } from '../queries'

interface OpenDataDetailsProps {
  namespace: Record<string, string>
}

interface DatasetResource {
  id: string
  name: string
  format: string
  url: string
  size?: number
  lastModified?: string
  license?: string
}

interface DatasetDetails {
  id: string
  title: string
  description: string
  category: string
  publisher: string
  publisherId: string
  organizationImage?: string
  lastUpdated: string
  format: string
  tags: string[]
  downloadUrl?: string
  license?: string
  maintainer?: string
  maintainerEmail?: string
  author?: string
  authorEmail?: string
  resources?: DatasetResource[]
  metadata?: {
    size?: string
    recordCount?: number
    updateFrequency?: string
  }
}

const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('is-IS', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}

const OpenDataDetailsPage: Screen<OpenDataDetailsProps> = ({ namespace }) => {
  const router = useRouter()
  const { id } = router.query
  const { width } = useWindowSize()
  const n = useNamespace(namespace)
  
  const [hasMounted, setHasMounted] = useState(false)
  const [activeSection, setActiveSection] = useState('Yfirlit')
  const _isMobileScreenWidth = hasMounted && width < theme.breakpoints.md

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Track active section based on scroll position and hash changes
  useEffect(() => {
    const sectionIds = ['yfirlit', 'lysigogn', 'uppfaerslur', 'abyrgdaradili', 'adgangur', 'svipud', 'abendingar']
    const sectionTitles: Record<string, string> = {
      'yfirlit': 'Yfirlit',
      'lysigogn': 'Lýsigögn og niðurhal',
      'uppfaerslur': 'Uppfærslur og viðhald',
      'abyrgdaradili': 'Ábyrgðaraðili',
      'adgangur': 'Aðgangur og endurnýting',
      'svipud': 'Svipuð gagnasöfn',
      'abendingar': 'Ábendingar',
    }

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash && sectionTitles[hash]) {
        setActiveSection(sectionTitles[hash])
      }
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200 // offset for header

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i])
        if (section) {
          const rect = section.getBoundingClientRect()
          const sectionTop = rect.top + window.scrollY
          if (sectionTop <= scrollPosition) {
            setActiveSection(sectionTitles[sectionIds[i]])
            break
          }
        }
      }
    }

    // Check initial hash
    handleHashChange()

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const { data, loading, error } = useQuery(GET_OPEN_DATA_DATASET, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  })

  const dataset: DatasetDetails | null = data?.openDataDataset || null

  const navigationItems: NavigationItem[] = [
    { title: 'Yfirlit', href: '#yfirlit', active: activeSection === 'Yfirlit' },
    { title: 'Lýsigögn og niðurhal', href: '#lysigogn', active: activeSection === 'Lýsigögn og niðurhal' },
    { title: 'Uppfærslur og viðhald', href: '#uppfaerslur', active: activeSection === 'Uppfærslur og viðhald' },
    { title: 'Ábyrgðaraðili', href: '#abyrgdaradili', active: activeSection === 'Ábyrgðaraðili' },
    { title: 'Aðgangur og endurnýting', href: '#adgangur', active: activeSection === 'Aðgangur og endurnýting' },
    { title: 'Svipuð gagnasöfn', href: '#svipud', active: activeSection === 'Svipuð gagnasöfn' },
    { title: 'Ábendingar', href: '#abendingar', active: activeSection === 'Ábendingar' },
  ]

  if (loading && !dataset) {
    return (
      <Box>
        <GridContainer>
          <Box paddingY={6}>
            <SkeletonLoader height={400} />
          </Box>
        </GridContainer>
      </Box>
    )
  }

  if (error || !dataset) {
    return (
      <Box>
        <GridContainer>
          <Box paddingY={6}>
            <Box padding={4} background="red100" borderRadius="large">
              <Text variant="h3" color="red600">
                {n('errorOccurred', 'Villa kom upp')}
              </Text>
              <Text>{error?.message || n('datasetNotFound', 'Gagnasafn fannst ekki')}</Text>
              <Box marginTop={3}>
                <Button variant="text" onClick={() => router.push('/opingogn')}>
                  ← {n('backToOverview', 'Til baka í yfirlit')}
                </Button>
              </Box>
            </Box>
          </Box>
        </GridContainer>
      </Box>
    )
  }

  return (
    <Box>
      
      {/* Main content */}
      <GridContainer>
        <SidebarLayout
          paddingTop={[2, 2, 4]}
          paddingBottom={[4, 4, 4]}
          isSticky={true}
          fullWidthContent={false}
          sidebarContent={
            <Box paddingRight={[0, 0, 4]}>
              <Hidden below="md">

                 <Box paddingTop={2} paddingBottom={4}>
                  <Button 
                    variant="text" 
                    preTextIcon="arrowBack" 
                    size="small"
                    onClick={() => router.push('/opingogn')}
                  >
                    {n('back', 'Til baka')}
                  </Button>
                </Box>

              {/* Header with organization logo */}
              <Box 
                paddingY={3} 
                paddingX={3} 
                marginBottom={3}
                background="purple100" 
                borderRadius="large"
                display="flex" 
                alignItems="center" 
                style={{ gap: '1rem' }}
              >
                {dataset.organizationImage ? (
                  <Box style={{ flexShrink: 0 }}>
                    <img
                      src={dataset.organizationImage}
                      alt={dataset.publisher}
                      style={{ height: '80px', width: '80px', objectFit: 'contain' }}
                    />
                  </Box>
                ) : null}
                <Box>
                  <Text variant="eyebrow" color="purple600">
                    {dataset.category || 'Náttúra'}
                  </Text>
                  <Text variant="h4" as="p" color="blueberry600">
                    {dataset.publisher}
                  </Text>
                </Box>
              </Box>


                <Box marginBottom={3}>
                  <Navigation
                    baseId="opendata-nav"
                    title={n('tableOfContents', 'Efnisyfirlit')}
                    items={navigationItems}
                    activeItemTitle={activeSection}
                  />
                </Box>
                
                {/* Key information sidebar */}
                <Box background="purple100" padding={3} borderRadius="large">
                  <Text variant="h5" color="purple600" marginBottom={2}>
                    {n('keyInformation', 'Lykilupplýsingar')}
                  </Text>
                  <Stack space={2}>
                    <Box>
                      <Text variant="small" color="dark300">{n('category', 'Efnisflokkur')}</Text>
                      <Text>{dataset.category || n('notDefined', 'Ekki skilgreint')}</Text>
                    </Box>
                    <Box>
                      <Text variant="small" color="dark300">{n('lastUpdated', 'Síðast uppfært')}</Text>
                      <Text>{formatDate(dataset.lastUpdated)}</Text>
                    </Box>
                    {dataset.metadata?.updateFrequency && (
                      <Box>
                        <Text variant="small" color="dark300">{n('updateFrequency', 'Uppfærslutíðni')}</Text>
                        <Text>{dataset.metadata.updateFrequency}</Text>
                      </Box>
                    )}
                    <Box>
                      <Text variant="small" color="dark300">{n('status', 'Staða')}</Text>
                      <Text>{n('active', 'Virkt')}</Text>
                    </Box>
                    <Box>
                      <Text variant="small" color="dark300">{n('access', 'Aðgangur')}</Text>
                      <Text>{n('open', 'Opinn')}</Text>
                    </Box>
                    <Box>
                      <Text variant="small" color="dark300">{n('license', 'Notkunarleyfi')}</Text>
                      <Text>{dataset.license || 'CC-BY (4.0)'}</Text>
                    </Box>
                  </Stack>
                </Box>
              </Hidden>
            </Box>
          }
        >
          <Box paddingLeft={[0, 0, 4]}>


            <Box paddingY={2}>
          <Breadcrumbs
            items={[
              { title: 'Ísland.is', href: '/' },
              { title: 'Opin gögn', href: '/opingogn' },
              { title: dataset.publisher },
            ]}
            renderLink={(link, item) => {
              return item?.href ? (
                <NextLink href={item.href} legacyBehavior>
                  {link}
                </NextLink>
              ) : (
                link
              )
            }}
          />
        </Box>

            {/* Header with organization logo */}
            <Box paddingTop={4}  style={{ gap: '1.5rem' }}>
              <Text variant="h1" as="h1" marginBottom={2}>
                {dataset.title}
              </Text>
              <Text color="dark400" marginBottom={3}>
                {n('lastUpdated', 'Síðast uppfært')}: {formatDate(dataset.lastUpdated)}
              </Text>
            </Box>
            
            <Webreader />

            {/* Yfirlit Section */}
            <Box id="yfirlit" marginBottom={6}>
              <Text variant="h2" as="h2" marginBottom={3}>
                {n('overview', 'Yfirlit')}
              </Text>
              {dataset.description ? (
                <Text marginBottom={3}>
                  {dataset.description}
                </Text>
              ) : null}
              {dataset.tags && dataset.tags.length > 0 && (
                <Box display="flex" flexWrap="wrap" style={{ gap: '0.5rem' }} marginTop={dataset.description ? 3 : 0}>
                  {dataset.tags.map((tag) => (
                    <Tag key={tag} variant="blue" outlined>
                      {tag}
                    </Tag>
                  ))}
                </Box>
              )}
            </Box>

            <Divider />

            {/* Lýsigögn og niðurhal Section */}
            <Box id="lysigogn" paddingY={6}>
              <Text variant="h3" as="h3" marginBottom={3}>
                {n('metadataAndDownload', 'Lýsigögn og niðurhal')}
              </Text>
              {dataset.resources && dataset.resources.length > 0 ? (
                <Box overflow="auto">
                  <T.Table>
                    <T.Head>
                      <T.Row>
                        <T.HeadData>{n('file', 'Skrá')}</T.HeadData>
                        <T.HeadData>{n('format', 'Snið')}</T.HeadData>
                        <T.HeadData>{n('license', 'Notkunarleyfi')}</T.HeadData>
                        <T.HeadData>{n('lastUpdated', 'Síðast uppfært')}</T.HeadData>
                        <T.HeadData>{n('download', 'Niðurhal')}</T.HeadData>
                      </T.Row>
                    </T.Head>
                    <T.Body>
                      {dataset.resources.map((resource) => (
                        <T.Row key={resource.id}>
                          <T.Data>
                            <Text variant="small">{resource.name}</Text>
                          </T.Data>
                          <T.Data>
                            <Tag variant="blue" outlined disabled>
                              {resource.format}
                            </Tag>
                          </T.Data>
                          <T.Data>
                            <Text variant="small">{resource.license || dataset.license || 'CC-BY (4.0)'}</Text>
                          </T.Data>
                          <T.Data>
                            <Text variant="small">{formatDate(resource.lastModified || dataset.lastUpdated)}</Text>
                          </T.Data>
                          <T.Data>
                            <Link href={resource.url} color="blue400" underline="small">
                              {n('fetchData', 'Sækja gögn')}
                            </Link>
                          </T.Data>
                        </T.Row>
                      ))}
                    </T.Body>
                  </T.Table>
                </Box>
              ) : (
                <Box padding={4} background="blue100" borderRadius="large">
                  <Text>{n('noFilesAvailable', 'Engar skrár til niðurhals')}</Text>
                </Box>
              )}
            </Box>

            <Divider />

            {/* Uppfærslur og viðhald Section */}
            <Box id="uppfaerslur" paddingY={6}>
              <Text variant="h3" as="h3" marginBottom={3}>
                {n('updatesAndMaintenance', 'Uppfærslur og viðhald')}
              </Text>
              <Stack space={3}>
                <Box>
                  <Text fontWeight="semiBold" marginBottom={1}>{n('updateFrequency', 'Uppfærslutíðni')}</Text>
                  <Text>{dataset.metadata?.updateFrequency || n('notDefined', 'Ekki skilgreint')}</Text>
                </Box>
                <Box>
                  <Text fontWeight="semiBold" marginBottom={1}>{n('lastUpdate', 'Síðasta uppfærsla')}</Text>
                  <Text>{formatDate(dataset.lastUpdated)}</Text>
                </Box>
                <Box>
                  <Text fontWeight="semiBold" marginBottom={1}>{n('maintenanceAndResponsibility', 'Viðhald og ábyrgð')}</Text>
                  <Text>
                    {dataset.publisher} {n('maintenanceDescription', 'ber ábyrgð á viðhaldi gagnasafnsins og tryggir að gögn endurspegli skráða stöðu á hverjum tíma.')}
                  </Text>
                </Box>
              </Stack>
            </Box>

            <Divider />

            {/* Ábyrgðaraðili Section */}
            <Box id="abyrgdaradili" paddingY={6}>
              <Text variant="h3" as="h3" marginBottom={3}>
                {n('responsibleParty', 'Ábyrgðaraðili')}
              </Text>
              <Stack space={3}>
                <Box>
                  <Text fontWeight="semiBold" marginBottom={1}>{n('responsibleParty', 'Ábyrgðaraðili')}</Text>
                  <Text>{dataset.publisher}</Text>
                </Box>
                {dataset.maintainer && (
                  <Box>
                    <Text fontWeight="semiBold" marginBottom={1}>{n('contactPerson', 'Tengiliður')}</Text>
                    <Text>{dataset.maintainer}</Text>
                    {dataset.maintainerEmail && (
                      <Link href={`mailto:${dataset.maintainerEmail}`} color="blue400">
                        {dataset.maintainerEmail}
                      </Link>
                    )}
                  </Box>
                )}
                {dataset.author && (
                  <Box>
                    <Text fontWeight="semiBold" marginBottom={1}>{n('author', 'Höfundur')}</Text>
                    <Text>{dataset.author}</Text>
                  </Box>
                )}
              </Stack>
            </Box>

            <Divider />

            {/* Aðgangur og endurnýting Section */}
            <Box id="adgangur" paddingY={6}>
              <Text variant="h3" as="h3" marginBottom={3}>
                {n('accessAndReuse', 'Aðgangur og endurnýting')}
              </Text>
              <Stack space={3}>
                <Box>
                  <Text fontWeight="semiBold" marginBottom={1}>{n('accessLevel', 'Aðgangsstig')}</Text>
                  <Text>{n('openAccessDescription', 'Opinn - Gögnin eru aðgengileg öllum án takmarkana.')}</Text>
                </Box>
                <Box>
                  <Text fontWeight="semiBold" marginBottom={1}>{n('license', 'Notkunarleyfi')}</Text>
                  <Text>{dataset.license || 'CC-BY (4.0)'}</Text>
                  <Text variant="small" color="dark300" marginTop={1}>
                    {n('licenseDescription', 'Þetta leyfi leyfir endurnýtingu gagnanna að því tilskildu að uppruninn sé tilgreindur.')}
                  </Text>
                </Box>
              </Stack>
            </Box>

            <Divider />

            {/* Svipuð gagnasöfn Section */}
            <Box id="svipud" paddingY={6}>
              <Text variant="h3" as="h3" marginBottom={3}>
                {n('similarDatasets', 'Svipuð gagnasöfn')}
              </Text>
              <Text color="dark300">
                {n('noSimilarDatasetsFound', 'Engin svipuð gagnasöfn fundust.')}
              </Text>
            </Box>

            <Divider />

            {/* Ábendingar Section */}
            <Box id="abendingar" paddingY={6}>
              <Text variant="h3" as="h3" marginBottom={3}>
                {n('feedback', 'Ábendingar')}
              </Text>
              <Text marginBottom={3}>
                {n('feedbackDescription', 'Ef þú hefur ábendingar um þessi gögn, vinsamlegast hafðu samband við ábyrgðaraðila.')}
              </Text>
              {dataset.maintainerEmail && (
                <Button
                  variant="ghost"
                  icon="mail"
                  iconType="outline"
                  onClick={() => window.location.href = `mailto:${dataset.maintainerEmail}?subject=${n('feedbackSubject', 'Ábending um gagnasafn')}: ${dataset.title}`}
                >
                  {n('sendFeedback', 'Senda ábendingu')}
                </Button>
              )}
            </Box>
          </Box>
        </SidebarLayout>
      </GridContainer>
    </Box>
  )
}

OpenDataDetailsPage.getProps = async ({ apolloClient, query, locale }) => {
  const id = query.id as string
  
  const [, namespaceResponse] = await Promise.all([
    id ? apolloClient.query({
      query: GET_OPEN_DATA_DATASET,
      variables: { id },
    }).catch((error) => {
      console.error('Error prefetching dataset:', error)
      return null
    }) : Promise.resolve(null),
    apolloClient.query<GetNamespaceQuery, QueryGetNamespaceArgs>({
      query: GET_NAMESPACE_QUERY,
      variables: {
        input: {
          lang: locale,
          namespace: 'OpenData',
        },
      },
    }),
  ])

  const namespace = JSON.parse(
    namespaceResponse?.data?.getNamespace?.fields || '{}',
  ) as Record<string, string>

  return {
    namespace,
  }
}

export default withMainLayout(OpenDataDetailsPage)
