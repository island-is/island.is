import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { UserShipCollectionItem } from './userShipCollectionItem.model'

@ObjectType('ShipRegistryUserShips')
export class UserShipsCollection extends PaginatedResponse(UserShipCollectionItem) {}
