export interface ProfessionCategory {
  id: number
  title: string
}

export const mockProfessionCategories: ProfessionCategory[] = [
  { id: 1, title: 'Heilbrigðisstarfsemi' },
  { id: 2, title: 'Menntun' },
  { id: 3, title: 'Tækni og verkfræði' },
  { id: 4, title: 'Lögfræði' },
  { id: 5, title: 'Fjármál og bókhald' },
  { id: 6, title: 'Iðnaður og viðhald' },
  { id: 7, title: 'Samgöngur' },
  { id: 8, title: 'Upplýsingatækni' },
  { id: 9, title: 'Öryggisþjónusta' },
  { id: 10, title: 'Þýðingar og ritstörf' },
  { id: 11, title: 'Skrifstofustörf' },
  { id: 12, title: 'Þjónusta' },
  { id: 13, title: 'Listir og menning' },
  { id: 14, title: 'Landbúnaður' },
  { id: 15, title: 'Veitinga- og gististarfsemi' },
  { id: 16, title: 'Sala og markaðsmál' },
]

export const mockProfessionJobTitle: ProfessionCategory[] = [
  { id: 1, title: 'Læknir' },
  { id: 2, title: 'Kennari' },
  { id: 3, title: 'Forritari' },
  { id: 4, title: 'Lögfræðingur' },
  { id: 5, title: 'Fjármálari' },
  { id: 6, title: 'Málari' },
]

export const mockEducationLevels = [
  {
    label: 'Lauk ekki grunnskóla',
    value: 'no_basic_education',
  },
  {
    label: 'Grunnskólapróf',
    value: 'basic_education',
  },
  {
    label:
      'Hóf bóknám til stúdentspróf / Iðnnám eða starfsnám í framhaldsskóla en náminu er ólokið',
    value: 'secondary_education_unfinished',
  },
  {
    label: 'Hef lokið stúdentsprófi, iðnnámi, eða starfsnámi í framhaldsskóla',
    value: 'secondary_education_finished',
  },
  {
    label:
      'Hóf grunnám í háskóla (t.d. BA nám eða sambærilegt) en náminu er ólokið',
    value: 'higher_education_unfinished',
  },
  {
    label: 'Hef lokið grunnnámi í háskóla (t.d. BA námi eða sambærileg)',
    value: 'higher_education_finished',
  },
  {
    label: 'Hóf masters- eða doktorsnám í háskóla en náminu er ólokið',
    value: 'master_doctor_degree_unfinished',
  },
  {
    label: 'Hef lokið masters- eða doktorsnámi í háskóla',
    value: 'master_doctor_degree_finished',
  },
]
