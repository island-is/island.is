import { CaseTableGroup, CaseTableType } from '../caseTableTypes'

const districtCourtRequestCasesTableGroup = {
  title: 'Rannsóknarmál',
  tables: [
    {
      type: CaseTableType.DISTRICT_COURT_REQUEST_CASES_IN_PROGRESS,
      route: 'rannsoknarmal-i-vinnslu',
      title: 'Rannsóknarmál í vinnslu',
      description: 'Drög, ný mál, móttekin mál og mál á dagskrá.',
    },
    {
      type: CaseTableType.DISTRICT_COURT_REQUEST_CASES_APPEALED,
      route: 'rannsoknarmal-kaerd-til-landsrettar',
      title: 'Kærur til Landsréttar',
      description:
        'Úrskurðir sem búið er að kæra en á eftir að senda til Landsréttar.',
    },
    {
      type: CaseTableType.DISTRICT_COURT_REQUEST_CASES_COMPLETED,
      route: 'afgreidd-rannsoknarmal',
      title: 'Afgreidd rannsóknarmál',
      description: 'Rannsóknarmál sem búið er að ljúka.',
    },
  ],
}

const districtCourtIndictmentsTableGroup = {
  title: 'Sakamál',
  tables: [
    {
      type: CaseTableType.DISTRICT_COURT_INDICTMENTS_NEW,
      route: 'sakamal-sem-bida-uthlutunar',
      title: 'Bíða úthlutunar',
      description: 'Ný sakamál sem á eftir að úthluta.',
    },
    {
      type: CaseTableType.DISTRICT_COURT_INDICTMENTS_RECEIVED,
      route: 'mottekin-sakamal',
      title: 'Móttekin sakamál',
      description: 'Sakamál sem bíða þess að fyrirkall sé gefið út.',
    },
    {
      type: CaseTableType.DISTRICT_COURT_INDICTMENTS_IN_PROGRESS,
      route: 'sakamal-i-vinnslu',
      title: 'Sakamál í vinnslu',
      description:
        'Sakamál sem eru í frestum, á dagskrá eða búið er að dómtaka.',
    },
    {
      type: CaseTableType.DISTRICT_COURT_INDICTMENTS_FINALIZING,
      route: 'sakamal-i-fragangi',
      title: 'Sakamál í frágangi',
      description: 'Sakamál sem á eftir að senda til ríkissaksóknara.',
    },
    {
      type: CaseTableType.DISTRICT_COURT_INDICTMENTS_COMPLETED,
      route: 'afgreidd-sakamal',
      title: 'Afgreidd sakamál',
      description: 'Sakamál sem búið er að ljúka.',
    },
  ],
}

export const districtCourtTableGroups: CaseTableGroup[] = [
  districtCourtRequestCasesTableGroup,
  districtCourtIndictmentsTableGroup,
]
