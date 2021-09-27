import { SendMailOptions } from 'nodemailer'
import { SyslumennFormsInput } from '../dto/syslumennForms.input'
import { environment } from '../environments/environment'

const DEFAULT_EMAIL = 'smh@syslumenn.is'

type StringOrNull = string | null

type CategoryEmails = {
  /**
   * Fjölskyldumál
   */
  '69HeuLviw3gfK9c0B9AVwn': StringOrNull
  /**
   * Skírteini
   */
  '1jeEF0NCzquMoUbFWKhCae': StringOrNull
  /**
   * Andlát og dánarbú
   */
  '4OcHzX4wSgmLrX8NjbVmKl': StringOrNull
  /**
   * Þinglýsingar, staðfestingar og skráningar
   */
  CPVfReLmOMUD32DA9k6ep: StringOrNull
  /**
   * Gjöld og innheimta
   */
  '6Upd5qvyHk3zSZTywwOM85': StringOrNull
  /**
   * Löggildingar
   */
  '3lw0aUaePoyMWLPLLDNDNs': StringOrNull
  /**
   * Vottorð
   */
  '4T3333TKM9ihXKPHaLENX4': StringOrNull
  /**
   * Lögráðamál
   */
  QDLhh38prxV8CjjjqbOpn: StringOrNull
  /**
   * Önnur þjónusta sýslumanna
   */
  '4MoRkdeC9IpxU3wJaRJ0sO': StringOrNull
  /**
   * Leyfi
   */
  '6gbQGNSBcv3MX8v3PhQdK4': StringOrNull
  /**
   * Fullnustugerðir
   */
  '6Db1w3hMxYT1kunuI52gxz': StringOrNull
  /**
   * Default/fallback email address
   */
  default: StringOrNull
}

type Syslumenn = {
  /**
   * Sýslumaðurinn i Vestmannaeyjum
   */
  '145ctmpqLPrOM7rHZIpC6F': CategoryEmails
  /**
   * Sýslumaðurinn á Norðurlandi eystra
   */
  '12JLsyDmODBfZedYPOQXtX': CategoryEmails
  /**
   * Sýslumaðurinn á Austurlandi
   */
  Xnes7x1ccvBvuZxInRXDm: CategoryEmails
  /**
   * Sýslumaðurinn á Vesturlandi
   */
  '43KqapFNoM9m4MNXXc8UPU': CategoryEmails
  /**
   * Sýslumaðurinn á höfuðborgarsvæðinu
   */
  '6puIJvhGxFBzxExVHxi5sr': CategoryEmails
  /**
   * Sýslumaðurinn á Suðurnesjum
   */
  cRCuTTXXSrpBj27nBiLbc: CategoryEmails
  /**
   * Sýslumaðurinn á Suðurlandi
   */
  '2uyNnLcRooCNk7u6CMpsIv': CategoryEmails
  /**
   * Sýslumaðurinn á Norðurlandi vestra
   */
  ZefqpCw4y5oy9lREilQY3: CategoryEmails
  /**
   * Sýslumaðurinn á Vestfjörðum
   */
  '5MDZoq1DGsJospUnQz4y98': CategoryEmails
}

