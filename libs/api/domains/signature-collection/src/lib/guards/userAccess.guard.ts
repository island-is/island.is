import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { BYPASS_AUTH_KEY, getRequest, User } from '@island.is/auth-nest-tools'
import { SignatureCollectionService } from '../signatureCollection.service'
import { MetadataAbstractor } from '../utils'
import { AuthDelegationType } from '@island.is/shared/types'
import { isPerson } from 'kennitala'
import {
  ALLOW_DELEGATION_KEY,
  IS_OWNER_KEY,
  RESTRICT_GUARANTOR_KEY,
} from './constants'
import {
  CollectionType,
  isCollectionType,
} from '@island.is/clients/signature-collection'

enum UserDelegationContext {
  Person = 'Person',
  PersonDelegatedToPerson = 'PersonDelegatedToPerson',
  PersonDelegatedToCompany = 'PersonDelegatedToCompany',
  ProcurationHolder = 'ProcurationHolder',
}

@Injectable()
export class UserAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly signatureCollectionService: SignatureCollectionService,
  ) {}

  private determineUserDelegationContext(
    user: Express.User & User,
  ): UserDelegationContext {
    // If actor found on user, then user is delegated
    if (user.actor?.nationalId) {
      // If delegation is from person to person
      if (isPerson(user.nationalId)) {
        return UserDelegationContext.PersonDelegatedToPerson
      } else {
        // Determine whether it's a procuration vs delegation to a company
        const hasProcuration = user.delegationType?.some(
          (delegation) => delegation === AuthDelegationType.ProcurationHolder,
        )

        return hasProcuration
          ? UserDelegationContext.ProcurationHolder
          : UserDelegationContext.PersonDelegatedToCompany
      }
    }

    return UserDelegationContext.Person
  }

  private determineCollectionType = (context: ExecutionContext) => {
    const { body } = getRequest(context)
    if (
      body &&
      body.variables.input.collectionType &&
      isCollectionType(body.variables.input.collectionType)
    ) {
      return body.variables.input.collectionType as CollectionType
    }
    return CollectionType.OtherUnknown
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const m = new MetadataAbstractor(this.reflector, context)
    const isOwnerRestriction = m.getMetadataIfExists<boolean>(IS_OWNER_KEY)
    const bypassAuth = m.getMetadataIfExists<boolean>(BYPASS_AUTH_KEY)
    const allowDelegation = m.getMetadataIfExists<boolean>(ALLOW_DELEGATION_KEY)
    const restrictGuarantors = m.getMetadataIfExists<boolean>(
      RESTRICT_GUARANTOR_KEY,
    )
    if (bypassAuth) {
      return true
    }

    const request = getRequest(context)
    const user = request.user
    if (!user) {
      return false
    }
    const delegationContext = this.determineUserDelegationContext(user)
    const isDelegatedUser = [
      UserDelegationContext.PersonDelegatedToCompany,
      UserDelegationContext.PersonDelegatedToPerson,
    ].includes(delegationContext)

    if (isDelegatedUser && !allowDelegation) {
      return false
    }

    if (restrictGuarantors && !isDelegatedUser) {
      return false
    }

    const collectionType = this.determineCollectionType(context)
    // IsOwner needs signee
    const signee = await this.signatureCollectionService.signee(
      user,
      collectionType,
    )
    request.body = { ...request.body, signee }

    const { candidate } = signee

    if (isOwnerRestriction) {
      if (signee.isOwner && candidate) {
        // Check if user is an actor for owner and if so check if registered collector, if not actor will be added as collector
        if (isDelegatedUser && allowDelegation) {
          const isCollector = await this.signatureCollectionService.isCollector(
            candidate.id,
            user,
          )
          return isCollector
        }
      }
      return signee.isOwner
    }
    return true
  }
}
