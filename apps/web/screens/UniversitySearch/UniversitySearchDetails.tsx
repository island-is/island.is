import React, { useMemo, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import format from 'date-fns/format'
import en from 'date-fns/locale/en-US'
import is from 'date-fns/locale/is'
import getConfig from 'next/config'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { SliceType } from '@island.is/island-ui/contentful'
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
  Navigation,
  NavigationItem,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  IconTitleCard,
  OrganizationFooter,
  OrganizationHeader,
  Webreader,
} from '@island.is/web/components'
import {
  ContentLanguage,
  GetNamespaceQuery,
  GetNamespaceQueryVariables,
  GetUniversityGatewayQuery,
  GetUniversityGatewayQueryVariables,
  GetUniversityGatewayUniversitiesQuery,
  Query,
  QueryGetOrganizationPageArgs,
  UniversityGatewayProgramDetails,
  UniversityGatewayUniversity,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import SidebarLayout from '../Layouts/SidebarLayout'
import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../queries'
import {
  GET_UNIVERSITY_GATEWAY_PROGRAM,
  GET_UNIVERSITY_GATEWAY_UNIVERSITIES,
} from '../queries/UniversityGateway'
import { TranslationDefaults } from './TranslationDefaults'
import * as styles from './UniversitySearch.css'

const { publicRuntimeConfig = {} } = getConfig() ?? {}
interface UniversityDetailsProps {
  data: UniversityGatewayProgramDetails
  namespace: Record<string, string>
  locale: string
  universities: Array<UniversityGatewayUniversity>
  organizationPage?: Query['getOrganizationPage']
}

const UniversityDetails: Screen<UniversityDetailsProps> = ({
  data,
  namespace,
  locale,
  universities,
  organizationPage,
}) => {
  const n = useNamespace(namespace)
  const router = useRouter()
  // const [sortedCourses, setSortedCourses] = useState<
  //   Array<UniversityGatewayProgramCourse>
  // >([])
  const { linkResolver } = useLinkResolver()
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

  // useEffect(() => {
  //   setSortedCourses(
  //     data.courses.sort((x, y) =>
  //       (x.semesterSeason + x.semesterYear).localeCompare(
  //         y.semesterSeason + y.semesterYear,
  //       ),
  //     ),
  //   )
  // }, [data, sortedCourses])

  const mapArrayToDictionary = (array: Array<unknown>, mapByKey: string) => {
    const dictionary: { [key: string]: Array<any> } = {}

    array.forEach((arrayItem: any) => {
      const keyValue = arrayItem[mapByKey]

      if (keyValue === undefined) {
        return
      }
      if (dictionary[keyValue] === undefined) {
        // If the key doesn't exist in the dictionary, create a new array
        dictionary[keyValue] = [arrayItem]
      } else {
        // If the key already exists, push the value to the existing array
        dictionary[keyValue].push(arrayItem)
      }
    })

    return dictionary
  }

  // TODO THIS WILL BE ADDED BACK WHEN UNIVERSITIES RETURN THE COURSES FOR EACH PROGRAM
  // const createTabContent = () => {
  //   if (sortedCourses.length === 0) {
  //     return
  //   }
  //   const tabList: Array<TabType> = []
  //   const mappedDictionary = mapArrayToDictionary(
  //     sortedCourses,
  //     'semesterYearNumber',
  //   )
  //   let index = 0
  //   for (const key in mappedDictionary) {
  //     const value = mappedDictionary[key]
  //     const mappedBySemester = mapArrayToDictionary(value, 'semesterSeason')

  //     const contentItems: Array<React.ReactElement> = []
  //     for (const x in mappedBySemester) {
  //       contentItems.push(
  //         <Box className={[styles.courseTypeIcon, styles.capitalizeText]}>
  //           <Text variant="h4" color="blue400" paddingBottom={2} paddingTop={2}>
  //             {n(x, TranslationDefaults[x])}
  //           </Text>
  //           {mappedBySemester[x].map((item) => {
  //             return (
  //               <Box
  //                 display="flex"
  //                 flexDirection="row"
  //                 justifyContent="spaceBetween"
  //               >
  //                 <Text variant="h4" as="p" paddingBottom={1} paddingTop={1}>
  //                   {locale === 'en' ? item.nameEn : item.nameIs}
  //                 </Text>
  //                 <Box className={styles.courseTypeIcon}>
  //                   <Text
  //                     fontWeight="semiBold"
  //                     color={
  //                       item.requirement === Requirement.MANDATORY
  //                         ? 'red600'
  //                         : item.requirement === Requirement.FREE_ELECTIVE
  //                         ? 'blue600'
  //                         : 'purple600'
  //                     }
  //                   >
  //                     {item.requirement === Requirement.MANDATORY
  //                       ? 'S'
  //                       : item.requirement === Requirement.FREE_ELECTIVE
  //                       ? 'V'
  //                       : 'B'}
  //                   </Text>
  //                 </Box>
  //               </Box>
  //             )
  //           })}
  //         </Box>,
  //       )
  //     }

  //     tabList.push({
  //       id: index.toString(),
  //       label: `${parseInt(key) + 1}. ${n('year', 'ár')}`,
  //       content: contentItems,
  //     })
  //     index++
  //   }

  //   return tabList
  // }

  const navList: NavigationItem[] =
    organizationPage?.menuLinks.map(({ primaryLink, childrenLinks }) => ({
      title: primaryLink?.text ?? '',
      href: primaryLink?.url,
      active: primaryLink?.url === router.pathname,
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
      })),
    })) ?? []

  const universityData = useMemo(() => {
    return universities.filter((x) => x.id === data.universityId)[0] || {}
  }, [universities, data.universityId])

  const htmlParser = (dataEn: string | undefined, dataIs: string) => {
    return locale === 'en'
      ? ReactHtmlParser(dataEn ? dataEn : '')
      : ReactHtmlParser(dataIs ? dataIs : '')
  }

  const applicationUrlParser = () => {
    switch (universityData.contentfulTitle) {
      case 'Háskóli Íslands':
        return 'https://ugla.hi.is/namsumsoknir/'
      case 'Háskólinn á Akureyri':
        return 'https://ugla.unak.is/namsumsoknir/'
      case 'Háskólinn á Bifröst':
        return 'https://ugla.bifrost.is/namsumsoknir/index.php'
      case 'Háskólinn á Hólum':
        return 'https://ugla.holar.is/namsumsoknir/'
      case 'Háskólinn í Reykjavík':
        return 'https://umsoknir.ru.is/'
      case 'Landbúnaðarháskóli Íslands':
        return 'https://ugla.lbhi.is/namsumsoknir/'
      case 'Listaháskóli Íslands':
        return 'https://ugla.lhi.is/namsumsoknir/'
      default:
        return '/'
    }
  }

  const formatModeOfDelivery = (items: string[]): string => {
    items = items.filter((item) => {
      return item !== 'UNDEFINED' ? true : false
    })

    const length = items.length

    if (length === 0) {
      return ''
    }

    if (length === 1) {
      return n(items[0], TranslationDefaults[items[0]])
    }

    if (length === 2) {
      return `${n(items[0], TranslationDefaults[items[0]])} ${n(
        'or',
        'eða',
      )} ${n(items[1], TranslationDefaults[items[1]])}`
    }

    const formattedList = items.map((item, index) => {
      if (index === length - 1) {
        return `${n('or', 'eða')} ${n(item, TranslationDefaults[item])}`
      } else {
        return `${n(item, TranslationDefaults[item])}, `
      }
    })

    return formattedList.join('')
  }

  return (
    <>
      {organizationPage && (
        <OrganizationHeader organizationPage={organizationPage} />
      )}
      <SidebarLayout
        fullWidthContent={true}
        sidebarContent={
          <Stack space={3}>
            <Navigation
              baseId="pageNav"
              items={navList}
              title={n('navigationTitle', 'Efnisyfirlit')}
              activeItemTitle="Námsleit"
              renderLink={(link, item) => {
                return item?.href ? (
                  <NextLink href={item?.href} legacyBehavior>
                    {link}
                  </NextLink>
                ) : (
                  link
                )
              }}
            />
            <IconTitleCard
              heading={
                locale === 'is'
                  ? universityData.contentfulTitle || ''
                  : universityData.contentfulTitleEn || ''
              }
              href={
                locale === 'is'
                  ? universityData.contentfulLink || ''
                  : universityData.contentfulLinkEn || ''
              }
              imgSrc={universityData.contentfulLogoUrl || ''}
              alt="University infomation"
            />
          </Stack>
        }
      >
        <Box className={styles.mainContentWrapper}>
          <Stack space={3}>
            <Hidden above="sm">
              <LinkV2 href={linkResolver('universitysearch').href} skipTab>
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
            <Box
              display={'flex'}
              flexDirection={'column'}
              style={{ gap: '0.5rem' }}
            >
              <Box style={{ marginBottom: '-16px' }}>
                <Webreader />
              </Box>
              <Text variant="h1" as="h2">
                {locale === 'en' ? data.nameEn : data.nameIs}
              </Text>
              {data.specializationNameIs && data.specializationNameEn && (
                <Text variant="h3" as="h3">
                  {`${locale === 'en' ? 'Specialization: ' : 'Kjörsvið: '}${
                    locale === 'en'
                      ? data.specializationNameEn
                      : data.specializationNameIs
                  }`}
                </Text>
              )}
            </Box>
            <Box
              width="full"
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'spaceBetween'}
              alignItems={'center'}
              style={{ backgroundColor: '#F2F7FF' }}
              padding={3}
            >
              <Text variant={'h3'} as="h3" color={'blue600'}>
                {n('applyForProgram', 'Umsókn í háskólanám')}
              </Text>

              <Button
                onClick={() => router.push(applicationUrlParser())}
                disabled={!data.applicationPeriodOpen}
              >
                <Box display={'flex'} style={{ gap: '0.5rem' }}>
                  {n('apply', 'Sækja um')}
                  <Icon icon="open" type="outline" />
                </Box>
              </Button>
            </Box>
            <Box marginTop={2}>
              {data.credits && data.credits > 0 ? (
                <Text variant="default">{`${data.degreeAbbreviation} - ${
                  data.credits
                } ${n('units', 'einingar')}`}</Text>
              ) : (
                <Text variant="default">{`${data.degreeAbbreviation}`}</Text>
              )}
              {data.iscedCode && (
                <Text variant="small">{`${n('isced', 'ISCED Flokkun')}: ${
                  data.iscedCode
                }`}</Text>
              )}
              <Box className="rs_read">
                <Text marginTop={3} marginBottom={3} variant="default" as="div">
                  {webRichText(
                    (locale === 'is'
                      ? [data.descriptionHtmlIs]
                      : [data.descriptionHtmlEn]) as SliceType[],
                  )}
                </Text>
              </Box>
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
                        {`${n('degreeType', 'Námsstig')}: ${n(
                          data.degreeType,
                          TranslationDefaults[data.degreeType],
                        )}, ${data.degreeAbbreviation}`}
                      </Text>
                    </Box>
                  </GridColumn>
                  <GridColumn span="1/2">
                    <Box display="flex" flexDirection="row">
                      <Box marginRight={1}>
                        <Icon
                          icon={'calendar'}
                          type="outline"
                          color="blue400"
                        />
                      </Box>
                      <Text variant="medium">{`${n('begins', 'Nám hefst')}: ${n(
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
                        <Icon
                          icon={'calendar'}
                          type="outline"
                          color="blue400"
                        />
                      </Box>
                      <Text variant="medium">
                        {`${n('applicationPeriod', 'Umsóknartímabil')}: ${
                          data.applicationStartDate && data.applicationEndDate
                            ? `${format(
                                new Date(data.applicationStartDate),
                                'd. MMMM yyyy',
                                { locale: locale === 'en' ? en : is },
                              )} - ${format(
                                new Date(data.applicationEndDate),
                                'd. MMMM yyyy',
                                { locale: locale === 'en' ? en : is },
                              )}`
                            : n('Not specified', 'Ótilgreint')
                        }`}
                      </Text>
                    </Box>
                  </GridColumn>

                  <GridColumn span="1/2">
                    <Box display="flex" flexDirection="row">
                      <Box marginRight={1}>
                        <Icon icon={'person'} type="outline" color="blue400" />
                      </Box>
                      <Text variant="medium">{`${n(
                        'modeOfDelivery',
                        'Námsform',
                      )}: ${formatModeOfDelivery(data.modeOfDelivery)}`}</Text>
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
                {(data.admissionRequirementsEn ||
                  data.admissionRequirementsIs) && (
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
                      {htmlParser(
                        data.admissionRequirementsEn || '',
                        data.admissionRequirementsIs || '',
                      )}
                    </Text>
                  </AccordionItem>
                )}
                {(data.studyRequirementsEn || data.studyRequirementsIs) && (
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
                      {htmlParser(
                        data.studyRequirementsEn || '',
                        data.studyRequirementsIs || '',
                      )}
                    </Text>
                  </AccordionItem>
                )}
                {(data.costInformationEn || data.costInformationIs) && (
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
                )}
              </Accordion>
            </Box>
          </Stack>
        </Box>
      </SidebarLayout>
      <Box className="rs_read">
        <OrganizationFooter
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          organizations={[organizationPage.organization]}
          force={true}
        />
      </Box>
    </>
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
    throw new CustomNextError(404, 'Page not found')
  }

  const newResponse = await apolloClient.query<
    GetUniversityGatewayQuery,
    GetUniversityGatewayQueryVariables
  >({
    query: GET_UNIVERSITY_GATEWAY_PROGRAM,
    variables: {
      input: {
        id: query.id as string,
      },
    },
  })

  const organizationPage = await apolloClient.query<
    Query,
    QueryGetOrganizationPageArgs
  >({
    query: GET_ORGANIZATION_PAGE_QUERY,
    variables: {
      input: {
        slug: locale === 'is' ? 'haskolanam' : 'university-studies',
        lang: locale as ContentLanguage,
      },
    },
  })

  const universities =
    await apolloClient.query<GetUniversityGatewayUniversitiesQuery>({
      query: GET_UNIVERSITY_GATEWAY_UNIVERSITIES,
    })

  const data = newResponse.data.universityGatewayProgram

  return {
    data,
    namespace,
    locale,
    universities: universities.data.universityGatewayUniversities,
    organizationPage: organizationPage.data.getOrganizationPage,
  }
}

export default withMainLayout(UniversityDetails, {
  showFooter: false,
})
