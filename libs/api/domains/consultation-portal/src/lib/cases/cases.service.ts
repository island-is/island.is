import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { FetchError } from '@island.is/clients/middlewares'

import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CaseResult } from '../models/caseResult.model'
@Injectable()
export class CaseResultService {
    constructor(
        @Inject(LOGGER_PROVIDER)
        private logger: Logger,
        // private caseApi: CasesApi
    ) {}

//     async getAllCases (): Promise<CaseResult[]> {
//         const cases = await this.getAllCases()

//     }
// }