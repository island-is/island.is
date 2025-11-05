interface InvoiceItemizationGroup {
  date: Date;
  id: string;
  items: Array<{ label: string, value: number }>;
}

interface OpenInvoice {
  seller: string,
  buyer: string;
  amount: number;
}

interface MockTable {
  headers: {
    seller: string,
    buyer: string,
    amount: string
  }
  rows: Array<OpenInvoice & { subrows?: Array<InvoiceItemizationGroup>}>
}

export const MOCK_TABLE_DATA: MockTable = {
  headers:{
    seller: 'Seljandi',
    buyer: 'Kaupandi',
    amount: 'Upphæð'
  },
  rows: [
    {
      seller: 'Reykjavík Ráðgjöf ehf.',
      buyer: 'Íslenska Byggingafélagið hf.',
      amount: 2450000,
      subrows: [
        {
          date: new Date('2024-01-10'),
          id: 'RRE-IBF-001',
          items: [
            { label: 'Ráðgjöf um byggingarverkefni', value: 1800000 },
            { label: 'Verkefnastjórnun', value: 450000 },
            { label: 'Útlagður kostnaður', value: 200000 }
          ]
        }
      ]
    },
    {
      seller: 'Norðurorka ehf.',
      buyer: 'Landspítali',
      amount: 890000,
      subrows: [
        {
          date: new Date('2024-01-15'),
          id: 'INV-001-A',
          items: [
            { label: 'Rafmagnsframleiðsla', value: 280000 },
            { label: 'Þjónustugjald', value: 60000 }
          ]
        },
        {
          date: new Date('2024-01-20'),
          id: 'INV-001-B',
          items: [
            { label: 'Rafmagnsframleiðsla', value: 450000 },
            { label: 'Viðhaldsgjald', value: 100000 }
          ]
        }
      ]
    },
    {
      seller: 'Bláa lónið ehf.',
      buyer: 'Ferðamálastofa',
      amount: 1250000,
      subrows: [
        {
          date: new Date('2024-01-18'),
          id: 'BL-FMS-001',
          items: [
            { label: 'Aðgöngumiðar', value: 800000 },
            { label: 'Veitingaþjónusta', value: 350000 },
            { label: 'Aukaþjónusta', value: 100000 }
          ]
        }
      ]
    },
    {
      seller: 'Icelandair Group hf.',
      buyer: 'Keflavíkurflugvöllur',
      amount: 5675000,
      subrows: [
        {
          date: new Date('2024-01-22'),
          id: 'ICE-KEF-001',
          items: [
            { label: 'Flugvallarsgjöld', value: 3500000 },
            { label: 'Eldsneyti', value: 1800000 },
            { label: 'Afgreiðslugjöld', value: 375000 }
          ]
        }
      ]
    },
    {
      seller: 'Eimskip hf.',
      buyer: 'Samskip hf.',
      amount: 3200000,
      subrows: [
        {
          date: new Date('2024-02-01'),
          id: 'SHP-2024-001',
          items: [
            { label: 'Flutningsgjald', value: 1200000 },
            { label: 'Eldsneytisgjald', value: 400000 },
            { label: 'Afgreiðslugjald', value: 200000 }
          ]
        },
        {
          date: new Date('2024-02-05'),
          id: 'SHP-2024-002',
          items: [
            { label: 'Geymslugjald', value: 900000 },
            { label: 'Meðhöndlunargjald', value: 350000 },
            { label: 'Tryggingagjald', value: 150000 }
          ]
        }
      ]
    },
    {
      seller: 'Orkuveita Reykjavíkur',
      buyer: 'Álftanes sveitarfélag',
      amount: 780000,
      subrows: [
        {
          date: new Date('2024-02-03'),
          id: 'OR-ALF-001',
          items: [
            { label: 'Raforkuframleiðsla', value: 480000 },
            { label: 'Hitaveita', value: 220000 },
            { label: 'Þjónustugjald', value: 80000 }
          ]
        }
      ]
    },
    {
      seller: 'Marel hf.',
      buyer: 'Fiskifélag Íslands',
      amount: 4500000,
      subrows: [
        {
          date: new Date('2024-02-08'),
          id: 'MAR-FIS-001',
          items: [
            { label: 'Vélar og tæki', value: 3200000 },
            { label: 'Viðhald og þjónusta', value: 800000 },
            { label: 'Uppsetning og þjálfun', value: 500000 }
          ]
        }
      ]
    },
    {
      seller: 'CCP Games ehf.',
      buyer: 'Tæknigarður',
      amount: 650000,
      subrows: [
        {
          date: new Date('2024-02-12'),
          id: 'CCP-TEK-001',
          items: [
            { label: 'Hugbúnaðarleyfi', value: 400000 },
            { label: 'Tækniþjónusta', value: 180000 },
            { label: 'Þjálfun starfsfólks', value: 70000 }
          ]
        }
      ]
    },
    {
      seller: 'Lífeyrissjóður Verslunarmanna',
      buyer: 'Fasteignafélag Reykjavíkur',
      amount: 8900000,
      subrows: [
        {
          date: new Date('2024-02-15'),
          id: 'LVE-FAR-001',
          items: [
            { label: 'Fasteignakaup', value: 7500000 },
            { label: 'Lögfræðiþjónusta', value: 800000 },
            { label: 'Stimpilgjöld og gjöld', value: 600000 }
          ]
        }
      ]
    },
    {
      seller: 'Vífilfell hf.',
      buyer: 'Hagkaup hf.',
      amount: 420000,
      subrows: [
        {
          date: new Date('2024-01-25'),
          id: 'VIF-KRI-001',
          items: [
            { label: 'Coca Cola', value: 85000 },
            { label: 'Pepsi', value: 65000 },
            { label: 'Flutningskostnaður', value: 30000 }
          ]
        },
        {
          date: new Date('2024-01-28'),
          id: 'VIF-SMA-001',
          items: [
            { label: 'Coca Cola', value: 120000 },
            { label: 'Pepsi', value: 90000 },
            { label: 'Flutningskostnaður', value: 30000 }
          ]
        }
      ]
    },
    {
      seller: 'Síminn hf.',
      buyer: 'Reykjavíkurborg',
      amount: 1850000,
      subrows: [
        {
          date: new Date('2024-02-18'),
          id: 'SIM-RVK-001',
          items: [
            { label: 'Fjarskiptaþjónusta', value: 1200000 },
            { label: 'Internetþjónusta', value: 450000 },
            { label: 'Viðhaldsþjónusta', value: 200000 }
          ]
        }
      ]
    },
    {
      seller: 'Íslandsbanki hf.',
      buyer: 'Íslenska Erfðagreiningarfyrirtækið',
      amount: 2100000,
      subrows: [
        {
          date: new Date('2024-02-20'),
          id: 'ISB-IER-001',
          items: [
            { label: 'Bankaþjónusta', value: 1400000 },
            { label: 'Lánveitingar', value: 500000 },
            { label: 'Fjármálaráðgjöf', value: 200000 }
          ]
        }
      ]
    },
    {
      seller: 'Össur hf.',
      buyer: 'Sjúkratryggingar Íslands',
      amount: 3750000,
      subrows: [
        {
          date: new Date('2024-02-22'),
          id: 'OSS-SJU-001',
          items: [
            { label: 'Gervilimir', value: 2800000 },
            { label: 'Stoðtæki', value: 650000 },
            { label: 'Þjálfun og þjónusta', value: 300000 }
          ]
        }
      ]
    },
    {
      seller: 'Nova ehf.',
      buyer: 'Háskóli Íslands',
      amount: 925000,
      subrows: [
        {
          date: new Date('2024-02-25'),
          id: 'NOV-HAS-001',
          items: [
            { label: 'Fjarskiptaþjónusta', value: 600000 },
            { label: 'Internetþjónusta', value: 225000 },
            { label: 'Tækniþjónusta', value: 100000 }
          ]
        }
      ]
    },
    {
      seller: 'Byko ehf.',
      buyer: 'Húsasmiðjan hf.',
      amount: 1600000,
      subrows: [
        {
          date: new Date('2024-02-10'),
          id: 'BYK-BYG-001',
          items: [
            { label: 'Timbur', value: 600000 },
            { label: 'Naglar og skrúfur', value: 200000 },
            { label: 'Einangrun', value: 150000 }
          ]
        },
        {
          date: new Date('2024-02-12'),
          id: 'BYK-GAR-001',
          items: [
            { label: 'Garðáhöld', value: 300000 },
            { label: 'Jarðvegur og áburður', value: 250000 },
            { label: 'Fræ og plöntur', value: 100000 }
          ]
        }
      ]
    },
    {
      seller: 'Arion Banki hf.',
      buyer: 'Íslenska Gámafélagið',
      amount: 2800000,
      subrows: [
        {
          date: new Date('2024-02-28'),
          id: 'ARI-GAM-001',
          items: [
            { label: 'Viðskiptalán', value: 2000000 },
            { label: 'Bankaþjónusta', value: 600000 },
            { label: 'Fjármálaráðgjöf', value: 200000 }
          ]
        }
      ]
    },
    {
      seller: 'Landsbankinn hf.',
      buyer: 'Valitor hf.',
      amount: 1450000,
      subrows: [
        {
          date: new Date('2024-03-02'),
          id: 'LAN-VAL-001',
          items: [
            { label: 'Greiðsluvinnslur', value: 900000 },
            { label: 'Bankaþjónusta', value: 400000 },
            { label: 'Tækniþjónusta', value: 150000 }
          ]
        }
      ]
    },
    {
      seller: 'Vodafone Iceland ehf.',
      buyer: 'Míla ehf.',
      amount: 3350000,
      subrows: [
        {
          date: new Date('2024-03-05'),
          id: 'VOD-MIL-001',
          items: [
            { label: 'Fjarskiptaþjónusta', value: 2200000 },
            { label: 'Netþjónusta', value: 800000 },
            { label: 'Tækniviðhald', value: 350000 }
          ]
        }
      ]
    },
    {
      seller: 'Penninn ehf.',
      buyer: 'Menntamálaráðuneytið',
      amount: 780000,
      subrows: [
        {
          date: new Date('2024-03-08'),
          id: 'PEN-MEN-001',
          items: [
            { label: 'Skrifstofuvörur', value: 450000 },
            { label: 'Prentþjónusta', value: 220000 },
            { label: 'Flutningur', value: 110000 }
          ]
        }
      ]
    },
    {
      seller: 'Reitir fasteignafélag hf.',
      buyer: 'Kópavogsbær',
      amount: 6200000,
      subrows: [
        {
          date: new Date('2024-01-30'),
          id: 'REI-LOD1-001',
          items: [
            { label: 'Fasteignaleiga', value: 3000000 },
            { label: 'Þjónustugjöld', value: 500000 },
            { label: 'Viðhaldsgjald', value: 300000 }
          ]
        },
        {
          date: new Date('2024-02-15'),
          id: 'REI-LOD2-001',
          items: [
            { label: 'Fasteignaleiga', value: 1900000 },
            { label: 'Þjónustugjöld', value: 350000 },
            { label: 'Viðhaldsgjald', value: 150000 }
          ]
        }
      ]
    },
    {
      seller: 'Olís hf.',
      buyer: 'Flugfélag Íslands',
      amount: 4700000,
      subrows: [
        {
          date: new Date('2024-03-12'),
          id: 'OLI-FLU-001',
          items: [
            { label: 'Flugeldsneyti', value: 3800000 },
            { label: 'Bensín og dísel', value: 600000 },
            { label: 'Smurðu og viðhald', value: 300000 }
          ]
        }
      ]
    },
    {
      seller: 'Veitur ohf.',
      buyer: 'Garðabær',
      amount: 1950000,
      subrows: [
        {
          date: new Date('2024-03-15'),
          id: 'VEI-GAR-001',
          items: [
            { label: 'Raforkuframleiðsla', value: 1200000 },
            { label: 'Hitaveita', value: 550000 },
            { label: 'Vatn og fráveita', value: 200000 }
          ]
        }
      ]
    },
    {
      seller: 'Atorka ehf.',
      buyer: 'Alcoa Fjarðaál',
      amount: 8500000,
      subrows: [
        {
          date: new Date('2024-03-18'),
          id: 'ATO-ALC-001',
          items: [
            { label: 'Iðnaðarrafmagn', value: 6800000 },
            { label: 'Þjónustugjald', value: 1200000 },
            { label: 'Viðhaldsgjald', value: 500000 }
          ]
        }
      ]
    },
    {
      seller: 'Ísey skyr ehf.',
      buyer: 'Nettó ehf.',
      amount: 620000,
      subrows: [
        {
          date: new Date('2024-03-20'),
          id: 'ISE-NET-001',
          items: [
            { label: 'Ísey skyr vörur', value: 480000 },
            { label: 'Mjólkurvörur', value: 100000 },
            { label: 'Flutningskostnaður', value: 40000 }
          ]
        }
      ]
    },
    {
      seller: 'Kaupfélag Eyfirðinga',
      buyer: 'Akureyrarbær',
      amount: 1100000,
      subrows: [
        {
          date: new Date('2024-03-22'),
          id: 'KEF-AKU-001',
          items: [
            { label: 'Matvörur og vörur', value: 750000 },
            { label: 'Þjónustugjald', value: 250000 },
            { label: 'Flutningskostnaður', value: 100000 }
          ]
        }
      ]
    }
  ]
}
