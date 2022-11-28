import { useEffect, useState } from 'react'
import { EventHandler, PowerBIEmbed } from 'powerbi-client-react'
import { Embed, models, Report, VisualDescriptor } from 'powerbi-client'
import { useApolloClient } from '@apollo/client'
import { useRouter } from 'next/router'
import {
  PowerBiEmbedTokenQuery,
  PowerBiEmbedTokenQueryVariables,
  PowerBiSlice as PowerBiSliceSchema,
} from '@island.is/web/graphql/schema'
import { POWERBI_EMBED_TOKEN_QUERY } from '@island.is/web/screens/queries/PowerBi'
import { Box } from '@island.is/island-ui/core'
import { GET_SINGLE_SHIP } from '@island.is/web/screens/queries/Fiskistofa'

import * as styles from './PowerBiSlice.css'

type EventType =
  | 'loaded'
  | 'saved'
  | 'rendered'
  | 'saveAsTriggered'
  | 'error'
  | 'dataSelected'
  | 'buttonClicked'
  | 'info'
  | 'filtersApplied'
  | 'pageChanged'
  | 'commandTriggered'
  | 'swipeStart'
  | 'swipeEnd'
  | 'bookmarkApplied'
  | 'dataHyperlinkClicked'
  | 'visualRendered'
  | 'visualClicked'
  | 'selectionChanged'
  | 'renderingStarted'

interface PowerBiSliceProps {
  slice: PowerBiSliceSchema
}

export const PowerBiSlice = ({ slice }: PowerBiSliceProps) => {
  const [embedPropsFromServer, setEmbedPropsFromServer] = useState<{
    accessToken: string
    embedUrl: string
    tokenType: models.TokenType
  } | null>(null)
  const [shouldRender, setShouldRender] = useState(false)
  const router = useRouter()
  const [embeddedReport, setEmbeddedReport] = useState<Report | null>(null)

  const eventHandlers = new Map<EventType, EventHandler>([
    [
      'loaded',
      async (event) => {
        const report = event.target?.['powerBiEmbed'] as Report

        if (!report) {
          return
        }

        const activePage = await report.getActivePage()
        const slicers = await activePage.getSlicers()

        for (const visual of slicers) {
          if (visual.type !== 'slicer') continue
          const slicer = visual as VisualDescriptor
          if (slicer.name in router.query) {
            const newSlicerState = JSON.parse(
              router.query[slicer.name] as string,
            )
            await slicer.setSlicerState(newSlicerState)
          }
        }
      },
    ],
    [
      'dataSelected',
      async (event) => {
        const visualName = event.detail?.visual?.name as string
        const report: Report =
          event.target?.['powerBiEmbed'] ?? event.detail?.report

        if (!report || !visualName) {
          return
        }

        const activePage = await report.getActivePage()
        const visual = await activePage.getVisualByName(visualName)
        const slicerState = await visual.getSlicerState()
        const baseRouterPath = router.asPath.split('?')[0].split('#')[0]

        const query = { ...router.query }
        query[visualName] = JSON.stringify(slicerState)

        // Change the ship number query param if this report is owned by Fiskistofa
        if (
          slice?.owner === 'Fiskistofa' &&
          slicerState.filters?.[0]?.target?.['column'] === 'Skip nafn og númer'
        ) {
          const value: string = slicerState.filters?.[0]?.['values']?.[0] ?? ''
          const firstParenthesis = value.indexOf('(')
          const lastParenthesis = value.indexOf(')')
          const nr = value?.slice(firstParenthesis + 1, lastParenthesis)
          if (nr) query['nr'] = nr
        }

        router.push(
          {
            pathname: baseRouterPath,
            query,
          },
          undefined,
          { shallow: true },
        )
      },
    ],
  ])

  const apolloClient = useApolloClient()

  useEffect(() => {
    const sliceNeedsEmbedParams =
      !!slice.owner && !!slice.reportId && !!slice.workspaceId

    if (!sliceNeedsEmbedParams) {
      setShouldRender(true)
      return
    }

    const getEmbedPropsFromServer = async () => {
      setShouldRender(false)
      const response = await apolloClient.query<
        PowerBiEmbedTokenQuery,
        PowerBiEmbedTokenQueryVariables
      >({
        query: POWERBI_EMBED_TOKEN_QUERY,
        variables: {
          input: {
            reportId: slice.reportId,
            owner: slice.owner,
            workspaceId: slice.workspaceId,
          },
        },
      })
      if (
        response?.data?.powerbiEmbedToken?.token &&
        response?.data?.powerbiEmbedToken?.embedUrl
      ) {
        setEmbedPropsFromServer({
          accessToken: response.data.powerbiEmbedToken.token,
          embedUrl: response.data.powerbiEmbedToken.embedUrl,
          tokenType: models.TokenType.Embed,
        })
        setShouldRender(true)
      } else {
        // TODO: Show an error
      }
    }

    getEmbedPropsFromServer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slice.owner, slice.reportId, slice.workspaceId])

  useEffect(() => {
    if (!embeddedReport || !router?.query?.nr || slice?.owner !== 'Fiskistofa')
      return
    const nr = Number(router.query.nr)
    embeddedReport.getActivePage().then((page) => {
      page.getSlicers().then((slicers) => {
        for (const visual of slicers) {
          if (visual.type !== 'slicer') continue
          const slicer = visual as VisualDescriptor
          slicer.getSlicerState().then((slicerState) => {
            if (
              slicerState.filters?.[0]?.target?.['column'] ===
              'Skip nafn og númer'
            ) {
              apolloClient
                .query({
                  query: GET_SINGLE_SHIP,
                  variables: {
                    input: {
                      shipNumber: nr,
                    },
                  },
                })
                .then((response) => {
                  const ship =
                    response?.data?.fiskistofaGetSingleShip
                      ?.fiskistofaSingleShip
                  if (ship?.name) {
                    let name = ship.name as string
                    const nameSplit = name.split(' ')
                    name = `${nameSplit
                      .slice(0, nameSplit.length - 1)
                      .join(' ')}-${nameSplit[nameSplit.length - 1]} (${nr})`
                    slicer.setSlicerState({
                      ...slicerState,
                      filters: [
                        {
                          ...slicerState.filters?.[0],
                          values: [name],
                        },
                      ],
                    })
                  }
                })
            }
          })
        }
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query?.nr])

  const getEmbeddedComponent = (embed: Embed) => {
    // Default styles
    embed.element.style.height = '600px'
    embed.iframe.style.border = 'none'

    // Apply styles to containing element from CMS
    const elementStyle = slice?.powerBiEmbedProps?.style?.element
    if (elementStyle) {
      for (const key of Object.keys(elementStyle)) {
        const value = elementStyle?.[key]
        if (value) {
          embed.element.style[key] = value
        }
      }
    }

    // Apply styles to iframe child emelement from CMS
    const iframeStyle = slice?.powerBiEmbedProps?.style?.iframe
    if (iframeStyle) {
      for (const key of Object.keys(iframeStyle)) {
        const value = iframeStyle?.[key]
        if (value) {
          embed.element.style[key] = value
        }
      }
    }
    setEmbeddedReport(embed as Report)
  }

  if (!shouldRender) return <Box className={styles.blankContainer} />

  const embedProps = slice?.powerBiEmbedProps?.embedProps ?? {}

  return (
    <PowerBIEmbed
      embedConfig={{
        type: 'report',
        ...embedProps,
        ...embedPropsFromServer,
      }}
      getEmbeddedComponent={getEmbeddedComponent}
      eventHandlers={eventHandlers}
    />
  )
}

export default PowerBiSlice
