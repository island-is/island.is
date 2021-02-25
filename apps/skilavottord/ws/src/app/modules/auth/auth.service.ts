import { Injectable } from '@nestjs/common'
import { User } from '../user'
import { Role, AuthUser } from './auth.types'

const users = `[{ "nationalId":"2310765229", "name": "Vésteinn Viðarsson", "role":"DEVELOPERS", "partnerId":""},
{ "nationalId":"0602773039", "name": "Bjarki Már Flosason", "role":"DEVELOPERS", "partnerId":""},
{ "nationalId":"1505664449","name": "Rúnar Sigurður Guðlaugsson", "role":"DEVELOPERS", "partnerId":""},
{ "nationalId":"0301665909","name": "Sigurgeir Guðmundsson", "role":"DEVELOPERS", "partnerId":""},
{ "nationalId":"2311862559","name": "Quan Dong", "role":"DEVELOPERS", "partnerId":""},
{ "nationalId":"0101302129","name": "Gervimaður Noregur", "role":"DEVELOPERS", "partnerId":""},
{ "nationalId":"2811638099","name": "Tómas Árni Jónsson", "role":"DEVELOPERS", "partnerId":""},
{ "nationalId":"0905665129","name": "Friðbjörn Hólm Ólafsson", "role":"RECYCLINGCOMPANY", "partnerId":""},
{ "nationalId":"0706765599","name": "Sigríður Björk Þórisdóttir", "role":"RECYCLINGCOMPANY", "partnerId":"110"},
{ "nationalId":"1310734109","name": "Reynir Þór Guðmundsson", "role":"RECYCLINGCOMPANY", "partnerId":"110"},
{ "nationalId":"1110892489","name": "Ari Halldór Hjaltason", "role":"RECYCLINGCOMPANY", "partnerId":"110"},
{ "nationalId":"0409842919","name": "Gísli Rúnar Svanbergsson", "role":"RECYCLINGCOMPANY", "partnerId":"110"},
{ "nationalId":"3108002360","name": "Viktoría Sól Reynisdóttir", "role":"RECYCLINGCOMPANY", "partnerId":"110"},
{ "nationalId":"2309695079","name": "Valdemar Örn Haraldsson", "role":"RECYCLINGCOMPANY", "partnerId":"110"},
{ "nationalId":"0910872009","name": "Tómas Kári Kristinsson", "role":"RECYCLINGCOMPANY", "partnerId":"110"},
{ "nationalId":"0601756089","name": "Greta Björg Egilsdóttir", "role":"RECYCLINGCOMPANY", "partnerId":"110"},
{ "nationalId":"0709804529","name": "Halldór Örn Kristjánsson", "role":"RECYCLINGCOMPANY", "partnerId":"110"},
{ "nationalId":"1811673949","name": "Tryggvi Daníel Sigurðsson", "role":"RECYCLINGCOMPANY", "partnerId":"104"},
{ "nationalId":"2405843609","name": "Þórdís Jónsdóttir", "role":"RECYCLINGCOMPANY", "partnerId":"104"},
{ "nationalId":"2211692989","name": "Úlfar Haraldsson", "role":"RECYCLINGCOMPANY", "partnerId":"221"},
{ "nationalId":"2808714009","name": "Dagný Michelle Jónsdóttir", "role":"RECYCLINGCOMPANY", "partnerId":"221"},
{ "nationalId":"3108654949","name": "Ólafía Sigurjónsdóttir", "role":"RECYCLINGCOMPANY", "partnerId":"221"},
{ "nationalId":"2512942099","name": "Marjón Pétur Benediktsson", "role":"RECYCLINGCOMPANY", "partnerId":"221"},
{ "nationalId":"0306942609","name": "Karítas Þorvaldsdóttir", "role":"RECYCLINGCOMPANY", "partnerId":"221"},
{ "nationalId":"1207952879","name": "Anton Örn  Kærnested", "role":"RECYCLINGCOMPANY", "partnerId":"221"},
{ "nationalId":"3005594339","name": "Ólafur Kjartansson", "role":"RECYCLINGFUND", "partnerId":""},
{ "nationalId":"0202614989","name": "Guðlaugur Gylfi Sverrisson", "role":"RECYCLINGFUND", "partnerId":""},
{ "nationalId":"0305695639","name": "Ása Hauksdóttir", "role":"RECYCLINGFUND", "partnerId":""}
]`

@Injectable()
export class AuthService {
  // TODO old
  // getRole(user: AuthUser): Role {
  //   var picked = roleArr.find((o) => o.nationalId === user.nationalId)
  //   //TODO if not found
  //   return picked.role as Role
  // }

  //TODO
  getUserRole(user: AuthUser): User {
    const roleArr: [User] = JSON.parse(users)
    var picked = roleArr.find((o) => o.nationalId === user.nationalId)
    return picked
  }

  checkRole(user: AuthUser, role: Role): boolean {
    const roleArr: [User] = JSON.parse(users)
    const picked = roleArr.find((o) => o.nationalId === user.nationalId)
    if (!picked) {
      return false
    } else {
      const r = picked.role as Role
      return (
        r === 'developer' || r === 'recyclingCompany' || r === 'recyclingFund'
      )
    }

    // switch (role) {
    //   case 'recyclingCompany':
    //     return RECYCLINGCOMPANY.includes(user.nationalId)
    //   case 'recyclingFund':
    //     return RECYCLINGFUND.includes(user.nationalId)
    //   case 'developer':
    //     return DEVELOPERS.includes(user.nationalId)
    //   default: {
    //     if (role) {
    //       return false
    //     }
    //   return true
    // }
    // }
    return true
  }
}
