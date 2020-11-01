import { Injectable } from '@nestjs/common'
import { Role, AuthUser } from './auth.types'

const DEVELOPERS = [
  /* Deloitte */
  '1903795829', // Örvar
]

const RECYCLINGCOMPANY = [
  /* Deloitte og DI test */
  '2310765229', // Vésteinn Viðarsson
  '2811638099', // Tómas Árni Jónsson
  '0905665129', // Friðbjörn Hólm Ólafsson
  /* Vaka */
  '0706765599', // Sigríður Björk Þórisdóttir
  '1310734109', // Reynir Þór Guðmundsson
]

const RECYCLINGFUND = [
  /* Deloitte test */
  '0101302129', // Gervimaður Noregur
  '1505664449', // Rúnar Sigurður Guðlaugsson
  '0301665909', // Sigurgeir Guðmundsson
  '2311862559', //   Quan Dong
  // Urvinnslusjodur test
  '3005594339', // Ólafur Kjartansson
  '0202614989', // Guðlaugur Gylfi Sverrisson
  '0305695639', // Ása Hauksdóttir
]


@Injectable()
export class AuthService {
  getRole(user: AuthUser): Role {
    if (RECYCLINGCOMPANY.includes(user.nationalId)) {
      return 'recyclingCompany'
    } else if (RECYCLINGFUND.includes(user.nationalId)) {
      return 'recyclingFund'
    } else if (DEVELOPERS.includes(user.nationalId)) {
      return 'developer'
    } else {
      return 'citizen'
    }
  }

  checkRole(user: AuthUser, role: Role): boolean {
    //console.log("  - checkRole starting")
    switch (role) {
      case 'recyclingCompany':
        return RECYCLINGCOMPANY.includes(user.nationalId)
      case 'recyclingFund':
        return RECYCLINGFUND.includes(user.nationalId)
      case 'developer':
        return DEVELOPERS.includes(user.nationalId)
      default: {
        if (role) {
          return false
        }
        return true
      }
    }
  }
}
