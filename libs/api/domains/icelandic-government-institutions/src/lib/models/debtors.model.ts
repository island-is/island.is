import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { Debtor } from './debtor.model'

@ObjectType('IcelandicGovernmentInstitutionsDebtors')
export class DebtorCollection extends PaginatedResponse(Debtor) {}
