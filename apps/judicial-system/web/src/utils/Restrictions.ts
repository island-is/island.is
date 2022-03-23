import { CaseCustodyRestrictions } from '@island.is/judicial-system/types'
import { restrictions as m } from '@island.is/judicial-system-web/messages'

export const restrictions = [
  {
    title: 'A - Eigin nauðsynjar',
    id: CaseCustodyRestrictions.NECESSITIES,
    info: m[CaseCustodyRestrictions.NECESSITIES],
  },
  {
    title: 'C - Heimsóknarbann',
    id: CaseCustodyRestrictions.VISITAION,
    info: m[CaseCustodyRestrictions.VISITAION],
  },
  {
    title: 'D - Bréfskoðun, símabann',
    id: CaseCustodyRestrictions.COMMUNICATION,
    info: m[CaseCustodyRestrictions.COMMUNICATION],
  },
  {
    title: 'E - Fjölmiðlabann',
    id: CaseCustodyRestrictions.MEDIA,
    info: m[CaseCustodyRestrictions.MEDIA],
  },
  {
    title: 'F - Vinnubann',
    id: CaseCustodyRestrictions.WORKBAN,
    info: m[CaseCustodyRestrictions.WORKBAN],
  },
]

export const alternativeTravelBanRestrictions = [
  {
    title: 'Tilkynningarskylda',
    id: CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
    info:
      m[CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION],
  },
]
