export type Process = {
  state: State
}

export type State = {
  code: string
  title: string
  date?: Date
  icon?: 'attention' | 'checkmark' | 'error'
}

type Cases = {
  texts?: {
    intro?: string
    footnote?: string
  }
  actions?: {
    type: 'file' | 'url' | 'inbox'
    title: string
    data?: string // þarf þetta að vera e-ð annað?
  }[]
  data: {
    id: number
    process: Process[]
  }
  type: string // todo: decide if from enum or text from service
  status: string // todo: decide if from enum or text from service
  caseNumber?: string // todo: can this be null?
  description?: string
  detail: {
    LOKECaseNumber: string
    court: string
    prosecutor: string
    judge: string
    requestedDateTime: Date
    prosecution: string
    arrestDateTime: Date
    hearingDateTime: Date
    fineprint?: string
  }
  defendant: {
    name: string
    nationalId: number
    address: string // todo: does this need to be seperate or postcode, city, address in one line?
    email: string
    phone: number
    subpoenaDateTime: Date
  }
  defenseAttorney: {
    id: number
    name: string
    email: string
    phone: number
  }[]
}

export const listCases = () => {
  const cases: Cases[] = [
    {
      data: {
        id: 123,
        process: [
          {
            state: {
              code: '1',
              title: 'Sent',
              date: new Date(),
            },
          },
          {
            state: {
              code: '2',
              title: 'Á dagskrá',
              date: new Date(),
            },
          },
          {
            state: {
              code: '3',
              title: 'Samþykkt',
              icon: 'checkmark',
            },
          },
          {
            state: {
              code: '4',
              title: 'Virkt',
            },
          },
          {
            state: {
              code: '5',
              title: 'Lokið',
            },
          },
        ],
      },
      type: 'Ákæra',
      status: 'Á dagskrá',
      caseNumber: 'Málsnúmer S-9999/2022',
      description: '???',
      detail: {
        LOKECaseNumber: '123-2022-123',
        court: 'Héraðsdómur Suðurlands',
        judge: 'Ragnar Tómas Jóhannesarson',
        prosecutor: 'Anna Sigfríður Hannesardóttir',
        prosecution: 'Lögreglustjórinn á Suðurlandi',
        arrestDateTime: new Date(2018, 2, 23, 3, 23, 22, 22),
        hearingDateTime: new Date(2022, 2, 30, 1, 23, 22, 22),
        requestedDateTime: new Date(2020, 2, 30, 1, 23, 22, 22),
      },
      defendant: {
        nationalId: 1212902230,
        name: 'Arnar Jónsson',
        email: 'nonninuttari@nutnut.is',
        address: 'Lagarfell 23, 700 Egilsstaðir',
        phone: 7776655,
        subpoenaDateTime: new Date(2019, 2, 23, 3, 23, 22, 22),
      },
      defenseAttorney: [
        {
          id: 123958437234,
          name: 'Halldór Halldórsson',
          email: 'dorijudge@judgari.is',
          phone: 8769988,
        },
      ],
    },
    {
      texts: {
        footnote:
          'Lorem ipsum dolor sit amet consectetur. Integer feugiat iaculis ac odio blandit proin feugiat. Vitae eu mattis in elit sapien netus. A ut risus elementum urna egestas laoreet. Gravida velit platea metus ultrices purus viverra.',
      },
      data: {
        id: 124,
        process: [
          {
            state: {
              code: '1',
              title: 'Sent',
              date: new Date(),
            },
          },
          {
            state: {
              code: '2',
              title: 'Á dagskrá',
              date: new Date(),
            },
          },
          {
            state: {
              code: '3',
              title: 'Samþykkt',
              icon: 'checkmark',
              date: new Date(),
            },
          },
          {
            state: {
              code: '4',
              title: 'Virkt',
            },
          },
          {
            state: {
              code: '5',
              title: 'Lokið',
            },
          },
        ],
      },
      type: 'Ákæra',
      status: 'Á dagskrá',
      description: '???',
      detail: {
        LOKECaseNumber: '123-2022-123',
        court: 'Héraðsdómur Suðurlands',
        judge: 'Ragnar Tómas Jóhannesarson',
        prosecutor: 'Anna Sigfríður Hannesardóttir',
        prosecution: 'Lögreglustjórinn á Suðurlandi',
        arrestDateTime: new Date(2018, 2, 23, 3, 23, 22, 22),
        hearingDateTime: new Date(2022, 2, 30, 1, 23, 22, 22),
        requestedDateTime: new Date(2020, 2, 30, 1, 23, 22, 22),
      },
      defendant: {
        nationalId: 1212902230,
        name: 'Arnar Jónsson',
        email: 'nonninuttari@nutnut.is',
        address: 'Lagarfell 23, 700 Egilsstaðir',
        phone: 7776655,
        subpoenaDateTime: new Date(2019, 2, 23, 3, 23, 22, 22),
      },
      defenseAttorney: [
        {
          id: 123958437234,
          name: 'Halldór Halldórsson',
          email: 'dorijudge@judgari.is',
          phone: 8769988,
        },
        {
          id: 123958412334,
          name: 'Halldóra Halla Halldórsdóttir',
          email: 'dorajudge@judgari.is',
          phone: 8769338,
        },
      ],
    },
  ]

  return cases
}

export const getCase = (id: number) => {
  const cases = listCases()

  const detailedCase = cases.find((x) => x.data.id === id) ?? null

  const courtCaseDetail = {
    courtCaseDetail: detailedCase,
  }
  return { data: courtCaseDetail, loading: false, error: false }
}
