import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  SetMetadata,
  UseGuards,
  applyDecorators,
  forwardRef,
} from '@nestjs/common'
import { AuthenticationError } from 'apollo-server-express'
import { jwtDecrypt } from 'jose'
import { hkdf } from '@panva/hkdf'

import type { GraphQLContext } from '@island.is/auth-nest-tools'
import { getRequest } from '@island.is/auth-nest-tools'

import { environment } from '../../../environments'
import { AccessControlService } from '../accessControl'

import { RolesGuard } from './roles.guard'
import { Role, User } from './user.model'

type AuthorizeOptions = {
  roles?: Role[]
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => AccessControlService))
    private accessControlService: AccessControlService,
  ) {}

  private async getUser(user: Partial<User>): Promise<User> {
    const accessControl = await this.accessControlService.findOne(
      user.nationalId,
    )
    if (accessControl) {
      return { ...accessControl, ...user } as User
    }
    return { ...user, role: Role.citizen } as User
  }

  private async decodeSession(
    request: GraphQLContext['req'],
  ): Promise<Partial<User>> {
    const sessionToken = request.cookies
      ? request.cookies[environment.auth.nextAuthCookieName]
      : null

    if (!sessionToken) {
      throw new AuthenticationError('Invalid user')
    }

    const secret = process.env.NEXTAUTH_SECRET
    if (!secret) {
      throw new AuthenticationError('NEXTAUTH_SECRET is not configured')
    }

    const encryptionKey = await hkdf(
      'sha256',
      secret,
      '',
      'NextAuth.js Generated Encryption Key',
      32,
    )

    const { payload } = await jwtDecrypt(sessionToken, encryptionKey, {
      clockTolerance: 15,
    })

    return {
      name: payload.name as string,
      nationalId: payload.nationalId as string,
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: GraphQLContext['req'] = getRequest(context)
    const oidcUser = await this.decodeSession(request)
    const user = await this.getUser(oidcUser)
    request['auth'] = { scope: [], authorization: '', client: '', ...user }
    request['user'] = { scope: [], authorization: '', client: '', ...user }
    return !!user
  }
}

export const Authorize = (
  { roles = [] }: AuthorizeOptions = { roles: [] },
): MethodDecorator & ClassDecorator => {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
  )
}
