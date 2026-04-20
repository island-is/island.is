import React, { useEffect, useState } from 'react'
import getConfig from 'next/config'

import {
  Box,
  Button,
  GridContainer,
  LinkV2,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import {
  GetNamespaceQuery,
  GetNamespaceQueryVariables,
  GetUniversityGatewayQuery,
  GetUniversityGatewayQueryVariables,
  GetUniversityGatewayUniversitiesQuery,
  UniversityGatewayProgramDetails,
  UniversityGatewayUniversity,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import { GET_NAMESPACE_QUERY } from '../queries'
import {
  GET_UNIVERSITY_GATEWAY_PROGRAM,
  GET_UNIVERSITY_GATEWAY_UNIVERSITIES,
} from '../queries/UniversityGateway'
import { TranslationDefaults } from './TranslationDefaults'

const { publicRuntimeConfig = {} } = getConfig() ?? {}

interface UniversityComparisonProps {
  data: Array<UniversityGatewayProgramDetails>
  locale: string
  namespace: Record<string, string>
  universities: Array<UniversityGatewayUniversity>
}

const Comparison: Screen<UniversityComparisonProps> = ({
  data,
  locale,
  namespace,
  universities,
}) => {
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const [selectedComparison, setSelectedComparison] =
    useState<Array<UniversityGatewayProgramDetails>>(data)

  const handleDelete = (dataItem: UniversityGatewayProgramDetails) => {
    const found = selectedComparison.some((x) => x.id === dataItem.id)

    if (found) {
      const a = selectedComparison.filter((item) => item.id !== dataItem.id)

      setSelectedComparison(a)
    }
  }

  const handleDeleteAll = () => {
    setSelectedComparison([])
  }

  useEffect(() => {
    const parsedData = selectedComparison.map((item) => {
      return {
        id: item.id,
        nameIs: item.nameIs,
        iconSrc: universities.filter((x) => x.id === item.universityId)[0]
          .contentfulLogoUrl,
      }
    })
    localStorage.setItem('comparison', JSON.stringify(parsedData))
  }, [selectedComparison])

  return (
    <GridContainer>
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

      <Text variant="h1" paddingTop={3}>
        {n('comparison', 'Samanburður')}
      </Text>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        alignItems="center"
      >
        <Text paddingY={5}>{`${data.length} ${n(
          'programsInComparison',
          'námsleiðir í samanburði',
        )}`}</Text>
        <Button
          icon="close"
          iconType="outline"
          size="small"
          type="button"
          variant="text"
          truncate
          onClick={handleDeleteAll}
        >
          {n('clearFilter', 'Hreinsa val')}
        </Button>
      </Box>
      <Box marginBottom={5}>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>
                <Text variant="eyebrow">{n('school', 'Skóli')}</Text>
              </T.HeadData>
              {selectedComparison.map((i) => {
                return (
                  <T.HeadData>
                    <Box
                      width="full"
                      display="flex"
                      flexDirection="row"
                      justifyContent="spaceBetween"
                      alignItems="center"
                    >
                      <Text variant="eyebrow">
                        {
                          universities.filter((x) => x.id === i.universityId)[0]
                            .contentfulTitle
                        }
                      </Text>
                      <Button
                        variant="text"
                        size="small"
                        icon="close"
                        onClick={() => handleDelete(i)}
                      ></Button>
                    </Box>
                  </T.HeadData>
                )
              })}
            </T.Row>
          </T.Head>
          <T.Body>
            <T.Row>
              <T.Data>
                <Text variant="eyebrow">{n('educationPath', 'Námsbraut')}</Text>
              </T.Data>
              {selectedComparison.map((i) => {
                return <T.Data>{locale === 'en' ? i.nameEn : i.nameIs}</T.Data>
              })}
            </T.Row>
            <T.Row>
              <T.Data>
                <Text variant="eyebrow">
                  {n('modeOfDelivery', 'Form kennslu')}
                </Text>
              </T.Data>
              {selectedComparison.map((i) => {
                return (
                  <T.Data>
                    {i.modeOfDelivery.map((delivery, index) => {
                      if (index !== 0) {
                        return `, ${n(delivery, TranslationDefaults[delivery])}`
                      } else {
                        return n(delivery, TranslationDefaults[delivery])
                      }
                    })}
                  </T.Data>
                )
              })}
            </T.Row>
            <T.Row>
              <T.Data>
                <Text variant="eyebrow">{n('degreeType', 'Námsstig')}</Text>
              </T.Data>
              {selectedComparison.map((i) => {
                return (
                  <T.Data>
                    {n(i.degreeType, TranslationDefaults[i.degreeType])}
                  </T.Data>
                )
              })}
            </T.Row>
            <T.Row>
              <T.Data>
                <Text variant="eyebrow">
                  {n('durationInYears', 'Lengd náms')}
                </Text>
              </T.Data>
              {selectedComparison.map((i) => {
                return (
                  <T.Data>{`${i.durationInYears} ${
                    locale === 'en'
                      ? i.durationInYears === 1
                        ? 'year'
                        : 'years'
                      : 'ár'
                  }`}</T.Data>
                )
              })}
            </T.Row>
          </T.Body>
          <T.Foot>
            <T.Row>
              <T.Data borderColor="transparent"></T.Data>
              {selectedComparison.map((i) => {
                return (
                  <T.Data borderColor="transparent">
                    <Box
                      width="full"
                      display="flex"
                      flexDirection="column"
                      rowGap={1}
                    >
                      {i.applicationPeriodOpen && (
                        <Button size="small" fluid>
                          {n('apply', 'Sækja um')}
                        </Button>
                      )}

                      <LinkV2
                        href={
                          linkResolver('universitysearchdetails', [i.id]).href
                        }
                        passHref
                      >
                        <Button size="small" variant="ghost" fluid>
                          {n('previewProgram', 'Skoða nám')}
                        </Button>
                      </LinkV2>
                    </Box>
                  </T.Data>
                )
              })}
            </T.Row>
          </T.Foot>
        </T.Table>
      </Box>
    </GridContainer>
  )
}

Comparison.getProps = async ({ query, apolloClient, locale }) => {
  const { comparison } = query
  const parsedComparison = comparison ? JSON.parse(comparison as string) : []

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

  const allResolvedPromises = await Promise.all(
    parsedComparison.map(async (item: string) => {
      return await apolloClient.query<
        GetUniversityGatewayQuery,
        GetUniversityGatewayQueryVariables
      >({
        query: GET_UNIVERSITY_GATEWAY_PROGRAM,
        variables: {
          input: {
            id: item as string,
          },
        },
      })
    }),
  )

  const mappedData = allResolvedPromises.map(
    (resolved) => resolved.data.universityGatewayProgram,
  )

  const universities =
    await apolloClient.query<GetUniversityGatewayUniversitiesQuery>({
      query: GET_UNIVERSITY_GATEWAY_UNIVERSITIES,
    })

  return {
    data: mappedData,
    locale,
    namespace,
    universities: universities.data.universityGatewayUniversities,
  }
}

export default withMainLayout(Comparison, { showFooter: false })
