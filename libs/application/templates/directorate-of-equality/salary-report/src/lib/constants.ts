export type JobFactor = {
  type: string
  title: string
  description: string
  weight: string
}

export type PersonalFactor = {
  title: string
  description: string
  weight: string
}

export const DEFAULT_JOB_FACTORS: JobFactor[] = [
  {
    type: 'RESPONSIBILITY',
    title: 'Ábyrgð',
    description:
      'Metur ábyrgð starfsins á fólki, fjármálum, gæðum og öðrum þáttum.',
    weight: '25',
  },
  {
    type: 'STRAIN',
    title: 'Álag',
    description: 'Metur hraða, tímaþrýsting, líkamlegt og tilfinningalegt álag.',
    weight: '25',
  },
  {
    type: 'CONDITION',
    title: 'Vinnuaðstæður',
    description:
      'Metur vaktavinnu, ferðalög, áhættu og aðrar aðstæður starfsins.',
    weight: '25',
  },
  {
    type: 'COMPETENCE',
    title: 'Hæfni',
    description:
      'Metur menntunarkröfur, reynslukröfur og sérhæfingu starfsins.',
    weight: '25',
  },
]

export const DEFAULT_CRITERIA_ANSWERS = {
  jobFactors: DEFAULT_JOB_FACTORS,
  personalFactors: [] as PersonalFactor[],
}
