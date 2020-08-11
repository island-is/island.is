import { createUnionType } from '@nestjs/graphql'
import { MailingListSignupSlice } from './mailingListSignupSlice.model'
import { PageHeaderSlice } from './pageHeaderSlice.model'
import { TimelineSlice } from './timelineSlice.model'
import { HeadingSlice } from './headingSlice.model'
import { StorySlice } from './storySlice.model'
import { LinkCardSlice } from './linkCardSlice.model'
import { LatestNewsSlice } from './latestNewsSlice.model'
import { LogoListSlice } from './logoListSlice.model'
import { BulletListSlice } from './bulletListSlice.model'

export const Slice = createUnionType({
  name: 'Slice',
  types: () => [
    PageHeaderSlice,
    TimelineSlice,
    HeadingSlice,
    StorySlice,
    LinkCardSlice,
    LatestNewsSlice,
    MailingListSignupSlice,
    LogoListSlice,
    BulletListSlice,
  ],
})
