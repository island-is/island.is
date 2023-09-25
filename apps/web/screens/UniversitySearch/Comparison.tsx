import React, { useEffect, useState } from 'react'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  Box,
  Button,
  GridContainer,
  LinkV2,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { Screen } from '@island.is/web/types'
import {
  GetNamespaceQuery,
  GetNamespaceQueryVariables,
  ProgramDetails,
} from '@island.is/web/graphql/schema'
import { GET_UNIVERSITY_GATEWAY_PROGRAM } from '../queries/UniversityGateway'
import { GET_NAMESPACE_QUERY } from '../queries'
import { useNamespace } from '@island.is/web/hooks'
import { TranslationDefaults } from './TranslationDefaults'
interface UniversityComparisonProps {
  data: Array<ProgramDetails>
  locale: string
  namespace: Record<string, string>
}

const Comparison: Screen<UniversityComparisonProps> = ({
  data,
  locale,
  namespace,
}) => {
  const n = useNamespace(namespace)
  const [selectedComparison, setSelectedComparison] =
    useState<Array<ProgramDetails>>(data)

  const handleDelete = (dataItem: ProgramDetails) => {
    let found = false
    selectedComparison.forEach((x) => {
      if (x.id === dataItem.id) {
        found = true
      }
    })

    if (found) {
      const a = selectedComparison.filter((item) => {
        if (item.id !== dataItem.id) {
          return true
        }
        return false
      })

      setSelectedComparison(a)
    }
  }

  const handleDeleteAll = () => {
    setSelectedComparison([])
  }

  useEffect(() => {
    //update localStorage
    localStorage.setItem('comparison', JSON.stringify(selectedComparison))
  }, [selectedComparison])

  return (
    <GridContainer>
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
          onClick={() => handleDeleteAll()}
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
                      <Text variant="eyebrow">{i.universityContentfulKey}</Text>
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
            {/* <T.Row>
              <T.Data>
                <Text variant="eyebrow">Háskólagráða</Text>
              </T.Data>
              {selectedComparison.map((i) => {
                return <T.Data>{i.degreeType}</T.Data>
              })}
            </T.Row> */}
            {/* <T.Row>
              <T.Data>
                <Text variant="eyebrow">Staðsetning</Text>
              </T.Data>
              {selectedComparison.map((i) => {
                return <T.Data>Staðsetning hér</T.Data>
              })}
            </T.Row> */}
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
                      <Button size="small" fluid>
                        {n('apply', 'Sækja um')}
                      </Button>
                      <Button size="small" variant="ghost" fluid>
                        {n('previewProgram', 'Skoða nám')}
                      </Button>
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
  const parsedComparison = JSON.parse(
    !!comparison ? (comparison as string) : '',
  )

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

  const allResolvedPromises = await Promise.all(
    parsedComparison.map(async (item: string) => {
      return await apolloClient.query<any, any>({
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
    (resolved) => resolved.data.universityGatewayProgramById,
  )

  return {
    data: mappedData,
    locale,
    namespace,
  }
}

export default withMainLayout(Comparison, { showFooter: false })
