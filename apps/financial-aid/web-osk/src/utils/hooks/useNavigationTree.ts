export interface FormStepperSection {
  name: string
  type?: string
  url?: string
  children?: FormStepperSection[]
}

const useNavigationTree = (hasIncome: boolean) => {
  const section: FormStepperSection[] = [
    {
      name: 'Gagnaöflun',
      url: '/umsokn',
    },
    {
      name: 'Upplýsingar',
      url: '/umsokn/rettur',
    },
    {
      name: 'Persónuhagir',
      children: [
        {
          type: 'SUB_SECTION',
          name: 'Hjúskaparstaða',
          url: '/umsokn/hjuskaparstada',
        },
        { type: 'SUB_SECTION', name: 'Búseta', url: '/umsokn/buseta' },
        { type: 'SUB_SECTION', name: 'Nám', url: '/umsokn/nam' },
        { type: 'SUB_SECTION', name: 'Atvinna', url: '/umsokn/atvinna' },
      ],
    },
    {
      name: 'Fjármál',
      children: hasIncome
        ? [
            { type: 'SUB_SECTION', name: 'Tekjur', url: '/umsokn/tekjur' },
            {
              type: 'SUB_SECTION',
              name: 'Skattagögn',
              url: '/umsokn/skattagogn',
            },
            {
              type: 'SUB_SECTION',
              name: 'Persónuafsláttur',
              url: '/umsokn/personuafslattur',
            },
            {
              type: 'SUB_SECTION',
              name: 'Bankaupplýsingar',
              url: '/umsokn/bankaupplysingar',
            },
          ]
        : [
            { type: 'SUB_SECTION', name: 'Tekjur', url: '/umsokn/tekjur' },
            { type: 'SUB_SECTION', name: 'Gögn', url: '/umsokn/gogn' },
            {
              type: 'SUB_SECTION',
              name: 'Skattagögn',
              url: '/umsokn/skattagogn',
            },
            {
              type: 'SUB_SECTION',
              name: 'Persónuafsláttur',
              url: '/umsokn/personuafslattur',
            },
            {
              type: 'SUB_SECTION',
              name: 'Bankaupplýsingar',
              url: '/umsokn/bankaupplysingar',
            },
          ],
    },
    {
      name: 'Samskipti',
      url: '/umsokn/samskipti',
    },
    {
      name: 'Yfirlit',
      url: '/umsokn/yfirlit',
    },
    {
      name: 'Staðfesting',
      url: '/umsokn/stadfesting',
    },
  ]

  const spouseSection: FormStepperSection[] = [
    {
      name: 'Upplýsingar',
      url: '/umsokn/rettur',
    },
    {
      name: 'Fjármál',
      children: hasIncome
        ? [
            { type: 'SUB_SECTION', name: 'Tekjur', url: '/umsokn/tekjur' },
            {
              type: 'SUB_SECTION',
              name: 'Skattagögn',
              url: '/umsokn/skattagogn',
            },
          ]
        : [
            { type: 'SUB_SECTION', name: 'Tekjur', url: '/umsokn/tekjur' },
            { type: 'SUB_SECTION', name: 'Gögn', url: '/umsokn/gogn' },
            {
              type: 'SUB_SECTION',
              name: 'Skattagögn',
              url: '/umsokn/skattagogn',
            },
          ],
    },
    {
      name: 'Samskipti',
      url: '/umsokn/samskipti',
    },
    {
      name: 'Yfirlit',
      url: '/umsokn/yfirlit-maki',
    },
    {
      name: 'Staðfesting',
      url: '/umsokn/stadfesting',
    },
  ]

  return spouseSection
}

export default useNavigationTree
