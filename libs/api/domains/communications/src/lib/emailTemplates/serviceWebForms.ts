import { SendMailOptions } from 'nodemailer'
import { ServiceWebFormsInputWithInstitutionEmail } from '../dto/serviceWebForms.input'
import { environment } from '../environments/environment'

type StringOrNull = string | null

enum Categories {
  // Fjölskyldumál
  FJOLSKYLDUMAL = '4vQ4htPOAZvzcXBcjx06SH',

  // Skírteini
  SKIRTEINI = '7nWhQCER920RakQ7BZpEmV',

  // Andlát og dánarbú
  ANDLAT_OG_DANARBU = '2TkJynZlamqTHdjUziXDG0',

  // Þinglýsingar, staðfestingar og skráningar
  THINGLYSINGAR = '6K9stHLAB2mEyGqtqjnXxf',

  // Gjöld og innheimta
  GJOLD_OG_INNHEIMTA = '5u2M09Kw3p1Spva1GSuAzB',

  // Löggildingar
  LOGGILDINGAR = 'WrQIftmx61sHJMoIr1QRW',

  // Vottorð
  VOTTORD = '76Expbwtudon1Gz5lrKOit',

  // Lögráðamál
  LOGRADAMAL = '4tvRkPgKP3kerbyRJDvaWF',

  // Önnur þjónusta sýslumanna
  ONNUR_THJONUSTA_SYSLUMANNA = '4LNbNB3GvH3RcoIGpuZKhG',

  // Leyfi
  LEYFI = '7HbSNTUHJReJ2GPeT1ni1C',

  // Fullnustugerðir
  FULLNUSTUGERDIR = '7LkzuYSzqwM7k8fJyeRbm6',

  // Default/fallback email address
  DEFAULT = 'default',
}

enum Syslumenn {
  VESTMANNAEYJAR = '145ctmpqLPrOM7rHZIpC6F',
  NORDURLANDI_EYSTRA = '12JLsyDmODBfZedYPOQXtX',
  AUSTURLAND = 'Xnes7x1ccvBvuZxInRXDm',
  VESTURLAND = '43KqapFNoM9m4MNXXc8UPU',
  HOFUDBORGARSVAEDID = '6puIJvhGxFBzxExVHxi5sr',
  SUDURNES = 'cRCuTTXXSrpBj27nBiLbc',
  SUDURLAND = '2uyNnLcRooCNk7u6CMpsIv',
  NORDURLAND_VESTRA = 'ZefqpCw4y5oy9lREilQY3',
  VESTFIRDIR = '5MDZoq1DGsJospUnQz4y98',
}

export const syslumennEmails: Record<
  Syslumenn,
  Record<Categories, StringOrNull>
