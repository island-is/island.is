import { UserProfile } from '@island.is/portals/my-pages/graphql'

export type Email = NonNullable<NonNullable<UserProfile['emails']>[number]>
