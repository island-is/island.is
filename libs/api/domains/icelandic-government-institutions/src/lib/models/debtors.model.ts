import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { Debtor } from './debtor.model'

@ObjectType('IcelandicGovernmentInstitutionsDebtors')
export class Debtors extends PaginatedResponse(Debtor) {}
