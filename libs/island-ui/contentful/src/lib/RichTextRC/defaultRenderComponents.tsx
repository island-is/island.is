import React from 'react'

import { Hidden } from '@island.is/island-ui/core'
import {
  CompanyList,
  CompanyListConnected,
  GeneralPetitionLists,
} from '@island.is/shared/connected'

import { AssetLink } from '../AssetLink/AssetLink'
import { ContactUs } from '../ContactUs/ContactUs'
import EmbeddedVideo from '../EmbeddedVideo/EmbeddedVideo'
import FaqList from '../FaqList/FaqList'
import { Image } from '../Image/Image'
import { Location } from '../Location/Location'
import { ProcessEntry } from '../ProcessEntry/ProcessEntry'
import { SectionWithImage } from '../SectionWithImage/SectionWithImage'
import { Statistics } from '../Statistics/Statistics'
import { TeamList } from '../TeamList/TeamList'

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
