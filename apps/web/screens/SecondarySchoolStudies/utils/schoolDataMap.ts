// School data lookup map - maps school ID to icon and website
export interface SchoolData {
  icon: string
  website: string
}

// Website belong on contentful ?
export const SCHOOL_DATA_MAP: Record<string, SchoolData> = {
  SA: {
    icon: 'SA.svg',
    website: 'https://www.island.is/framhaldsskolar',
  },
  BHS: {
    icon: 'BHS.svg',
    website: 'https://www.bhs.is/',
  },
  FISKT: {
    icon: 'FISKT.svg',
    website: 'https://www.fiskt.is/',
  },
  FB: {
    icon: 'FB.svg',
    website: 'https://www.fb.is/',
  },
  FG: {
    icon: 'FG.svg',
    website: 'https://www.fg.is/',
  },
  FÁ: {
    icon: 'FA.svg',
    website: 'https://www.fa.is/',
  },
  FNV: {
    icon: 'FNV.svg',
    website: 'https://www.fnv.is/',
  },
  FSN: {
    icon: 'FSN.svg',
    website: 'https://www.fsn.is/',
  },
  FSu: {
    icon: 'FSu.svg',
    website: 'https://www.fsu.is/',
  },
  FS: {
    icon: 'FS.svg',
    website: 'https://www.fss.is/',
  },
  FVA: {
    icon: 'FVA.svg',
    website: 'https://fva.is/',
  },
  FLB: {
    icon: 'FLB.svg',
    website: 'https://www.flensborg.is/',
  },
  FSH: {
    icon: 'FSH.svg',
    website: 'https://www.fsh.is/',
  },
  FL: {
    icon: 'FL.svg',
    website: 'https://laugar.is/',
  },
  FAS: {
    icon: 'FAS.svg',
    website:
      'https://www.stjornarradid.is/raduneyti/mennta-og-barnamalaraduneytid/',
  },
  FMOS: {
    icon: 'FMOS.svg',
    website: 'https://www.fmos.is/',
  },
  FÍV: {
    icon: 'FIV.svg',
    website: 'https://www.fiv.is/',
  },
  KVSK: {
    icon: 'KVSK.svg',
    website: 'https://www.kvenno.is/',
  },
  MÍT: {
    icon: 'MIT.svg',
    website: 'https://menton.is/',
  },
  MA: {
    icon: 'MA.svg',
    website: 'https://www.ma.is/',
  },
  ML: {
    icon: 'ML.svg',
    website: 'https://ml.is/',
  },
  ME: {
    icon: 'ME.svg',
    website: 'https://www.me.is/',
  },
  MÍ: {
    icon: 'MI.svg',
    website: 'https://www.misa.is/',
  },
  MTR: {
    icon: 'MTR.svg',
    website: 'https://www.mtr.is/',
  },
  MK: {
    icon: 'MK.svg',
    website: 'https://www.mk.is/',
  },
  MR: {
    icon: 'MR.svg',
    website: 'https://mr.is/',
  },
  MH: {
    icon: 'MH.svg',
    website: 'https://www.mh.is/',
  },
  MS: {
    icon: 'MS.svg',
    website: 'https://www.msund.is/',
  },
  MÍR: {
    icon: 'MÍR.svg',
    website: 'https://myndlistaskolinn.is/',
  },
  TS: {
    icon: 'TS.svg',
    website: 'https://tskoli.is/',
  },
  VA: {
    icon: 'VA.svg',
    website: 'https://www.va.is/',
  },
  VMA: {
    icon: 'VMA.svg',
    website: 'https://www.vma.is/',
  },
  Verzló: {
    icon: 'Verzlo.svg',
    website: 'https://www.verslo.is/',
  },
  MB: {
    icon: 'MB.svg', // TODO Change to actual logo, placeholder for now
    website: 'https://menntaborg.is/',
  },
}

export const DEFAULT_SCHOOL_DATA: SchoolData = {
  icon: 'MBR.svg',
  website:
    'https://www.stjornarradid.is/raduneyti/mennta-og-barnamalaraduneytid/',
}

export const getSchoolData = (schoolId?: string | null): SchoolData => {
  if (!schoolId || !SCHOOL_DATA_MAP[schoolId]) {
    return DEFAULT_SCHOOL_DATA
  }
  return SCHOOL_DATA_MAP[schoolId]
}
