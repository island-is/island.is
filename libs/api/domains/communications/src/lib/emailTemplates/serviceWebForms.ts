import { SendMailOptions } from 'nodemailer'
import { ServiceWebFormsInputWithInstitutionEmailAndConfig } from '../dto/serviceWebForms.input'
import { environment } from '../environments/environment'

type StringOrNull = string | null

enum SyslumennCategories {
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

  // Kaup á íbúðarhúsnæðum í Grindavík
  KAUP_A_IBUDARHUSNAEDUM_I_GRINDAVIK = '6Mykuc8BY9W5HiymxRHGsb',
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
  Record<SyslumennCategories, StringOrNull>
> = {
  [Syslumenn.VESTMANNAEYJAR]: {
    [SyslumennCategories.FJOLSKYLDUMAL]:
      'vestmannaeyjar.fjolskylda@syslumenn.is',
    [SyslumennCategories.SKIRTEINI]: 'island@island.is',
    [SyslumennCategories.ANDLAT_OG_DANARBU]:
      'vestmannaeyjar.danarbu@syslumenn.is',
    [SyslumennCategories.THINGLYSINGAR]:
      'vestmannaeyjar.thinglysing@syslumenn.is',
    [SyslumennCategories.GJOLD_OG_INNHEIMTA]:
      'vestmannaeyjar.innheimta@syslumenn.is',
    [SyslumennCategories.LOGGILDINGAR]: 'vestmannaeyjar@syslumenn.is',
    [SyslumennCategories.VOTTORD]: 'syslumenn@island.is',
    [SyslumennCategories.LOGRADAMAL]: 'vestmannaeyjar.logradamal@syslumenn.is',
    [SyslumennCategories.ONNUR_THJONUSTA_SYSLUMANNA]:
      'vestmannaeyjar@syslumenn.is',
    [SyslumennCategories.LEYFI]: 'vestmannaeyjar.leyfi@syslumenn.is',
    [SyslumennCategories.FULLNUSTUGERDIR]:
      'vestmannaeyjar.fullnusta@syslumenn.is',
    [SyslumennCategories.DEFAULT]: 'vestmannaeyjar@syslumenn.is',
    [SyslumennCategories.KAUP_A_IBUDARHUSNAEDUM_I_GRINDAVIK]:
      'ibudir@syslumenn.zendesk.com',
  },
  [Syslumenn.NORDURLANDI_EYSTRA]: {
    [SyslumennCategories.FJOLSKYLDUMAL]:
      'nordurlandeystra.fjolskylda@syslumenn.is',
    [SyslumennCategories.SKIRTEINI]: 'island@island.is',
    [SyslumennCategories.ANDLAT_OG_DANARBU]:
      'nordurlandeystra.danarbu@syslumenn.is',
    [SyslumennCategories.THINGLYSINGAR]:
      'nordurlandeystra.thinglysing@syslumenn.is',
    [SyslumennCategories.GJOLD_OG_INNHEIMTA]:
      'nordurlandeystra.innheimta@syslumenn.is',
    [SyslumennCategories.LOGGILDINGAR]: 'nordurlandeystra.leyfi@syslumenn.is',
    [SyslumennCategories.VOTTORD]: 'syslumenn@island.is',
    [SyslumennCategories.LOGRADAMAL]:
      'nordurlandeystra.logradamal@syslumenn.is',
    [SyslumennCategories.ONNUR_THJONUSTA_SYSLUMANNA]:
      'nordurlandeystra@syslumenn.is',
    [SyslumennCategories.LEYFI]: 'nordurlandeystra.leyfi@syslumenn.is',
    [SyslumennCategories.FULLNUSTUGERDIR]:
      'nordurlandeystra.fullnusta@syslumenn.is',
    [SyslumennCategories.DEFAULT]: 'nordurlandeystra@syslumenn.is',
    [SyslumennCategories.KAUP_A_IBUDARHUSNAEDUM_I_GRINDAVIK]:
      'ibudir@syslumenn.zendesk.com',
  },
  [Syslumenn.AUSTURLAND]: {
    [SyslumennCategories.FJOLSKYLDUMAL]: 'austurland.fjolskylda@syslumenn.is',
    [SyslumennCategories.SKIRTEINI]: 'island@island.is',
    [SyslumennCategories.ANDLAT_OG_DANARBU]: 'austurland.danarbu@syslumenn.is',
    [SyslumennCategories.THINGLYSINGAR]: 'austurland.thinglysing@syslumenn.is',
    [SyslumennCategories.GJOLD_OG_INNHEIMTA]:
      'austurland.innheimta@syslumenn.is',
    [SyslumennCategories.LOGGILDINGAR]: 'austurland.leyfi@syslumenn.is',
    [SyslumennCategories.VOTTORD]: 'syslumenn@island.is',
    [SyslumennCategories.LOGRADAMAL]: 'austurland.logradamal@syslumenn.is',
    [SyslumennCategories.ONNUR_THJONUSTA_SYSLUMANNA]: 'austurland@syslumenn.is',
    [SyslumennCategories.LEYFI]: 'austurland.leyfi@syslumenn.is',
    [SyslumennCategories.FULLNUSTUGERDIR]: 'austurland.fullnusta@syslumenn.is',
    [SyslumennCategories.DEFAULT]: 'austurland@syslumenn.is',
    [SyslumennCategories.KAUP_A_IBUDARHUSNAEDUM_I_GRINDAVIK]:
      'ibudir@syslumenn.zendesk.com',
  },
  [Syslumenn.VESTURLAND]: {
    [SyslumennCategories.FJOLSKYLDUMAL]: 'vesturland.fjolskylda@syslumenn.is',
    [SyslumennCategories.SKIRTEINI]: 'island@island.is',
    [SyslumennCategories.ANDLAT_OG_DANARBU]: 'vesturland.danarbu@syslumenn.is',
    [SyslumennCategories.THINGLYSINGAR]: 'vesturland.thinglysing@syslumenn.is',
    [SyslumennCategories.GJOLD_OG_INNHEIMTA]:
      'vesturland.innheimta@syslumenn.is',
    [SyslumennCategories.LOGGILDINGAR]: 'vesturland.leyfi@syslumenn.is',
    [SyslumennCategories.VOTTORD]: 'syslumenn@island.is',
    [SyslumennCategories.LOGRADAMAL]: 'vesturland.logradamal@syslumenn.is',
    [SyslumennCategories.ONNUR_THJONUSTA_SYSLUMANNA]: 'vesturland@syslumenn.is',
    [SyslumennCategories.LEYFI]: 'vesturland.leyfi@syslumenn.is',
    [SyslumennCategories.FULLNUSTUGERDIR]: 'vesturland.fullnusta@syslumenn.is',
    [SyslumennCategories.DEFAULT]: 'vesturland@syslumenn.is',
    [SyslumennCategories.KAUP_A_IBUDARHUSNAEDUM_I_GRINDAVIK]:
      'ibudir@syslumenn.zendesk.com',
  },
  [Syslumenn.HOFUDBORGARSVAEDID]: {
    [SyslumennCategories.FJOLSKYLDUMAL]: 'fjolskylda@syslumenn.is',
    [SyslumennCategories.SKIRTEINI]: 'island@island.is',
    [SyslumennCategories.ANDLAT_OG_DANARBU]: 'danarbu@syslumenn.is',
    [SyslumennCategories.THINGLYSINGAR]: 'thinglysing@syslumenn.is',
    [SyslumennCategories.GJOLD_OG_INNHEIMTA]: 'smh@syslumenn.is',
    [SyslumennCategories.LOGGILDINGAR]: 'leyfi@syslumenn.is',
    [SyslumennCategories.VOTTORD]: 'syslumenn@island.is',
    [SyslumennCategories.LOGRADAMAL]: 'fjolskylda@syslumenn.is',
    [SyslumennCategories.ONNUR_THJONUSTA_SYSLUMANNA]: 'smh@syslumenn.is',
    [SyslumennCategories.LEYFI]: 'leyfi@syslumenn.is',
    [SyslumennCategories.FULLNUSTUGERDIR]: 'fullnusta@syslumenn.is',
    [SyslumennCategories.DEFAULT]: 'smh@syslumenn.is',
    [SyslumennCategories.KAUP_A_IBUDARHUSNAEDUM_I_GRINDAVIK]:
      'ibudir@syslumenn.zendesk.com',
  },
  [Syslumenn.SUDURNES]: {
    [SyslumennCategories.FJOLSKYLDUMAL]: 'sudurnes.fjolskylda@syslumenn.is',
    [SyslumennCategories.SKIRTEINI]: 'island@island.is',
    [SyslumennCategories.ANDLAT_OG_DANARBU]: 'sudurnes.danarbu@syslumenn.is',
    [SyslumennCategories.THINGLYSINGAR]: 'sudurnes.thinglysing@syslumenn.is',
    [SyslumennCategories.GJOLD_OG_INNHEIMTA]: 'sudurnes.innheimta@syslumenn.is',
    [SyslumennCategories.LOGGILDINGAR]: 'sudurnes.leyfi@syslumenn.is',
    [SyslumennCategories.VOTTORD]: 'syslumenn@island.is',
    [SyslumennCategories.LOGRADAMAL]: 'sudurnes.logradamal@syslumenn.is',
    [SyslumennCategories.ONNUR_THJONUSTA_SYSLUMANNA]: 'sudurnes@syslumenn.is',
    [SyslumennCategories.LEYFI]: 'sudurnes.leyfi@syslumenn.is',
    [SyslumennCategories.FULLNUSTUGERDIR]: 'sudurnes.fullnusta@syslumenn.is',
    [SyslumennCategories.DEFAULT]: 'sudurnes@syslumenn.is',
    [SyslumennCategories.KAUP_A_IBUDARHUSNAEDUM_I_GRINDAVIK]:
      'ibudir@syslumenn.zendesk.com',
  },
  [Syslumenn.SUDURLAND]: {
    [SyslumennCategories.FJOLSKYLDUMAL]: 'sudurland.fjolskylda@syslumenn.is',
    [SyslumennCategories.SKIRTEINI]: 'island@island.is',
    [SyslumennCategories.ANDLAT_OG_DANARBU]: 'sudurland.danarbu@syslumenn.is',
    [SyslumennCategories.THINGLYSINGAR]: 'sudurland.thinglysing@syslumenn.is',
    [SyslumennCategories.GJOLD_OG_INNHEIMTA]: 'sudurland@syslumenn.is',
    [SyslumennCategories.LOGGILDINGAR]: 'sudurland.leyfi@syslumenn.is',
    [SyslumennCategories.VOTTORD]: 'syslumenn@island.is',
    [SyslumennCategories.LOGRADAMAL]: 'sudurland.logradamal@syslumenn.is',
    [SyslumennCategories.ONNUR_THJONUSTA_SYSLUMANNA]: 'sudurland@syslumenn.is',
    [SyslumennCategories.LEYFI]: 'sudurland.leyfi@syslumenn.is',
    [SyslumennCategories.FULLNUSTUGERDIR]: 'sudurland.fullnusta@syslumenn.is',
    [SyslumennCategories.DEFAULT]: 'sudurland@syslumenn.is',
    [SyslumennCategories.KAUP_A_IBUDARHUSNAEDUM_I_GRINDAVIK]:
      'ibudir@syslumenn.zendesk.com',
  },
  [Syslumenn.NORDURLAND_VESTRA]: {
    [SyslumennCategories.FJOLSKYLDUMAL]: 'nordurlandvestra@syslumenn.is',
    [SyslumennCategories.SKIRTEINI]: 'island@island.is',
    [SyslumennCategories.ANDLAT_OG_DANARBU]: 'nordurlandvestra@syslumenn.is',
    [SyslumennCategories.THINGLYSINGAR]: 'nordurlandvestra@syslumenn.is',
    [SyslumennCategories.GJOLD_OG_INNHEIMTA]: 'innheimta@syslumenn.is',
    [SyslumennCategories.LOGGILDINGAR]: 'nordurlandvestra@syslumenn.is',
    [SyslumennCategories.VOTTORD]: 'syslumenn@island.is',
    [SyslumennCategories.LOGRADAMAL]: 'nordurlandvestra@syslumenn.is',
    [SyslumennCategories.ONNUR_THJONUSTA_SYSLUMANNA]:
      'nordurlandvestra@syslumenn.is',
    [SyslumennCategories.LEYFI]: 'nordurlandvestra@syslumenn.is',
    [SyslumennCategories.FULLNUSTUGERDIR]: 'nordurlandvestra@syslumenn.is',
    [SyslumennCategories.DEFAULT]: 'nordurlandvestra@syslumenn.is',
    [SyslumennCategories.KAUP_A_IBUDARHUSNAEDUM_I_GRINDAVIK]:
      'ibudir@syslumenn.zendesk.com',
  },
  [Syslumenn.VESTFIRDIR]: {
    [SyslumennCategories.FJOLSKYLDUMAL]: 'vestfirdir.fjolskylda@syslumenn.is',
    [SyslumennCategories.SKIRTEINI]: 'island@island.is',
    [SyslumennCategories.ANDLAT_OG_DANARBU]: 'vestfirdir.danarbu@syslumenn.is',
    [SyslumennCategories.THINGLYSINGAR]: 'vestfirdir.thinglysing@syslumenn.is',
    [SyslumennCategories.GJOLD_OG_INNHEIMTA]:
      'vestfirdir.innheimta@syslumenn.is',
    [SyslumennCategories.LOGGILDINGAR]: 'vestfirdir.leyfi@syslumenn.is',
    [SyslumennCategories.VOTTORD]: 'syslumenn@island.is',
    [SyslumennCategories.LOGRADAMAL]: 'vestfirdir.logradamal@syslumenn.is',
    [SyslumennCategories.ONNUR_THJONUSTA_SYSLUMANNA]: 'vestfirdir@syslumenn.is',
    [SyslumennCategories.LEYFI]: 'vestfirdir.leyfi@syslumenn.is',
    [SyslumennCategories.FULLNUSTUGERDIR]: 'vestfirdir.fullnusta@syslumenn.is',
    [SyslumennCategories.DEFAULT]: 'vestfirdir@syslumenn.is',
    [SyslumennCategories.KAUP_A_IBUDARHUSNAEDUM_I_GRINDAVIK]:
      'ibudir@syslumenn.zendesk.com',
  },
}

const getEmailList = (
  input: ServiceWebFormsInputWithInstitutionEmailAndConfig,
): string | string[] => {
  const institutionEmail = input.institutionEmail
  const categoryId = input.category
  const syslumadurId = input.syslumadur

  let emailList: string | string[] = institutionEmail

  if (syslumadurId) {
    const syslumennEmailList = syslumennEmails[syslumadurId as Syslumenn]

    if (emailList) {
      emailList =
        syslumennEmailList[categoryId as SyslumennCategories] ??
        syslumennEmailList.default ??
        institutionEmail
    }
  }

  const emailListAccordingToConfig = input.config?.emails?.find(
    ({ supportCategoryId }) => supportCategoryId === categoryId,
  )?.emailList

  if (emailListAccordingToConfig) {
    emailList = emailListAccordingToConfig
  }

  return emailList
}

export const getTemplate = (
  input: ServiceWebFormsInputWithInstitutionEmailAndConfig,
): SendMailOptions => {
  const toName = 'Ísland.is aðstoð'
  const emailList = getEmailList(input)

  return {
    from: {
      name: input.name,
      address: environment.emailOptions.sendFrom!,
    },
    replyTo: {
      name: input.name,
      address: input.email,
    },
    to:
      typeof emailList === 'string'
        ? [
            {
              name: toName,
              address: emailList,
            },
          ]
        : emailList.map((address) => ({ name: toName, address })),
    subject: input.subject,
    text: input.message,
  }
}