export const syslumennEmails: Syslumenn = {
  '145ctmpqLPrOM7rHZIpC6F': {
    '69HeuLviw3gfK9c0B9AVwn': 'vestmannaeyjar.fjolskylda@syslumenn.is',
    '1jeEF0NCzquMoUbFWKhCae': 'vestmannaeyjar.vegabref@syslumenn.is',
    '4OcHzX4wSgmLrX8NjbVmKl': 'vestmannaeyjar.danarbu@syslumenn.is',
    CPVfReLmOMUD32DA9k6ep: 'vestmannaeyjar.thinglysing@syslumenn.is',
    '6Upd5qvyHk3zSZTywwOM85': 'vestmannaeyjar.innheimta@syslumenn.is',
    '3lw0aUaePoyMWLPLLDNDNs': null,
    '4T3333TKM9ihXKPHaLENX4': null,
    QDLhh38prxV8CjjjqbOpn: 'vestmannaeyjar.logradamal@syslumenn.is',
    '4MoRkdeC9IpxU3wJaRJ0sO': null,
    '6gbQGNSBcv3MX8v3PhQdK4': 'vestmannaeyjar.leyfi@syslumenn.is',
    '6Db1w3hMxYT1kunuI52gxz': 'vestmannaeyjar.fullnusta@syslumenn.is',
    default: 'vestmannaeyjar@syslumenn.is',
  },
  '12JLsyDmODBfZedYPOQXtX': {
    '69HeuLviw3gfK9c0B9AVwn': 'nordurlandeystra.fjolskylda@syslumenn.is',
    '1jeEF0NCzquMoUbFWKhCae': 'nordurlandeystra.vegabref@syslumenn.is',
    '4OcHzX4wSgmLrX8NjbVmKl': 'nordurlandeystra.danarbu@syslumenn.is',
    CPVfReLmOMUD32DA9k6ep: 'nordurlandeystra.thinglysing@syslumenn.is',
    '6Upd5qvyHk3zSZTywwOM85': 'nordurlandeystra.innheimta@syslumenn.is',
    '3lw0aUaePoyMWLPLLDNDNs': null,
    '4T3333TKM9ihXKPHaLENX4': null,
    QDLhh38prxV8CjjjqbOpn: 'nordurlandeystra.logradamal@syslumenn.is',
    '4MoRkdeC9IpxU3wJaRJ0sO': null,
    '6gbQGNSBcv3MX8v3PhQdK4': 'nordurlandeystra.leyfi@syslumenn.is',
    '6Db1w3hMxYT1kunuI52gxz': null,
    default: 'nordurlandeystra@syslumenn.is',
  },
  Xnes7x1ccvBvuZxInRXDm: {
    '69HeuLviw3gfK9c0B9AVwn': 'austurland.fjolskylda@syslumenn.is',
    '1jeEF0NCzquMoUbFWKhCae': 'austurland.vegabref@syslumenn.is',
    '4OcHzX4wSgmLrX8NjbVmKl': 'austurland.danarbu@syslumenn.is',
    CPVfReLmOMUD32DA9k6ep: 'austurland.thinglysing@syslumenn.is',
    '6Upd5qvyHk3zSZTywwOM85': 'austurland.innheimta@syslumenn.is',
    '3lw0aUaePoyMWLPLLDNDNs': null,
    '4T3333TKM9ihXKPHaLENX4': null,
    QDLhh38prxV8CjjjqbOpn: 'austurland.logradamal@syslumenn.is',
    '4MoRkdeC9IpxU3wJaRJ0sO': null,
    '6gbQGNSBcv3MX8v3PhQdK4': 'austurland.leyfi@syslumenn.is',
    '6Db1w3hMxYT1kunuI52gxz': 'austurland.fullnusta@syslumenn.is',
    default: 'austurland@syslumenn.is',
  },
  '43KqapFNoM9m4MNXXc8UPU': {
    '69HeuLviw3gfK9c0B9AVwn': 'vesturland.fjolskylda@syslumenn.is',
    '1jeEF0NCzquMoUbFWKhCae': 'vesturland.vegabref@syslumenn.is',
    '4OcHzX4wSgmLrX8NjbVmKl': 'vesturland.danarbu@syslumenn.is',
    CPVfReLmOMUD32DA9k6ep: 'vesturland.thinglysing@syslumenn.is',
    '6Upd5qvyHk3zSZTywwOM85': 'vesturland.innheimta@syslumenn.is',
    '3lw0aUaePoyMWLPLLDNDNs': null,
    '4T3333TKM9ihXKPHaLENX4': null,
    QDLhh38prxV8CjjjqbOpn: 'vesturland.logradamal@syslumenn.is',
    '4MoRkdeC9IpxU3wJaRJ0sO': null,
    '6gbQGNSBcv3MX8v3PhQdK4': null,
    '6Db1w3hMxYT1kunuI52gxz': 'vesturland.fullnusta@syslumenn.is',
    default: 'vesturland@syslumenn.is',
  },
  '6puIJvhGxFBzxExVHxi5sr': {
    '69HeuLviw3gfK9c0B9AVwn': 'fjolskylda@syslumenn.is',
    '1jeEF0NCzquMoUbFWKhCae': 'vegabref@syslumenn.is',
    '4OcHzX4wSgmLrX8NjbVmKl': 'danarbu@syslumenn.is',
    CPVfReLmOMUD32DA9k6ep: 'thinglysing@syslumenn.is',
    '6Upd5qvyHk3zSZTywwOM85': null,
    '3lw0aUaePoyMWLPLLDNDNs': null,
    '4T3333TKM9ihXKPHaLENX4': null,
    QDLhh38prxV8CjjjqbOpn: 'fjolskylda@syslumenn.is',
    '4MoRkdeC9IpxU3wJaRJ0sO': null,
    '6gbQGNSBcv3MX8v3PhQdK4': 'leyfi@syslumenn.is',
    '6Db1w3hMxYT1kunuI52gxz': 'fullnusta@syslumenn.is',
    default: 'smh@syslumenn.is',
  },
  cRCuTTXXSrpBj27nBiLbc: {
    '69HeuLviw3gfK9c0B9AVwn': 'sudurnes.fjolskylda@syslumenn.is',
    '1jeEF0NCzquMoUbFWKhCae': 'sudurnes.vegabref@syslumenn.is',
    '4OcHzX4wSgmLrX8NjbVmKl': 'sudurnes.danarbu@syslumenn.is',
    CPVfReLmOMUD32DA9k6ep: 'sudurnes.thinglysing@syslumenn.is',
    '6Upd5qvyHk3zSZTywwOM85': 'sudurnes.innheimta@syslumenn.is',
    '3lw0aUaePoyMWLPLLDNDNs': null,
    '4T3333TKM9ihXKPHaLENX4': null,
    QDLhh38prxV8CjjjqbOpn: 'sudurnes.logradamal@syslumenn.is',
    '4MoRkdeC9IpxU3wJaRJ0sO': null,
    '6gbQGNSBcv3MX8v3PhQdK4': 'sudurnes.leyfi@syslumenn.is',
    '6Db1w3hMxYT1kunuI52gxz': 'sudurnes.fullnusta@syslumenn.is',
    default: 'sudurnes@syslumenn.is',
  },
  '2uyNnLcRooCNk7u6CMpsIv': {
    '69HeuLviw3gfK9c0B9AVwn': 'sudurland.fjolskylda@syslumenn.is',
    '1jeEF0NCzquMoUbFWKhCae': 'sudurland.vegabref@syslumenn.is',
    '4OcHzX4wSgmLrX8NjbVmKl': 'sudurland.danarbu@syslumenn.is',
    CPVfReLmOMUD32DA9k6ep: 'sudurland.thinglysing@syslumenn.is',
    '6Upd5qvyHk3zSZTywwOM85': 'sudurland.innheimta@syslumenn.is',
    '3lw0aUaePoyMWLPLLDNDNs': null,
    '4T3333TKM9ihXKPHaLENX4': null,
    QDLhh38prxV8CjjjqbOpn: 'sudurland.logradamal@syslumenn.is',
    '4MoRkdeC9IpxU3wJaRJ0sO': null,
    '6gbQGNSBcv3MX8v3PhQdK4': 'sudurland.leyfi@syslumenn.is',
    '6Db1w3hMxYT1kunuI52gxz': 'sudurland.fullnusta@syslumenn.is',
    default: 'sudurland@syslumenn.is',
  },
  ZefqpCw4y5oy9lREilQY3: {
    '69HeuLviw3gfK9c0B9AVwn': 'nordurlandvestra.fjolskylda@syslumenn.is',
    '1jeEF0NCzquMoUbFWKhCae': 'nordurlandvestra.vegabref@syslumenn.is',
    '4OcHzX4wSgmLrX8NjbVmKl': 'nordurlandvestra.danarbu@syslumenn.is',
    CPVfReLmOMUD32DA9k6ep: 'nordurlandvestra.thinglysing@syslumenn.is',
    '6Upd5qvyHk3zSZTywwOM85': 'innheimta@syslumenn.is',
    '3lw0aUaePoyMWLPLLDNDNs': null,
    '4T3333TKM9ihXKPHaLENX4': null,
    QDLhh38prxV8CjjjqbOpn: 'nordurlandvestra.logradamal@syslumenn.is',
    '4MoRkdeC9IpxU3wJaRJ0sO': null,
    '6gbQGNSBcv3MX8v3PhQdK4': 'nordurlandvestra.leyfi@syslumenn.is',
    '6Db1w3hMxYT1kunuI52gxz': null,
    default: 'nordurlandvestra@syslumenn.is',
  },
  '5MDZoq1DGsJospUnQz4y98': {
    '69HeuLviw3gfK9c0B9AVwn': 'vestfirdir.fjolskylda@syslumenn.is',
    '1jeEF0NCzquMoUbFWKhCae': 'vestfirdir.vegabref@syslumenn.is',
    '4OcHzX4wSgmLrX8NjbVmKl': 'vestfirdir.danarbu@syslumenn.is',
    CPVfReLmOMUD32DA9k6ep: 'vestfirdir.thinglysing@syslumenn.is',
    '6Upd5qvyHk3zSZTywwOM85': 'vestfirdir.innheimta@syslumenn.is',
    '3lw0aUaePoyMWLPLLDNDNs': null,
    '4T3333TKM9ihXKPHaLENX4': null,
    QDLhh38prxV8CjjjqbOpn: 'vestfirdir.logradamal@syslumenn.is',
    '4MoRkdeC9IpxU3wJaRJ0sO': null,
    '6gbQGNSBcv3MX8v3PhQdK4': 'vestfirdir.leyfi@syslumenn.is',
    '6Db1w3hMxYT1kunuI52gxz': 'vestfirdir.fullnusta@syslumenn.is',
    default: 'vestfirdir@syslumenn.is',
  },
}

export const getTemplate = (input: SyslumennFormsInput): SendMailOptions => {
  const categoryId = input.category
  const syslumadurId = input.syslumadur

  let toAddress = DEFAULT_EMAIL

  if (syslumadurId) {
    const emailList = syslumennEmails[syslumadurId]

    if (emailList) {
      toAddress = emailList[categoryId] ?? emailList.default ?? DEFAULT_EMAIL
    }
  }

  return {
    from: {
      name: 'Island.is communications',
      address: environment.emailOptions.sendFrom,
    },
    replyTo: {
      name: input.name,
      address: input.email,
    },
    to: [
      {
        name: 'Þjónustuvefur Sýslumanna',
        address: toAddress,
      },
    ],
    subject: `Fyrirspurn af vef frá: "${input.name}"`,
    text: input.message,
  }
}
