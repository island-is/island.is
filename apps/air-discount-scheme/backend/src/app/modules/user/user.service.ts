import { Injectable } from '@nestjs/common'

import { ThjodskraUser, Fund } from '@island.is/air-discount-scheme/types'
import { User } from './user.model'
import { NationalRegistryResponse } from './user.types'
import { FlightService } from '../flight'

const ADS_POSTAL_CODES = [
  380, // Reykhólahreppur
  381, // Reykhólahreppur
  400, // Ísafjörður
  401, // Ísafjörður
  410, // Hnífsdalur
  415, // Bolungarvík
  416, // Bolungarvík
  420, // Súðavík
  421, // Súðavík
  425, // Flateyri
  426, // Flateyri
  430, // Suðureyri
  431, // Suðureyri
  450, // Patreksfjörður
  451, // Patreksfjörður
  460, // Tálknafjörður
  461, // Tálknafjörður
  465, // Bíldudalur
  466, // Bíldudalur
  470, // Þingeyri
  471, // Þingeyri
  510, // Hólmavík
  511, // Hólmavík
  512, // Hólmavík
  520, // Drangsnes
  522, // Kjörvogur
  523, // Bær
  524, // Norðurfjörður
  540, // Blönduós
  541, // Blönduós
  545, // Skagaströnd
  546, // Skagaströnd
  550, // Sauðárkrókur
  551, // Sauðárkrókur
  560, // Varmahlíð
  561, // Varmahlíð
  565, // Hofsós
  566, // Hofsós
  570, // Fljót
  580, // Siglufjörður
  581, // Siglufjörður
  600, // Akureyri
  601, // Akureyri
  603, // Akureyri
  604, // Akureyri
  605, // Akureyri
  606, // Akureyri
  607, // Akureyri
  610, // Grenivík
  611, // Grímsey
  616, // Grenivík
  620, // Dalvík
  621, // Dalvík
  625, // Ólafsfjörður
  626, // Ólafsfjörður
  630, // Hrísey
  640, // Húsavík
  641, // Húsavík
  645, // Fosshóll
  650, // Laugar
  660, // Mývatn
  670, // Kópasker
  671, // Kópasker
  675, // Raufarhöfn
  676, // Raufarhöfn
  680, // Þórshöfn
  681, // Þórshöfn
  685, // Bakkafjörður
  686, // Bakkafjörður
  690, // Vopnafjörður
  691, // Vopnafjörður
  700, // Egilsstaðir
  701, // Egilsstaðir
  710, // Seyðisfjörður
  711, // Seyðisfjörður
  715, // Mjóifjörður
  720, // Borgarfjörður eystri
  721, // Borgarfjörður (eystri
  730, // Reyðarfjörður
  731, // Reyðarfjörður
  735, // Eskifjörður
  736, // Eskifjörður
  740, // Neskaupstaður
  741, // Neskaupsstaður
  750, // Fáskrúðsfjörður
  751, // Fáskrúðsfjörður
  755, // Stöðvarfjörður
  760, // Breiðdalsvík
  761, // Breiðdalsvík
  765, // Djúpivogur
  766, // Djúpavogur
  780, // Höfn í Hornafirði
  781, // Höfn í Hornafirði
  785, // Öræfi
  900, // Vestmannaeyjar
]

@Injectable()
export class UserService {
  constructor(private readonly flightService: FlightService) {}

  private async getUserFromNationalRegistry(
    nationalId: string,
  ): Promise<ThjodskraUser> {
    // TODO: implement from thjodskra
    const users = [
      {
        nationalId,
        firstName: 'Jón',
        middleName: 'Gunnar',
        lastName: 'Jónsson',
        gender: 'kk',
        address: 'Bessastaðir 1',
        postalcode: 225,
        city: 'Álftanes',
      },
      {
        nationalId: '1234567890',
        firstName: 'Gervimaður',
        middleName: '',
        lastName: 'Afríka',
        gender: 'kvk',
        address: 'Ísabessastaðir 1',
        postalcode: 400,
        city: 'Ísafjörður',
      },
    ]
    if (nationalId !== '1234567890') {
      return Promise.resolve(users[0])
    }
    return Promise.resolve(users[1])
  }

  getRelations(nationalId: string): Promise<string[]> {
    // TODO: implement from thjodskra
    return Promise.resolve([nationalId, '1234567890'])
  }

  meetsADSRequirements(postalcode: number): boolean {
    return ADS_POSTAL_CODES.includes(postalcode)
  }

  async getFund(user: ThjodskraUser): Promise<Fund> {
    const {
      used,
      unused,
      total,
    } = await this.flightService.countFlightLegsByNationalId(user.nationalId)

    return {
      nationalId: user.nationalId,
      credit: this.meetsADSRequirements(user.postalcode) ? unused : 0,
      used: used,
      total,
    }
  }

  async getUserInfoByNationalId(nationalId: string): Promise<User> {
    const user = await this.getUserFromNationalRegistry(nationalId)
    const fund = await this.getFund(user)
    return new User(user, fund)
  }
}
