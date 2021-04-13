import {
  RegulationMinistry,
  RegulationMinistryList,
  RegName,
  RegulationListItem,
  ISODate,
} from './Regulations.types'

export const allMinistries: RegulationMinistryList = [
  {
    name: 'Atvinnuvega- og nýsköpunarráðuneytið',
    slug: 'ANR',
    current: true,
  },
  { name: 'Dómsmálaráðuneytið', slug: 'DR', current: true },
  { name: 'Heilbrigðisráðuneytið', slug: 'HR', current: true },
  { name: 'Danmerkurmálaráðuneytið', slug: 'HVR', current: false },
  { name: 'Innanríkisráðuneyti', slug: 'IR', current: false },
]

const _getMinistry = (slug: string): RegulationMinistry =>
  allMinistries.find((m) => m.slug === slug) || allMinistries[0]

export const regulationsSearchResults: Array<RegulationListItem> = [
  {
    name: '0221/2001' as RegName,
    title: 'Reglugerð um bólusetningar á Íslandi.',
    ministry: _getMinistry('HR'),
    publishedDate: '2020-12-01' as ISODate,
  },
  {
    name: '1052/2020' as RegName,
    title:
      'Reglugerð um (3.) breytingu á reglugerð nr. 1364/2019 um endurgreiðslu kostnaðar vegna þjónustu sjálfstætt starfandi sjúkraþjálfara sem starfa án samnings við Sjúkratryggingar Íslands.',
    ministry: _getMinistry('HR'),
    publishedDate: '2020-12-01' as ISODate,
  },
  {
    name: '1051/2020' as RegName,
    title: 'Reglugerð um takmörkun á samkomum vegna farsóttar.',
    ministry: _getMinistry('HR'),
    publishedDate: '2020-12-01' as ISODate,
  },
  {
    name: '1050/2020' as RegName,
    title: 'Reglugerð um gjöld fyrir einkaleyfi, vörumerki, hönnun o.fl.',
    ministry: _getMinistry('ANR'),
    publishedDate: '2020-12-01' as ISODate,
  },
  {
    name: '1049/2020' as RegName,
    title:
      'Reglugerð um (8.) breytingu á reglugerð nr. 678/2009 um raforkuvirki.',
    ministry: _getMinistry('HR'),
    publishedDate: '2020-12-01' as ISODate,
  },
  {
    name: '1048/2020' as RegName,
    title: 'Reglugerð um breytingu á reglugerð um útlendinga, nr. 540/2017.',
    ministry: _getMinistry('DR'),
    publishedDate: '2020-12-01' as ISODate,
  },
  {
    name: '1029/2020' as RegName,
    title:
      'Reglugerð um (1.) breytingu á reglugerð nr. 871/2020, um heimildir hjúkrunarfræðinga og ljósmæðra til að ávísa lyfjum, um námskröfur og veitingu leyfa.',
    ministry: _getMinistry('HR'),
    publishedDate: '2020-12-01' as ISODate,
  },
  {
    name: '1016/2020' as RegName,
    title:
      'Reglugerð um (2.) breytingu á reglugerð nr. 958/2020, um takmörkun á skólastarfi vegna farsóttar.',
    ministry: _getMinistry('HR'),
    publishedDate: '2020-12-01' as ISODate,
  },
  {
    name: '1014/2020' as RegName,
    title:
      'Reglugerð um gildistöku framkvæmdarreglugerðar framkvæmdastjórnarinnar (ESB) 2020/466 um tímabundnar ráðstafanir til að halda í skefjum áhættu fyrir heilbrigði manna og dýra og plöntuheilbrigði og velferð dýra við tiltekna alvarlega röskun á eftirlitskerfum aðildarríkjanna vegna kórónaveirufaraldursins (COVID-19).',
    ministry: _getMinistry('ANR'),
    publishedDate: '2020-12-01' as ISODate,
  },
]
