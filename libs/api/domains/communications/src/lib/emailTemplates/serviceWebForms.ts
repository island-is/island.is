import { SendMailOptions } from 'nodemailer'
import { ServiceWebFormsInputWithInstitutionEmail } from '../dto/serviceWebForms.input'
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
  },
}

enum SjukratryggingarCategories {
  // Ferðakostnaður
  FERDAKOSTNADUR = '5IetjgJbs6lgS5umDC6k17',

  // Heilbrigðisstarfsfólk
  HEILBRIGDISSTARFSFOLK = '1gYJuVaNKXXi5FXAFrEsCt',

  // Heilbrigðisþjónusta
  HEILBRIGDISTHJONUSTA = '5Q5c7YkbkHB1SFRTede9xK',

  // Hjálpartæki og næring
  HJALPARTAEKI_OG_NAERING = '5FHpqHHcLFxUdhvQS64DZJ',

  // Lyf og lyfjakostnaður
  LYF_OG_LYFJAKOSTNADUR = '1CcMQO8dHqkayO1IZu29P5',

  // Réttindi milli landa
  RETTINDI_MILLI_LANDA = '47vHdWS9R5VsTXHg5DMeS1',

  // Sjúkradagpeningar
  SJUKRADAGPENINGAR = 'njVZaaPHKlxconopmbPCf',

  // Slys og sjúklingatrygging
  SLYS_OG_SJUKLINGATRYGGING = '6o9o2bgfY6hYc4K77nyN4v',

  // Tannlækningar
  TANNLAEKNINGAR = '5MvO1XYR3iGlYDOg3kgsHD',

  // Vefgáttir
  VEFGATTIR = '34ELo2Zt3A6ynYdgZx72m',

  // Þjálfun
  THJALFUN = '2SvNHpvfhViaUTLDMQt0ZI',

  // Önnur þjónusta Sjúkratrygginga
  ONNUR_THJONUSTA_SJUKRATRYGGINGA = 'vVBHhkPz8AF9BEzLJsoZo',

  // Hjálpartæki
  HJALPARTAEKI = 'hjalpartaeki',

  // Næring
  NAERING = 'naering',

  // Slysatrygging
  SLYSATRYGGING = 'slysatrygging',

  // Sjúklingatrygging
  SJUKLINGATRYGGING = 'sjuklingatrygging',

  // Hjúkrunarheimili
  HJUKRUNARHEIMILI = 'hjukrunarheimili',

  // Túlkaþjónusta
  TULKATHJONUSTA = 'tulkathjonusta',
}

enum DirectorateOfImmigrationCategories {
  // ALþjóðleg vernd
  INTERNATIONAL_PROTECTION = 'vURM4bLHZZefkRTFMMhkW',

  // Dvalarleyfiskort og ferðaskilríki
  RESIDENCE_PERMIT_CARDS_AND_TRAVEL_DOCUMENTS = '2Z8C7zKJPsAtsbjaClcCAg',

  // Dvalarleyfi - Almenn skilyrði
  RESIDENCE_PERMIT_GENERAL_CONDITIONS = '5HwuyKorz5r8xmk3UxLE1q',

  // Dvalarleyfi - Tegundir
  RESIDENCE_PERMIT_TYPES = '3Jrix29x8wFv5X0O7P0KsB',

  // Ferðalög og heimsóknir til Íslands
  TRAVEL_AND_VISITS_TO_ICELAND = '3jzNnjUIuZAIU2MCwzYi1Q',

  // Ríkisborgararéttur
  CITIZENSHIP = '2PdX8CTx3uiGFphBbbazzc',

  // Staða umsókna, beiðni um gögn og afgreiðslugjald
  APPLICATION_STATUS = '7s7yrJ8Nl1YmocagF93QB7',

  // Dvalarleyfi
  RESIDENCE_PERMIT = 'dvalarleyfi',

  // Aðstoð við sjálfviljuga heimför
  ASSISTED_VOLUNTARY_RETURN = 'adstod-vid-sjalfviljuga-heimfor',
}

const sjukratryggingarEmails = {
  [SjukratryggingarCategories.FERDAKOSTNADUR]: 'ferdakostnadur@sjukra.is',
  [SjukratryggingarCategories.HEILBRIGDISSTARFSFOLK]:
    'laeknareikningar@sjukra.is',
  [SjukratryggingarCategories.HEILBRIGDISTHJONUSTA]:
    'laeknareikningar@sjukra.is',
  [SjukratryggingarCategories.HJALPARTAEKI_OG_NAERING]: 'hjalpart@sjukra.is',
  [SjukratryggingarCategories.HJALPARTAEKI]: 'hjalpart@sjukra.is',
  [SjukratryggingarCategories.NAERING]: 'naering@sjukra.is',
  [SjukratryggingarCategories.LYF_OG_LYFJAKOSTNADUR]: 'lyf@sjukra.is',
  [SjukratryggingarCategories.RETTINDI_MILLI_LANDA]: 'international@sjukra.is',
  [SjukratryggingarCategories.SJUKRADAGPENINGAR]: 'dagpeningar@sjukra.is',
  [SjukratryggingarCategories.SLYS_OG_SJUKLINGATRYGGING]: 'slys@sjukra.is',
  [SjukratryggingarCategories.SLYSATRYGGING]: 'slys@sjukra.is',
  [SjukratryggingarCategories.SJUKLINGATRYGGING]: 'sjuklingatrygging@sjukra.is',
  [SjukratryggingarCategories.TANNLAEKNINGAR]: 'tannmal@sjukra.is',
  [SjukratryggingarCategories.VEFGATTIR]: 'sjukra@sjukra.is',
  [SjukratryggingarCategories.THJALFUN]: 'thjalfunarmal@sjukra.is',
  [SjukratryggingarCategories.ONNUR_THJONUSTA_SJUKRATRYGGINGA]:
    'sjukra@sjukra.is',
  [SjukratryggingarCategories.HJUKRUNARHEIMILI]: 'hjukrunarheimili@sjukra.is',
  [SjukratryggingarCategories.TULKATHJONUSTA]: 'laeknareikningar@sjukra.is',
}

const directorateOfImmigrationEmails = {
  [DirectorateOfImmigrationCategories.TRAVEL_AND_VISITS_TO_ICELAND]:
    'aritanir@utl.is',
  [DirectorateOfImmigrationCategories.CITIZENSHIP]: 'rikisborgararettur@utl.is',
  [DirectorateOfImmigrationCategories.ASSISTED_VOLUNTARY_RETURN]:
    'return@utl.is',
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
        emailList[categoryId as SyslumennCategories] ??
        emailList.default ??
        institutionEmail
    }
  } else if (
    input.institutionSlug === 'sjukratryggingar' ||
    input.institutionSlug === 'icelandic-health-insurance'
  ) {
    toAddress =
      sjukratryggingarEmails[categoryId as SjukratryggingarCategories] ??
      institutionEmail
  } else if (
    input.institutionSlug === 'utlendingastofnun' ||
    input.institutionSlug === 'directorate-of-immigration'
  ) {
    toAddress =
      directorateOfImmigrationEmails[
        categoryId as keyof typeof directorateOfImmigrationEmails
      ] ?? institutionEmail
  }

  const name = 'Ísland.is aðstoð'

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
        name,
        address: toAddress,
      },
    ],
    subject: input.subject,
    text: input.message,
  }
}
