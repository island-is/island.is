import { SendMailOptions } from 'nodemailer'
import { SyslumennFormsInput } from '../dto/syslumennForms.input'
import { environment } from '../environments/environment'

const DEFAULT_EMAIL = 'smh@syslumenn.is'

type StringOrNull = string | null

type CategoryEmails = {
  /**
   * Fjölskyldumál
   */
  '4vQ4htPOAZvzcXBcjx06SH': StringOrNull
  /**
   * Skírteini
   */
  '7nWhQCER920RakQ7BZpEmV': StringOrNull
  /**
   * Andlát og dánarbú
   */
  '2TkJynZlamqTHdjUziXDG0': StringOrNull
  /**
   * Þinglýsingar, staðfestingar og skráningar
   */
  '6K9stHLAB2mEyGqtqjnXxf': StringOrNull
  /**
   * Gjöld og innheimta
   */
  '5u2M09Kw3p1Spva1GSuAzB': StringOrNull
  /**
   * Löggildingar
   */
  WrQIftmx61sHJMoIr1QRW: StringOrNull
  /**
   * Vottorð
   */
  '76Expbwtudon1Gz5lrKOit': StringOrNull
  /**
   * Lögráðamál
   */
  '4tvRkPgKP3kerbyRJDvaWF': StringOrNull
  /**
   * Önnur þjónusta sýslumanna
   */
  '4LNbNB3GvH3RcoIGpuZKhG': StringOrNull
  /**
   * Leyfi
   */
  '7HbSNTUHJReJ2GPeT1ni1C': StringOrNull
  /**
   * Fullnustugerðir
   */
  '7LkzuYSzqwM7k8fJyeRbm6': StringOrNull
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
    '4vQ4htPOAZvzcXBcjx06SH': 'vestmannaeyjar.fjolskylda@syslumenn.is',
    '7nWhQCER920RakQ7BZpEmV': 'vestmannaeyjar.vegabref@syslumenn.is',
    '2TkJynZlamqTHdjUziXDG0': 'vestmannaeyjar.danarbu@syslumenn.is',
    '6K9stHLAB2mEyGqtqjnXxf': 'vestmannaeyjar.thinglysing@syslumenn.is',
    '5u2M09Kw3p1Spva1GSuAzB': 'vestmannaeyjar.innheimta@syslumenn.is',
    WrQIftmx61sHJMoIr1QRW: null,
    '76Expbwtudon1Gz5lrKOit': null,
    '4tvRkPgKP3kerbyRJDvaWF': 'vestmannaeyjar.logradamal@syslumenn.is',
    '4LNbNB3GvH3RcoIGpuZKhG': null,
    '7HbSNTUHJReJ2GPeT1ni1C': 'vestmannaeyjar.leyfi@syslumenn.is',
    '7LkzuYSzqwM7k8fJyeRbm6': 'vestmannaeyjar.fullnusta@syslumenn.is',
    default: 'vestmannaeyjar@syslumenn.is',
  },
  '12JLsyDmODBfZedYPOQXtX': {
    '4vQ4htPOAZvzcXBcjx06SH': 'nordurlandeystra.fjolskylda@syslumenn.is',
    '7nWhQCER920RakQ7BZpEmV': 'nordurlandeystra.vegabref@syslumenn.is',
    '2TkJynZlamqTHdjUziXDG0': 'nordurlandeystra.danarbu@syslumenn.is',
    '6K9stHLAB2mEyGqtqjnXxf': 'nordurlandeystra.thinglysing@syslumenn.is',
    '5u2M09Kw3p1Spva1GSuAzB': 'nordurlandeystra.innheimta@syslumenn.is',
    WrQIftmx61sHJMoIr1QRW: null,
    '76Expbwtudon1Gz5lrKOit': null,
    '4tvRkPgKP3kerbyRJDvaWF': 'nordurlandeystra.logradamal@syslumenn.is',
    '4LNbNB3GvH3RcoIGpuZKhG': null,
    '7HbSNTUHJReJ2GPeT1ni1C': 'nordurlandeystra.leyfi@syslumenn.is',
    '7LkzuYSzqwM7k8fJyeRbm6': null,
    default: 'nordurlandeystra@syslumenn.is',
  },
  Xnes7x1ccvBvuZxInRXDm: {
    '4vQ4htPOAZvzcXBcjx06SH': 'austurland.fjolskylda@syslumenn.is',
    '7nWhQCER920RakQ7BZpEmV': 'austurland.vegabref@syslumenn.is',
    '2TkJynZlamqTHdjUziXDG0': 'austurland.danarbu@syslumenn.is',
    '6K9stHLAB2mEyGqtqjnXxf': 'austurland.thinglysing@syslumenn.is',
    '5u2M09Kw3p1Spva1GSuAzB': 'austurland.innheimta@syslumenn.is',
    WrQIftmx61sHJMoIr1QRW: null,
    '76Expbwtudon1Gz5lrKOit': null,
    '4tvRkPgKP3kerbyRJDvaWF': 'austurland.logradamal@syslumenn.is',
    '4LNbNB3GvH3RcoIGpuZKhG': null,
    '7HbSNTUHJReJ2GPeT1ni1C': 'austurland.leyfi@syslumenn.is',
    '7LkzuYSzqwM7k8fJyeRbm6': 'austurland.fullnusta@syslumenn.is',
    default: 'austurland@syslumenn.is',
  },
  '43KqapFNoM9m4MNXXc8UPU': {
    '4vQ4htPOAZvzcXBcjx06SH': 'vesturland.fjolskylda@syslumenn.is',
    '7nWhQCER920RakQ7BZpEmV': 'vesturland.vegabref@syslumenn.is',
    '2TkJynZlamqTHdjUziXDG0': 'vesturland.danarbu@syslumenn.is',
    '6K9stHLAB2mEyGqtqjnXxf': 'vesturland.thinglysing@syslumenn.is',
    '5u2M09Kw3p1Spva1GSuAzB': 'vesturland.innheimta@syslumenn.is',
    WrQIftmx61sHJMoIr1QRW: null,
    '76Expbwtudon1Gz5lrKOit': null,
    '4tvRkPgKP3kerbyRJDvaWF': 'vesturland.logradamal@syslumenn.is',
    '4LNbNB3GvH3RcoIGpuZKhG': null,
    '7HbSNTUHJReJ2GPeT1ni1C': null,
    '7LkzuYSzqwM7k8fJyeRbm6': 'vesturland.fullnusta@syslumenn.is',
    default: 'vesturland@syslumenn.is',
  },
  '6puIJvhGxFBzxExVHxi5sr': {
    '4vQ4htPOAZvzcXBcjx06SH': 'fjolskylda@syslumenn.is',
    '7nWhQCER920RakQ7BZpEmV': 'vegabref@syslumenn.is',
    '2TkJynZlamqTHdjUziXDG0': 'danarbu@syslumenn.is',
    '6K9stHLAB2mEyGqtqjnXxf': 'thinglysing@syslumenn.is',
    '5u2M09Kw3p1Spva1GSuAzB': null,
    WrQIftmx61sHJMoIr1QRW: null,
    '76Expbwtudon1Gz5lrKOit': null,
    '4tvRkPgKP3kerbyRJDvaWF': 'fjolskylda@syslumenn.is',
    '4LNbNB3GvH3RcoIGpuZKhG': null,
    '7HbSNTUHJReJ2GPeT1ni1C': 'leyfi@syslumenn.is',
    '7LkzuYSzqwM7k8fJyeRbm6': 'fullnusta@syslumenn.is',
    default: 'smh@syslumenn.is',
  },
  cRCuTTXXSrpBj27nBiLbc: {
    '4vQ4htPOAZvzcXBcjx06SH': 'sudurnes.fjolskylda@syslumenn.is',
    '7nWhQCER920RakQ7BZpEmV': 'sudurnes.vegabref@syslumenn.is',
    '2TkJynZlamqTHdjUziXDG0': 'sudurnes.danarbu@syslumenn.is',
    '6K9stHLAB2mEyGqtqjnXxf': 'sudurnes.thinglysing@syslumenn.is',
    '5u2M09Kw3p1Spva1GSuAzB': 'sudurnes.innheimta@syslumenn.is',
    WrQIftmx61sHJMoIr1QRW: null,
    '76Expbwtudon1Gz5lrKOit': null,
    '4tvRkPgKP3kerbyRJDvaWF': 'sudurnes.logradamal@syslumenn.is',
    '4LNbNB3GvH3RcoIGpuZKhG': null,
    '7HbSNTUHJReJ2GPeT1ni1C': 'sudurnes.leyfi@syslumenn.is',
    '7LkzuYSzqwM7k8fJyeRbm6': 'sudurnes.fullnusta@syslumenn.is',
    default: 'sudurnes@syslumenn.is',
  },
  '2uyNnLcRooCNk7u6CMpsIv': {
    '4vQ4htPOAZvzcXBcjx06SH': 'sudurland.fjolskylda@syslumenn.is',
    '7nWhQCER920RakQ7BZpEmV': 'sudurland.vegabref@syslumenn.is',
    '2TkJynZlamqTHdjUziXDG0': 'sudurland.danarbu@syslumenn.is',
    '6K9stHLAB2mEyGqtqjnXxf': 'sudurland.thinglysing@syslumenn.is',
    '5u2M09Kw3p1Spva1GSuAzB': 'sudurland.innheimta@syslumenn.is',
    WrQIftmx61sHJMoIr1QRW: null,
    '76Expbwtudon1Gz5lrKOit': null,
    '4tvRkPgKP3kerbyRJDvaWF': 'sudurland.logradamal@syslumenn.is',
    '4LNbNB3GvH3RcoIGpuZKhG': null,
    '7HbSNTUHJReJ2GPeT1ni1C': 'sudurland.leyfi@syslumenn.is',
    '7LkzuYSzqwM7k8fJyeRbm6': 'sudurland.fullnusta@syslumenn.is',
    default: 'sudurland@syslumenn.is',
  },
  ZefqpCw4y5oy9lREilQY3: {
    '4vQ4htPOAZvzcXBcjx06SH': 'nordurlandvestra.fjolskylda@syslumenn.is',
    '7nWhQCER920RakQ7BZpEmV': 'nordurlandvestra.vegabref@syslumenn.is',
    '2TkJynZlamqTHdjUziXDG0': 'nordurlandvestra.danarbu@syslumenn.is',
    '6K9stHLAB2mEyGqtqjnXxf': 'nordurlandvestra.thinglysing@syslumenn.is',
    '5u2M09Kw3p1Spva1GSuAzB': 'innheimta@syslumenn.is',
    WrQIftmx61sHJMoIr1QRW: null,
    '76Expbwtudon1Gz5lrKOit': null,
    '4tvRkPgKP3kerbyRJDvaWF': 'nordurlandvestra.logradamal@syslumenn.is',
    '4LNbNB3GvH3RcoIGpuZKhG': null,
    '7HbSNTUHJReJ2GPeT1ni1C': 'nordurlandvestra.leyfi@syslumenn.is',
    '7LkzuYSzqwM7k8fJyeRbm6': null,
    default: 'nordurlandvestra@syslumenn.is',
  },
  '5MDZoq1DGsJospUnQz4y98': {
    '4vQ4htPOAZvzcXBcjx06SH': 'vestfirdir.fjolskylda@syslumenn.is',
    '7nWhQCER920RakQ7BZpEmV': 'vestfirdir.vegabref@syslumenn.is',
    '2TkJynZlamqTHdjUziXDG0': 'vestfirdir.danarbu@syslumenn.is',
    '6K9stHLAB2mEyGqtqjnXxf': 'vestfirdir.thinglysing@syslumenn.is',
    '5u2M09Kw3p1Spva1GSuAzB': 'vestfirdir.innheimta@syslumenn.is',
    WrQIftmx61sHJMoIr1QRW: null,
    '76Expbwtudon1Gz5lrKOit': null,
    '4tvRkPgKP3kerbyRJDvaWF': 'vestfirdir.logradamal@syslumenn.is',
    '4LNbNB3GvH3RcoIGpuZKhG': null,
    '7HbSNTUHJReJ2GPeT1ni1C': 'vestfirdir.leyfi@syslumenn.is',
    '7LkzuYSzqwM7k8fJyeRbm6': 'vestfirdir.fullnusta@syslumenn.is',
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
