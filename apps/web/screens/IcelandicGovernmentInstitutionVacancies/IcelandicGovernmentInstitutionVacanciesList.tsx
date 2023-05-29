import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Text,
  FocusableBox,
  GridContainer,
  GridColumn,
  Box,
  GridRow,
  Breadcrumbs,
  Input,
  Select,
  Stack,
  Option,
  Button,
  Pagination,
  LinkV2,
  Hidden,
} from '@island.is/island-ui/core'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  GetIcelandicGovernmentInstitutionVacanciesQuery,
  GetIcelandicGovernmentInstitutionVacanciesQueryVariables,
  GetNamespaceQuery,
  GetNamespaceQueryVariables,
  IcelandicGovernmentInstitutionVacanciesResponse,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES } from '../queries/IcelandicGovernmentInstitutionVacancies'
import { GET_NAMESPACE_QUERY } from '../queries'

import * as styles from './IcelandicGovernmentInstitutionVacanciesList.css'

type Vacancy = IcelandicGovernmentInstitutionVacanciesResponse['vacancies'][number]

const ITEMS_PER_PAGE = 8
const MAX_DESCRIPTION_LENGTH = 80

const convertHtmlToPlainText = (html: string) => {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, ' ')
}

const shortenText = (text: string, maxLength: number) => {
  if (!text) return ''
  if (text.length > maxLength) {
    if (text[text.length - 1] === ' ') {
      maxLength -= 1
    }
    return text.slice(0, maxLength).concat('...')
  }
  return text
}

const mapVacanciesField = (vacancies: Vacancy[], fieldName: keyof Vacancy) => {
  const fieldSet = new Set<string | number>()
  for (const vacancy of vacancies) {
    if (vacancy[fieldName]) fieldSet.add(vacancy[fieldName])
  }
  return Array.from(fieldSet).map((field) => ({
    label: String(field),
    value: String(field),
  }))
}

interface IcelandicGovernmentInstitutionVacanciesListProps {
  vacancies: Vacancy[]
  namespace: Record<string, string>
}

