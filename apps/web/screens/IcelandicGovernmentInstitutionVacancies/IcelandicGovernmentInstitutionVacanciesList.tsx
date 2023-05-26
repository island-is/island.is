import { useMemo, useState } from 'react'
import {
  Text,
  FocusableBox,
  GridContainer,
  GridColumn,
  Box,
  GridRow,
  Breadcrumbs,
  Input,
  Inline,
  Select,
  Stack,
  Option,
  Button,
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

type Vacancy = IcelandicGovernmentInstitutionVacanciesResponse['vacancies'][number]

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
  const n = useNamespace(namespace)

  const [searchTerm, setSearchTerm] = useState('')
  const [
    selectedFieldOfWorkOption,
    setSelectedFieldOfWorkOption,
  ] = useState<Option | null>(null)
  const [
    selectedLocationOption,
    setSelectedLocationOption,
  ] = useState<Option | null>(null)
  const [
    selectedInstitutionOption,
    setSelectedInstitutionOption,
  ] = useState<Option | null>(null)

  const { linkResolver } = useLinkResolver()

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
    setSelectedFieldOfWorkOption(null)
    setSelectedLocationOption(null)
    setSelectedInstitutionOption(null)
  }

  return (
    <Box>
      <GridContainer>
        <Stack space={2}>
          <Box display="flex" justifyContent="spaceBetween">
            <Stack space={2}>
              <Breadcrumbs
                items={[
                  { title: 'Ísland.is', href: '/' },
                  {
                    title: 'Starfatorg',
                    isCurrentPage: true,
                    href: linkResolver('vacancies').href,
                  },
                ]}
              />

              <Text variant="h1">Starfatorg - laus störf hjá ríkinu</Text>

              <Box marginTop={5}>
                <Input
                  value={searchTerm}
                  onChange={(ev) => setSearchTerm(ev.target.value)}
                  name="vacancies-search"
                  placeholder="Leita í Starfatorgi"
                  icon={{ name: 'search', type: 'outline' }}
                />
              </Box>
            </Stack>
            <img
              src={n(
                'starfatorgIcon',
                'https://images.ctfassets.net/8k0h54kbe6bj/1SY4juL47FNJT7kBNIsdqv/452a41bd6b685915bf9d07fb99bd2090/LE_-_Jobs_-_S3.svg',
              )}
              alt=""
            />
          </Box>

          <Inline space={2}>
            <Select
              label="Veldu störf"
              placeholder="Veldu starf"
              size="sm"
              name="field-of-work-picker"
              options={fieldOfWorkOptions}
              onChange={(option) =>
                setSelectedFieldOfWorkOption(option as Option)
              }
              value={selectedFieldOfWorkOption}
            />
            <Select
              label="Veldu staðsetningu"
              placeholder="Veldu staðsetningu"
              size="sm"
              name="location-picker"
              options={locationOptions}
              onChange={(option) => setSelectedLocationOption(option as Option)}
              value={selectedLocationOption}
            />
            <Select
              label="Veldu stofnun/ráðuneyti"
              placeholder="Veldu stofnun/ráðuneyti"
              size="sm"
              name="institution-picker"
              options={institutionOptions}
              onChange={(option) =>
                setSelectedInstitutionOption(option as Option)
              }
              value={selectedInstitutionOption}
            />
          </Inline>
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
      <Box paddingBottom={6}>
        <GridContainer>
          <Text>
            {filteredVacancies.length}{' '}
            {filteredVacancies.length === 1
              ? n('singleJobFound', 'starf fannst')
              : n('jobsFound', 'störf fundust')}
          </Text>
          <GridRow>
            {filteredVacancies.map((vacancy) => (
              <GridColumn key={vacancy.id} span={['1/1', '1/1', '1/2']}>
                <FocusableBox
                  href={`${
                    linkResolver('vacancydetails', [vacancy.id?.toString()])
                      .href
                  }`}
                  padding="containerGutter"
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
                  <Text truncate={true} as="div">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: vacancy.description,
                      }}
                    />
                  </Text>
                </FocusableBox>
              </GridColumn>
            ))}
          </GridRow>
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

  const namespace = JSON.parse(
    namespaceResponse?.data?.getNamespace?.fields || '{}',
  ) as Record<string, string>

  return {
    vacancies:
      vacanciesResponse.data.icelandicGovernmentInstitutionVacancies.vacancies,
    namespace,
  }
}

export default withMainLayout(IcelandicGovernmentInstitutionVacanciesList)
