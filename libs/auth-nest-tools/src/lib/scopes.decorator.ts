import { SetMetadata } from '@nestjs/common'

export const SCOPES_KEY = 'scopes'
export const ACTOR_SCOPES_KEY = 'actor-scopes'

export const Scopes = (...scopes: string[]) => SetMetadata(SCOPES_KEY, scopes)

export const ActorScopes = (...scopes: string[]) =>
  SetMetadata(ACTOR_SCOPES_KEY, scopes)
