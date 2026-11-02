import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Embed, models, Report, VisualDescriptor } from 'powerbi-client'
import { EventHandler, PowerBIEmbed } from 'powerbi-client-react'
import { IBasicFilter } from 'powerbi-models'
import { useApolloClient, useQuery } from '@apollo/client'

import { theme } from '@island.is/island-ui/theme'
import {
  GetNamespaceQuery,
  GetNamespaceQueryVariables,
  PowerBiSlice as PowerBiSliceSchema,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { GET_NAMESPACE_QUERY } from '@island.is/web/screens/queries'
import { GET_SINGLE_SHIP } from '@island.is/web/screens/queries/Fiskistofa'

import {
  applyStyles,
  DEFAULT_ASPECT_RATIO,
  DEFAULT_MOBILE_ASPECT_RATIO,
  getAspectRatio,
  hasConfiguredSize,
  hasDimensions,
} from './utils'

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    slicerState?.filters?.[0]?.target?.['column'] === expectedTarget?.column ||
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
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
  const router = useRouter()
  const [embeddedReport, setEmbeddedReport] = useState<Report | null>(null)
  const { activeLocale } = useI18n()
  const width = useMemo(() => {
    return (
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    )
  }, [])
  const embedRef = useRef<Embed | null>(null)
  const pageLayoutRequestRef = useRef(0)

  const layoutShouldBeMobilePortrait =
    slice?.powerBiEmbedProps?.displayMobilePortraitLayoutOnSmallScreens &&
    width < theme.breakpoints.lg

  const cmsStyle = slice?.powerBiEmbedProps?.style
  const sizeIsConfigured =
    hasConfiguredSize(cmsStyle?.element) || hasConfiguredSize(cmsStyle?.iframe)
  const fallbackAspectRatio = layoutShouldBeMobilePortrait
    ? DEFAULT_MOBILE_ASPECT_RATIO
    : DEFAULT_ASPECT_RATIO

  // Sizes the report after its active page, so that pages don't need any config.
  // On small screens the mobile layout's own size wins over any CMS style, since
  // hand-picked heights go stale and differ from what the page needs. Otherwise
  // sizes set in the CMS take precedence over the size of the page.
  const applyPageLayout = async () => {
    const embed = embedRef.current
    if (!embed) return

    const requestId = ++pageLayoutRequestRef.current

    try {
      const report = embed as Report
      const page = await report.getActivePage()
      const usesMobileLayout =
        layoutShouldBeMobilePortrait &&
        (await page.hasLayout(models.LayoutType.MobilePortrait))

      // A newer page change has taken over while we were waiting
      if (requestId !== pageLayoutRequestRef.current) return

      const mobileSizeIsKnown =
        usesMobileLayout && hasDimensions(page.mobileSize)
      const pageStyle = layoutShouldBeMobilePortrait
        ? cmsStyle?.pages?.[page.name]
        : undefined

      if (!mobileSizeIsKnown && (pageStyle?.element || pageStyle?.iframe)) {
        embed.element.style.aspectRatio = ''
        embed.element.style.height = '100%'
        embed.element.style.minHeight = cmsStyle?.element?.minHeight ?? ''
        applyStyles(embed.element, pageStyle.element)
        applyStyles(embed.iframe, pageStyle.iframe)
        return
      }

      embed.element.style.height = 'auto'
      embed.iframe.style.height = '100%'

      if (sizeIsConfigured && !layoutShouldBeMobilePortrait) {
        embed.element.style.aspectRatio = ''
        applyStyles(embed.element, cmsStyle?.element)
        applyStyles(embed.iframe, cmsStyle?.iframe)
        return
      }

      // A min height from the CMS is meant for the desktop layout
      if (layoutShouldBeMobilePortrait) {
        embed.element.style.minHeight = ''
      }

      embed.element.style.aspectRatio = usesMobileLayout
        ? getAspectRatio(page.mobileSize, DEFAULT_MOBILE_ASPECT_RATIO)
        : getAspectRatio(page.defaultSize, DEFAULT_ASPECT_RATIO)
    } catch {
      // Keep the current size if the report can't tell us about the page
    }
  }

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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      report = embeddedReport
    }

    const nr = Number(router.query.nr)

    if (!report || isNaN(nr)) return

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

    const page = await report.getActivePage()

    const slicers = await page.getSlicers()

    for (const visual of slicers) {
      if (visual.type !== 'slicer') continue

      const slicer = visual as VisualDescriptor

      let slicerState: models.ISlicerState
      try {
        slicerState = await slicer.getSlicerState()
      } catch {
        // A visual can fail to report its state; skip it rather than
        // aborting the search for the ship slicer.
        continue
      }

      if (
        !slicerStateContainsExpectedTarget(
          slicerState,
          fiskistofaShipSearchTarget,
        )
      )
        continue

      try {
        await slicer.setSlicerState({
          ...slicerState,
          filters: [
            {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              $schema: 'http://powerbi.com/product/schema#basic',
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              filterType: 1,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              operator: 'In',
              requireSingleSelection: false,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              target: fiskistofaShipSearchTarget,
              ...(slicerState.filters?.[0] as IBasicFilter),
              values: [convertShipNameToSlicerDropdownValue(ship.name, nr)],
            },
          ],
        })
      } catch {
        continue
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const eventHandlers = new Map<EventType, EventHandler>([
    [
      'loaded',
      async (event) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        const report = event?.target?.['powerBiEmbed'] as Report
        if (!report) return
        setEmbeddedReport(report)

        applyPageLayout()

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
        const pageName = event?.detail?.newPage?.name

        if (pageName) {
          applyPageLayout()

          const params = new URLSearchParams(window.location.search)

          const query = {}

          for (const [key, value] of params.entries()) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
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
        const visualName = event?.detail?.visual?.name as string

        const report: Report =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          event?.target?.['powerBiEmbed'] ?? event?.detail?.report

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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
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
    embed.element.style.height = 'auto'
    embed.iframe.style.border = 'none'

    // Placeholder until the report tells us the size of its active page
    if (!sizeIsConfigured) {
      embed.element.style.aspectRatio = fallbackAspectRatio
    }

    embedRef.current = embed

    // Apply styles to containing element and iframe child element from CMS
    applyStyles(embed.element, cmsStyle?.element)
    applyStyles(embed.iframe, cmsStyle?.iframe)
  }

  const embedProps = slice?.powerBiEmbedProps?.embedProps ?? {}

  return (
    <PowerBIEmbed
      embedConfig={{
        type: 'report',
        ...embedProps,
        ...(layoutShouldBeMobilePortrait && {
          settings: {
            ...embedProps?.settings,
            layoutType: models.LayoutType.MobilePortrait,
          },
        }),
        ...(slice?.powerBiEmbedPropsFromServer && {
          ...slice.powerBiEmbedPropsFromServer,
          tokenType: models.TokenType.Embed,
        }),
        pageName: router.query.pageName,
      }}
      getEmbeddedComponent={getEmbeddedComponent}
      eventHandlers={eventHandlers}
    />
  )
}

export default PowerBiSlice