> = {
  [Syslumenn.VESTMANNAEYJAR]: {
    [Categories.FJOLSKYLDUMAL]: 'vestmannaeyjar.fjolskylda@syslumenn.is',
    [Categories.SKIRTEINI]: 'island@island.is',
    [Categories.ANDLAT_OG_DANARBU]: 'vestmannaeyjar.danarbu@syslumenn.is',
    [Categories.THINGLYSINGAR]: 'vestmannaeyjar.thinglysing@syslumenn.is',
    [Categories.GJOLD_OG_INNHEIMTA]: 'vestmannaeyjar.innheimta@syslumenn.is',
    [Categories.LOGGILDINGAR]: 'vestmannaeyjar@syslumenn.is',
    [Categories.VOTTORD]: 'island@island.is',
    [Categories.LOGRADAMAL]: 'vestmannaeyjar.logradamal@syslumenn.is',
    [Categories.ONNUR_THJONUSTA_SYSLUMANNA]: 'vestmannaeyjar@syslumenn.is',
    [Categories.LEYFI]: 'vestmannaeyjar.leyfi@syslumenn.is',
    [Categories.FULLNUSTUGERDIR]: 'vestmannaeyjar.fullnusta@syslumenn.is',
    [Categories.DEFAULT]: 'vestmannaeyjar@syslumenn.is',
  },
  [Syslumenn.NORDURLANDI_EYSTRA]: {
    [Categories.FJOLSKYLDUMAL]: 'nordurlandeystra.fjolskylda@syslumenn.is',
    [Categories.SKIRTEINI]: 'island@island.is',
    [Categories.ANDLAT_OG_DANARBU]: 'nordurlandeystra.danarbu@syslumenn.is',
    [Categories.THINGLYSINGAR]: 'nordurlandeystra.thinglysing@syslumenn.is',
    [Categories.GJOLD_OG_INNHEIMTA]: 'nordurlandeystra.innheimta@syslumenn.is',
    [Categories.LOGGILDINGAR]: 'nordurlandeystra.leyfi@syslumenn.is',
    [Categories.VOTTORD]: 'island@island.is',
    [Categories.LOGRADAMAL]: 'nordurlandeystra.logradamal@syslumenn.is',
    [Categories.ONNUR_THJONUSTA_SYSLUMANNA]: 'nordurlandeystra@syslumenn.is',
    [Categories.LEYFI]: 'nordurlandeystra.leyfi@syslumenn.is',
    [Categories.FULLNUSTUGERDIR]: 'nordurlandeystra.fullnusta@syslumenn.is',
    [Categories.DEFAULT]: 'nordurlandeystra@syslumenn.is',
  },
  [Syslumenn.AUSTURLAND]: {
    [Categories.FJOLSKYLDUMAL]: 'austurland.fjolskylda@syslumenn.is',
    [Categories.SKIRTEINI]: 'island@island.is',
    [Categories.ANDLAT_OG_DANARBU]: 'austurland.danarbu@syslumenn.is',
    [Categories.THINGLYSINGAR]: 'austurland.thinglysing@syslumenn.is',
    [Categories.GJOLD_OG_INNHEIMTA]: 'austurland.innheimta@syslumenn.is',
    [Categories.LOGGILDINGAR]: 'austurland.leyfi@syslumenn.is',
    [Categories.VOTTORD]: 'island@island.is',
    [Categories.LOGRADAMAL]: 'austurland.logradamal@syslumenn.is',
    [Categories.ONNUR_THJONUSTA_SYSLUMANNA]: 'austurland@syslumenn.is',
    [Categories.LEYFI]: 'austurland.leyfi@syslumenn.is',
    [Categories.FULLNUSTUGERDIR]: 'austurland.fullnusta@syslumenn.is',
    [Categories.DEFAULT]: 'austurland@syslumenn.is',
  },
  [Syslumenn.VESTURLAND]: {
    [Categories.FJOLSKYLDUMAL]: 'vesturland.fjolskylda@syslumenn.is',
    [Categories.SKIRTEINI]: 'island@island.is',
    [Categories.ANDLAT_OG_DANARBU]: 'vesturland.danarbu@syslumenn.is',
    [Categories.THINGLYSINGAR]: 'vesturland.thinglysing@syslumenn.is',
    [Categories.GJOLD_OG_INNHEIMTA]: 'vesturland.innheimta@syslumenn.is',
    [Categories.LOGGILDINGAR]: 'vesturland.leyfi@syslumenn.is',
    [Categories.VOTTORD]: 'island@island.is',
    [Categories.LOGRADAMAL]: 'vesturland.logradamal@syslumenn.is',
    [Categories.ONNUR_THJONUSTA_SYSLUMANNA]: 'vesturland@syslumenn.is',
    [Categories.LEYFI]: 'vesturland.leyfi@syslumenn.is',
    [Categories.FULLNUSTUGERDIR]: 'vesturland.fullnusta@syslumenn.is',
    [Categories.DEFAULT]: 'vesturland@syslumenn.is',
  },
  [Syslumenn.HOFUDBORGARSVAEDID]: {
    [Categories.FJOLSKYLDUMAL]: 'fjolskylda@syslumenn.is',
    [Categories.SKIRTEINI]: 'island@island.is',
    [Categories.ANDLAT_OG_DANARBU]: 'danarbu@syslumenn.is',
    [Categories.THINGLYSINGAR]: 'thinglysing@syslumenn.is',
    [Categories.GJOLD_OG_INNHEIMTA]: 'smh@syslumenn.is',
    [Categories.LOGGILDINGAR]: 'leyfi@syslumenn.is',
    [Categories.VOTTORD]: 'island@island.is',
    [Categories.LOGRADAMAL]: 'fjolskylda@syslumenn.is',
    [Categories.ONNUR_THJONUSTA_SYSLUMANNA]: 'smh@syslumenn.is',
    [Categories.LEYFI]: 'leyfi@syslumenn.is',
    [Categories.FULLNUSTUGERDIR]: 'fullnusta@syslumenn.is',
    [Categories.DEFAULT]: 'smh@syslumenn.is',
  },
  [Syslumenn.SUDURNES]: {
    [Categories.FJOLSKYLDUMAL]: 'sudurnes.fjolskylda@syslumenn.is',
    [Categories.SKIRTEINI]: 'island@island.is',
    [Categories.ANDLAT_OG_DANARBU]: 'sudurnes.danarbu@syslumenn.is',
    [Categories.THINGLYSINGAR]: 'sudurnes.thinglysing@syslumenn.is',
    [Categories.GJOLD_OG_INNHEIMTA]: 'sudurnes.innheimta@syslumenn.is',
    [Categories.LOGGILDINGAR]: 'sudurnes.leyfi@syslumenn.is',
    [Categories.VOTTORD]: 'island@island.is',
    [Categories.LOGRADAMAL]: 'sudurnes.logradamal@syslumenn.is',
    [Categories.ONNUR_THJONUSTA_SYSLUMANNA]: 'sudurnes@syslumenn.is',
    [Categories.LEYFI]: 'sudurnes.leyfi@syslumenn.is',
    [Categories.FULLNUSTUGERDIR]: 'sudurnes.fullnusta@syslumenn.is',
    [Categories.DEFAULT]: 'sudurnes@syslumenn.is',
  },
  [Syslumenn.SUDURLAND]: {
    [Categories.FJOLSKYLDUMAL]: 'sudurland.fjolskylda@syslumenn.is',
    [Categories.SKIRTEINI]: 'island@island.is',
    [Categories.ANDLAT_OG_DANARBU]: 'sudurland.danarbu@syslumenn.is',
    [Categories.THINGLYSINGAR]: 'sudurland.thinglysing@syslumenn.is',
    [Categories.GJOLD_OG_INNHEIMTA]: 'sudurland@syslumenn.is',
    [Categories.LOGGILDINGAR]: 'sudurland.leyfi@syslumenn.is',
    [Categories.VOTTORD]: 'island@island.is',
    [Categories.LOGRADAMAL]: 'sudurland.logradamal@syslumenn.is',
    [Categories.ONNUR_THJONUSTA_SYSLUMANNA]: 'sudurland@syslumenn.is',
    [Categories.LEYFI]: 'sudurland.leyfi@syslumenn.is',
    [Categories.FULLNUSTUGERDIR]: 'sudurland.fullnusta@syslumenn.is',
    [Categories.DEFAULT]: 'sudurland@syslumenn.is',
  },
  [Syslumenn.NORDURLAND_VESTRA]: {
    [Categories.FJOLSKYLDUMAL]: 'nordurlandvestra@syslumenn.is',
    [Categories.SKIRTEINI]: 'island@island.is',
    [Categories.ANDLAT_OG_DANARBU]: 'nordurlandvestra@syslumenn.is',
    [Categories.THINGLYSINGAR]: 'nordurlandvestra@syslumenn.is',
    [Categories.GJOLD_OG_INNHEIMTA]: 'innheimta@syslumenn.is',
    [Categories.LOGGILDINGAR]: 'nordurlandvestra@syslumenn.is',
    [Categories.VOTTORD]: 'island@island.is',
    [Categories.LOGRADAMAL]: 'nordurlandvestra@syslumenn.is',
    [Categories.ONNUR_THJONUSTA_SYSLUMANNA]: 'nordurlandvestra@syslumenn.is',
    [Categories.LEYFI]: 'nordurlandvestra@syslumenn.is',
    [Categories.FULLNUSTUGERDIR]: 'nordurlandvestra@syslumenn.is',
    [Categories.DEFAULT]: 'nordurlandvestra@syslumenn.is',
  },
  [Syslumenn.VESTFIRDIR]: {
    [Categories.FJOLSKYLDUMAL]: 'vestfirdir.fjolskylda@syslumenn.is',
    [Categories.SKIRTEINI]: 'island@island.is',
    [Categories.ANDLAT_OG_DANARBU]: 'vestfirdir.danarbu@syslumenn.is',
    [Categories.THINGLYSINGAR]: 'vestfirdir.thinglysing@syslumenn.is',
    [Categories.GJOLD_OG_INNHEIMTA]: 'vestfirdir.innheimta@syslumenn.is',
    [Categories.LOGGILDINGAR]: 'vestfirdir.leyfi@syslumenn.is',
    [Categories.VOTTORD]: 'island@island.is',
    [Categories.LOGRADAMAL]: 'vestfirdir.logradamal@syslumenn.is',
    [Categories.ONNUR_THJONUSTA_SYSLUMANNA]: 'vestfirdir@syslumenn.is',
    [Categories.LEYFI]: 'vestfirdir.leyfi@syslumenn.is',
    [Categories.FULLNUSTUGERDIR]: 'vestfirdir.fullnusta@syslumenn.is',
    [Categories.DEFAULT]: 'vestfirdir@syslumenn.is',
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
