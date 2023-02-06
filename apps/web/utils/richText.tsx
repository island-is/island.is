import {
  FaqList,
  FaqListProps,
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
  EmailSignup,
  OneColumnTextSlice,
  PowerBiSlice,
  SelectedShip,
  ShipSearch,
  ShipSearchBoxedInput,
  SidebarShipSearchInput,
  StraddlingStockCalculator,
  TwoColumnTextSlice,
  AlcoholLicencesList,
  TemporaryEventLicencesList,
} from '@island.is/web/components'
import {
  PowerBiSlice as PowerBiSliceSchema,
  Slice,
  AccordionSlice as AccordionSliceSchema,
  FeaturedSupportQnAs as FeaturedSupportQNAsSchema,
} from '@island.is/web/graphql/schema'
import { Locale } from '@island.is/shared/types'
import { MonthlyStatistics } from '../components/connected/electronicRegistrationStatistics'
import FeaturedSupportQNAs from '../components/FeaturedSupportQNAs/FeaturedSupportQNAs'

export const webRenderConnectedComponent = (slice) => {
  const data = slice.json ?? {}

  switch (slice.componentType) {
    case 'Fiskistofa/ShipSearch':
      return <ShipSearch namespace={data} />
    case 'Fiskistofa/ShipSearchSidebarInput':
      return <SidebarShipSearchInput namespace={data} />
    case 'Fiskistofa/StraddlingStockCalculator':
      return <StraddlingStockCalculator namespace={data} />
    case 'Fiskistofa/CatchQuotaCalculator':
      return <CatchQuotaCalculator namespace={data} />
    case 'Fiskistofa/SelectedShip':
      return <SelectedShip />
    case 'ElectronicRegistrations/MonthlyStatistics':
      return <MonthlyStatistics slice={slice} />
    case 'Fiskistofa/ShipSearchBoxedInput':
      return <ShipSearchBoxedInput namespace={data} />
    case 'Áfengisleyfi/AlcoholLicences':
      return <AlcoholLicencesList slice={slice} />
    case 'Tækifærisleyfi/TemporaryEventLicences':
        return <TemporaryEventLicencesList slice={slice} />
    default:
      break
  }

  return renderConnectedComponent(slice)
}

const defaultRenderComponent = {
  PowerBiSlice: (slice: PowerBiSliceSchema) => <PowerBiSlice slice={slice} />,
  AccordionSlice: (slice: AccordionSliceSchema) =>
    slice.accordionItems && <AccordionSlice slice={slice} />,
  ConnectedComponent: (slice) => webRenderConnectedComponent(slice),
  GraphCard: (chart) => <ChartsCard chart={chart} />,
  OneColumnText: (slice) => <OneColumnTextSlice slice={slice} />,
  TwoColumnText: (slice) => <TwoColumnTextSlice slice={slice} />,
  EmailSignup: (slice) => <EmailSignup slice={slice} />,
  FaqList: (slice: FaqListProps) => slice?.questions && <FaqList {...slice} />,
  FeaturedSupportQNAs: (slice: FeaturedSupportQNAsSchema) => (
    <FeaturedSupportQNAs slice={slice} />
  ),
}

export const webRichText = (
  slices: Slice[] | SliceType[],
  options?: {
    renderComponent?: Record<string, unknown>
    renderMark?: Record<string, unknown>
    renderNode?: Record<string, unknown>
  },
  activeLocale?: Locale,
) => {
  return richText(
    slices as SliceType[],
    {
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
    },
    activeLocale,
  )
}
