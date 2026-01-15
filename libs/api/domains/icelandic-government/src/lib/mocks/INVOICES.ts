import { Invoices } from '../models/invoices.model'

export const MOCK_INVOICES: Invoices = {
  data: [
    {
      id: 'group-1',
      supplier: {
        id: 1001,
        name: 'Reykjavík Ráðgjöf ehf.',
      },
      customer: {
        id: 2001,
        name: 'Íslenska Byggingafélagið hf.',
      },
      totalAmount: 2450000,
      invoices: [
        {
          id: 1001,
          date: '2024-01-10T00:00:00Z',
          totalItemizationAmount: 2450000,
          itemization: [
            {
              id: 'item-1001-1',
              label: 'Ráðgjöf um byggingarverkefni',
              amount: 1800000,
            },
            {
              id: 'item-1001-2',
              label: 'Verkefnastjórnun',
              amount: 450000,
            },
            {
              id: 'item-1001-3',
              label: 'Útlagður kostnaður',
              amount: 200000,
            },
          ],
        },
      ],
    },
    {
      id: 'group-2',
      supplier: {
        id: 1002,
        name: 'Norðurorka ehf.',
      },
      customer: {
        id: 2002,
        name: 'Landspítali',
      },
      totalAmount: 890000,
      invoices: [
        {
          id: 1002,
          date: '2024-01-15T00:00:00Z',
          totalItemizationAmount: 340000,
          itemization: [
            {
              id: 'item-1002-1',
              label: 'Rafmagnsframleiðsla',
              amount: 280000,
            },
            {
              id: 'item-1002-2',
              label: 'Þjónustugjald',
              amount: 60000,
            },
          ],
        },
        {
          id: 1003,
          date: '2024-01-20T00:00:00Z',
          totalItemizationAmount: 550000,
          itemization: [
            {
              id: 'item-1003-1',
              label: 'Rafmagnsframleiðsla',
              amount: 450000,
            },
            {
              id: 'item-1003-2',
              label: 'Viðhaldsgjald',
              amount: 100000,
            },
          ],
        },
      ],
    },
    {
      id: 'group-3',
      supplier: {
        id: 1003,
        name: 'Bláa lónið ehf.',
      },
      customer: {
        id: 2003,
        name: 'Ferðamálastofa',
      },
      totalAmount: 1250000,
      invoices: [
        {
          id: 1004,
          date: '2024-01-18T00:00:00Z',
          totalItemizationAmount: 1250000,
          itemization: [
            {
              id: 'item-1004-1',
              label: 'Aðgöngumiðar',
              amount: 800000,
            },
            {
              id: 'item-1004-2',
              label: 'Veitingaþjónusta',
              amount: 350000,
            },
            {
              id: 'item-1004-3',
              label: 'Aukaþjónusta',
              amount: 100000,
            },
          ],
        },
      ],
    },
    {
      id: 'group-4',
      supplier: {
        id: 1004,
        name: 'Icelandair Group hf.',
      },
      customer: {
        id: 2004,
        name: 'Keflavíkurflugvöllur',
      },
      totalAmount: 5675000,
      invoices: [
        {
          id: 1005,
          date: '2024-01-22T00:00:00Z',
          totalItemizationAmount: 5675000,
          itemization: [
            {
              id: 'item-1005-1',
              label: 'Flugvallarsgjöld',
              amount: 3500000,
            },
            {
              id: 'item-1005-2',
              label: 'Eldsneyti',
              amount: 1800000,
            },
            {
              id: 'item-1005-3',
              label: 'Afgreiðslugjöld',
              amount: 375000,
            },
          ],
        },
      ],
    },
    {
      id: 'group-5',
      supplier: {
        id: 1005,
        name: 'Eimskip hf.',
      },
      customer: {
        id: 2005,
        name: 'Samskip hf.',
      },
      totalAmount: 3200000,
      invoices: [
        {
          id: 1006,
          date: '2024-02-01T00:00:00Z',
          totalItemizationAmount: 1800000,
          itemization: [
            {
              id: 'item-1006-1',
              label: 'Flutningsgjald',
              amount: 1200000,
            },
            {
              id: 'item-1006-2',
              label: 'Eldsneytisgjald',
              amount: 400000,
            },
            {
              id: 'item-1006-3',
              label: 'Afgreiðslugjald',
              amount: 200000,
            },
          ],
        },
        {
          id: 1007,
          date: '2024-02-05T00:00:00Z',
          totalItemizationAmount: 1400000,
          itemization: [
            {
              id: 'item-1007-1',
              label: 'Geymslugjald',
              amount: 900000,
            },
            {
              id: 'item-1007-2',
              label: 'Meðhöndlunargjald',
              amount: 350000,
            },
            {
              id: 'item-1007-3',
              label: 'Tryggingagjald',
              amount: 150000,
            },
          ],
        },
      ],
    },
    {
      id: 'group-6',
      supplier: {
        id: 1006,
        name: 'Orkuveita Reykjavíkur',
      },
      customer: {
        id: 2006,
        name: 'Álftanes sveitarfélag',
      },
      totalAmount: 780000,
      invoices: [
        {
          id: 1008,
          date: '2024-02-03T00:00:00Z',
          totalItemizationAmount: 780000,
          itemization: [
            {
              id: 'item-1008-1',
              label: 'Raforkuframleiðsla',
              amount: 480000,
            },
            {
              id: 'item-1008-2',
              label: 'Hitaveita',
              amount: 220000,
            },
            {
              id: 'item-1008-3',
              label: 'Þjónustugjald',
              amount: 80000,
            },
          ],
        },
      ],
    },
    {
      id: 'group-7',
      supplier: {
        id: 1007,
        name: 'Marel hf.',
      },
      customer: {
        id: 2007,
        name: 'Fiskifélag Íslands',
      },
      totalAmount: 4500000,
      invoices: [
        {
          id: 1009,
          date: '2024-02-08T00:00:00Z',
          totalItemizationAmount: 4500000,
          itemization: [
            {
              id: 'item-1009-1',
              label: 'Vélar og tæki',
              amount: 3200000,
            },
            {
              id: 'item-1009-2',
              label: 'Viðhald og þjónusta',
              amount: 800000,
            },
            {
              id: 'item-1009-3',
              label: 'Uppsetning og þjálfun',
              amount: 500000,
            },
          ],
        },
      ],
    },
    {
      id: 'group-8',
      supplier: {
        id: 1008,
        name: 'CCP Games ehf.',
      },
      customer: {
        id: 2008,
        name: 'Tæknigarður',
      },
      totalAmount: 650000,
      invoices: [
        {
          id: 1010,
          date: '2024-02-12T00:00:00Z',
          totalItemizationAmount: 650000,
          itemization: [
            {
              id: 'item-1010-1',
              label: 'Hugbúnaðarleyfi',
              amount: 400000,
            },
            {
              id: 'item-1010-2',
              label: 'Tækniþjónusta',
              amount: 180000,
            },
            {
              id: 'item-1010-3',
              label: 'Þjálfun starfsfólks',
              amount: 70000,
            },
          ],
        },
      ],
    },
    {
      id: 'group-9',
      supplier: {
        id: 1009,
        name: 'Lífeyrissjóður Verslunarmanna',
      },
      customer: {
        id: 2009,
        name: 'Fasteignafélag Reykjavíkur',
      },
      totalAmount: 8900000,
      invoices: [
        {
          id: 1011,
          date: '2024-02-15T00:00:00Z',
          totalItemizationAmount: 8900000,
          itemization: [
            {
              id: 'item-1011-1',
              label: 'Fasteignakaup',
              amount: 7500000,
            },
            {
              id: 'item-1011-2',
              label: 'Lögfræðiþjónusta',
              amount: 800000,
            },
            {
              id: 'item-1011-3',
              label: 'Stimpilgjöld og gjöld',
              amount: 600000,
            },
          ],
        },
      ],
    },
    {
      id: 'group-10',
      supplier: {
        id: 1010,
        name: 'Vífilfell hf.',
      },
      customer: {
        id: 2010,
        name: 'Hagkaup hf.',
      },
      totalAmount: 420000,
      invoices: [
        {
          id: 1012,
          date: '2024-01-25T00:00:00Z',
          totalItemizationAmount: 180000,
          itemization: [
            {
              id: 'item-1012-1',
              label: 'Coca Cola',
              amount: 85000,
            },
            {
              id: 'item-1012-2',
              label: 'Pepsi',
              amount: 65000,
            },
            {
              id: 'item-1012-3',
              label: 'Flutningskostnaður',
              amount: 30000,
            },
          ],
        },
        {
          id: 1013,
          date: '2024-01-28T00:00:00Z',
          totalItemizationAmount: 240000,
          itemization: [
            {
              id: 'item-1013-1',
              label: 'Coca Cola',
              amount: 120000,
            },
            {
              id: 'item-1013-2',
              label: 'Pepsi',
              amount: 90000,
            },
            {
              id: 'item-1013-3',
              label: 'Flutningskostnaður',
              amount: 30000,
            },
          ],
        },
      ],
    },
  ],
  totalCount: 10,
  pageInfo: {
    hasNextPage: true,
    hasPreviousPage: false,
  },
}
