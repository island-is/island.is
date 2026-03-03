// School data lookup map - maps school ID to icon and website
export interface SchoolData {
  icon: string
  website: string
}

export const SCHOOL_DATA_MAP: Record<string, SchoolData> = {
  '82d70830-afb7-414c-aeb5-d4ef0fba7dce': {
    icon: 'SA.svg',
    website: 'https://www.island.is/framhaldsskolar',
  },
  '6fd818b0-d82b-4179-a7f0-dfaf2924a480': {
    icon: 'BHS.svg',
    website: 'https://www.bhs.is/',
  },
  '1b24abe1-55de-4310-a314-4c7abbfee45e': {
    icon: 'FISKT.svg',
    website: 'https://www.fiskt.is/',
  },
  '310908e0-06db-4c03-a7d8-ff1a2e24246c': {
    icon: 'FB.svg',
    website: 'https://www.fb.is/',
  },
  '919b0ded-7018-4b44-a4ff-8ab12cd1314e': {
    icon: 'FG.svg',
    website: 'https://www.fg.is/',
  },
  '8a79840b-ae00-447f-8161-653500fe1a6e': {
    icon: 'FA.svg',
    website: 'https://www.fa.is/',
  },
  '188f39e6-65f8-46d4-9288-72eaaa1159e0': {
    icon: 'FNV.svg',
    website: 'https://www.fnv.is/',
  },
  'e8da7c94-d3e6-4c15-b6b7-b864a2a922fb': {
    icon: 'FSN.svg',
    website: 'https://www.fsn.is/',
  },
  'e392a5cb-984d-42af-86c5-8be5193b72e0': {
    icon: 'FSu.svg',
    website: 'https://www.fsu.is/',
  },
  'c1785c80-99cd-4841-bb5d-ea41e984c115': {
    icon: 'FS.svg',
    website: 'https://www.fss.is/',
  },
  'd4519554-9461-4fcf-8f38-9283d1f32481': {
    icon: 'FVA.svg',
    website: 'https://fva.is/',
  },
  '985c3f7f-f534-4a5f-9935-f8a1578a5a75': {
    icon: 'FLB.svg',
    website: 'https://www.flensborg.is/',
  },
  '5012062f-36eb-4139-9ea4-cb3b1891942f': {
    icon: 'FSH.svg',
    website: 'https://www.fsh.is/',
  },
  '862ec59b-c41a-4847-bb1a-529b0c7dbea2': {
    icon: 'FL.svg',
    website: 'https://laugar.is/',
  },
  'e50da845-316b-4972-9910-f2b0094a0bde': {
    icon: 'FAS.svg',
    website:
      'https://www.stjornarradid.is/raduneyti/mennta-og-barnamalaraduneytid/',
  },
  'ba02cf2e-a259-4fd2-af8c-9c40f28240bf': {
    icon: 'FMOS.svg',
    website: 'https://www.fmos.is/',
  },
  '421cfdf2-d779-48fb-b56a-1d65b60372d3': {
    icon: 'FIV.svg',
    website: 'https://www.fiv.is/',
  },
  'e7e30c32-e500-41eb-bae8-0e89083fc332': {
    icon: 'KVSK.svg',
    website: 'https://www.kvenno.is/',
  },
  '0473b0cf-8f2f-49d0-b390-d72319a0d728': {
    icon: 'MIT.svg',
    website: 'https://menton.is/',
  },
  '0507f94a-522d-4e55-8889-7f321bab7afe': {
    icon: 'MA.svg',
    website: 'https://www.ma.is/',
  },
  '5f92d2db-e651-4d41-a4c1-83f204c8dc84': {
    icon: 'ML.svg',
    website: 'https://ml.is/',
  },
  '72d53238-e698-4549-acac-18b74b0833a9': {
    icon: 'ME.svg',
    website: 'https://www.me.is/',
  },
  '0163d325-3c47-42ca-85bf-2ce9af27983c': {
    icon: 'MI.svg',
    website: 'https://www.misa.is/',
  },
  'a755bd0d-ea6b-4762-a0f9-c873a7ae56b5': {
    icon: 'MTR.svg',
    website: 'https://www.mtr.is/',
  },
  '0e9a171a-cb1d-42e7-8d42-dc9069a5e337': {
    icon: 'MK.svg',
    website: 'https://www.mk.is/',
  },
  '52315eae-36ca-4348-91c5-9a22e1f6629e': {
    icon: 'MR.svg',
    website: 'https://mr.is/',
  },
  '32a63574-0f70-4b72-9c0c-96d918f02276': {
    icon: 'MH.svg',
    website: 'https://www.mh.is/',
  },
  'd8e20ecc-9bd6-4787-9118-143e3a817324': {
    icon: 'MS.svg',
    website: 'https://www.msund.is/',
  },
  '45c95db4-4661-4fab-9ad5-63ac5e18ceac': {
    icon: 'MÍR.svg',
    website: 'https://myndlistaskolinn.is/',
  },
  '4a493bfb-9ffb-4d95-833d-60869fdcf152': {
    icon: 'TS.svg',
    website: 'https://tskoli.is/',
  },
  'abec6558-2d1c-4bc5-8283-d7c056e41a7f': {
    icon: 'VA.svg',
    website: 'https://www.va.is/',
  },
  '7ae1a2de-10f5-4ea7-95e9-4150ac7884a9': {
    icon: 'VMA.svg',
    website: 'https://www.vma.is/',
  },
  'a26d10e3-f5e7-44e1-80b6-e17c9fce1e83': {
    icon: 'Verzlo.svg',
    website: 'https://www.verslo.is/',
  },
  'a936163e-2023-4a21-8a89-ddc4a7a9c5b0': {
    icon: 'MBR.svg', // TODO Change to actual logo, placeholder for now
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
