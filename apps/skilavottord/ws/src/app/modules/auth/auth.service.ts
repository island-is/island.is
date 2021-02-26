import { Injectable } from '@nestjs/common'
import { User } from '../user'
import { Role, AuthUser } from './auth.types'

const users = `[{ "nationalId":"2310765229", "name": "Vésteinn Viðarsson", "role":"developer", "partnerId":""},
{ "nationalId":"0602773039", "name": "Bjarki Már Flosason", "role":"developer", "partnerId":""},
{ "nationalId":"1505664449","name": "Rúnar Sigurður Guðlaugsson", "role":"developer", "partnerId":""},
{ "nationalId":"0301665909","name": "Sigurgeir Guðmundsson", "role":"developer", "partnerId":""},
{ "nationalId":"2311862559","name": "Quan Dong", "role":"developer", "partnerId":""},
{ "nationalId":"0101302129","name": "Gervimaður Noregur", "role":"developer", "partnerId":""},
{ "nationalId":"2811638099","name": "Tómas Árni Jónsson", "role":"developer", "partnerId":""},
{ "nationalId":"0905665129","name": "Friðbjörn Hólm Ólafsson", "role":"recyclingCompany", "partnerId":""},
{ "nationalId":"0706765599","name": "Sigríður Björk Þórisdóttir", "role":"recyclingCompany", "partnerId":"110"},
{ "nationalId":"1310734109","name": "Reynir Þór Guðmundsson", "role":"recyclingCompany", "partnerId":"110"},
{ "nationalId":"1110892489","name": "Ari Halldór Hjaltason", "role":"recyclingCompany", "partnerId":"110"},
{ "nationalId":"0409842919","name": "Gísli Rúnar Svanbergsson", "role":"recyclingCompany", "partnerId":"110"},
{ "nationalId":"3108002360","name": "Viktoría Sól Reynisdóttir", "role":"recyclingCompany", "partnerId":"110"},
{ "nationalId":"2309695079","name": "Valdemar Örn Haraldsson", "role":"recyclingCompany", "partnerId":"110"},
{ "nationalId":"0910872009","name": "Tómas Kári Kristinsson", "role":"recyclingCompany", "partnerId":"110"},
{ "nationalId":"0601756089","name": "Greta Björg Egilsdóttir", "role":"recyclingCompany", "partnerId":"110"},
{ "nationalId":"0709804529","name": "Halldór Örn Kristjánsson", "role":"recyclingCompany", "partnerId":"110"},
{ "nationalId":"1811673949","name": "Tryggvi Daníel Sigurðsson", "role":"recyclingCompany", "partnerId":"104"},
{ "nationalId":"2405843609","name": "Þórdís Jónsdóttir", "role":"recyclingCompany", "partnerId":"104"},
{ "nationalId":"2211692989","name": "Úlfar Haraldsson", "role":"recyclingCompany", "partnerId":"221"},
{ "nationalId":"2808714009","name": "Dagný Michelle Jónsdóttir", "role":"recyclingCompany", "partnerId":"221"},
{ "nationalId":"3108654949","name": "Ólafía Sigurjónsdóttir", "role":"recyclingCompany", "partnerId":"221"},
{ "nationalId":"2512942099","name": "Marjón Pétur Benediktsson", "role":"recyclingCompany", "partnerId":"221"},
{ "nationalId":"0306942609","name": "Karítas Þorvaldsdóttir", "role":"recyclingCompany", "partnerId":"221"},
{ "nationalId":"1207952879","name": "Anton Örn  Kærnested", "role":"recyclingCompany", "partnerId":"221"},
{ "nationalId":"3005594339","name": "Ólafur Kjartansson", "role":"recyclingFund", "partnerId":""},
{ "nationalId":"0202614989","name": "Guðlaugur Gylfi Sverrisson", "role":"recyclingFund", "partnerId":""},
{ "nationalId":"0305695639","name": "Ása Hauksdóttir", "role":"recyclingFund", "partnerId":""},
{ "nationalId":"1111111111","name": "Gervimaður", "role":"recyclingCompany", "partnerId":"999"}
]`

@Injectable()
export class AuthService {
  roleArr: [User]
  constructor() {
    this.roleArr = JSON.parse(users)
  }
  // TODO old
  // getRole(user: AuthUser): Role {
  //   var picked = roleArr.find((o) => o.nationalId === user.nationalId)
  //   //TODO if not found
  //   return picked.role as Role
  // }

  // //TODO
  // getUserRoleNew(user: AuthUser): User {
  //   const picked = this.roleArr.find((o) => o.nationalId === user.nationalId)
  //   let curruser = new User()
  //   // curruser.nationalId = user.nationalId
  //   if (!picked) {
  //     // curruser.role = 'citizen'
  //   } else {
  //     // curruser.role = picked.role
  //     // curruser.partnerId = picked.partnerId
  //   }
  //   return null
  // }

  // get user role
  getUserRole(user: AuthUser): User {
    const picked = this.roleArr.find((o) => o.nationalId === user.nationalId)
    return picked
  }

  // check role
  checkRole(user: AuthUser, role: Role): boolean {
    const picked = this.roleArr.find((o) => o.nationalId === user.nationalId)
    if (!picked) {
      return false
    } else {
      const r = picked.role as Role
      return (
        r === 'developer' || r === 'recyclingCompany' || r === 'recyclingFund'
      )
    }
    return false
  }
}
