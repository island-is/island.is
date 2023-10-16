import React, { useState } from 'react'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Icon,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Screen } from '@island.is/web/types'
import {
  GetNamespaceQuery,
  GetNamespaceQueryVariables,
  GetUniversityGatewayByIdQuery,
  GetUniversityGatewayByIdQueryVariables,
  GetUniversityGatewayUniversitiesQuery,
  ProgramDetails,
  University,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import {
  GET_UNIVERSITY_GATEWAY_PROGRAM,
  GET_UNIVERSITY_GATEWAY_UNIVERSITIES,
} from '../queries/UniversityGateway'
import { CustomNextError } from '@island.is/web/units/errors'
import { IconTitleCard } from '@island.is/web/components'
import SidebarLayout from '../Layouts/SidebarLayout'
import { GET_NAMESPACE_QUERY } from '../queries'
import { TranslationDefaults } from './TranslationDefaults'

import getConfig from 'next/config'

const { publicRuntimeConfig = {} } = getConfig() ?? {}

interface UniversityDetailsProps {
  data: ProgramDetails
  namespace: Record<string, string>
  locale: string
  universities: Array<University>
}

const UniversityDetails: Screen<UniversityDetailsProps> = ({
  data,
  namespace,
  locale,
  universities,
}) => {
  const n = useNamespace(namespace)

  const [isOpen, setIsOpen] = useState<Array<boolean>>([
    false,
    false,
    false,
    false,
  ])

  const toggleIsOpen = (index: number) => {
    const newIsOpen = isOpen.map((x, i) => {
      if (i === index) {
        return !isOpen[index]
      } else return x
    })

    setIsOpen(newIsOpen)
  }

  return (
    <SidebarLayout
      sidebarContent={
        <Stack space={3}>
          <LinkV2 href="/haskolanam" skipTab>
            <Button
              preTextIcon="arrowBack"
              preTextIconType="filled"
              size="small"
              type="button"
              variant="text"
              truncate
            >
              {n('goBack', 'Til baka í yfirlit')}
            </Button>
          </LinkV2>
          <IconTitleCard
            heading={
              universities.filter((x) => x.id === data.universityId)[0].title
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            href="/"
            imgSrc={
              universities.filter((x) => x.id === data.universityId)[0].logoUrl
            }
            alt="University infomation"
          />
        </Stack>
      }
    >
      <Stack space={3}>
        <Hidden above="sm">
          <LinkV2 href="/haskolanam" skipTab>
            <Button
              preTextIcon="arrowBack"
              preTextIconType="filled"
              size="small"
              type="button"
              variant="text"
              truncate
            >
              {n('goBack', 'Til baka í yfirlit')}
            </Button>
          </LinkV2>
        </Hidden>
        <Text variant="h1" as="h1">
          {locale === 'en' ? data.nameEn : data.nameIs}
        </Text>

        <Box marginTop={2}>
          <Text variant="default">{`${data.degreeAbbreviation} - ${data.credits} einingar`}</Text>
          <Text marginTop={3} marginBottom={3} variant="default">
            {locale === 'en' ? data.descriptionEn : data.descriptionIs}
          </Text>
        </Box>

        <Box marginTop={2}>
          <Text variant="default">{`${data.degreeAbbreviation} - ${data.credits} einingar`}</Text>
          <Text marginTop={3} marginBottom={3} variant="default">
            {locale === 'en' ? data.descriptionEn : data.descriptionIs}
          </Text>
          {data.externalUrlIs && (
            <LinkV2
              underlineVisibility="always"
              color="blue400"
              as="h5"
              href={
                locale === 'en'
                  ? data.externalUrlEn
                    ? data.externalUrlEn
                    : data.externalUrlIs
                  : data.externalUrlIs
              }
            >
              <Box display="flex" flexDirection="row">
                {`${n('seeMoreWeb', 'Sjá meira á vef skóla')}`}
                <Box marginLeft={1}>
                  <Icon icon="open" type="outline" />
                </Box>
              </Box>
            </LinkV2>
          )}
        </Box>
        <Box marginTop={7}>
          <GridContainer>
            <GridRow rowGap={1}>
              <GridColumn span="1/2">
                <Box display="flex" flexDirection="row">
                  <Box marginRight={1}>
                    <Icon icon={'school'} type="outline" color="blue400" />
                  </Box>
                  <Text variant="medium">
                    {n(data.degreeType, TranslationDefaults[data.degreeType])}
                  </Text>
                </Box>
              </GridColumn>
              <GridColumn span="1/2">
                <Box display="flex" flexDirection="row">
                  <Box marginRight={1}>
                    <Icon icon={'calendar'} type="outline" color="blue400" />
                  </Box>
                  <Text variant="medium">{`${n('begins', 'Hefst')} ${n(
                    data.startingSemesterSeason,
                    TranslationDefaults[data.startingSemesterSeason],
                  )} ${data.startingSemesterYear}`}</Text>
                </Box>
              </GridColumn>

              <GridColumn span="1/2">
                <Box display="flex" flexDirection="row">
                  <Box marginRight={1}>
                    <Icon icon={'time'} type="outline" color="blue400" />
                  </Box>
                  <Text variant="medium">{`${n(
                    'educationLength',
                    'Námstími',
                  )}: ${data.durationInYears} ${
                    locale === 'en'
                      ? data.durationInYears === 1
                        ? 'year'
                        : 'years'
                      : 'ár'
                  }`}</Text>
                </Box>
              </GridColumn>
              <GridColumn span="1/2">
                <Box display="flex" flexDirection="row">
                  <Box marginRight={1}>
                    <Icon icon={'wallet'} type="outline" color="blue400" />
                  </Box>
                  <Text variant="medium">
                    {`${n('yearlyCost', 'Árlegur kostnaður')}: ${
                      data.costPerYear
                    }kr.`}
                  </Text>
                </Box>
              </GridColumn>
              <GridColumn span="1/2">
                <Box display="flex" flexDirection="row">
                  <Box marginRight={1}>
                    <Icon icon={'calendar'} type="outline" color="blue400" />
                  </Box>
                  <Text variant="medium">{`${n(
                    'applicationPeriod',
                    'Umsóknartímabil',
                  )}: ${data.applicationStartDate} - ${
                    data.applicationEndDate
                  }`}</Text>
                </Box>
              </GridColumn>

              <GridColumn span="1/2">
                <Box display="flex" flexDirection="row">
                  <Box marginRight={1}>
                    <Icon icon={'person'} type="outline" color="blue400" />
                  </Box>
                  <Text variant="medium">{`${data.modeOfDelivery.map(
                    (delivery, index) => {
                      if (index !== 0) {
                        return `, ${n(delivery, TranslationDefaults[delivery])}`
                      } else {
                        return n(delivery, TranslationDefaults[delivery])
                      }
                    },
                  )}`}</Text>
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
        <Box>
          <Accordion
            singleExpand={false}
            dividerOnTop={false}
            dividerOnBottom={false}
          >
            <AccordionItem
              id="application-rules"
              label={n('admissionRequirements', 'Inntökuskilyrði')}
              labelUse="p"
              labelVariant="h3"
              iconVariant="default"
              expanded={isOpen[0]}
              onToggle={() => toggleIsOpen(0)}
            >
              <Text as="p">
                {locale === 'en'
                  ? data.admissionRequirementsEn
                  : data.admissionRequirementsIs}
              </Text>
            </AccordionItem>
            <AccordionItem
              id="education-requirements"
              label={n('educationRequirements', 'Námskröfur')}
              labelUse="p"
              labelVariant="h3"
              iconVariant="default"
              expanded={isOpen[1]}
              onToggle={() => toggleIsOpen(1)}
            >
              <Text as="p">
                {locale === 'en'
                  ? data.studyRequirementsEn
                  : data.studyRequirementsIs}
              </Text>
            </AccordionItem>
            <AccordionItem
              id="education-orginization"
              label={n('educationOrganization', 'Skipulag náms')}
              labelUse="p"
              labelVariant="h3"
              iconVariant="default"
              expanded={isOpen[2]}
              onToggle={() => toggleIsOpen(2)}
            >
              <Text as="p">
                {data.courses &&
                  data.courses.map((i, index) => {
                    return `${i.nameIs}${
                      index === data.courses.length - 1 ? ', ' : ''
                    }`
                  })}
              </Text>
            </AccordionItem>
            <AccordionItem
              id="annual-cost"
              label={n('yearlyCost', 'Árlegt gjald')}
              labelUse="p"
              labelVariant="h3"
              iconVariant="default"
              expanded={isOpen[3]}
              onToggle={() => toggleIsOpen(3)}
            >
              <Text as="p">
                {locale === 'en'
                  ? data.costInformationEn
                  : data.costInformationIs}
              </Text>
            </AccordionItem>
          </Accordion>
        </Box>
      </Stack>
    </SidebarLayout>
  )
}

UniversityDetails.getProps = async ({ query, apolloClient, locale }) => {
  if (!query?.id) {
    throw new CustomNextError(404, 'Education item was not found')
  }

  const namespaceResponse = await apolloClient.query<
    GetNamespaceQuery,
    GetNamespaceQueryVariables
  >({
    query: GET_NAMESPACE_QUERY,
    variables: {
      input: {
        lang: locale,
        namespace: 'universityGateway',
      },
    },
  })

  const namespace = JSON.parse(
    namespaceResponse?.data?.getNamespace?.fields || '{}',
  ) as Record<string, string>

  let showPagesFeatureFlag = false

  if (publicRuntimeConfig?.environment === 'prod') {
    showPagesFeatureFlag = Boolean(namespace?.showPagesProdFeatureFlag)
  } else if (publicRuntimeConfig?.environment === 'staging') {
    showPagesFeatureFlag = Boolean(namespace?.showPagesStagingFeatureFlag)
  } else {
    showPagesFeatureFlag = Boolean(namespace?.showPagesDevFeatureFlag)
  }

  if (!showPagesFeatureFlag) {
    throw new CustomNextError(404, 'Síða er ekki opin')
  }

  const newResponse = await apolloClient.query<
    GetUniversityGatewayByIdQuery,
    GetUniversityGatewayByIdQueryVariables
  >({
    query: GET_UNIVERSITY_GATEWAY_PROGRAM,
    variables: {
      input: {
        id: query.id as string,
      },
    },
  })

  const universities =
    await apolloClient.query<GetUniversityGatewayUniversitiesQuery>({
      query: GET_UNIVERSITY_GATEWAY_UNIVERSITIES,
    })

  const data = newResponse.data.universityGatewayProgramById

  return {
    data,
    namespace,
    locale,
    universities: universities.data.universityGatewayUniversities,
  }
}

export default withMainLayout(UniversityDetails, { showFooter: false })
