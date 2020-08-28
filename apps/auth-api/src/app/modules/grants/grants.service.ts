import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Counter } from 'prom-client'
import { Sequelize } from 'sequelize-typescript'
import { InjectModel } from '@nestjs/sequelize'
import { string } from 'yargs'

@Injectable()
export class GrantsService {
    constructor(
        private sequelize: Sequelize,
        // @InjectModel(UserIdentity)
        // private userIdentityModel: typeof UserIdentity,
        @Inject(LOGGER_PROVIDER)
        private logger: Logger,
    ) {}

    testString(): string {
        return "Hellz yeah"
    }

}