import { SendMailOptions } from 'nodemailer'
import { ServiceWebFormsInputWithInstitutionEmail } from '../dto/serviceWebForms.input'
import { environment } from '../environments/environment'

type StringOrNull = string | null

// Fjölskyldumál
const FJOLSKYLDUMAL = '4vQ4htPOAZvzcXBcjx06SH'

// Skírteini
const SKIRTEINI = '7nWhQCER920RakQ7BZpEmV'

// Andlát og dánarbú
const ANDLAT_OG_DANARBU = '2TkJynZlamqTHdjUziXDG0'

// Þinglýsingar, staðfestingar og skráningar
const THINGLYSINGAR = '6K9stHLAB2mEyGqtqjnXxf'

// Gjöld og innheimta
const GJOLD_OG_INNHEIMTA = '5u2M09Kw3p1Spva1GSuAzB'

// Löggildingar
const LOGGILDINGAR = 'WrQIftmx61sHJMoIr1QRW'

// Vottorð
const VOTTORD = '76Expbwtudon1Gz5lrKOit'

// Lögráðamál
const LOGRADAMAL = '4tvRkPgKP3kerbyRJDvaWF'

// Önnur þjónusta sýslumanna
const ONNUR_THJONUSTA_SYSLUMANNA = '4LNbNB3GvH3RcoIGpuZKhG'

// Leyfi
const LEYFI = '7HbSNTUHJReJ2GPeT1ni1C'

// Fullnustugerðir
const FULLNUSTUGERDIR = '7LkzuYSzqwM7k8fJyeRbm6'

// Default/fallback email address
const DEFAULT = 'default'

type Categories =
  | typeof FJOLSKYLDUMAL
  | typeof SKIRTEINI
  | typeof ANDLAT_OG_DANARBU
  | typeof THINGLYSINGAR
  | typeof GJOLD_OG_INNHEIMTA
  | typeof LOGGILDINGAR
  | typeof VOTTORD
  | typeof LOGRADAMAL
  | typeof ONNUR_THJONUSTA_SYSLUMANNA
  | typeof LEYFI
  | typeof FULLNUSTUGERDIR
  | typeof DEFAULT

type Syslumenn =
  /**
   * Sýslumaðurinn i Vestmannaeyjum
   */
  | '145ctmpqLPrOM7rHZIpC6F'
  /**
   * Sýslumaðurinn á Norðurlandi eystra
   */
  | '12JLsyDmODBfZedYPOQXtX'
  /**
   * Sýslumaðurinn á Austurlandi
   */
  | 'Xnes7x1ccvBvuZxInRXDm'
  /**
   * Sýslumaðurinn á Vesturlandi
   */
  | '43KqapFNoM9m4MNXXc8UPU'
  /**
   * Sýslumaðurinn á höfuðborgarsvæðinu
   */
  | '6puIJvhGxFBzxExVHxi5sr'
  /**
   * Sýslumaðurinn á Suðurnesjum
   */
  | 'cRCuTTXXSrpBj27nBiLbc'
  /**
   * Sýslumaðurinn á Suðurlandi
   */
  | '2uyNnLcRooCNk7u6CMpsIv'
  /**
   * Sýslumaðurinn á Norðurlandi vestra
   */
  | 'ZefqpCw4y5oy9lREilQY3'
  /**
   * Sýslumaðurinn á Vestfjörðum
   */
  | '5MDZoq1DGsJospUnQz4y98'

export const syslumennEmails: Record<
  Syslumenn,
  Record<Categories, StringOrNull>
