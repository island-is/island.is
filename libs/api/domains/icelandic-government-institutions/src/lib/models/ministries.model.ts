import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { Ministry } from './ministry.model'

@ObjectType('IcelandicGovernmentInstitutionsMinistries')
export class Ministries extends PaginatedResponse(Ministry) {}
