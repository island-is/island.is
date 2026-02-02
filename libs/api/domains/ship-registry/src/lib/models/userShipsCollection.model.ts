import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { UserShip } from './userShip.model'

@ObjectType('ShipRegistryUserShips')
export class UserShipsCollection extends PaginatedResponse(UserShip) {}
