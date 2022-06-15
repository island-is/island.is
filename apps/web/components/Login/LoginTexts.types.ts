// ---------------------------------------------------------------------------

export type LoginPageTexts = Partial<
  Record<
    | 'gomluSidurTitle' // 'Eitthvað um gömlu mínar síður'
    | 'gomluSidurText' // 'Einhver texti um nýja útgáfu á minna síðna á ísland.is...'
    | 'gomluSidurLink' // 'Fara á gömlu mínar síður'
    | 'gomluSidurListTitle' // 'Á nýjum mínum síðum'
    | 'nyjuSidurTitle' // 'Ný útgáfa af mínum síðum á island.is'
    | 'nyjuSidurText' // 'Einhver texti um nýja útgáfu á minna síðna á ísland.is...'
    | 'nyjuSidurSubText' // 'Einhver texti um nýja útgáfu á minna síðna á ísland.is...'
    | 'nyjuSidurLink' // 'Fara á nýju mínar síður'
    | 'nyjuSidurTag' // 'Beta útgáfa'
    | 'nyjuSidurListTitle', // 'Á nýjum mínum síðum'
    string
  > & {
    nyjuSidurBullets: string[] // 'Bullets
    gomluSidurList: string[]
    nyjuSidurList: string[]
  }
>
