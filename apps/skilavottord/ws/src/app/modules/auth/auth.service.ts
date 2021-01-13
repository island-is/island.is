import { Injectable } from '@nestjs/common'
import { Role, AuthUser } from './auth.types'

const DEVELOPERS = [
  /* Deloitte */
  '2310765229', // Vésteinn Viðarsson
  '0602773039', // Bjarki Már Flosason
  '1505664449', // Rúnar Sigurður Guðlaugsson
  '0301665909', // Sigurgeir Guðmundsson
  '2311862559', // Quan Dong
  '2811638099', // Tómas Árni Jónsson
  '0101302129', // Gervimaður Noregur
]

const RECYCLINGCOMPANY = [
  /* Deloitte og DI test */
  '0905665129', // Friðbjörn Hólm Ólafsson
  /* Vaka */
  '0706765599', // Sigríður Björk Þórisdóttir
  '1310734109', // Reynir Þór Guðmundsson admin later
  '1110892489', // Ari Halldór Hjaltason
  '0409842919', // Gísli Rúnar Svanbergsson
  '3108002360', // Viktoría Sól Reynisdóttir
  /* Hringrás   */
  '1811673949', // Tryggvi Daníel Sigurðsson admin later
  '2405843609', // Þórdís Jónsdóttir
]

const RECYCLINGFUND = [
  /* Urvinnslusjodur test  */
  '3005594339', // Ólafur Kjartansson admin later
  '0202614989', // Guðlaugur Gylfi Sverrisson normal
  '0305695639', // Ása Hauksdóttir  admin later
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
