import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common'

import {
  getAdminUserInstitutionScope,
  isCoreUser,
  User,
} from '@island.is/judicial-system/types'

import { InstitutionService } from '../../institution'
import { CreateUserDto } from '../dto/createUser.dto'

@Injectable()
export class CreateUserValidator implements NestInterceptor {
  constructor(private readonly institutionService: InstitutionService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()

    const user: User = request.user?.currentUser

    if (!user) {
      throw new BadRequestException('Missing user')
    }

    const createUser: CreateUserDto = request.body

    if (!createUser) {
      throw new BadRequestException('Missing create user dto')
    }

    if (createUser.role === user.role) {
      throw new UnauthorizedException(
        `User ${user.id} is not allowed to create a user with the same role`,
      )
    }

    const institution = await this.institutionService
      .getById(createUser.institutionId)
      .catch((error) => {
        throw new BadRequestException(error, 'Not a valid user')
      })

    if (!getAdminUserInstitutionScope(user).includes(institution.type)) {
      throw new UnauthorizedException(
        `User ${user.id} is not allowed to create a user in instutition ${institution.id}`,
      )
    }

    if (!isCoreUser({ ...createUser, institution })) {
      throw new BadRequestException('Not a valid user')
    }

    return next.handle()
  }
}