const IcelandicGovernmentInstitutionVacanciesList: Screen<IcelandicGovernmentInstitutionVacanciesListProps> = ({
  vacancies,
  namespace,
}) => {
  const { query, push } = useRouter()
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  const pathname = linkResolver('vacancies').href

  const [selectedPage, setSelectedPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<{
    institution: Option | null
    fieldOfWork: Option | null
    location: Option | null
  }>({
    institution: null,
    fieldOfWork: null,
    location: null,
  })

  const selectedFieldOfWorkOption = selectedOptions.fieldOfWork
  const selectedLocationOption = selectedOptions.location
  const selectedInstitutionOption = selectedOptions.institution

  const filteredVacancies = vacancies.filter((vacancy) => {
    const searchTermMatches = vacancy.title
      ?.toLowerCase()
      ?.includes(searchTerm.toLowerCase())

    let shouldBeShown = searchTermMatches

    if (selectedFieldOfWorkOption) {
      shouldBeShown =
        shouldBeShown && selectedFieldOfWorkOption.value === vacancy.fieldOfWork
    }

    if (selectedLocationOption) {
      shouldBeShown =
        shouldBeShown && selectedLocationOption.value === vacancy.locationTitle
    }

    if (selectedInstitutionOption) {
      shouldBeShown =
        shouldBeShown &&
        selectedInstitutionOption.value === vacancy.institutionName
    }

    return shouldBeShown
  })

  const fieldOfWorkOptions = useMemo(
    () => mapVacanciesField(vacancies, 'fieldOfWork'),
    [vacancies],
  )

  const locationOptions = useMemo(
    () => mapVacanciesField(vacancies, 'locationTitle'),
    [vacancies],
  )

  const institutionOptions = useMemo(
    () => mapVacanciesField(vacancies, 'institutionName'),
    [vacancies],
  )

  const clearFilters = () => {
    setSelectedOptions({
      fieldOfWork: null,
      institution: null,
      location: null,
    })
  }

  const totalPages = Math.ceil(filteredVacancies.length / ITEMS_PER_PAGE)

  useEffect(() => {
    let queriedPage = Number(query.page)
    if (!isNaN(queriedPage) && queriedPage > 0) {
      if (queriedPage > totalPages) {
        queriedPage = totalPages
      }
      setSelectedPage(queriedPage)
    }
  }, [query.page, totalPages])

  useEffect(() => {
    if (query.location) {
      const location = locationOptions.find((o) => o.value === query.location)
      if (location) {
        setSelectedOptions((options) => ({ ...options, location }))
      }
    }
  }, [locationOptions, query?.location])

  useEffect(() => {
    if (query.fieldOfWork) {
      const fieldOfWork = fieldOfWorkOptions.find(
        (o) => o.value === query.fieldOfWork,
      )
      if (fieldOfWork) {
        setSelectedOptions((options) => ({
          ...options,
          fieldOfWork,
        }))
      }
    }
  }, [fieldOfWorkOptions, query?.fieldOfWork])

  useEffect(() => {
    if (query.institution) {
      const institution = institutionOptions.find(
        (o) => o.value === query.institution,
      )
      if (institution) {
        setSelectedOptions((options) => ({
          ...options,
          institution,
        }))
      }
    }
  }, [institutionOptions, query.institution])

  useEffect(() => {
    if (query?.q && !searchTerm) {
      setSearchTerm(query.q as string)
    }
  }, [query?.q, searchTerm])

  useEffect(() => {
    const updatedQuery = { ...query }

    if (!searchTerm) {
      if ('q' in updatedQuery) delete updatedQuery['q']
    } else {
      updatedQuery.q = searchTerm
    }

    if (!selectedFieldOfWorkOption?.value) {
      if ('fieldOfWork' in updatedQuery) delete updatedQuery['fieldOfWork']
    } else {
      updatedQuery.fieldOfWork = String(selectedFieldOfWorkOption.value)
    }

    if (!selectedInstitutionOption?.value) {
      if ('institution' in updatedQuery) delete updatedQuery['institution']
    } else {
      updatedQuery.institution = String(selectedInstitutionOption.value)
    }

    if (!selectedLocationOption?.value) {
      if ('location' in updatedQuery) delete updatedQuery['location']
    } else {
      updatedQuery.location = String(selectedLocationOption.value)
    }

    push(
      {
        pathname,
        query: updatedQuery,
      },
      undefined,
      { shallow: true },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchTerm,
    selectedFieldOfWorkOption?.value,
    selectedInstitutionOption?.value,
    selectedLocationOption?.value,
  ])

  return (
    <Box paddingTop={[0, 0, 8]}>
      <GridContainer>
        <Stack space={2}>
          <Box display="flex" justifyContent="spaceBetween">
            <Stack space={2}>
              <Breadcrumbs
                items={[
                  { title: 'Ísland.is', href: '/' },
                  {
                    title: n('title', 'Starfatorg'),
                    isCurrentPage: true,
                    href: linkResolver('vacancies').href,
                  },
                ]}
              />

              <Text variant="h1">Starfatorg - laus störf hjá ríkinu</Text>

              <Box
                marginBottom={1}
                marginTop={5}
                className={styles.searchTermInput}
              >
                <Input
                  value={searchTerm}
                  onChange={(ev) => {
                    setSearchTerm(ev.target.value)
                    setSelectedPage(1)
                  }}
                  name="vacancies-search"
                  placeholder={n(
                    'searchTermPlaceholder',
                    'Leita í Starfatorgi',
                  )}
                  icon={{ name: 'search', type: 'outline' }}
                />
              </Box>
            </Stack>
            <Hidden below="lg">
              <img
                src={n(
                  'starfatorgIcon',
                  'https://images.ctfassets.net/8k0h54kbe6bj/1SY4juL47FNJT7kBNIsdqv/5e51b2319665a832549e6d0813dcd984/LE_-_Jobs_-_S3__1_.svg',
                )}
                alt=""
              />
            </Hidden>
          </Box>

          <GridRow rowGap={2}>
            <GridColumn span={['1/1', '1/1', '1/3']}>
              <Select
                label={n('fieldOfWorkDropdownLabel', 'Veldu störf')}
                placeholder={n(
                  'fieldOfWorkDropwdownPlaceholder',
                  'Veldu starf',
                )}
                size="sm"
                name="field-of-work-picker"
                options={fieldOfWorkOptions}
                onChange={(option) =>
                  setSelectedOptions((options) => ({
                    ...options,
                    fieldOfWork: option as Option,
                  }))
                }
                value={selectedFieldOfWorkOption}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/1', '1/3']}>
              <Select
                label={n('locationDropdownLabel', 'Veldu staðsetningu')}
                placeholder={n(
                  'locationDropdownPlaceholder',
                  'Veldu staðsetningu',
                )}
                size="sm"
                name="location-picker"
                options={locationOptions}
                onChange={(option) =>
                  setSelectedOptions((options) => ({
                    ...options,
                    location: option as Option,
                  }))
                }
                value={selectedLocationOption}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/1', '1/3']}>
              <Select
                label={n('institutionDropdownLabel', 'Veldu stofnun/ráðuneyti')}
                placeholder={n(
                  'institutionDropdownPlaceholder',
                  'Veldu stofnun/ráðuneyti',
                )}
                size="sm"
                name="institution-picker"
                options={institutionOptions}
                onChange={(option) =>
                  setSelectedOptions((options) => ({
                    ...options,
                    institution: option as Option,
                  }))
                }
                value={selectedInstitutionOption}
              />
            </GridColumn>
          </GridRow>
          <Box
            marginBottom={3}
            style={{
              visibility:
                selectedFieldOfWorkOption ||
                selectedLocationOption ||
                selectedInstitutionOption
                  ? 'visible'
                  : 'hidden',
            }}
          >
            <Button
              size="small"
              onClick={clearFilters}
              icon="reload"
              variant="text"
            >
              {n('clearFilters', 'Núllstila leit')}
            </Button>
          </Box>
        </Stack>
      </GridContainer>
      <Box paddingTop={3} paddingBottom={6} background="blue100">
        <GridContainer>
          <Box marginBottom={6}>
            <Text>
              {filteredVacancies.length}{' '}
              {filteredVacancies.length === 1
                ? n('singleJobFound', 'starf fannst')
                : n('jobsFound', 'störf fundust')}
            </Text>
          </Box>
          <GridRow rowGap={[3, 3, 6]}>
            {filteredVacancies
              .slice(
                ITEMS_PER_PAGE * (selectedPage - 1),
                ITEMS_PER_PAGE * selectedPage,
              )
              .map((vacancy) => {
                const description = convertHtmlToPlainText(vacancy.description)
                return (
                  <GridColumn key={vacancy.id} span={['1/1', '1/1', '1/2']}>
                    <FocusableBox
                      height="full"
                      href={`${
                        linkResolver('vacancydetails', [vacancy.id?.toString()])
                          .href
                      }`}
                      padding={[3, 3, 'containerGutter']}
                      display="flex"
                      flexDirection="column"
                      background="white"
                      borderRadius="large"
                      borderColor="blue200"
                      borderWidth="standard"
                    >
                      <Text variant="eyebrow">{vacancy.fieldOfWork}</Text>
                      <Text color="blue400" variant="h3">
                        {vacancy.title}
                      </Text>
                      <Text as="div">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: shortenText(
                              description,
                              MAX_DESCRIPTION_LENGTH,
                            ),
                          }}
                        />
                      </Text>
                    </FocusableBox>
                  </GridColumn>
                )
              })}
          </GridRow>
          {filteredVacancies.length > 0 && (
            <Box paddingTop={8}>
              <Pagination
                variant="blue"
                page={selectedPage}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={filteredVacancies.length}
                totalPages={totalPages}
                renderLink={(page, className, children) => (
                  <LinkV2
                    href={{
                      pathname: pathname,
                      query: { ...query, page },
                    }}
                  >
                    <span className={className}>{children}</span>
                  </LinkV2>
                )}
              />
            </Box>
          )}
        </GridContainer>
      </Box>
    </Box>
  )
}

IcelandicGovernmentInstitutionVacanciesList.getInitialProps = async ({
  apolloClient,
  locale,
}) => {
  const [vacanciesResponse, namespaceResponse] = await Promise.all([
    apolloClient.query<
      GetIcelandicGovernmentInstitutionVacanciesQuery,
      GetIcelandicGovernmentInstitutionVacanciesQueryVariables
    >({
      query: GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES,
      variables: {
        input: {},
      },
    }),
    apolloClient.query<GetNamespaceQuery, GetNamespaceQueryVariables>({
      query: GET_NAMESPACE_QUERY,
      variables: {
        input: {
          lang: locale,
          namespace: 'Starfatorg',
        },
      },
    }),
  ])

  const vacancies =
    vacanciesResponse.data.icelandicGovernmentInstitutionVacancies.vacancies

  const namespace = JSON.parse(
    namespaceResponse?.data?.getNamespace?.fields || '{}',
  ) as Record<string, string>

  return {
    vacancies,
    namespace,
  }
}

export default withMainLayout(IcelandicGovernmentInstitutionVacanciesList)
