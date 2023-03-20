import { User } from '@island.is/auth-nest-tools'
import { Op, WhereOptions } from 'sequelize'

export const getDelegationNoActorWhereClause = (user: User): WhereOptions => {
  if (user.actor) {
    return { toNationalId: { [Op.ne]: user.actor.nationalId } }
  }
  return {}
}
