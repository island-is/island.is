import { RecyclingPartner } from '.'

//TODO: create partnerDummy list

export class RecyclingPartnerService {
  recyclingPartnerList: RecyclingPartner[]

  constructor() {
    this.recyclingPartnerList = []
    this.recyclingPartnerList.push(
      new RecyclingPartner(
        1,
        'Vaka',
        'Suðurlandsbraut 1',
        109,
        'vaka.is',
        '8881111',
        true,
      ),
    )
    this.recyclingPartnerList.push(
      new RecyclingPartner(
        1,
        'Hringrás',
        'Vesturlandsbraut 1',
        109,
        'hringras.is',
        '7772222',
        true,
      ),
    )
    this.recyclingPartnerList.push(
      new RecyclingPartner(
        1,
        'Rusl & Drasl',
        'Valhúsabraut 1',
        229,
        'rusldrasl.is',
        '2339999',
        true,
      ),
    )
  }

  getRecyclingPartner(id: number) {
    return this.recyclingPartnerList.find((e) => e.id === id)
  }
}
