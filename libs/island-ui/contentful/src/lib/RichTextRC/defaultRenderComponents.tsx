import {
  CompanyList,
  CompanyListConnected,
  GeneralPetitionLists,
  RealEstateAgentsList,
  LawyersList,
  SignatureLists,
} from '@island.is/shared/connected'
import { Image } from '../Image/Image'
import FaqList from '../FaqList/FaqList'
import { Statistics } from '../Statistics/Statistics'
import { AssetLink } from '../AssetLink/AssetLink'
import { LinkCard, LinkCardProps } from '../LinkCard/LinkCard'
import { Hidden } from '@island.is/island-ui/core'
import { ProcessEntry } from '../ProcessEntry/ProcessEntry'
import EmbeddedVideo from '../EmbeddedVideo/EmbeddedVideo'
import { SectionWithImage } from '../SectionWithImage/SectionWithImage'
import { SectionWithVideo } from '../SectionWithVideo/SectionWithVideo'
import { TeamList } from '../TeamList/TeamList'
import { ContactUs } from '../ContactUs/ContactUs'
import { Location } from '../Location/Location'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
export const renderConnectedComponent = (slice) => {
  const data = slice.json

  switch (slice.componentType) {
    case 'Skilavottord/CompanyList':
      if (Array.isArray(data)) {
        return <CompanyList recyclingPartners={data} />
      }
      break
    case 'Undirskriftalistar/PetitionLists':
      return <GeneralPetitionLists slice={slice} />
    case 'Skilavottord/CompanyListConnected':
      if (typeof data === 'object') {
        const { graphqlLink } = data
        return <CompanyListConnected graphqlLink={graphqlLink} />
      }
      break
    case 'Fasteignasalar/RealEstateAgents':
      return <RealEstateAgentsList slice={slice} />
    case 'Lögmenn/Lawyers':
      return <LawyersList slice={slice} />
    case 'Meðmælalistar/SignatureLists':
      return (
        <SignatureLists
          slice={slice}
          collectionType={
            (slice?.configJson?.collectionType ??
              (SignatureCollectionCollectionType.OtherUnknown as unknown)) as SignatureCollectionCollectionType
          }
        />
      )
    default:
      break
  }

  return null
}

// TODO: add types
export const defaultRenderComponentObject = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  ConnectedComponent: (slice) => renderConnectedComponent(slice),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  FaqList: (slice) => <FaqList {...slice} />,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  Statistics: (slice) => <Statistics {...slice} />,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  Image: (slice) => <Image {...slice} />,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  Asset: (slice) => <AssetLink {...slice} />,
  LinkCard: (slice: LinkCardProps) => <LinkCard {...slice} />,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  ProcessEntry: (slice) => (
    <Hidden print={true}>
      <ProcessEntry {...slice} />
    </Hidden>
  ),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  EmbeddedVideo: (slice, locale: string) => (
    <Hidden print={true}>
      <EmbeddedVideo locale={locale} {...slice} />
    </Hidden>
  ),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  SectionWithImage: (slice) => <SectionWithImage {...slice} />,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  SectionWithVideo: (slice) => <SectionWithVideo {...slice} />,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  TeamList: (slice) => <TeamList {...slice} />,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  Location: (slice) => <Location {...slice} />,
  // NB: ContactUs needs to be connected with submit logic higher up
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  ContactUs: (slice) => (
    <ContactUs
      {...slice}
      onSubmit={async (data) => console.warn(data)}
      state="edit"
    />
  ),
}
