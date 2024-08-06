/* eslint-disable local-rules/disallow-kennitalas */
import { LawAndOrderPaths } from '../lib/paths'

export type Process = {
  state: State
}

export type State = {
  code: string
  title: string
  date?: Date
  icon?: 'attention' | 'checkmark' | 'error'
}

export type Items = {
  label: string
  value?: string
  link?: string
  action?: {
    label: string
    url: string
    type?: string
  }
}

export type Actions = {
  type: 'file' | 'url' | 'inbox'
  title: string
  data?: string
}

export type Lawyers = {
  name: string
  nationalId: string
  practice: string
}

type Cases = {
  texts?: {
    intro?: string
    footnote?: string
  }
  actions?: Actions[]
  data: {
    id: number
    caseNumber: string
    caseNumberTitle: string
    acknowledged?: boolean
    type: string
    status: string
    groups: {
      label: string
      items: Items[]
    }[]
  }
}

export type Subpoena = {
  texts?: {
    intro?: string
    confirmation?: string
    description?: string
    claim?: string
  }
  actions?: Actions[]
  data: {
    id: number
    acknowledged?: boolean
    chosenDefender?: string // ef null = birta lista ef ekki, birta breyta
    groups: {
      label: string
      items: Items[]
    }[]
  }
}

export const listCases = () => {
  const cases: Cases[] = [
    {
      actions: [
        {
          title: 'Hlaða niður ákæru',
          type: 'file',
          data: '123',
        },
      ],
      data: {
        id: 123,
        caseNumber: 'S-0000',
        caseNumberTitle: 'Málsnúmer S-0000/2022',
        type: 'Ákæra',
        status: 'Á dagskrá',
        acknowledged: undefined,
        groups: [
          {
            label: 'Varnaraðili',
            items: [
              {
                label: 'Nafn',
                value: 'Lísa Jónsdóttir',
              },
              {
                label: 'Kennitala',
                value: '010203-6789',
              },
              {
                label: 'Lögheimili',
                value: 'Hagamelur 92, 107 Reykjavík',
              },
              {
                label: 'Fyrirkall sent',
                value: '6.maí 2022',
                action: {
                  label: 'Sjá fyrirkall',
                  url: LawAndOrderPaths.SubpoenaDetail.replace(':id', '123'),
                  type: 'popup',
                },
              },
            ],
          },
          {
            label: 'Verjandi',
            items: [
              {
                label: 'Nafn',
                value: 'Andri Valur Ívarsson',
              },
              {
                label: 'Netfang',
                value: 'andri.ivar@fyrirtaeki.is',
                link: 'mailto:',
              },
              {
                label: 'Símanúmer',
                value: '555 4789',
                link: 'tel:',
              },
            ],
          },
          {
            label: 'Málsupplýsingar',
            items: [
              {
                label: 'Tegund',
                value: 'Ákæra',
              },
              {
                label: 'Málsnúmer héraðsdóms',
                value: 'S-999/2022',
              },
              {
                label: 'Dómstóll',
                value: 'Héraðsdómur Reykjavíkur',
              },
              {
                label: 'Dómari',
                value: 'Judge Dredd',
              },
              {
                label: 'Embætti',
                value: 'Lögreglustjórinn á höfuðborgarsvæðinu',
              },
              {
                label: 'Ákærandi',
                value: 'Katrín Ólöf Einarsdóttir',
              },
            ],
          },
        ],
      },
    },
    {
      actions: [
        {
          title: 'Hlaða niður ákæru',
          type: 'file',
          data: '123',
        },
      ],
      data: {
        id: 1234,
        caseNumber: 'S-1111',
        caseNumberTitle: 'Málsnúmer S-1111/2022',
        type: 'Ákæra',
        status: 'Á dagskrá',
        acknowledged: true,
        groups: [
          {
            label: 'Varnaraðili',
            items: [
              {
                label: 'Nafn',
                value: 'Lísa Jónsdóttir',
              },
              {
                label: 'Kennitala',
                value: '010203-6789',
              },
              {
                label: 'Lögheimili',
                value: 'Hagamelur 92, 107 Reykjavík',
              },
              {
                label: 'Fyrirkall sent',
                value: '6.maí 2022',
                action: {
                  label: 'Sjá fyrirkall',
                  url: LawAndOrderPaths.SubpoenaDetail.replace(':id', '123'),
                  type: 'popup',
                },
              },
            ],
          },
          {
            label: 'Verjandi',
            items: [
              {
                label: 'Nafn',
                value: 'Andri Valur Ívarsson',
              },
              {
                label: 'Netfang',
                value: 'andri.ivar@fyrirtaeki.is',
                link: 'mailto:',
              },
              {
                label: 'Símanúmer',
                value: '555 4789',
                link: 'tel:',
              },
            ],
          },
          {
            label: 'Málsupplýsingar',
            items: [
              {
                label: 'Tegund',
                value: 'Ákæra',
              },
              {
                label: 'Málsnúmer héraðsdóms',
                value: 'S-999/2022',
              },
              {
                label: 'Dómstóll',
                value: 'Héraðsdómur Reykjavíkur',
              },
              {
                label: 'Dómari',
                value: 'Judge Dredd',
              },
              {
                label: 'Embætti',
                value: 'Lögreglustjórinn á höfuðborgarsvæðinu',
              },
              {
                label: 'Ákærandi',
                value: 'Katrín Ólöf Einarsdóttir',
              },
            ],
          },
        ],
      },
    },
    {
      actions: [
        {
          title: 'Hlaða niður ákæru',
          type: 'file',
          data: '123',
        },
      ],
      data: {
        id: 12345,
        caseNumber: 'S-2222',
        caseNumberTitle: 'Málsnúmer S-2222/2022',
        type: 'Ákæra',
        status: 'Á dagskrá',
        acknowledged: false,
        groups: [
          {
            label: 'Varnaraðili',
            items: [
              {
                label: 'Nafn',
                value: 'Lísa Jónsdóttir',
              },
              {
                label: 'Kennitala',
                value: '010203-6789',
              },
              {
                label: 'Lögheimili',
                value: 'Hagamelur 92, 107 Reykjavík',
              },
              {
                label: 'Fyrirkall sent',
                value: '6.maí 2022',
                action: {
                  label: 'Sjá fyrirkall',
                  url: LawAndOrderPaths.SubpoenaDetail.replace(':id', '123'),
                  type: 'popup',
                },
              },
            ],
          },
          {
            label: 'Verjandi',
            items: [
              {
                label: 'Nafn',
                value: 'Andri Valur Ívarsson',
              },
              {
                label: 'Netfang',
                value: 'andri.ivar@fyrirtaeki.is',
                link: 'mailto:',
              },
              {
                label: 'Símanúmer',
                value: '555 4789',
                link: 'tel:',
              },
            ],
          },
          {
            label: 'Málsupplýsingar',
            items: [
              {
                label: 'Tegund',
                value: 'Ákæra',
              },
              {
                label: 'Málsnúmer héraðsdóms',
                value: 'S-999/2022',
              },
              {
                label: 'Dómstóll',
                value: 'Héraðsdómur Reykjavíkur',
              },
              {
                label: 'Dómari',
                value: 'Judge Dredd',
              },
              {
                label: 'Embætti',
                value: 'Lögreglustjórinn á höfuðborgarsvæðinu',
              },
              {
                label: 'Ákærandi',
                value: 'Katrín Ólöf Einarsdóttir',
              },
            ],
          },
        ],
      },
    },
  ]

  return { data: cases, loading: false, error: false }
}

