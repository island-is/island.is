import {
  renderConnectedComponent,
  richText,
  SliceType,
} from '@island.is/island-ui/contentful'
import {
  defaultRenderComponentObject,
  defaultRenderMarkObject,
  defaultRenderNodeObject,
} from '@island.is/island-ui/contentful'
import {
  AccordionSlice,
  CatchQuotaCalculator,
  ChartsCard,
  OneColumnTextSlice,
  PowerBiSlice,
  SelectedShip,
  ShipSearch,
  SidebarShipSearchInput,
  StraddlingStockCalculator,
} from '@island.is/web/components'
import {
  PowerBiSlice as PowerBiSliceSchema,
  Slice,
  AccordionSlice as AccordionSliceSchema,
} from '@island.is/web/graphql/schema'

const webRenderConnectedComponent = (slice) => {
  const data = slice.json

  switch (slice.componentType) {
    case 'Fiskistofa/ShipSearch':
      return <ShipSearch {...data} />
    case 'Fiskistofa/ShipSearchSidebarInput':
      return <SidebarShipSearchInput {...data} />
    case 'Fiskistofa/StraddlingStockCalculator':
      return <StraddlingStockCalculator namespace={data ?? {}} />
    case 'Fiskistofa/CatchQuotaCalculator':
      return <CatchQuotaCalculator namespace={data ?? {}} />
    case 'Fiskistofa/SelectedShip':
      return <SelectedShip />
    default:
      break
  }

  return renderConnectedComponent(slice)
}

const defaultRenderComponent = {
  PowerBiSlice: (slice: PowerBiSliceSchema) => <PowerBiSlice slice={slice} />,
  AccordionSlice: (slice: AccordionSliceSchema) => (
    <AccordionSlice slice={slice} />
  ),
  ConnectedComponent: (slice) => webRenderConnectedComponent(slice),
  GraphCard: (chart) => <ChartsCard chart={chart} />,
  OneColumnText: (slice) => <OneColumnTextSlice slice={slice} />,
}

export const webRichText = (
  slices: Slice[] | SliceType[],
  options?: {
    renderComponent?: Record<string, unknown>
    renderMark?: Record<string, unknown>
    renderNode?: Record<string, unknown>
  },
) => {
  return richText(slices as SliceType[], {
    renderComponent: {
      ...defaultRenderComponentObject,
      ...defaultRenderComponent,
      ...options?.renderComponent,
    },
    renderMark: {
      ...defaultRenderMarkObject,
      ...options?.renderMark,
    },
    renderNode: {
      ...defaultRenderNodeObject,
      ...options?.renderNode,
    },
  })
}
