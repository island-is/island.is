import { PropsWithChildren } from 'react'
import { IntlConfig, IntlProvider } from 'react-intl'

import {
  FaqList,
  type FaqListProps,
  Image,
  type ImageProps,
  renderConnectedComponent,
  richText,
  SectionWithImage,
  type SliceType,
  type TeamListProps,
} from '@island.is/island-ui/contentful'
import {
  defaultRenderComponentObject,
  defaultRenderMarkObject,
  defaultRenderNodeObject,
} from '@island.is/island-ui/contentful'
import { Locale } from '@island.is/shared/types'
import {
  AccordionSlice,
  AircraftSearch,
  AlcoholLicencesList,
  BrokersList,
  CatchQuotaCalculator,
  Chart,
  ChartNumberBox,
  ChartsCard,
  ChartsCardsProps,
  DrivingInstructorList,
  EmailSignup,
  Form,
  GenericListWrapper,
  KilometerFee,
  MasterList,
  MultipleStatistics,
  OneColumnTextSlice,
  OverviewLinksSlice,
  ParentalLeaveCalculator,
  PlateAvailableSearch,
  PowerBiSlice,
  PublicShipSearch,
  PublicVehicleSearch,
  SectionWithVideo,
  SelectedShip,
  ShipSearch,
  ShipSearchBoxedInput,
  SidebarShipSearchInput,
  SliceDropdown,
  SpecificHousingBenefitSupportCalculator,
  StraddlingStockCalculator,
  TableSlice,
  TeamListSlice,
  TemporaryEventLicencesList,
  TwoColumnTextSlice,
} from '@island.is/web/components'
import {
  AccordionSlice as AccordionSliceSchema,
  Chart as ChartSchema,
  ChartNumberBox as ChartNumberBoxSchema,
  ConnectedComponent,
  EmailSignup as EmailSignupSchema,
  Embed as EmbedSchema,
  FeaturedEvents as FeaturedEventsSchema,
  FeaturedSupportQnAs as FeaturedSupportQNAsSchema,
  Form as FormSchema,
  GenericList as GenericListSchema,
  MultipleStatistics as MultipleStatisticsSchema,
  OneColumnText,
  OverviewLinks as OverviewLinksSliceSchema,
  PowerBiSlice as PowerBiSliceSchema,
  SectionWithImage as SectionWithImageSchema,
  SectionWithVideo as SectionWithVideoSchema,
  Slice,
  SliceDropdown as SliceDropdownSchema,
  TableSlice as TableSliceSchema,
  TeamList,
  TwoColumnText,
} from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'

import AdministrationOfOccupationalSafetyAndHealthCourses from '../components/connected/AdministrationOfOccupationalSafetyAndHealthCourses/AdministrationOfOccupationalSafetyAndHealthCourses'
import { BenefitsOfDigitalProcessesCalculator } from '../components/connected/BenefitsOfDigitalProcessesCalculator/BenefitsOfDigitalProcessesCalculator'
import { MonthlyStatistics } from '../components/connected/electronicRegistrationStatistics'
import { GrindavikResidentialPropertyPurchaseCalculator } from '../components/connected/GrindavikResidentialPropertyPurchaseCalculator'
import HousingBenefitCalculator from '../components/connected/HousingBenefitCalculator/HousingBenefitCalculator/HousingBenefitCalculator'
import JourneymanList from '../components/connected/syslumenn/TableLists/JourneymanList/JourneymanList'
import ProfessionRights from '../components/connected/syslumenn/TableLists/ProfessionRights/ProfessionRights'
import { UmsCostOfLivingCalculator } from '../components/connected/UmbodsmadurSkuldara'
import FeaturedEvents from '../components/FeaturedEvents/FeaturedEvents'
import FeaturedSupportQNAs from '../components/FeaturedSupportQNAs/FeaturedSupportQNAs'
import { EmbedSlice } from '../components/Organization/Slice/EmbedSlice/EmbedSlice'

