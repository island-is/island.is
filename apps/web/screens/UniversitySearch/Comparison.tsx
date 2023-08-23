import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  Box,
  Button,
  GridContainer,
  Icon,
  LinkV2,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { UNIVERSITY_GATEWAY_BASE_URL } from '@island.is/web/constants'
import axios from 'axios'
import { useLinkResolver } from '@island.is/web/hooks'
import { ComparisonProps } from './UniversitySearch'

const Comparison = ({ data }) => {
  const router = useRouter()
  console.log('data', data)
  const { linkResolver } = useLinkResolver()

  const [selectedComparison, setSelectedComparison] = useState<Array<any>>([])

  useEffect(() => {
    const comparison = JSON.parse(localStorage.getItem('comparison'))
    if (!!comparison) {
      const newComp = []
      comparison.map((item) => {
        console.log('item', item)
        const i = data.filter((dataItem) => {
          console.log('dataItem.id', dataItem.id)
          if (dataItem.id === item.id) {
            return true
          }
          return false
        })[0]

        newComp.push(i)
      })
      setSelectedComparison(newComp)
    }
  }, [])

  //TODO: TYPE UP DATA ITEMS AS THEY COME FROM THE GRAPHQL
  const handleDelete = (dataItem: any) => {
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
      console.log('a', a)
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
          Til baka í yfirlit
        </Button>
      </LinkV2>

      <Text variant="h1" paddingTop={3}>
        Samanburður
      </Text>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        alignItems="center"
      >
        <Text paddingY={5}>{`${data.length} námsleiðir í samanburði`}</Text>
        <Button
          icon="close"
          iconType="outline"
          size="small"
          type="button"
          variant="text"
          truncate
          onClick={() => handleDeleteAll()}
        >
          Hreinsa val
        </Button>
      </Box>
      <Box marginBottom={5}>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>
                <Text variant="eyebrow">Skóli</Text>
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
                      <Text variant="eyebrow">Skóli kemur hér</Text>
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
                <Text variant="eyebrow">Námsbraut</Text>
              </T.Data>
              {selectedComparison.map((i) => {
                return <T.Data>{i.nameIs}</T.Data>
              })}
            </T.Row>
            <T.Row>
              <T.Data>
                <Text variant="eyebrow">Form kennslu</Text>
              </T.Data>
              {selectedComparison.map((i) => {
                return <T.Data>Form kemur hér</T.Data>
              })}
            </T.Row>
            <T.Row>
              <T.Data>
                <Text variant="eyebrow">Námsstig</Text>
              </T.Data>
              {selectedComparison.map((i) => {
                return <T.Data>{i.degreeType}</T.Data>
              })}
            </T.Row>
            <T.Row>
              <T.Data>
                <Text variant="eyebrow">Háskólagráða</Text>
              </T.Data>
              {selectedComparison.map((i) => {
                return <T.Data>{i.degreeType}</T.Data>
              })}
            </T.Row>
            <T.Row>
              <T.Data>
                <Text variant="eyebrow">Staðsetning</Text>
              </T.Data>
              {selectedComparison.map((i) => {
                return <T.Data>Staðsetning hér</T.Data>
              })}
            </T.Row>
            <T.Row>
              <T.Data>
                <Text variant="eyebrow">Lengd náms</Text>
              </T.Data>
              {selectedComparison.map((i) => {
                return <T.Data>{`${i.durationInYears} ár`}</T.Data>
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
                        Sækja um nám
                      </Button>
                      <Button size="small" variant="ghost" fluid>
                        Skoða nám
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

interface Props {
  query?: any
  apolloClient: any
  locale: any
}

Comparison.getInitialProps = async ({ query, apolloClient, locale }: Props) => {
  const api = `${UNIVERSITY_GATEWAY_BASE_URL}`
  let response
  let data

  const { comparison } = query
  const parsedComparison = JSON.parse(comparison)
  parsedComparison.map((i) => console.log('i', i))
  try {
    response = await axios.get(`${api}/programs`)
    data = response?.data?.data
  } catch (e) {
    const errMsg = 'Failed to retrieve program'
    // const description = e.response.data.description

    //   this.logger.error(errMsg, {
    //     message: description,
    //   })

    throw new Error(`${errMsg}:`)
  }

  const matchedItems = data.filter((x) => parsedComparison.includes(x.id))

  return {
    data: matchedItems,
  }
}

export default withMainLayout(Comparison)
