import { useEffect, useMemo, useState } from 'react'
import { EventHandler, PowerBIEmbed } from 'powerbi-client-react'
import { Embed, models, Report, VisualDescriptor } from 'powerbi-client'
import { useApolloClient, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import {
  GetNamespaceQuery,
  GetNamespaceQueryVariables,
  PowerBiEmbedTokenQuery,
  PowerBiEmbedTokenQueryVariables,
  PowerBiSlice as PowerBiSliceSchema,
} from '@island.is/web/graphql/schema'
import { POWERBI_EMBED_TOKEN_QUERY } from '@island.is/web/screens/queries/PowerBi'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { GET_SINGLE_SHIP } from '@island.is/web/screens/queries/Fiskistofa'
import { GET_NAMESPACE_QUERY } from '@island.is/web/screens/queries'
import { useI18n } from '@island.is/web/i18n'
import { useNamespace } from '@island.is/web/hooks'

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

const slicerStateContainsExpectedTarget = (
  slicerState: models.ISlicerState,
  expectedTarget = {
    column: 'Skip',
    table: 'Skipaskra',
  },
) => {
  return (
    slicerState?.filters?.[0]?.target?.['column'] === expectedTarget?.column ||
    slicerState?.targets?.[0]?.['column'] === expectedTarget?.column
  )
}

const convertShipNameToSlicerDropdownValue = (
  shipName: string,
  shipNumber: string | number,
) => {
  const nameSplit = shipName.split(' ')
  return `${nameSplit.slice(0, nameSplit.length - 1).join(' ')} ${
    nameSplit[nameSplit.length - 1]
  } (${shipNumber})`
}

interface PowerBiSliceProps {
  slice: PowerBiSliceSchema
}

export const PowerBiSlice = ({ slice }: PowerBiSliceProps) => {
  const [embedPropsFromServer, setEmbedPropsFromServer] = useState<{
    accessToken: string
    embedUrl: string
    tokenType: models.TokenType
    pageName?: string
  } | null>(null)
  const [shouldRender, setShouldRender] = useState(false)
  const router = useRouter()
  const [embeddedReport, setEmbeddedReport] = useState<Report | null>(null)
  const [errorOccurred, setErrorOccurred] = useState(false)
  const { activeLocale } = useI18n()

  const namespaceResponse = useQuery<
    GetNamespaceQuery,
    GetNamespaceQueryVariables
  >(GET_NAMESPACE_QUERY, {
    variables: {
      input: {
        lang: activeLocale,
        namespace: 'PowerBiSlice',
      },
    },
  })

  const namespace = useMemo(() => {
    return JSON.parse(namespaceResponse?.data?.getNamespace?.fields || '{}')
  }, [namespaceResponse?.data?.getNamespace?.fields])

  const n = useNamespace(namespace)

  const fiskistofaShipSearchTarget = n('fiskistofaShipSearchTarget', {
    column: 'Skip',
    table: 'Skipaskra',
  })

  const updateReportStateFromQueryParams = async (report?: Report) => {
    if (!report) {
      report = embeddedReport
    }

    const nr = Number(router.query.nr)

    if (!report || isNaN(nr)) return

    const page = await report.getActivePage()

    const slicers = await page.getSlicers()

    for (const visual of slicers) {
      if (visual.type !== 'slicer') continue

      const slicer = visual as VisualDescriptor

      const slicerState = await slicer.getSlicerState()

      if (
        !slicerStateContainsExpectedTarget(
          slicerState,
          fiskistofaShipSearchTarget,
        )
      )
        return

      const response = await apolloClient.query({
        query: GET_SINGLE_SHIP,
        variables: {
          input: {
            shipNumber: nr,
          },
        },
      })

      const ship = response?.data?.fiskistofaGetSingleShip?.fiskistofaSingleShip

      if (!ship?.name) return
      slicer.setSlicerState({
        ...slicerState,
        filters: [
          {
            $schema: 'http://powerbi.com/product/schema#basic',
            filterType: 1,
            operator: 'In',
            requireSingleSelection: false,
            target: fiskistofaShipSearchTarget,
            ...slicerState.filters?.[0],
            values: [convertShipNameToSlicerDropdownValue(ship.name, nr)],
          },
        ],
      })
    }
  }

  const eventHandlers = new Map<EventType, EventHandler>([
    [
      'loaded',
      async (event) => {
        const report = event.target?.['powerBiEmbed'] as Report
        if (!report) return
        setEmbeddedReport(report)

        const activePage = await report.getActivePage()

        const slicers = await activePage.getSlicers()

        for (const visual of slicers) {
          if (visual.type !== 'slicer') continue

          const slicer = visual as VisualDescriptor

          if (slicer.name in router.query) {
            await slicer.setSlicerState(
              JSON.parse(router.query[slicer.name] as string),
            )
          }
        }
      },
    ],
    [
      'pageChanged',
      async (event) => {
        const pageName = event.detail?.newPage?.name

        if (pageName) {
          const params = new URLSearchParams(window.location.search)

          const query = {}

          for (const [key, value] of params.entries()) {
            query[key] = value
          }

          router.query = query

          router.push(
            {
              pathname: router.asPath.split('?')[0].split('#')[0],
              query: {
                ...query,
                pageName,
              },
            },
            undefined,
            { shallow: true },
          )
        }
      },
    ],
    [
      'dataSelected',
      async (event) => {
        const visualName = event.detail?.visual?.name as string

        const report: Report =
          event.target?.['powerBiEmbed'] ?? event.detail?.report

        if (!report || !visualName) return

        const activePage = await report.getActivePage()
        const visual = await activePage.getVisualByName(visualName)
        const slicerState = await visual.getSlicerState()

        const baseRouterPath = router.asPath.split('?')[0].split('#')[0]

        const query = { ...router.query }
        query[visualName] = JSON.stringify(slicerState)

        // Change the ship number query param if this report is owned by Fiskistofa
        // and the data that got changed relates to a ship number
        if (
          slice?.owner === 'Fiskistofa' &&
          slicerStateContainsExpectedTarget(
            slicerState,
            fiskistofaShipSearchTarget,
          )
        ) {
          const value: string = slicerState.filters?.[0]?.['values']?.[0] ?? ''
          const firstParenthesis = value.indexOf('(')
          const lastParenthesis = value.indexOf(')')
          const nr = value?.slice(firstParenthesis + 1, lastParenthesis)
          if (nr) query['nr'] = nr
        }

        router.query = query

        // Store via query params the state of the report
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
          pageName: router.query?.pageName as string,
        })
        setShouldRender(true)
        setErrorOccurred(false)
      } else {
        setErrorOccurred(true)
      }
    }

    getEmbedPropsFromServer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slice.owner, slice.reportId, slice.workspaceId])

  // If the report is owned by Fiskistofa then make sure to update the report if the 'nr' query param is set
  useEffect(() => {
    if (
      !embeddedReport ||
      !router?.query?.nr ||
      slice?.owner !== 'Fiskistofa'
    ) {
      return
    }

    updateReportStateFromQueryParams()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query?.nr, embeddedReport])

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
  }

  if (!shouldRender) return <Box className={styles.blankContainer} />

  if (errorOccurred) {
    return (
      <AlertMessage
        title={n('errorTitle', 'Villa kom upp')}
        message={n('errorMessage', 'Ekki tókst að hlaða upp Power Bi skýrslu')}
        type="error"
      />
    )
  }

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