export const getCase = (id: number) => {
  const cases = listCases()

  const detailedCase = cases.data.find((x) => x.data.id === id) ?? null

  const courtCaseDetail = {
    courtCaseDetail: detailedCase,
  }
  return { data: courtCaseDetail, loading: false, error: false }
}

const lawyers: Lawyers[] = [
  {
    name: 'Halldór Halldórsson',
    nationalId: '1010203090',
    practice: 'Paxma',
  },
  {
    name: 'Agnes Guðmundsdóttir',
    nationalId: '1004303090',
    practice: 'Lögfræðingar Reykjavíkur',
  },
  {
    name: 'Jóhann Atli Jóhannesson',
    nationalId: '1012203090',
    practice: 'Logos',
  },
]

export const getLawyers = () => {
  const lwrs = { items: lawyers }
  return {
    data: lwrs,
    loading: false,
    error: false,
  }
}
export const getSubpoena = (id: number) => {
  const subpoenas: Subpoena[] = [
    {
      texts: {
        intro: 'Héraðsdómur Reykjavíkur, Dómhúsið við Lækjartorg, Reykjavík.',
        confirmation: 'Staðfesting á móttöku hefur verið send á dómstóla',
        description:
          'Ákærði er kvaddur til að koma fyrir dóm, hlýða á ákæru, halda uppi vörnum og sæta dómi. Sæki ákærði ekki þing má hann búast við því að fjarvist hans verði metin til jafns við það að hann viðurkenni að hafa framið brot það sem hann er ákærður fyrir og dómur verði lagður á málið að honum fjarstöddum. Birtingarfrestur er þrír sólarhringar.',
        claim:
          'Ég hef jafnframt veitt viðtöku greinargerð/-um vegna bótakröfu/-krafna í málinu.',
      },
      actions: [
        {
          type: 'file',
          title: 'Hala niður PDF',
          data: 'þetta er pdf',
        },
      ],
      data: {
        id: 123,
        acknowledged: undefined,
        groups: [
          {
            label: 'Mál nr. S-2023/2022',
            items: [
              {
                label: 'Dagsetning',
                value: '6. maí 2022',
              },
              {
                label: 'Embætti',
                value: 'Lögreglustjórinn á höfuðborgarsvæðinu',
              },
              {
                label: 'Ákærandi',
                value: 'Katrín Ólöf Einarsdóttir',
              },
              {
                label: 'Ákærði',
                value: 'Jón Jónsson',
              },
              {
                label: 'Verður tekið fyrir á dómþingi',
                value: '1.6.2022 kl. 14:15',
              },
              {
                label: 'Staður',
                value: 'Héraðsdómur Reykjavíkur, Dómsalur 202',
              },
              {
                label: 'Dómsathöfn',
                value: 'Þingfesting',
              },
            ],
          },
        ],
      },
    },
    {
      texts: {
        intro: 'Héraðsdómur Reykjavíkur, Dómhúsið við Lækjartorg, Reykjavík.',
        confirmation: 'Staðfesting á móttöku hefur verið send á dómstóla',
        description:
          'Ákærði er kvaddur til að koma fyrir dóm, hlýða á ákæru, halda uppi vörnum og sæta dómi. Sæki ákærði ekki þing má hann búast við því að fjarvist hans verði metin til jafns við það að hann viðurkenni að hafa framið brot það sem hann er ákærður fyrir og dómur verði lagður á málið að honum fjarstöddum. Birtingarfrestur er þrír sólarhringar.',
        claim:
          'Ég hef jafnframt veitt viðtöku greinargerð/-um vegna bótakröfu/-krafna í málinu.',
      },
      actions: [
        {
          type: 'file',
          title: 'Hala niður PDF',
          data: 'þetta er pdf',
        },
      ],
      data: {
        id: 1234,
        acknowledged: true,
        groups: [
          {
            label: 'Mál nr. S-2023/2022',
            items: [
              {
                label: 'Dagsetning',
                value: '6. maí 2022',
              },
              {
                label: 'Embætti',
                value: 'Lögreglustjórinn á höfuðborgarsvæðinu',
              },
              {
                label: 'Ákærandi',
                value: 'Katrín Ólöf Einarsdóttir',
              },
              {
                label: 'Ákærði',
                value: 'Jón Jónsson',
              },
              {
                label: 'Verður tekið fyrir á dómþingi',
                value: '1.6.2022 kl. 14:15',
              },
              {
                label: 'Staður',
                value: 'Héraðsdómur Reykjavíkur, Dómsalur 202',
              },
              {
                label: 'Dómsathöfn',
                value: 'Þingfesting',
              },
            ],
          },
        ],
      },
    },
    {
      texts: {
        intro: 'Héraðsdómur Reykjavíkur, Dómhúsið við Lækjartorg, Reykjavík.',
        confirmation: 'Staðfesting á móttöku hefur verið send á dómstóla',
        description:
          'Ákærði er kvaddur til að koma fyrir dóm, hlýða á ákæru, halda uppi vörnum og sæta dómi. Sæki ákærði ekki þing má hann búast við því að fjarvist hans verði metin til jafns við það að hann viðurkenni að hafa framið brot það sem hann er ákærður fyrir og dómur verði lagður á málið að honum fjarstöddum. Birtingarfrestur er þrír sólarhringar.',
        claim:
          'Ég hef jafnframt veitt viðtöku greinargerð/-um vegna bótakröfu/-krafna í málinu.',
      },
      actions: [
        {
          type: 'file',
          title: 'Hala niður PDF',
          data: 'þetta er pdf',
        },
      ],
      data: {
        id: 12345,
        acknowledged: false,
        groups: [
          {
            label: 'Mál nr. S-2023/2022',
            items: [
              {
                label: 'Dagsetning',
                value: '6. maí 2022',
              },
              {
                label: 'Embætti',
                value: 'Lögreglustjórinn á höfuðborgarsvæðinu',
              },
              {
                label: 'Ákærandi',
                value: 'Katrín Ólöf Einarsdóttir',
              },
              {
                label: 'Ákærði',
                value: 'Jón Jónsson',
              },
              {
                label: 'Verður tekið fyrir á dómþingi',
                value: '1.6.2022 kl. 14:15',
              },
              {
                label: 'Staður',
                value: 'Héraðsdómur Reykjavíkur, Dómsalur 202',
              },
              {
                label: 'Dómsathöfn',
                value: 'Þingfesting',
              },
            ],
          },
        ],
      },
    },
  ]

  const subpoena = subpoenas.find((x) => x.data.id === id) ?? null

  return { data: subpoena, loading: false, error: false }
}
