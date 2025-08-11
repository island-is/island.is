import { ApplicationScope } from '../application.scope'
import { UserProfileScope } from '../userProfile.scope'
import { NationalRegistryScope } from '../nationalRegistry.scope'

export const formSystemScopes = [
    ApplicationScope.read,
    ApplicationScope.write,
    UserProfileScope.read,
    UserProfileScope.write,
    NationalRegistryScope.individuals
]
