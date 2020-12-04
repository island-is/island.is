import { createUnionType } from '@nestjs/graphql';
import { Asset } from '../models/asset.model';
import { BulletListSlice } from '../models/bulletListSlice.model';
import { ConnectedComponent } from '../models/connectedComponent.model';
import { ContactUs } from '../models/contactUs.model';
import { EmbeddedVideo } from '../models/embeddedVideo.model';
import { FaqList } from '../models/faqList.model';
import { HeadingSlice } from '../models/headingSlice.model';
import { Html } from '../models/html.model';
import { LatestNewsSlice } from '../models/latestNewsSlice.model';
import { LinkCardSlice } from '../models/linkCardSlice.model';
import { LogoListSlice } from '../models/logoListSlice.model';
import { MailingListSignupSlice } from '../models/mailingListSignupSlice.model';
import { ProcessEntry } from '../models/processEntry.model';
import { SectionWithImage } from '../models/sectionWithImage.model';
import { Statistics } from '../models/statistics.model';
import { StorySlice } from '../models/storySlice.model';
import { TabSection } from '../models/tabSection.model';
import { TeamList } from '../models/teamList.model';
import { TellUsAStory } from '../models/tellUsAStory.model';
import { TimelineSlice } from '../models/timelineSlice.model';

export const SliceUnion = createUnionType({
  name: 'Slice',
  types: () => [
    TimelineSlice,
    MailingListSignupSlice,
    HeadingSlice,
    LinkCardSlice,
    StorySlice,
    LogoListSlice,
    LatestNewsSlice,
    BulletListSlice,
    Statistics,
    ProcessEntry,
    FaqList,
    ConnectedComponent,
    EmbeddedVideo,
    SectionWithImage,
    TabSection,
    TeamList,
    ContactUs,
    Location,
    TellUsAStory,
    Html,
    Image,
    Asset,
  ],
  resolveType: (document) => document.typename, // typename is appended to request on indexing
})
