import React from 'react'
import { CompanyList, CompanyListConnected } from '@island.is/shared/connected'
import { Image } from '../Image/Image'
import FaqList from '../FaqList/FaqList'
import { Statistics } from '../Statistics/Statistics'
import { AssetLink } from '../AssetLink/AssetLink'
import { Hidden } from '@island.is/island-ui/core'
import { ProcessEntry } from '../ProcessEntry/ProcessEntry'
import EmbeddedVideo from '../EmbeddedVideo/EmbeddedVideo'
import { SectionWithImage } from '../SectionWithImage/SectionWithImage'
import { TeamList } from '../TeamList/TeamList'
import { ContactUs } from '../ContactUs/ContactUs'
import { Location } from '../Location/Location'
import GeneralPetitionLists from '../GeneralPetitionLists/GeneralPetitionLists'

const renderConnectedComponent = (slice) => {
  const data = slice.json

  switch (slice.componentType) {
    case 'Skilavottord/CompanyList':
      if (Array.isArray(data)) {
        return <CompanyList recyclingPartners={data} />
      }
      break
    case 'Undirskriftalistar/PetitionLists':
      return <GeneralPetitionLists />
    case 'Skilavottord/CompanyListConnected':
      if (typeof data === 'object') {
        const { graphqlLink } = data

        return <CompanyListConnected graphqlLink={graphqlLink} />
      }
      break
    default:
      break
  }

  return null
}

// TODO: add types
export const defaultRenderComponent = {
  ConnectedComponent: (slice) => renderConnectedComponent(slice),
  FaqList: (slice) => <FaqList {...slice} />,
  Statistics: (slice) => <Statistics {...slice} />,

  Image: (slice) => <Image {...slice} thumbnail={slice.url + '?w=50'} />,

  Asset: (slice) => <AssetLink {...slice} />,

  ProcessEntry: (slice) => (
    <Hidden print={true}>
      <ProcessEntry {...slice} />
    </Hidden>
  ),

  EmbeddedVideo: (slice, locale) => (
    <Hidden print={true}>
      <EmbeddedVideo locale={locale} {...slice} />
    </Hidden>
  ),

  SectionWithImage: (slice) => <SectionWithImage {...slice} />,

  TeamList: (slice) => <TeamList {...slice} />,

  Location: (slice) => <Location {...slice} />,
  // NB: ContactUs needs to be connected with submit logic higher up
  ContactUs: (slice) => (
    <ContactUs
      {...slice}
      onSubmit={async (data) => console.warn(data)}
      state="edit"
    />
  ),
}