> = {
  /**
   * Sýslumaðurinn i Vestmannaeyjum
   */
  '145ctmpqLPrOM7rHZIpC6F': {
    [FJOLSKYLDUMAL]: 'vestmannaeyjar.fjolskylda@syslumenn.is',
    [SKIRTEINI]: 'island@island.is',
    [ANDLAT_OG_DANARBU]: 'vestmannaeyjar.danarbu@syslumenn.is',
    [THINGLYSINGAR]: 'vestmannaeyjar.thinglysing@syslumenn.is',
    [GJOLD_OG_INNHEIMTA]: 'vestmannaeyjar.innheimta@syslumenn.is',
    [LOGGILDINGAR]: 'vestmannaeyjar@syslumenn.is',
    [VOTTORD]: 'island@island.is',
    [LOGRADAMAL]: 'vestmannaeyjar.logradamal@syslumenn.is',
    [ONNUR_THJONUSTA_SYSLUMANNA]: 'vestmannaeyjar@syslumenn.is',
    [LEYFI]: 'vestmannaeyjar.leyfi@syslumenn.is',
    [FULLNUSTUGERDIR]: 'vestmannaeyjar.fullnusta@syslumenn.is',
    [DEFAULT]: 'vestmannaeyjar@syslumenn.is',
  },
  /**
   * Sýslumaðurinn á Norðurlandi eystra
   */
  '12JLsyDmODBfZedYPOQXtX': {
    [FJOLSKYLDUMAL]: 'nordurlandeystra.fjolskylda@syslumenn.is',
    [SKIRTEINI]: 'island@island.is',
    [ANDLAT_OG_DANARBU]: 'nordurlandeystra.danarbu@syslumenn.is',
    [THINGLYSINGAR]: 'nordurlandeystra.thinglysing@syslumenn.is',
    [GJOLD_OG_INNHEIMTA]: 'nordurlandeystra.innheimta@syslumenn.is',
    [LOGGILDINGAR]: 'nordurlandeystra.leyfi@syslumenn.is',
    [VOTTORD]: 'island@island.is',
    [LOGRADAMAL]: 'nordurlandeystra.logradamal@syslumenn.is',
    [ONNUR_THJONUSTA_SYSLUMANNA]: 'nordurlandeystra@syslumenn.is',
    [LEYFI]: 'nordurlandeystra.leyfi@syslumenn.is',
    [FULLNUSTUGERDIR]: 'nordurlandeystra.fullnusta@syslumenn.is',
    [DEFAULT]: 'nordurlandeystra@syslumenn.is',
  },
  /**
   * Sýslumaðurinn á Austurlandi
   */
  Xnes7x1ccvBvuZxInRXDm: {
    [FJOLSKYLDUMAL]: 'austurland.fjolskylda@syslumenn.is',
    [SKIRTEINI]: 'island@island.is',
    [ANDLAT_OG_DANARBU]: 'austurland.danarbu@syslumenn.is',
    [THINGLYSINGAR]: 'austurland.thinglysing@syslumenn.is',
    [GJOLD_OG_INNHEIMTA]: 'austurland.innheimta@syslumenn.is',
    [LOGGILDINGAR]: 'austurland.leyfi@syslumenn.is',
    [VOTTORD]: 'island@island.is',
    [LOGRADAMAL]: 'austurland.logradamal@syslumenn.is',
    [ONNUR_THJONUSTA_SYSLUMANNA]: 'austurland@syslumenn.is',
    [LEYFI]: 'austurland.leyfi@syslumenn.is',
    [FULLNUSTUGERDIR]: 'austurland.fullnusta@syslumenn.is',
    [DEFAULT]: 'austurland@syslumenn.is',
  },
  /**
   * Sýslumaðurinn á Vesturlandi
   */
  '43KqapFNoM9m4MNXXc8UPU': {
    [FJOLSKYLDUMAL]: 'vesturland.fjolskylda@syslumenn.is',
    [SKIRTEINI]: 'island@island.is',
    [ANDLAT_OG_DANARBU]: 'vesturland.danarbu@syslumenn.is',
    [THINGLYSINGAR]: 'vesturland.thinglysing@syslumenn.is',
    [GJOLD_OG_INNHEIMTA]: 'vesturland.innheimta@syslumenn.is',
    [LOGGILDINGAR]: 'vesturland.leyfi@syslumenn.is',
    [VOTTORD]: 'island@island.is',
    [LOGRADAMAL]: 'vesturland.logradamal@syslumenn.is',
    [ONNUR_THJONUSTA_SYSLUMANNA]: 'vesturland@syslumenn.is',
    [LEYFI]: 'vesturland.leyfi@syslumenn.is',
    [FULLNUSTUGERDIR]: 'vesturland.fullnusta@syslumenn.is',
    [DEFAULT]: 'vesturland@syslumenn.is',
  },
  /**
   * Sýslumaðurinn á höfuðborgarsvæðinu
   */
  '6puIJvhGxFBzxExVHxi5sr': {
    [FJOLSKYLDUMAL]: 'fjolskylda@syslumenn.is',
    [SKIRTEINI]: 'island@island.is',
    [ANDLAT_OG_DANARBU]: 'danarbu@syslumenn.is',
    [THINGLYSINGAR]: 'thinglysing@syslumenn.is',
    [GJOLD_OG_INNHEIMTA]: 'smh@syslumenn.is',
    [LOGGILDINGAR]: 'leyfi@syslumenn.is',
    [VOTTORD]: 'island@island.is',
    [LOGRADAMAL]: 'fjolskylda@syslumenn.is',
    [ONNUR_THJONUSTA_SYSLUMANNA]: 'smh@syslumenn.is',
    [LEYFI]: 'leyfi@syslumenn.is',
    [FULLNUSTUGERDIR]: 'fullnusta@syslumenn.is',
    [DEFAULT]: 'smh@syslumenn.is',
  },
  /**
   * Sýslumaðurinn á Suðurnesjum
   */
  cRCuTTXXSrpBj27nBiLbc: {
    [FJOLSKYLDUMAL]: 'sudurnes.fjolskylda@syslumenn.is',
    [SKIRTEINI]: 'island@island.is',
    [ANDLAT_OG_DANARBU]: 'sudurnes.danarbu@syslumenn.is',
    [THINGLYSINGAR]: 'sudurnes.thinglysing@syslumenn.is',
    [GJOLD_OG_INNHEIMTA]: 'sudurnes.innheimta@syslumenn.is',
    [LOGGILDINGAR]: 'sudurnes.leyfi@syslumenn.is',
    [VOTTORD]: 'island@island.is',
    [LOGRADAMAL]: 'sudurnes.logradamal@syslumenn.is',
    [ONNUR_THJONUSTA_SYSLUMANNA]: 'sudurnes@syslumenn.is',
    [LEYFI]: 'sudurnes.leyfi@syslumenn.is',
    [FULLNUSTUGERDIR]: 'sudurnes.fullnusta@syslumenn.is',
    [DEFAULT]: 'sudurnes@syslumenn.is',
  },
  /**
   * Sýslumaðurinn á Suðurlandi
   */
  '2uyNnLcRooCNk7u6CMpsIv': {
    [FJOLSKYLDUMAL]: 'sudurland.fjolskylda@syslumenn.is',
    [SKIRTEINI]: 'island@island.is',
    [ANDLAT_OG_DANARBU]: 'sudurland.danarbu@syslumenn.is',
    [THINGLYSINGAR]: 'sudurland.thinglysing@syslumenn.is',
    [GJOLD_OG_INNHEIMTA]: 'sudurland@syslumenn.is',
    [LOGGILDINGAR]: 'sudurland.leyfi@syslumenn.is',
    [VOTTORD]: 'island@island.is',
    [LOGRADAMAL]: 'sudurland.logradamal@syslumenn.is',
    [ONNUR_THJONUSTA_SYSLUMANNA]: 'sudurland@syslumenn.is',
    [LEYFI]: 'sudurland.leyfi@syslumenn.is',
    [FULLNUSTUGERDIR]: 'sudurland.fullnusta@syslumenn.is',
    [DEFAULT]: 'sudurland@syslumenn.is',
  },
  /**
   * Sýslumaðurinn á Norðurlandi vestra
   */
  ZefqpCw4y5oy9lREilQY3: {
    [FJOLSKYLDUMAL]: 'nordurlandvestra@syslumenn.is',
    [SKIRTEINI]: 'island@island.is',
    [ANDLAT_OG_DANARBU]: 'nordurlandvestra@syslumenn.is',
    [THINGLYSINGAR]: 'nordurlandvestra@syslumenn.is',
    [GJOLD_OG_INNHEIMTA]: 'innheimta@syslumenn.is',
    [LOGGILDINGAR]: 'nordurlandvestra@syslumenn.is',
    [VOTTORD]: 'island@island.is',
    [LOGRADAMAL]: 'nordurlandvestra@syslumenn.is',
    [ONNUR_THJONUSTA_SYSLUMANNA]: 'nordurlandvestra@syslumenn.is',
    [LEYFI]: 'nordurlandvestra@syslumenn.is',
    [FULLNUSTUGERDIR]: 'nordurlandvestra@syslumenn.is',
    [DEFAULT]: 'nordurlandvestra@syslumenn.is',
  },
  /**
   * Sýslumaðurinn á Vestfjörðum
   */
  '5MDZoq1DGsJospUnQz4y98': {
    [FJOLSKYLDUMAL]: 'vestfirdir.fjolskylda@syslumenn.is',
    [SKIRTEINI]: 'island@island.is',
    [ANDLAT_OG_DANARBU]: 'vestfirdir.danarbu@syslumenn.is',
    [THINGLYSINGAR]: 'vestfirdir.thinglysing@syslumenn.is',
    [GJOLD_OG_INNHEIMTA]: 'vestfirdir.innheimta@syslumenn.is',
    [LOGGILDINGAR]: 'vestfirdir.leyfi@syslumenn.is',
    [VOTTORD]: 'island@island.is',
    [LOGRADAMAL]: 'vestfirdir.logradamal@syslumenn.is',
    [ONNUR_THJONUSTA_SYSLUMANNA]: 'vestfirdir@syslumenn.is',
    [LEYFI]: 'vestfirdir.leyfi@syslumenn.is',
    [FULLNUSTUGERDIR]: 'vestfirdir.fullnusta@syslumenn.is',
    [DEFAULT]: 'vestfirdir@syslumenn.is',
  },
}

export const getTemplate = (
  input: ServiceWebFormsInputWithInstitutionEmail,
): SendMailOptions => {
  const categoryId = input.category
  const syslumadurId = input.syslumadur
  const institutionEmail = input.institutionEmail

  let toAddress = institutionEmail

  if (syslumadurId) {
    const emailList = syslumennEmails[syslumadurId as Syslumenn]

    if (emailList) {
      toAddress =
        emailList[categoryId as Categories] ??
        emailList.default ??
        institutionEmail
    }
  }

  return {
    from: {
      name: input.name,
      address: environment.emailOptions.sendFrom!,
    },
    replyTo: {
      name: input.name,
      address: input.email,
    },
    to: [
      {
        name: 'Ísland.is aðstoð',
        address: toAddress,
      },
    ],
    subject: input.subject,
    text: input.message,
  }
}
