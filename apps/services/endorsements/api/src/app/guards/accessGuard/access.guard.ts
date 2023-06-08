import { Reflector } from '@nestjs/core'
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  MethodNotAllowedException,
} from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { AccessGroup } from './access.enum'
import { ACCESS_GROUP_KEY } from './access.decorator'
import { EndorsementListService } from '../../modules/endorsementList/endorsementList.service'
import type { Logger } from '@island.is/logging'

/**
 * This exists to limit access to trusted individuals
 * This should probably be replaced by the access control system at some point
 */

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly endorsementListService: EndorsementListService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const accessGroups = this.reflector.getAllAndOverride<AccessGroup[]>(
      ACCESS_GROUP_KEY,
      [context.getHandler(), context.getClass()],
    )

    // there are no access group restrictions on this entrypoint
    if (!accessGroups) {
      return true
    }

    const request = context.switchToHttp().getRequest()

    // try to pass access check for any defined access group
    for (const group of accessGroups) {
      switch (group) {
        case AccessGroup.Owner: {
          const listId = request.params?.listId
          if (listId) {
            const endorsementList =
              await this.endorsementListService.findSingleList(
                listId,
                request.auth,
              )
            // admin has all the same rights as owner
            const isAdmin = await this.endorsementListService.hasAdminScope(
              request.auth,
            )

            if (endorsementList?.owner === request.auth.nationalId || isAdmin) {
              return true
            }
          }
          break
        }
      }
    }

    // if we get to here without returning user has failed access control
    this.logger.warn(
      'Access guard prevented routing, user does not belong to any access group',
      { accessGroups },
    )
    throw new MethodNotAllowedException('Not allowed')
  }
}
