import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { Locale } from '@island.is/shared/types'
import {
  ExamCategoriesApi,
  ExameeValidationApi,
  InstructorApi,
} from '../../gen/fetch'

@Injectable()
export class PracticalExamsClientService {
  constructor(
    private readonly examCategoriesApi: ExamCategoriesApi,
    private readonly exameeValidationApi: ExameeValidationApi,
    private readonly instructorApi: InstructorApi,
  ) {}
}