interface TranslationNamespaceProviderProps {
  messages: IntlConfig['messages']
}

const TranslationNamespaceProvider = ({
  messages,
  children,
}: PropsWithChildren<TranslationNamespaceProviderProps>) => {
  const { activeLocale } = useI18n()

  return (
    <IntlProvider locale={activeLocale} messages={messages}>
      {children}
    </IntlProvider>
  )
}

export const webRenderConnectedComponent = (
  slice: ConnectedComponent & { componentType?: string },
) => {
  let connectedComponent = null

  switch (slice.componentType) {
    case 'Fiskistofa/ShipSearch':
      connectedComponent = <ShipSearch />
      break
    case 'Fiskistofa/ShipSearchSidebarInput':
      connectedComponent = <SidebarShipSearchInput />
      break
    case 'Fiskistofa/StraddlingStockCalculator':
      connectedComponent = <StraddlingStockCalculator />
      break
    case 'Fiskistofa/CatchQuotaCalculator':
      connectedComponent = <CatchQuotaCalculator />
      break
    case 'Fiskistofa/SelectedShip':
      connectedComponent = <SelectedShip />
      break
    case 'ElectronicRegistrations/MonthlyStatistics':
      connectedComponent = <MonthlyStatistics slice={slice} />
      break
    case 'Fiskistofa/ShipSearchBoxedInput':
      connectedComponent = <ShipSearchBoxedInput />
      break
    case 'Áfengisleyfi/AlcoholLicences':
      connectedComponent = <AlcoholLicencesList slice={slice} />
      break
    case 'Tækifærisleyfi/TemporaryEventLicences':
      connectedComponent = <TemporaryEventLicencesList slice={slice} />
      break
    case 'Verðbréfamiðlarar/Brokers':
      connectedComponent = <BrokersList slice={slice} />
      break
    case 'PublicVehicleSearch':
      connectedComponent = <PublicVehicleSearch />
      break
    case 'AircraftSearch':
      connectedComponent = <AircraftSearch slice={slice} />
      break
    case 'DrivingInstructorList':
      connectedComponent = <DrivingInstructorList slice={slice} />
      break
    case 'PlateAvailableSearch':
      connectedComponent = <PlateAvailableSearch />
      break
    case 'HousingBenefitCalculator':
      connectedComponent = <HousingBenefitCalculator slice={slice} />
      break
    case 'PublicShipSearch':
      connectedComponent = <PublicShipSearch />
      break
    case 'Meistaraleyfi/MasterLicences':
      connectedComponent = <MasterList slice={slice} />
      break
    case 'Vinnueftirlitid/Namskeid':
      connectedComponent = (
        <AdministrationOfOccupationalSafetyAndHealthCourses slice={slice} />
      )
      break
    case 'KilometerFee':
      connectedComponent = <KilometerFee slice={slice} />
      break
    case 'SpecificHousingBenefitSupportCalculator':
      connectedComponent = <SpecificHousingBenefitSupportCalculator />
      break
    case 'GrindavikResidentialPropertyPurchaseCalculator':
      connectedComponent = (
        <GrindavikResidentialPropertyPurchaseCalculator slice={slice} />
      )
      break
    case 'Sveinslisti/JourneymanList':
      connectedComponent = <JourneymanList slice={slice} />
      break
    case 'Starfsrettindi/ProfessionRights':
      connectedComponent = <ProfessionRights slice={slice} />
      break
    case 'Ums/CostOfLivingCalculator':
      connectedComponent = <UmsCostOfLivingCalculator />
      break
    case 'VMST/ParentalLeaveCalculator':
      connectedComponent = <ParentalLeaveCalculator slice={slice} />
      break
    case 'DigitalIceland/BenefitsOfDigitalProcesses':
      connectedComponent = (
        <BenefitsOfDigitalProcessesCalculator slice={slice} />
      )
      break
    default:
      connectedComponent = renderConnectedComponent(slice)
  }

  return (
    <TranslationNamespaceProvider
      messages={slice.translationStrings ?? slice.json ?? {}}
    >
      {connectedComponent}
    </TranslationNamespaceProvider>
  )
}

