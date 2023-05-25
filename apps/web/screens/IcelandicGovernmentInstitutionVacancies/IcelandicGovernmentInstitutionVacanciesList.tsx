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
} from '@island.is/island-ui/core'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  GetIcelandicGovernmentInstitutionVacanciesQuery,
  GetIcelandicGovernmentInstitutionVacanciesQueryVariables,
  IcelandicGovernmentInstitutionVacanciesResponse,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES } from '../queries/IcelandicGovernmentInstitutionVacancies'

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
}

const IcelandicGovernmentInstitutionVacanciesList: Screen<IcelandicGovernmentInstitutionVacanciesListProps> = ({
  vacancies,
}) => {
  console.log(vacancies)
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

  return (
    <Box>
      <GridContainer>
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

          <Input
            value={searchTerm}
            onChange={(ev) => setSearchTerm(ev.target.value)}
            name="vacancies-search"
            placeholder="Leita í Starfatorgi"
            icon={{ name: 'search', type: 'outline' }}
          />

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
            />
            <Select
              label="Veldu staðsetningu"
              placeholder="Veldu staðsetningu"
              size="sm"
              name="location-picker"
              options={locationOptions}
              onChange={(option) => setSelectedLocationOption(option as Option)}
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
            />
          </Inline>
        </Stack>
      </GridContainer>
      <Box paddingBottom={6}>
        <GridContainer>
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
                  <div
                    dangerouslySetInnerHTML={{
                      __html: vacancy.description?.slice(0, 80).concat('...'),
                    }}
                  ></div>
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
}) => {
  const vacanciesResponse = await apolloClient.query<
    GetIcelandicGovernmentInstitutionVacanciesQuery,
    GetIcelandicGovernmentInstitutionVacanciesQueryVariables
  >({
    query: GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES,
    variables: {
      input: {},
    },
  })

  return {
    vacancies:
      vacanciesResponse.data.icelandicGovernmentInstitutionVacancies.vacancies,
  }
}

export default withMainLayout(IcelandicGovernmentInstitutionVacanciesList)