const defaultRenderComponent = {
  PowerBiSlice: (slice: PowerBiSliceSchema) => <PowerBiSlice slice={slice} />,
  AccordionSlice: (slice: AccordionSliceSchema) =>
    slice.accordionItems && <AccordionSlice slice={slice} />,
  ConnectedComponent: (slice: ConnectedComponent) =>
    webRenderConnectedComponent(slice),
  GraphCard: (chart: ChartsCardsProps['chart']) => <ChartsCard chart={chart} />,
  OneColumnText: (slice: OneColumnText) => <OneColumnTextSlice slice={slice} />,
  TwoColumnText: (slice: TwoColumnText) => <TwoColumnTextSlice slice={slice} />,
  EmailSignup: (slice: EmailSignupSchema) => <EmailSignup slice={slice} />,
  FaqList: (slice: FaqListProps, locale?: Locale) =>
    slice?.questions && <FaqList {...slice} locale={locale} />,
  FeaturedSupportQNAs: (slice: FeaturedSupportQNAsSchema) => (
    <FeaturedSupportQNAs slice={slice} />
  ),
  SliceDropdown: (slice: SliceDropdownSchema) => (
    <SliceDropdown
      slices={slice.slices}
      sliceExtraText={slice.dropdownLabel ?? ''}
      gridSpan="1/1"
      gridOffset="0"
      slicesAreFullWidth={true}
      dropdownMarginBottom={5}
      orderOptionsAlphabetically={slice.alphabeticallyOrdered}
    />
  ),
  SectionWithVideo: (slice: SectionWithVideoSchema) => (
    <SectionWithVideo slice={slice} />
  ),
  TableSlice: (slice: TableSliceSchema) => <TableSlice slice={slice} />,
  Embed: (slice: EmbedSchema) => <EmbedSlice slice={slice} />,
  OverviewLinks: (slice: OverviewLinksSliceSchema) => (
    <OverviewLinksSlice slice={slice} />
  ),
  Chart: (slice: ChartSchema) => <Chart slice={slice} />,
  ChartNumberBox: (
    slice: ChartNumberBoxSchema & { chartNumberBoxId: string },
  ) => <ChartNumberBox slice={slice} />,
  SectionWithImage: (slice: SectionWithImageSchema) => (
    <SectionWithImage
      title={slice.title}
      content={slice.content as SliceType[]}
      image={slice.image ?? undefined}
      contain={true}
    />
  ),
  MultipleStatistics: (slice: MultipleStatisticsSchema) => (
    <MultipleStatistics slice={slice} />
  ),
  FeaturedEvents: (slice: FeaturedEventsSchema) => (
    <FeaturedEvents slice={slice} />
  ),
  Form: (slice: FormSchema) => <Form form={slice} />,
  GenericList: (slice: GenericListSchema) => (
    <GenericListWrapper
      id={slice.id}
      searchInputPlaceholder={slice.searchInputPlaceholder}
      itemType={slice.itemType}
      filterTags={slice.filterTags}
    />
  ),
  TeamList: (slice: TeamList) => (
    <TeamListSlice
      id={slice.id}
      teamMembers={slice.teamMembers as TeamListProps['teamMembers']}
      filterTags={slice.filterTags}
      variant={slice.variant as 'accordion' | 'card'}
    />
  ),
  Image: (slice: ImageProps) => {
    const thumbnailUrl = slice?.url ? slice.url + '?w=50' : ''
    const url = slice?.url ? slice.url + '?w=800' : ''
    return <Image {...slice} thumbnail={thumbnailUrl} url={url} />
  },
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
