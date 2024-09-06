export type SizeOfEnterprise = {
  Code: number
  LabelIs: string
  LabelEn: string
}

export type WorkplaceHealthAndSafety = {
  Vinnuver: number
  Heiti: string
  Röð: number
}

export type WorkingEnvironmentGroup = {
  Code: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: number
}

export type WorkingEnvironmentSubGroup = {
  Code: number
  FK_Grou: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: number
}

export type WorkStation = {
  Code: number
  LabelIs: string
  LabelEn: string
}

export type LengthOfEmployment = {
  StarfstímiID: number
  Heiti: string
}

export type WorkhourArrangement = {
  TegundVinnuID: number
  Heiti: string
}

export type VictimsOccupationMajorGroup = {
  Code: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: number
}

export type VictimsOccupationSubMajorGroup = {
  Code: number
  FK_MajorGroupCode: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: number
}

export type EmploymentStatusOfTheVictim = {
  RáðningarstaðaID: number
  FK_EmploymentStatusOfTheVictimCode: number
  LabelIs: string
  LabelEn: string | null
}

export type AbsenceDueToAccident = {
  FjarveraV: number
  FK_DaysLostSeverityCode: string | null
  LabelIs: string
  LabelEn: string
}

export type SpecificPhysicalActivityGroup = {
  Code: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: number
}

export type VictimOccupationMinorGroup = {
  Code: number
  FK_SubMajorGroupCode: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: number
}

export type SpecificPhysicalActivity = {
  Code: number
  FK_Group: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: number
}

export type DeviationGroup = {
  Code: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: number
}

export type Deviation = {
  Code: number
  FK_Group: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: number
}

export type ContactModeOfInjuryGroup = {
  Code: number
  LabelIs: string
  LabelEn: string
}

export type TypeOfInjuryGroup = {
  Code: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: number
}

export type TypeOfInjury = {
  Code: number
  FK_Group: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: number
}

export type PartOfBodyInjuredGroup = {
  Code: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: number
}

export type PartOfBodyInjured = {
  Code: number
  FK_Group: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: number
}

export type VictimsOccupationUnitGroup = {
  Code: number
  FK_MinorGroupCode: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: number
}

export const sizeOfEnterprises: SizeOfEnterprise[] = [
  {
    Code: 0,
    LabelIs: '0 Einyrki',
    LabelEn: '0 employees - Self-employed without employees',
  },
  {
    Code: 1,
    LabelIs: '1-9 starfsmenn eða samsvarandi stöðugildi',
    LabelEn: '1-9 employees or full-time equivalent',
  },
  {
    Code: 2,
    LabelIs: '10-49 starfsmenn eða samsvarandi stöðugildi',
    LabelEn: '10-49 employees or full-time equivalent',
  },
  {
    Code: 3,
    LabelIs: '50-249 starfsmenn eða samsvarandi stöðugildi',
    LabelEn: '50-249 employees or full-time equivalent',
  },
  {
    Code: 4,
    LabelIs: '250-499 starfsmenn eða samsvarandi stöðugildi',
    LabelEn: '250-499 employees or full-time equivalent',
  },
  {
    Code: 5,
    LabelIs: '500 starfsmenn eða fleiri og samsvarandi stöðugildi',
    LabelEn: '500 employees or more full-time equivalent',
  },
]

export const workplaceHealthAndSafety: WorkplaceHealthAndSafety[] = [
  {
    Vinnuver: 1,
    Heiti: 'Engin',
    Röð: 7,
  },
  {
    Vinnuver: 2,
    Heiti: 'Öryggistrúnaðarmaður',
    Röð: 1,
  },
  {
    Vinnuver: 3,
    Heiti: 'Öryggisvörður',
    Röð: 2,
  },
  {
    Vinnuver: 4,
    Heiti: 'Öryggisnefnd',
    Röð: 4,
  },
  {
    Vinnuver: 5,
    Heiti: 'Samningur við vinnuverndarráðgjafa',
    Röð: 5,
  },
  {
    Vinnuver: 6,
    Heiti: 'Samþætt öryggis- og heilbrigðisstarfsemi verktaka og verkkaupa',
    Röð: 6,
  },
  {
    Vinnuver: 7,
    Heiti: 'Öryggisstjóri',
    Röð: 3,
  },
]

export const workingEnvironmentGroup: WorkingEnvironmentGroup[] = [
  {
    Code: 10,
    LabelIs: 'Iðnaðarsvæði (Matvælaiðnaður, fiskiðnaður, þungaiðnaður og fl.)',
    LabelEn: 'Industrial site - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 20,
    LabelIs: 'Byggingarsvæði, byggingarvinna, námuvinnsla',
    LabelEn:
      'Construction site, construction, opencast quarry, opencast mine - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 30,
    LabelIs: 'Landbúnaður, undaneldi, fiskeldi, skógræktarsvæði',
    LabelEn: 'Farming, breeding, fish farming, forest zone - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 40,
    LabelIs:
      'Verslanir, skólar, veitingahús, skrifstofur, afþreyingarsvæði, ofl.',
    LabelEn:
      'Tertiary activity area, office, amusement area, miscellaneous - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 50,
    LabelIs: 'Heilbrigðisstofnanir',
    LabelEn: 'Health establishment - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 60,
    LabelIs: 'Vegir, bílar, bilastæði, flugvellir og önnur samgöngumannvirki',
    LabelEn: 'Public area - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 70,
    LabelIs: 'Á heimili',
    LabelEn: 'In the home - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 80,
    LabelIs: 'Íþróttasvæði',
    LabelEn: 'Sports area - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 90,
    LabelIs: 'Vinnusvæði í hæð, byggingavinna undanskilin',
    LabelEn:
      'In the air, elevated, excluding construction sites - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 100,
    LabelIs: 'Vinnusvæði neðanjarðar, byggingarsvæði undanskilin',
    LabelEn: 'Underground, excluding construction sites - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 110,
    LabelIs: 'Vinna á hafi og vötnum, byggingarsvæði undanskilin',
    LabelEn: 'On /over water, excluding construction sites - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 120,
    LabelIs: 'Vinnusvæði undir háum þrýstingi, byggingarsvæði undanskilin',
    LabelEn:
      'In high pressure environments, excluding construction sites - Not specified',
    ValidToSelect: 0,
  },
]

export const workingEnvironmentSubGroup: WorkingEnvironmentSubGroup[] = [
  {
    Code: 11,
    FK_Grou: 10,
    LabelIs: 'Framleiðslusvæði, verksmiðjur, fiskvinnsla og matvælaiðnaður',
    LabelEn: 'Production area, factory, workshop',
    ValidToSelect: 1,
  },
  {
    Code: 12,
    FK_Grou: 10,
    LabelIs: 'Viðhaldssvæði, verkstæði',
    LabelEn: 'Maintenance area, repair workshop',
    ValidToSelect: 1,
  },
  {
    Code: 13,
    FK_Grou: 10,
    LabelIs: 'Svæði notuð aðallega til geymslu, fermingar og affermingar',
    LabelEn: 'Area used principally for storage, loading, unloading',
    ValidToSelect: 1,
  },
  {
    Code: 19,
    FK_Grou: 10,
    LabelIs: 'Annað iðnaðarsvæði sem er ekki talið upp að ofan',
    LabelEn: 'Other group 010 type Working Environments not listed above',
    ValidToSelect: 1,
  },
  {
    Code: 21,
    FK_Grou: 20,
    LabelIs: 'Byggingasvæði - byggingar sem er verið að reisa',
    LabelEn: 'Construction site - building being constructed',
    ValidToSelect: 1,
  },
  {
    Code: 22,
    FK_Grou: 20,
    LabelIs: 'Byggingasvæði - viðhaldsvinna eða niðurrif',
    LabelEn:
      'Construction site - building being demolished, repaired, maintained',
    ValidToSelect: 1,
  },
  {
    Code: 23,
    FK_Grou: 20,
    LabelIs:
      'Opin námuvinnsla, opnar námur, uppgröftur, skurðir (þar með talið opnar námur og námuvinnsla)',
    LabelEn:
      'Opencast quarry, opencast mine, excavation, trench (including opencast mines and working quarries)',
    ValidToSelect: 1,
  },
  {
    Code: 24,
    FK_Grou: 20,
    LabelIs: 'Byggingasvæði - neðanjarðar, jarðgangnagerð',
    LabelEn: 'Construction site - underground',
    ValidToSelect: 1,
  },
  {
    Code: 25,
    FK_Grou: 20,
    LabelIs: 'Byggingasvæði - á / yfir vatni, brúarvinna, hafnarvinna',
    LabelEn: 'Construction site - on / over water',
    ValidToSelect: 1,
  },
  {
    Code: 29,
    FK_Grou: 20,
    LabelIs: 'Annað vinnuumhverfi á byggingarsvæðum',
    LabelEn: 'Other group 020 type Working Environments not listed above',
    ValidToSelect: 1,
  },
  {
    Code: 31,
    FK_Grou: 30,
    LabelIs: 'Svæði fyrir ræktun ungviðis',
    LabelEn: 'Breeding area',
    ValidToSelect: 1,
  },
  {
    Code: 32,
    FK_Grou: 30,
    LabelIs: 'Landbúnaðarsvæði - jarðrækt',
    LabelEn: 'Farming area - ground crop',
    ValidToSelect: 1,
  },
  {
    Code: 33,
    FK_Grou: 30,
    LabelIs: 'Landbúnaðarsvæði - ræktun á trjám og runnum',
    LabelEn: 'Farming area - tree or bush crop',
    ValidToSelect: 1,
  },
  {
    Code: 34,
    FK_Grou: 30,
    LabelIs: 'Skógarhöggssvæði',
    LabelEn: 'Forestry zone',
    ValidToSelect: 1,
  },
  {
    Code: 35,
    FK_Grou: 30,
    LabelIs: 'Fiskeldi, fiskveiðar, eldi í vatni (ekki með veiðiskipi)',
    LabelEn: 'Fish farming zone, fishing, aquaculture (not on a vessel)',
    ValidToSelect: 1,
  },
  {
    Code: 36,
    FK_Grou: 30,
    LabelIs: 'Garðar, almenningsgarðar, lystigarðar, dýragarðar',
    LabelEn: 'Garden, park, botanical garden, zoological garden',
    ValidToSelect: 1,
  },
  {
    Code: 39,
    FK_Grou: 30,
    LabelIs:
      'Annað vinnuumhverfi í landbúnaði, þ.m.t. sauðfjár- ,hrossa- og nautgriparækt',
    LabelEn: 'Other group 030 type Working Environments not listed above',
    ValidToSelect: 1,
  },
  {
    Code: 41,
    FK_Grou: 40,
    LabelIs: 'Skrifstofur, fundarherbergi, bókasafn o.s.frv.',
    LabelEn: 'Office, meeting room, library etc.',
    ValidToSelect: 1,
  },
  {
    Code: 42,
    FK_Grou: 40,
    LabelIs: 'Kennslustofnun, skóli, framhaldsskóli, háskóli, leikskóli',
    LabelEn:
      'Teaching establishment, school, secondary school, college, university, crèche, day nursery',
    ValidToSelect: 1,
  },
  {
    Code: 43,
    FK_Grou: 40,
    LabelIs: 'Litlar og stórar verslanir (þ.m.t. verslun á götu)',
    LabelEn: 'Small or large sales area (including street commerce)',
    ValidToSelect: 1,
  },
  {
    Code: 44,
    FK_Grou: 40,
    LabelIs:
      'Veitingahús, söfn, hótel/gisting, tónleikasalir, leikhús, íþróttaleikvangur, markaðir osfrv.',
    LabelEn:
      'Restaurant, recreational area, temporary accommodation (including museums, auditoriums, stadiums, fairs etc.)',
    ValidToSelect: 1,
  },
  {
    Code: 49,
    FK_Grou: 40,
    LabelIs: 'Annað vinnuumhverfi í þjónustugreinum',
    LabelEn: 'Other group 040 type Working Environments not listed above',
    ValidToSelect: 1,
  },
  {
    Code: 51,
    FK_Grou: 50,
    LabelIs: 'Heilbrigðisstofnun, sjúkrahús, hjúkrunarheimili',
    LabelEn: 'Health establishment, private hospital, hospital, nursing home',
    ValidToSelect: 1,
  },
  {
    Code: 59,
    FK_Grou: 50,
    LabelIs: 'Annað vinnuumhverfi í heilbrigðisþjónustu',
    LabelEn: 'Other group 050 type Working Environments not listed above',
    ValidToSelect: 1,
  },
  {
    Code: 61,
    FK_Grou: 60,
    LabelIs:
      'Þjóðvegir, hliðarvegir, bílastæði, gangstígar, biðstöðvar tengdar samgöngum, osfrv',
    LabelEn:
      'Area permanently open to public thoroughfare (highways, byways, parking areas, station or airport waiting rooms etc.)',
    ValidToSelect: 1,
  },
  {
    Code: 62,
    FK_Grou: 60,
    LabelIs: 'Fólksflutningabílar, einkabílar osfrv.',
    LabelEn:
      'Means of transport - by land or rail private or public (all kinds: train, bus, car etc.)',
    ValidToSelect: 1,
  },
  {
    Code: 63,
    FK_Grou: 60,
    LabelIs:
      'Lokuð þjónustusvæði samgöngumannvirkja, flugvellir, umferðarmiðstöðvar, osfrv.',
    LabelEn:
      'Zone attached to public places but with access restricted to authorised personnel: railway line, airport apron, motorway hard shoulder',
    ValidToSelect: 1,
  },
  {
    Code: 69,
    FK_Grou: 60,
    LabelIs: 'Annað vinnuumhverfi tengt samgöngum',
    LabelEn: 'Other group 060 type Working Environments not listed above',
    ValidToSelect: 1,
  },
  {
    Code: 71,
    FK_Grou: 70,
    LabelIs: 'Heimili',
    LabelEn: 'Private home',
    ValidToSelect: 1,
  },
  {
    Code: 72,
    FK_Grou: 70,
    LabelIs: 'Sameign bygginga og húsagarðar',
    LabelEn: 'Communal parts of a building, annexes, private family garden',
    ValidToSelect: 1,
  },
  {
    Code: 81,
    FK_Grou: 80,
    LabelIs:
      'Íþróttasvæði innanhúss - íþróttahöll, leikfimisalur, innisundlaug',
    LabelEn:
      'Indoor sports area - sports hall, gymnasium, indoor swimming pool',
    ValidToSelect: 1,
  },
  {
    Code: 82,
    FK_Grou: 80,
    LabelIs: 'Íþróttasvæði utanhúss - íþróttavöllur, útisundlaug, skíðabraut',
    LabelEn:
      'Outdoor sports area - sports ground, outdoor swimming pool, skiing piste',
    ValidToSelect: 1,
  },
  {
    Code: 89,
    FK_Grou: 80,
    LabelIs: 'Önnur íþróttasvæði',
    LabelEn: 'Other group 080 type Working Environments not listed above',
    ValidToSelect: 1,
  },
  {
    Code: 91,
    FK_Grou: 90,
    LabelIs: 'Þök, svalir ofl.',
    LabelEn: 'Elevated - on a fixed level (roof, terrace, etc.)',
    ValidToSelect: 1,
  },
  {
    Code: 92,
    FK_Grou: 90,
    LabelIs: 'Möstur, stöpplar, fastir hengiverkpallar',
    LabelEn: 'Elevated - mast, pylon, suspended platform',
    ValidToSelect: 1,
  },
  {
    Code: 99,
    FK_Grou: 90,
    LabelIs: 'Annað vinnuumhverfi í hæð að undanskildum byggingarsvæðum',
    LabelEn:
      'Other group 090 type Working Environments not listed above, excluding construction sites',
    ValidToSelect: 1,
  },
  {
    Code: 101,
    FK_Grou: 100,
    LabelIs: 'Neðanjarðar - jarðgöng',
    LabelEn: 'Underground - tunnel (road, train, tube)',
    ValidToSelect: 1,
  },
  {
    Code: 102,
    FK_Grou: 100,
    LabelIs: 'Neðanjarðar - náma',
    LabelEn: 'Underground - mine',
    ValidToSelect: 1,
  },
  {
    Code: 103,
    FK_Grou: 100,
    LabelIs: 'Neðanjarðar - holræsi/skolpræsi',
    LabelEn: 'Underground - drains/sewers',
    ValidToSelect: 1,
  },
  {
    Code: 109,
    FK_Grou: 100,
    LabelIs: 'Annað vinnuumhverfi neðanjarðar, að undanskildum byggingarsvæðum',
    LabelEn:
      'Other group 100 type Working Environments not listed above, excluding construction sites',
    ValidToSelect: 1,
  },
  {
    Code: 111,
    FK_Grou: 110,
    LabelIs: 'Á sjó, skip, bátar og prammar',
    LabelEn:
      'Sea or ocean - aboard all types of vessels, platforms, ships, boats, barges',
    ValidToSelect: 1,
  },
  {
    Code: 112,
    FK_Grou: 110,
    LabelIs: 'Vötn, fljót, í höfn - pallar, skip, bátar og prammar',
    LabelEn:
      'Lake, river, harbour - aboard all types of vessels, platforms, ships, boats, barges',
    ValidToSelect: 1,
  },
  {
    Code: 119,
    FK_Grou: 110,
    LabelIs:
      'Annað vinnuumhverfi á sjó og vötnum, að undanskildum byggingarsvæðum',
    LabelEn:
      'Other group 110 type Working Environments not listed above, excluding construction sites',
    ValidToSelect: 1,
  },
  {
    Code: 121,
    FK_Grou: 120,
    LabelIs: 'Í háþrýstiumhverfi - neðansjávar eða ferskvatni (t.d. köfun)',
    LabelEn: 'In a high pressure environment - underwater (e.g. diving)',
    ValidToSelect: 1,
  },
  {
    Code: 122,
    FK_Grou: 120,
    LabelIs: 'Í háþrýstiumhverfi - hylki eða lokað rými',
    LabelEn:
      'In a high pressure environment - pressure chamber or enclosed space',
    ValidToSelect: 1,
  },
  {
    Code: 129,
    FK_Grou: 120,
    LabelIs: 'Annað háþrýstivinnuumhverfi, að undanskildum byggingarsvæðum',
    LabelEn:
      'Other group 120 type Working Environments not listed above, excluding construction site',
    ValidToSelect: 1,
  },
]

export const workStations: WorkStation[] = [
  {
    Code: 1,
    LabelIs: 'Reglubun',
    LabelEn: 'Usual workstation or within the usual local unit of work',
  },
  {
    Code: 2,
    LabelIs: 'Tilfallandi',
    LabelEn:
      'Occasional or mobile workstation or in a journey on behalf of the employer',
  },
  {
    Code: 9,
    LabelIs: 'Aðrar vin',
    LabelEn: 'Other workstation',
  },
]

export const employmentStatusOfTheVictim: EmploymentStatusOfTheVictim[] = [
  {
    RáðningarstaðaID: 2,
    FK_EmploymentStatusOfTheVictimCode: 100,
    LabelIs: 'Sjálfstætt starfandi (með eða án launamanns)',
    LabelEn: 'Self-employed (with or without employees)',
  },
  {
    RáðningarstaðaID: 3,
    FK_EmploymentStatusOfTheVictimCode: 300,
    LabelIs: 'Launamaður',
    LabelEn:
      'Employee, with a job permanent/temporary (unlimited/limited duration) and full-time/part-time not specified-full-time',
  },
  {
    RáðningarstaðaID: 4,
    FK_EmploymentStatusOfTheVictimCode: 300,
    LabelIs: 'Starfsmaður frá starfsmannaleigu',
    LabelEn: null, // No English label provided
  },
  {
    RáðningarstaðaID: 13,
    FK_EmploymentStatusOfTheVictimCode: 400,
    LabelIs: 'Vinna hjá eigin fyrirtæki',
    LabelEn: 'Family worker',
  },
  {
    RáðningarstaðaID: 14,
    FK_EmploymentStatusOfTheVictimCode: 500,
    LabelIs: 'Starfsmaður í þjálfun',
    LabelEn: 'Trainee / Apprentice',
  },
]

export const lengthOfEmployments: LengthOfEmployment[] = [
  {
    StarfstímiID: 2,
    Heiti: 'Fyrsti dagur', // First day
  },
  {
    StarfstímiID: 3,
    Heiti: 'Lengri en dagur', // Longer than a day
  },
  {
    StarfstímiID: 4,
    Heiti: 'Lengri en vika', // Longer than a week
  },
  {
    StarfstímiID: 5,
    Heiti: 'Lengri en mánuður', // Longer than a month
  },
  {
    StarfstímiID: 6,
    Heiti: 'Lengri en ár', // Longer than a year
  },
]

export const workhourArrangements: WorkhourArrangement[] = [
  {
    TegundVinnuID: 2,
    Heiti: 'Dagvinnu', // Daytime work
  },
  {
    TegundVinnuID: 3,
    Heiti: 'Kvöldvinnu', // Evening work
  },
  {
    TegundVinnuID: 4,
    Heiti: 'Næturvinnu', // Night work
  },
  {
    TegundVinnuID: 5,
    Heiti: 'Vaktavinnu', // Shift work
  },
  {
    TegundVinnuID: 6,
    Heiti: 'Yfirvinnu', // Overtime work
  },
  {
    TegundVinnuID: 7,
    Heiti: 'Annars konar vinnu', // Other type of work
  },
]

export const victimsOccupationMajorGroup: VictimsOccupationMajorGroup[] = [
  {
    Code: 1,
    LabelIs: 'Stjórnendur',
    LabelEn: 'Managers',
    ValidToSelect: 0,
  },
  {
    Code: 2,
    LabelIs: 'Sérfræðistörf',
    LabelEn: 'Professional',
    ValidToSelect: 0,
  },
  {
    Code: 3,
    LabelIs: 'Tæknimenntað starfsfólk og aðstoðarfólk sérfræðinga',
    LabelEn: 'Technicians and associate professionals',
    ValidToSelect: 0,
  },
  {
    Code: 4,
    LabelIs: 'Skrifstofustörf o.fl.',
    LabelEn: 'Clerical support workers',
    ValidToSelect: 0,
  },
  {
    Code: 5,
    LabelIs:
      'Þjónustu- og sölustörf, t.d. starfsfólk á leikskólum, við umönnun og lögregla',
    LabelEn: 'Service and sales workers',
    ValidToSelect: 0,
  },
  {
    Code: 6,
    LabelIs: 'Starfsfólk menntað í landbúnaði og fiskiðnaði',
    LabelEn: 'Skilled agricultural, forestry and fishery workers',
    ValidToSelect: 0,
  },
  {
    Code: 7,
    LabelIs: 'Störf iðnaðarmanna og sérhæfðs iðnverkafólks',
    LabelEn: 'Craft and related trades workers',
    ValidToSelect: 0,
  },
  {
    Code: 8,
    LabelIs:
      'Verkafólk í verksmiðjum sem vinnur við vélar og stjórnendur vinnuvéla og ökutækja',
    LabelEn: 'Plant and machine operators, and assemblers',
    ValidToSelect: 0,
  },
  {
    Code: 9,
    LabelIs: 'Almenn störf - Verkafólk',
    LabelEn: 'Elementary occupations',
    ValidToSelect: 0,
  },
]

export const victimsOccupationSubMajorGroup: VictimsOccupationSubMajorGroup[] =
  [
    {
      Code: 11,
      FK_MajorGroupCode: 1,
      LabelIs: 'Störf æðstu embættismanna og kjörinna fulltrúa',
      LabelEn: 'Chief executives, senior officials and legislators',
      ValidToSelect: 0,
    },
    {
      Code: 12,
      FK_MajorGroupCode: 1,
      LabelIs: 'Forstjórar og stjórnendur stærri fyrirtækja og stofnana',
      LabelEn: 'Administrative and commercial managers',
      ValidToSelect: 0,
    },
    {
      Code: 13,
      FK_MajorGroupCode: 1,
      LabelIs: 'Framleiðslustjórar og stjórnendur í sérhæfðri þjónustu',
      LabelEn: 'Production and specialized services managers',
      ValidToSelect: 0,
    },
    {
      Code: 14,
      FK_MajorGroupCode: 1,
      LabelIs:
        'Stjórnendur í hótel- og veitingahúsarekstri, smásölu og annarri þjónustu',
      LabelEn: 'Hospitality, retail and other services managers',
      ValidToSelect: 0,
    },
    {
      Code: 21,
      FK_MajorGroupCode: 2,
      LabelIs: 'Sérfræðingar í vísindum og verkfræði',
      LabelEn: 'Science and engineering professionals',
      ValidToSelect: 0,
    },
    {
      Code: 22,
      FK_MajorGroupCode: 2,
      LabelIs: 'Sérfræðingar í heilbrigðisþjónustu',
      LabelEn: 'Health professionals',
      ValidToSelect: 0,
    },
    {
      Code: 23,
      FK_MajorGroupCode: 2,
      LabelIs: 'Kennarar',
      LabelEn: 'Teaching professionals',
      ValidToSelect: 0,
    },
    {
      Code: 24,
      FK_MajorGroupCode: 2,
      LabelIs: 'Viðskipta- og stjórnsýslufræðingar',
      LabelEn: 'Business and administration professionals',
      ValidToSelect: 0,
    },
    {
      Code: 25,
      FK_MajorGroupCode: 2,
      LabelIs: 'Sérfræðingar í upplýsinga-og fjarskiptatækni',
      LabelEn: 'Information and communications technology professionals',
      ValidToSelect: 0,
    },
    {
      Code: 26,
      FK_MajorGroupCode: 2,
      LabelIs: 'Sérfræðingar í lögfræði, félagsfræði, menningu og listum',
      LabelEn: 'Legal, social and cultural professionals',
      ValidToSelect: 0,
    },
    {
      Code: 31,
      FK_MajorGroupCode: 3,
      LabelIs: 'Aðstoðarfólk í vísindum og raungreinum',
      LabelEn: 'Science and engineering associate professionals',
      ValidToSelect: 0,
    },
    {
      Code: 32,
      FK_MajorGroupCode: 3,
      LabelIs: 'Heilbrigðisstarfsfólk',
      LabelEn: 'Health associate professionals',
      ValidToSelect: 0,
    },
    {
      Code: 33,
      FK_MajorGroupCode: 3,
      LabelIs: 'Sérfræðingar á sviði viðskipta og stjórnsýslu',
      LabelEn: 'Business and administration associate professionals',
      ValidToSelect: 0,
    },
    {
      Code: 34,
      FK_MajorGroupCode: 3,
      LabelIs:
        'Sérfræðingar á sviði lögfræði, félagsmála, menningar og íþrótta',
      LabelEn: 'Legal, social, cultural and related associate professionals',
      ValidToSelect: 0,
    },
    {
      Code: 35,
      FK_MajorGroupCode: 3,
      LabelIs: 'Tæknimenn í upplýsinga- og fjarskiptatækni',
      LabelEn: 'Information and communications technicians',
      ValidToSelect: 0,
    },
    {
      Code: 41,
      FK_MajorGroupCode: 4,
      LabelIs: 'Skrifstofufólk við almenn skrifstofustörf',
      LabelEn: 'General and keyboard clerks',
      ValidToSelect: 0,
    },
    {
      Code: 42,
      FK_MajorGroupCode: 4,
      LabelIs: 'Skrifstofustörf, þjónusta við viðskiptavini',
      LabelEn: 'Customer services clerks',
      ValidToSelect: 0,
    },
    {
      Code: 43,
      FK_MajorGroupCode: 4,
      LabelIs: 'Skrifstofufólk við skráningu og vörumiðlun',
      LabelEn: 'Numerical and material recording clerks',
      ValidToSelect: 0,
    },
    {
      Code: 44,
      FK_MajorGroupCode: 4,
      LabelIs: 'Bréfberar og póstflokkun',
      LabelEn: 'Other clerical support workers',
      ValidToSelect: 1,
    },
    {
      Code: 51,
      FK_MajorGroupCode: 5,
      LabelIs: 'Ýmis persónuleg þjónustustörf',
      LabelEn: 'Personal service workers',
      ValidToSelect: 0,
    },
    {
      Code: 52,
      FK_MajorGroupCode: 5,
      LabelIs: 'Sölumenn',
      LabelEn: 'Sales workers',
      ValidToSelect: 0,
    },
    {
      Code: 53,
      FK_MajorGroupCode: 5,
      LabelIs: 'Starfsfólk við umönnun og kennslu',
      LabelEn: 'Personal care workers',
      ValidToSelect: 0,
    },
    {
      Code: 54,
      FK_MajorGroupCode: 5,
      LabelIs: 'Lögregla, slökkvilið, björgun og gæsla fólks',
      LabelEn: 'Protective services workers',
      ValidToSelect: 0,
    },
    {
      Code: 61,
      FK_MajorGroupCode: 6,
      LabelIs: 'Menntað starfsfólk í landbúnaði',
      LabelEn: 'Market-oriented skilled agricultural workers',
      ValidToSelect: 0,
    },
    {
      Code: 62,
      FK_MajorGroupCode: 6,
      LabelIs: 'Menntað starfsfólk við skógrækt, fiskiðnað og veiðar',
      LabelEn: 'Market-oriented skilled forestry, fishery and hunting workers',
      ValidToSelect: 0,
    },
    {
      Code: 63,
      FK_MajorGroupCode: 6,
      LabelIs: 'Bændur (bóndi)',
      LabelEn: 'Subsistence farmers, fishers, hunters and gatherers',
      ValidToSelect: 0,
    },
    {
      Code: 71,
      FK_MajorGroupCode: 7,
      LabelIs:
        'Starfsfólk í byggingavinnu og skyldum atvinnugreinum, að undanskildum rafvirkjum',
      LabelEn: 'Building and related trades workers, excluding electricians',
      ValidToSelect: 0,
    },
    {
      Code: 72,
      FK_MajorGroupCode: 7,
      LabelIs: 'Málm- og vélvirkjar og skyld störf',
      LabelEn: 'Metal, machinery and related trades workers',
      ValidToSelect: 0,
    },
    {
      Code: 73,
      FK_MajorGroupCode: 7,
      LabelIs: 'Handverksfólk og prentarar',
      LabelEn: 'Handicraft and printing workers',
      ValidToSelect: 0,
    },
    {
      Code: 74,
      FK_MajorGroupCode: 7,
      LabelIs: 'Störf við rafvirkjun og rafeindavirkjun',
      LabelEn: 'Electrical and electronic trades workers',
      ValidToSelect: 0,
    },
    {
      Code: 75,
      FK_MajorGroupCode: 7,
      LabelIs: 'Störf í matvæla-, tré-, fata- textíliðnaði og skyld störf',
      LabelEn:
        'Food processing, wood working, garment and other craft and related trades workers',
      ValidToSelect: 0,
    },
    {
      Code: 81,
      FK_MajorGroupCode: 8,
      LabelIs: 'Verkafólk í verksmiðjum sem vinnur við vélar',
      LabelEn: 'Stationary plant and machine operators',
      ValidToSelect: 0,
    },
    {
      Code: 82,
      FK_MajorGroupCode: 8,
      LabelIs: 'Verkafólk sem vinnur við samsetningu',
      LabelEn: 'Assemblers',
      ValidToSelect: 0,
    },
    {
      Code: 83,
      FK_MajorGroupCode: 8,
      LabelIs: 'Bifreiða- og vinnuvélastjórar',
      LabelEn: 'Drivers and mobile plant operators',
      ValidToSelect: 0,
    },
    {
      Code: 91,
      FK_MajorGroupCode: 9,
      LabelIs: 'Ræstitæknar og þrifafólk',
      LabelEn: 'Cleaners and helpers',
      ValidToSelect: 0,
    },
    {
      Code: 92,
      FK_MajorGroupCode: 9,
      LabelIs: 'Verkafólk í landbúnaði og fiskvinnslu',
      LabelEn: 'Agricultural, forestry and fishery labourers',
      ValidToSelect: 0,
    },
    {
      Code: 93,
      FK_MajorGroupCode: 9,
      LabelIs: 'Verkafólk í byggingarvinnu, pökkun, námuvinnslu og samgöngum',
      LabelEn: 'Labourers in mining, construction, manufacturing and transport',
      ValidToSelect: 0,
    },
    {
      Code: 94,
      FK_MajorGroupCode: 9,
      LabelIs: 'Aðstoðarfólk við matreiðslu',
      LabelEn: 'Food preparation assistants',
      ValidToSelect: 0,
    },
    {
      Code: 95,
      FK_MajorGroupCode: 9,
      LabelIs: 'Götusalar og skyld sölu- og þjónustustörf',
      LabelEn: 'Street and related sales and service workers',
      ValidToSelect: 0,
    },
    {
      Code: 96,
      FK_MajorGroupCode: 9,
      LabelIs: 'Sorphreinsunarmenn og skyld störf',
      LabelEn: 'Refuse workers and other elementary workers',
      ValidToSelect: 0,
    },
  ]

export const absenceDueToAccident: AbsenceDueToAccident[] = [
  {
    FjarveraV: 1,
    FK_DaysLostSeverityCode: '0',
    LabelIs: 'Ekki vitað um fjölda fjarverudaga',
    LabelEn: 'Number of days lost unknown',
  },
  {
    FjarveraV: 2,
    FK_DaysLostSeverityCode: null,
    LabelIs: '0 fjarverudagar',
    LabelEn: '0 days lost',
  },
  {
    FjarveraV: 3,
    FK_DaysLostSeverityCode: null,
    LabelIs: '1 fjarverudagur',
    LabelEn: '1 day lost',
  },
  {
    FjarveraV: 4,
    FK_DaysLostSeverityCode: null,
    LabelIs: '2 - 3 fjarverudagar',
    LabelEn: '2 - 3 days lost',
  },
  {
    FjarveraV: 5,
    FK_DaysLostSeverityCode: 'A01',
    LabelIs: '4 - 6 fjarverudagar',
    LabelEn: '4 - 6 days lost',
  },
  {
    FjarveraV: 6,
    FK_DaysLostSeverityCode: 'A02',
    LabelIs: '7 - 13 fjarverudagar',
    LabelEn: '7 - 13 days lost',
  },
  {
    FjarveraV: 7,
    FK_DaysLostSeverityCode: 'A03',
    LabelIs: '14 - 20 fjarverudagar',
    LabelEn: '14 - 21 days lost',
  },
  {
    FjarveraV: 8,
    FK_DaysLostSeverityCode: 'A04',
    LabelIs: '21- 30 fjarverudagar',
    LabelEn: 'At least 21 days but less than 1 month lost',
  },
  {
    FjarveraV: 9,
    FK_DaysLostSeverityCode: 'A05',
    LabelIs: '31 - 90 fjarverudagar',
    LabelEn: 'At least 1 month but less than 3 months lost',
  },
  {
    FjarveraV: 10,
    FK_DaysLostSeverityCode: 'A06',
    LabelIs: '91 -180 fjarverudagar',
    LabelEn: 'At least 3 months but less than 6 months lost',
  },
  {
    FjarveraV: 11,
    FK_DaysLostSeverityCode: '997',
    LabelIs: 'Fleiri en 180 dagar eða óvinnufær',
    LabelEn:
      "Permanent incapacity (to work) or 183 or more days lost (6 months' absence or more)",
  },
  {
    FjarveraV: 12,
    FK_DaysLostSeverityCode: '998',
    LabelIs: 'Dauðaslys',
    LabelEn: 'Fatal accident',
  },
]

export const specificPhysicalActivityGroups: SpecificPhysicalActivityGroup[] = [
  {
    Code: 10,
    LabelIs: 'Unnið við vél  (vélar fastar á sama stað)',
    LabelEn: 'Operating machine - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 20,
    LabelIs: 'Vinna með handverkfæri',
    LabelEn: 'Working with hand-held tools - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 30,
    LabelIs:
      'Stjórna eða vera farþegi í farartæki, vinnuvél eða öðrum hreyfanlegum tækjum',
    LabelEn:
      'Driving/being on board a means of transport or handling equipment - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 40,
    LabelIs: 'Handleika hluti',
    LabelEn: 'Handling of objects - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 50,
    LabelIs: 'Halda á með höndum',
    LabelEn: 'Carrying by hand - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 60,
    LabelIs: 'Hreyfing',
    LabelEn: 'Movement - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 70,
    LabelIs: 'Kyrrstaða (t.d. sitja við borð og hlutur fellur á viðkomandi)',
    LabelEn: 'Presence - Not specified',
    ValidToSelect: 1,
  },
]

export const victimOccupationMinorGroups = [
  {
    Code: 111,
    FK_SubMajorGroupCode: 11,
    LabelIs: 'Kjörnir fulltrúar og æðstu embættismenn',
    LabelEn: 'Chief executives, senior officials and legislators',
    ValidToSelect: 0,
  },
  {
    Code: 121,
    FK_SubMajorGroupCode: 12,
    LabelIs: 'Forstjórar og framkvæmdastjórar fyrirtækja og stofnana',
    LabelEn: 'Business services and administration managers',
    ValidToSelect: 0,
  },
  {
    Code: 122,
    FK_SubMajorGroupCode: 12,
    LabelIs: 'Yfirmenn framleiðslu- og rekstrar- og þróunardeilda',
    LabelEn: 'Sales, marketing and development managers',
    ValidToSelect: 1,
  },
  {
    Code: 131,
    FK_SubMajorGroupCode: 13,
    LabelIs: 'Framleiðslustjórar í landbúnaði, skógrækt og fiskiðnaði',
    LabelEn: 'Production managers in agriculture, forestry and fisheries',
    ValidToSelect: 1,
  },
  {
    Code: 132,
    FK_SubMajorGroupCode: 13,
    LabelIs: 'Framkvæmdastjórar í byggingariðnaði og dreifingarstjórnun',
    LabelEn: 'Manufacturing, mining, construction, and distribution managers',
    ValidToSelect: 0,
  },
  {
    Code: 133,
    FK_SubMajorGroupCode: 13,
    LabelIs: 'Þjónustustjórar í upplýsinga- og fjarskiptatækni',
    LabelEn: 'Information and communications technology service managers',
    ValidToSelect: 1,
  },
  {
    Code: 134,
    FK_SubMajorGroupCode: 13,
    LabelIs: 'Stjórnendur í sérfræðiþjónustu',
    LabelEn: 'Professional services managers',
    ValidToSelect: 1,
  },
  {
    Code: 141,
    FK_SubMajorGroupCode: 14,
    LabelIs: 'Hótel- og veitingastjórar',
    LabelEn: 'Hotel and restaurant managers',
    ValidToSelect: 0,
  },
  {
    Code: 142,
    FK_SubMajorGroupCode: 14,
    LabelIs: 'Verslunarstjórar í smásölu- og heildsölu',
    LabelEn: 'Retail and wholesale trade managers',
    ValidToSelect: 1,
  },
  {
    Code: 143,
    FK_SubMajorGroupCode: 14,
    LabelIs: 'Aðrir þjónustustjórar',
    LabelEn: 'Other services managers',
    ValidToSelect: 1,
  },
  {
    Code: 211,
    FK_SubMajorGroupCode: 21,
    LabelIs: 'Sérfræðistörf í eðlis- og efnafræði, jarð- og veðurfræði',
    LabelEn: 'Physical and earth science professionals',
    ValidToSelect: 1,
  },
  {
    Code: 212,
    FK_SubMajorGroupCode: 21,
    LabelIs: 'Stærðfræðingar, tryggingafræðingar og tölfræðingar',
    LabelEn: 'Mathematicians, actuaries and statisticians',
    ValidToSelect: 1,
  },
  {
    Code: 213,
    FK_SubMajorGroupCode: 21,
    LabelIs: 'Sérfræðingar í lífvísindum, lífeindafræðingar og geislafræðingar',
    LabelEn: 'Life science professionals',
    ValidToSelect: 1,
  },
  {
    Code: 214,
    FK_SubMajorGroupCode: 21,
    LabelIs: 'Sérfræðistörf í verk og tæknifræði (að undanskildri raftækni)',
    LabelEn: 'Engineering professionals (excluding electrotechnology)',
    ValidToSelect: 0,
  },
  {
    Code: 215,
    FK_SubMajorGroupCode: 21,
    LabelIs: 'Verk og tæknifræðingar í raftækni og fjarskiptatækni',
    LabelEn: 'Electrotechnology engineers',
    ValidToSelect: 0,
  },
  {
    Code: 216,
    FK_SubMajorGroupCode: 21,
    LabelIs: 'Arkitektar, skipulagsfræðingar, landmælingamenn og hönnuðir',
    LabelEn: 'Architects, planners, surveyors and designers',
    ValidToSelect: 0,
  },
  {
    Code: 221,
    FK_SubMajorGroupCode: 22,
    LabelIs: 'Læknar',
    LabelEn: 'Medical doctors',
    ValidToSelect: 0,
  },
  {
    Code: 222,
    FK_SubMajorGroupCode: 22,
    LabelIs: 'Hjúkrunarfræðingar og ljósmæður',
    LabelEn: 'Nursing and midwifery professionals',
    ValidToSelect: 0,
  },
  {
    Code: 224,
    FK_SubMajorGroupCode: 22,
    LabelIs: 'Bráðatæknar',
    LabelEn: 'Paramedical practitioners',
    ValidToSelect: 1,
  },
  {
    Code: 225,
    FK_SubMajorGroupCode: 22,
    LabelIs: 'Dýralæknar',
    LabelEn: 'Veterinarians',
    ValidToSelect: 1,
  },
  {
    Code: 226,
    FK_SubMajorGroupCode: 22,
    LabelIs: 'Aðrir sérfræðingar í heilbrigðisþjónustu',
    LabelEn: 'Other health professionals',
    ValidToSelect: 0,
  },
  {
    Code: 227,
    FK_SubMajorGroupCode: 22,
    LabelIs: 'Sérfræðimenntað aðstoðarfólk í heilbrigðisþjónustu',
    LabelEn: 'Medical Assistant professionals',
    ValidToSelect: 1,
  },
  {
    Code: 231,
    FK_SubMajorGroupCode: 23,
    LabelIs: 'Kennarar á háskólastigi',
    LabelEn: 'University and higher education teachers',
    ValidToSelect: 1,
  },
  {
    Code: 232,
    FK_SubMajorGroupCode: 23,
    LabelIs: 'Verknámskennarar',
    LabelEn: 'Vocational education teachers',
    ValidToSelect: 1,
  },
  {
    Code: 233,
    FK_SubMajorGroupCode: 23,
    LabelIs: 'Framhaldsskólakennarar',
    LabelEn: 'Secondary education teachers',
    ValidToSelect: 1,
  },
  {
    Code: 234,
    FK_SubMajorGroupCode: 23,
    LabelIs: 'Grunnskóla-og leikskólakennarar',
    LabelEn: 'Primary school and early childhood teachers',
    ValidToSelect: 0,
  },
  {
    Code: 235,
    FK_SubMajorGroupCode: 23,
    LabelIs: 'Aðrir kennarar og kennslufræðingar',
    LabelEn: 'Other teaching professionals',
    ValidToSelect: 0,
  },
  {
    Code: 241,
    FK_SubMajorGroupCode: 24,
    LabelIs: 'Fjármálasérfræðingar (t.d. viðskiptafræðingar)',
    LabelEn: 'Finance professionals',
    ValidToSelect: 1,
  },
  {
    Code: 242,
    FK_SubMajorGroupCode: 24,
    LabelIs: 'Stjórnsýslufræðingar',
    LabelEn: 'Administration professionals',
    ValidToSelect: 1,
  },
  {
    Code: 243,
    FK_SubMajorGroupCode: 24,
    LabelIs: 'Sérfræðingar í sölu, markaðssetningu og almannatengslum',
    LabelEn: 'Sales, marketing and public relations professionals',
    ValidToSelect: 1,
  },
  {
    Code: 251,
    FK_SubMajorGroupCode: 25,
    LabelIs: 'Forritarar og hugbúnaðarsérfræðingar',
    LabelEn: 'Software and applications developers and analysts',
    ValidToSelect: 0,
  },
  {
    Code: 252,
    FK_SubMajorGroupCode: 25,
    LabelIs: 'Gagnagrunns- og dreifikerfissérfræðingar',
    LabelEn: 'Database and network professionals',
    ValidToSelect: 0,
  },
  {
    Code: 261,
    FK_SubMajorGroupCode: 26,
    LabelIs: 'Lögfræðingar og lögmenn',
    LabelEn: 'Legal professionals',
    ValidToSelect: 0,
  },
  {
    Code: 262,
    FK_SubMajorGroupCode: 26,
    LabelIs: 'Sérfræðingar í bókasafns, skjala-og safnfræði',
    LabelEn: 'Librarians, archivists and curators',
    ValidToSelect: 0,
  },
  {
    Code: 263,
    FK_SubMajorGroupCode: 26,
    LabelIs: 'Sérfræðingar í félags-og trúfræði',
    LabelEn: 'Social and religious professionals',
    ValidToSelect: 0,
  },
  {
    Code: 264,
    FK_SubMajorGroupCode: 26,
    LabelIs: 'Rithöfundar, blaðamenn og málvísindamenn',
    LabelEn: 'Authors, journalists and linguists',
    ValidToSelect: 0,
  },
  {
    Code: 265,
    FK_SubMajorGroupCode: 26,
    LabelIs: 'Sviðslistamenn og aðrir listamenn',
    LabelEn: 'Creative and performing artists',
    ValidToSelect: 0,
  },
  {
    Code: 311,
    FK_SubMajorGroupCode: 31,
    LabelIs: 'Tæknifólk á sviði eðlis- og verkfræði',
    LabelEn: 'Physical and engineering science technicians',
    ValidToSelect: 0,
  },
  {
    Code: 312,
    FK_SubMajorGroupCode: 31,
    LabelIs: 'Verkstjórar í framleiðslu og mannvirkjagerð',
    LabelEn: 'Mining, manufacturing and construction supervisors',
    ValidToSelect: 0,
  },
  {
    Code: 313,
    FK_SubMajorGroupCode: 31,
    LabelIs: 'Vélfræðingar og vélstjórar, tæknimenn í framleiðsluferlum',
    LabelEn: 'Process control technicians',
    ValidToSelect: 0,
  },
  {
    Code: 314,
    FK_SubMajorGroupCode: 31,
    LabelIs: 'Tæknimenn í lífvísindum og skyld störf',
    LabelEn: 'Life science technicians and related associate professionals',
    ValidToSelect: 1,
  },
  {
    Code: 315,
    FK_SubMajorGroupCode: 31,
    LabelIs: 'Áhafnir flugvéla og skipa, flugumferðarstjórar',
    LabelEn: 'Ship and aircraft controllers and technicians',
    ValidToSelect: 1,
  },
  {
    Code: 321,
    FK_SubMajorGroupCode: 32,
    LabelIs: 'Aðstoðarfólk í læknis- og lyfjafræði',
    LabelEn: 'Medical and pharmaceutical technicians',
    ValidToSelect: 1,
  },
  {
    Code: 322,
    FK_SubMajorGroupCode: 32,
    LabelIs: 'Sjúkraliðar og félagsliðar',
    LabelEn: 'Nursing and midwifery associate professionals',
    ValidToSelect: 1,
  },
  {
    Code: 324,
    FK_SubMajorGroupCode: 32,
    LabelIs: 'Sérhæfðir aðstoðarmenn dýralækna',
    LabelEn: 'Veterinary technicians and assistants',
    ValidToSelect: 1,
  },
  {
    Code: 325,
    FK_SubMajorGroupCode: 32,
    LabelIs: 'Annað sérhæft starfsfólk í lýðheilsu og heilbrigðisþjónustu',
    LabelEn: 'Other health associate professionals',
    ValidToSelect: 0,
  },
  {
    Code: 331,
    FK_SubMajorGroupCode: 33,
    LabelIs: 'Sérhæfðir aðstoðarmenn í fjármálum og stærðfræði',
    LabelEn: 'Financial and mathematical associate professionals',
    ValidToSelect: 1,
  },
  {
    Code: 332,
    FK_SubMajorGroupCode: 33,
    LabelIs: 'Sölumenn og miðlarar',
    LabelEn: 'Sales and purchasing agents and brokers',
    ValidToSelect: 1,
  },
  {
    Code: 333,
    FK_SubMajorGroupCode: 33,
    LabelIs: 'Viðskiptafulltrúar',
    LabelEn: 'Business services agents',
    ValidToSelect: 1,
  },
  {
    Code: 334,
    FK_SubMajorGroupCode: 33,
    LabelIs: 'Aðstoðarmenn í stjórnsýslu',
    LabelEn: 'Administrative and specialized secretaries',
    ValidToSelect: 1,
  },
  {
    Code: 335,
    FK_SubMajorGroupCode: 33,
    LabelIs: 'Eftirlitsmenn hjá hinu opinbera',
    LabelEn: 'Regulatory government associate professionals',
    ValidToSelect: 0,
  },
  {
    Code: 341,
    FK_SubMajorGroupCode: 34,
    LabelIs:
      'Starfsfólk sem tengist sérfræðisviðum lögfræði, félagsmála og trúarhreyfi',
    LabelEn: 'Legal, social and religious associate professionals',
    ValidToSelect: 1,
  },
  {
    Code: 342,
    FK_SubMajorGroupCode: 34,
    LabelIs: 'Íþrótta- og líkamsræktarþjálfarar, atvinnufólk í íþróttum',
    LabelEn: 'Sports and fitness workers',
    ValidToSelect: 1,
  },
  {
    Code: 343,
    FK_SubMajorGroupCode: 34,
    LabelIs: 'Starfsfólk í listum, menningu og matreiðslu',
    LabelEn: 'Artistic, cultural and culinary associate professionals',
    ValidToSelect: 0,
  },
  {
    Code: 351,
    FK_SubMajorGroupCode: 35,
    LabelIs: 'Tæknimenn í upplýsinga- og fjarskiptatækni og notendaþjónustu',
    LabelEn:
      'Information and communications technology operations and user support',
    ValidToSelect: 0,
  },
  {
    Code: 352,
    FK_SubMajorGroupCode: 35,
    LabelIs: 'Tæknimenn í fjarskiptum og dreifingu útvarps- og sjónvarpsefnis',
    LabelEn: 'Telecommunications and broadcasting technicians',
    ValidToSelect: 1,
  },
  {
    Code: 411,
    FK_SubMajorGroupCode: 41,
    LabelIs: 'Skrifstofumenn við almenn skrifstofustörf',
    LabelEn: 'General office clerks',
    ValidToSelect: 1,
  },
  {
    Code: 412,
    FK_SubMajorGroupCode: 41,
    LabelIs: 'Ritarar',
    LabelEn: 'Secretaries (general)',
    ValidToSelect: 1,
  },
  {
    Code: 421,
    FK_SubMajorGroupCode: 42,
    LabelIs: 'Gjaldkerar, innheimtufulltrúar og tengd störf',
    LabelEn: 'Tellers, money collectors and related clerks',
    ValidToSelect: 1,
  },
  {
    Code: 422,
    FK_SubMajorGroupCode: 42,
    LabelIs: 'Starfsmenn í viðskiptavinaupplýsingum',
    LabelEn: 'Client information workers',
    ValidToSelect: 1,
  },
  {
    Code: 431,
    FK_SubMajorGroupCode: 43,
    LabelIs: 'Skrifstofumenn við tölulega skráningu',
    LabelEn: 'Numerical clerks',
    ValidToSelect: 1,
  },
  {
    Code: 432,
    FK_SubMajorGroupCode: 43,
    LabelIs: 'Skrifstofumenn í vörumiðlun',
    LabelEn: 'Material-recording and transport clerks',
    ValidToSelect: 1,
  },
  {
    Code: 511,
    FK_SubMajorGroupCode: 51,
    LabelIs: 'Þjónustustörf tengd ferðalögum',
    LabelEn: 'Travel attendants, conductors and guides',
    ValidToSelect: 0,
  },
  {
    Code: 512,
    FK_SubMajorGroupCode: 51,
    LabelIs: 'Kokkar',
    LabelEn: 'Cooks',
    ValidToSelect: 1,
  },
  {
    Code: 513,
    FK_SubMajorGroupCode: 51,
    LabelIs: 'Framreiðslufólk, þjónar og barþjónar',
    LabelEn: 'Waiters and bartenders',
    ValidToSelect: 0,
  },
  {
    Code: 514,
    FK_SubMajorGroupCode: 51,
    LabelIs: 'Hársnyrtar (hárgreiðslufólk), snyrtifræðingar og tengd störf',
    LabelEn: 'Hairdressers, beauticians and related workers',
    ValidToSelect: 1,
  },
  {
    Code: 515,
    FK_SubMajorGroupCode: 51,
    LabelIs: 'Húsverðir, umsjónamenn fasteigna',
    LabelEn: 'Building and housekeeping supervisors',
    ValidToSelect: 1,
  },
  {
    Code: 516,
    FK_SubMajorGroupCode: 51,
    LabelIs:
      'Ökukennarar, útfararstjórar, tamningafólk, spákonur og önnur þjónusta',
    LabelEn: 'Other personal services workers',
    ValidToSelect: 1,
  },
  {
    Code: 521,
    FK_SubMajorGroupCode: 52,
    LabelIs: 'Sölumenn í sölubásum og á mörkuðum',
    LabelEn: 'Street and market salespersons',
    ValidToSelect: 1,
  },
  {
    Code: 522,
    FK_SubMajorGroupCode: 52,
    LabelIs: 'Sölumenn í verslunum',
    LabelEn: 'Shop salespersons',
    ValidToSelect: 0,
  },
  {
    Code: 523,
    FK_SubMajorGroupCode: 52,
    LabelIs: 'Gjaldkerar og miðasalar',
    LabelEn: 'Cashiers and ticket clerks',
    ValidToSelect: 1,
  },
  {
    Code: 524,
    FK_SubMajorGroupCode: 52,
    LabelIs: 'Aðrir sölumenn',
    LabelEn: 'Other sales workers',
    ValidToSelect: 1,
  },
  {
    Code: 531,
    FK_SubMajorGroupCode: 53,
    LabelIs:
      'Starfsfólk á leikskólum, dagmæður, leiðbeinendur, stuðningsf. leikskóla',
    LabelEn: 'Child care workers and teachers aides',
    ValidToSelect: 1,
  },
  {
    Code: 532,
    FK_SubMajorGroupCode: 53,
    LabelIs:
      'Starfsfólk við umönnun (aðhlynningu) í heilbrigðisþjónustu og heimahjálp',
    LabelEn: 'Personal care workers in health services',
    ValidToSelect: 1,
  },
  {
    Code: 541,
    FK_SubMajorGroupCode: 54,
    LabelIs:
      'Lögregla, slökkvilið, björgun fólks, fangavarsla, öryggisgæsla, dyravarsla og',
    LabelEn: 'Protective services workers',
    ValidToSelect: 0,
  },
  {
    Code: 611,
    FK_SubMajorGroupCode: 61,
    LabelIs: 'Sérmenntað starfsfólk í garðyrkju og ræktun (garðyrkjufræðingur)',
    LabelEn: 'Market gardeners and crop growers',
    ValidToSelect: 1,
  },
  {
    Code: 612,
    FK_SubMajorGroupCode: 61,
    LabelIs: 'Sérmenntað starfsfólk í ræktun dýra',
    LabelEn: 'Animal producers',
    ValidToSelect: 1,
  },
  {
    Code: 613,
    FK_SubMajorGroupCode: 61,
    LabelIs: 'Sérmenntað starfsfólk í nytjaplönturæktun',
    LabelEn: 'Mixed crop and animal producers',
    ValidToSelect: 1,
  },
  {
    Code: 621,
    FK_SubMajorGroupCode: 62,
    LabelIs: 'Skógræktarbændur og skyld störf',
    LabelEn: 'Forestry and related workers',
    ValidToSelect: 1,
  },
  {
    Code: 622,
    FK_SubMajorGroupCode: 62,
    LabelIs:
      'Menntað fiskvinnslufólk, veiðmenn og veiðimenn sem veiða í gildru',
    LabelEn: 'Fishery workers, hunters and trappers',
    ValidToSelect: 0,
  },
  {
    Code: 631,
    FK_SubMajorGroupCode: 63,
    LabelIs: 'Bændur í matjurta og kornrækt',
    LabelEn: 'Subsistence crop farmers',
    ValidToSelect: 1,
  },
  {
    Code: 632,
    FK_SubMajorGroupCode: 63,
    LabelIs: 'Kvikfjárbændur',
    LabelEn: 'Subsistence livestock farmers',
    ValidToSelect: 1,
  },
  {
    Code: 634,
    FK_SubMajorGroupCode: 63,
    LabelIs: 'Veiðmenn (minnkur, lágfóta, silungur, lax, svartfugl, o.fl.)',
    LabelEn: 'Subsistence fishers, hunters, trappers and gatherers',
    ValidToSelect: 1,
  },
  {
    Code: 711,
    FK_SubMajorGroupCode: 71,
    LabelIs:
      'Starfsfólk í byggingavinnu og skyldum atvinnugreinum, að undanskildum r',
    LabelEn: 'Building frame and related trades workers',
    ValidToSelect: 0,
  },
  {
    Code: 712,
    FK_SubMajorGroupCode: 71,
    LabelIs: 'Iðnaðarmenn við lokafrágang bygginga',
    LabelEn: 'Building finishers and related trades workers',
    ValidToSelect: 0,
  },
  {
    Code: 713,
    FK_SubMajorGroupCode: 71,
    LabelIs: 'Málarar, húsaþvottamenn og önnur skyld störf',
    LabelEn: 'Painters, building structure cleaners and related trades workers',
    ValidToSelect: 0,
  },
  {
    Code: 721,
    FK_SubMajorGroupCode: 72,
    LabelIs: 'Blikksmiðir, málmsuðumenn (rafsuðumenn) og skyld störf',
    LabelEn:
      'Sheet and structural metal workers, moulders and welders, and related',
    ValidToSelect: 1,
  },
  {
    Code: 722,
    FK_SubMajorGroupCode: 72,
    LabelIs:
      'Járnsmiðir, stálsmiðir, vélsmiðir, rennismiðir, ketil- og plötusmiðir o.fl.',
    LabelEn: 'Blacksmiths, toolmakers and related trades workers',
    ValidToSelect: 1,
  },
  {
    Code: 723,
    FK_SubMajorGroupCode: 72,
    LabelIs: 'Vélvirkjar og viðgerðarmenn',
    LabelEn: 'Machinery mechanics and repairers',
    ValidToSelect: 0,
  },
  {
    Code: 731,
    FK_SubMajorGroupCode: 73,
    LabelIs: 'Handverksfólk',
    LabelEn: 'Handicraft workers',
    ValidToSelect: 0,
  },
  {
    Code: 732,
    FK_SubMajorGroupCode: 73,
    LabelIs: 'Prentarar og bókbindarar',
    LabelEn: 'Printing trades workers',
    ValidToSelect: 1,
  },
  {
    Code: 741,
    FK_SubMajorGroupCode: 74,
    LabelIs: 'Rafvirkjar, uppsetning og viðgerðir',
    LabelEn: 'Electrical equipment installers and repairers',
    ValidToSelect: 1,
  },
  {
    Code: 742,
    FK_SubMajorGroupCode: 74,
    LabelIs: 'Rafeindavirkjar og símvirkjar, uppsetning og viðgerðir',
    LabelEn: 'Electronics and telecommunications installers and repairers',
    ValidToSelect: 1,
  },
  {
    Code: 751,
    FK_SubMajorGroupCode: 75,
    LabelIs: 'Störf í matvælaiðnaði',
    LabelEn: 'Food processing and related trades workers',
    ValidToSelect: 0,
  },
  {
    Code: 752,
    FK_SubMajorGroupCode: 75,
    LabelIs: 'Húsgagnasmiðir á verkstæðum og skyld störf',
    LabelEn: 'Wood treaters, cabinet-makers and related trades workers',
    ValidToSelect: 1,
  },
  {
    Code: 753,
    FK_SubMajorGroupCode: 75,
    LabelIs: 'Störf í fata-og textíliðnaði',
    LabelEn: 'Garment and related trades workers',
    ValidToSelect: 1,
  },
  {
    Code: 754,
    FK_SubMajorGroupCode: 75,
    LabelIs: 'Störf í öðrum iðnaði',
    LabelEn: 'Other craft and related workers',
    ValidToSelect: 0,
  },
  {
    Code: 811,
    FK_SubMajorGroupCode: 81,
    LabelIs: 'Verkafólk sem vinnur við vélar í námum',
    LabelEn: 'Mining and mineral processing plant operators',
    ValidToSelect: 1,
  },
  {
    Code: 812,
    FK_SubMajorGroupCode: 81,
    LabelIs:
      'Verkafólk sem vinnur við vélar í málmvinnslu (t.d. álver, járnblendi, kísilve',
    LabelEn: 'Metal processing and finishing plant operators',
    ValidToSelect: 1,
  },
  {
    Code: 813,
    FK_SubMajorGroupCode: 81,
    LabelIs: 'Verkafólk sem vinnur við vélar í efnaverksmiðjum',
    LabelEn: 'Chemical and photographic products plant and machine operators',
    ValidToSelect: 1,
  },
  {
    Code: 814,
    FK_SubMajorGroupCode: 81,
    LabelIs:
      'Verkafólk sem vinnur við vélar í gummí-, plast- eða pappírsverksmiðjum',
    LabelEn: 'Rubber, plastic and paper products machine operators',
    ValidToSelect: 1,
  },
  {
    Code: 815,
    FK_SubMajorGroupCode: 81,
    LabelIs: 'Verkafólk sem vinnur við vélar í textíl og loðskinnaverkun',
    LabelEn: 'Textile, fur and leather products machine operators',
    ValidToSelect: 1,
  },
  {
    Code: 816,
    FK_SubMajorGroupCode: 81,
    LabelIs: 'Verkafólk sem vinnur við vélar í matvælaverksmiðjum',
    LabelEn: 'Food and related products machine operators',
    ValidToSelect: 1,
  },
  {
    Code: 817,
    FK_SubMajorGroupCode: 81,
    LabelIs: 'Verkafólk sem vinnur við vélar í timburvinnslu og pappírsgerð',
    LabelEn: 'Wood processing and papermaking plant operators',
    ValidToSelect: 1,
  },
  {
    Code: 818,
    FK_SubMajorGroupCode: 81,
    LabelIs: 'Annað verkafólk sem vinnur við vélar í verksmiðjum',
    LabelEn: 'Other stationary plant and machine operators',
    ValidToSelect: 1,
  },
  {
    Code: 832,
    FK_SubMajorGroupCode: 83,
    LabelIs: 'Bílstjórar, sendibílstjórar og stjórnendur bifhjóls',
    LabelEn: 'Car, van and motorcycle drivers',
    ValidToSelect: 0,
  },
  {
    Code: 833,
    FK_SubMajorGroupCode: 83,
    LabelIs: 'Bílstjórar vörubifreiða og almenningsvagna',
    LabelEn: 'Heavy truck and bus drivers',
    ValidToSelect: 0,
  },
  {
    Code: 834,
    FK_SubMajorGroupCode: 83,
    LabelIs: 'Stjórnendur vinnuvéla',
    LabelEn: 'Mobile plant operators',
    ValidToSelect: 0,
  },
  {
    Code: 911,
    FK_SubMajorGroupCode: 91,
    LabelIs: 'Ræstitæknar á heimilum og vinnustöðum, hótelþernur',
    LabelEn: 'Domestic, hotel and office cleaners and helpers',
    ValidToSelect: 1,
  },
  {
    Code: 912,
    FK_SubMajorGroupCode: 91,
    LabelIs: 'Bílaþvottamenn, gluggaþvottamenn og annar handþvottur',
    LabelEn: 'Vehicle, window, laundry and other hand cleaning workers',
    ValidToSelect: 1,
  },
  {
    Code: 921,
    FK_SubMajorGroupCode: 92,
    LabelIs: 'Verkafólk í landbúnaði og fiskvinnslu',
    LabelEn: 'Agricultural, forestry and fishery labourers',
    ValidToSelect: 0,
  },
  {
    Code: 931,
    FK_SubMajorGroupCode: 93,
    LabelIs: 'Verkafólk í mannvirkjagerð (byggingarvinnu) og námum',
    LabelEn: 'Building and related labourers, mining and quarrying',
    ValidToSelect: 0,
  },
  {
    Code: 932,
    FK_SubMajorGroupCode: 93,
    LabelIs: 'Verkafólk í framleiðslu og flutningum',
    LabelEn: 'Manufacturing and transport labourers',
    ValidToSelect: 0,
  },
  {
    Code: 933,
    FK_SubMajorGroupCode: 93,
    LabelIs: 'Annað verkafólk',
    LabelEn: 'Other labourers',
    ValidToSelect: 0,
  },
]

// export const subMajorGroups = [
//   {
//     Code: 31,
//     LabelIs: 'Tæknimenn og sérfræðingar',
//     LabelEn: 'Technicians and associate professionals',
//   },
//   {
//     Code: 32,
//     LabelIs: 'Heilbrigðisstarfsmenn og aðstoðarfólk',
//     LabelEn: 'Health professionals and associate professionals',
//   },
//   {
//     Code: 33,
//     LabelIs: 'Fjármálastarfsmenn og sérfræðingar',
//     LabelEn: 'Financial and business services',
//   },
//   {
//     Code: 34,
//     LabelIs: 'Lögfræði, félagsmál og trúarbrögð',
//     LabelEn: 'Legal, social and religious professions',
//   },
//   {
//     Code: 35,
//     LabelIs: 'Upplýsinga- og fjarskiptatækni',
//     LabelEn: 'Information and communication technology',
//   },
//   { Code: 41, LabelIs: 'Skrifstofufólk', LabelEn: 'Office clerks' },
//   { Code: 42, LabelIs: 'Fjármálastarfsmenn', LabelEn: 'Tellers and cashiers' },
//   {
//     Code: 43,
//     LabelIs: 'Töluleg skrifstofustörf',
//     LabelEn: 'Numerical and material recording clerks',
//   },
//   {
//     Code: 51,
//     LabelIs: 'Þjónusta og matvæli',
//     LabelEn: 'Service and sales workers',
//   },
//   {
//     Code: 52,
//     LabelIs: 'Verslun og sala',
//     LabelEn: 'Sales and related occupations',
//   },
//   {
//     Code: 53,
//     LabelIs: 'Menntun og umönnun',
//     LabelEn: 'Education and personal care',
//   },
//   {
//     Code: 54,
//     LabelIs: 'Öryggis- og verndartengd störf',
//     LabelEn: 'Protective services',
//   },
//   {
//     Code: 61,
//     LabelIs: 'Búskapur og garðyrkja',
//     LabelEn: 'Agriculture and horticulture',
//   },
//   {
//     Code: 62,
//     LabelIs: 'Skóg- og fiskvinnsla',
//     LabelEn: 'Forestry and fishing',
//   },
//   {
//     Code: 63,
//     LabelIs: 'Landbúnaður og veiði',
//     LabelEn: 'Subsistence agriculture and fishing',
//   },
//   { Code: 71, LabelIs: 'Byggingavinna', LabelEn: 'Building and construction' },
//   {
//     Code: 72,
//     LabelIs: 'Iðnaðarstarfsemi',
//     LabelEn: 'Manufacturing and engineering',
//   },
//   {
//     Code: 73,
//     LabelIs: 'Handverk og hönnun',
//     LabelEn: 'Handicrafts and design',
//   },
//   {
//     Code: 74,
//     LabelIs: 'Raf- og rafeindatækni',
//     LabelEn: 'Electrical and electronic trades',
//   },
//   { Code: 75, LabelIs: 'Íðnaðariðnaður', LabelEn: 'Industrial trades' },
//   {
//     Code: 81,
//     LabelIs: 'Verkafólk í verksmiðjum',
//     LabelEn: 'Plant and machine operators',
//   },
//   {
//     Code: 83,
//     LabelIs: 'Bílstjórar og vélstjórar',
//     LabelEn: 'Drivers and mobile plant operators',
//   },
//   {
//     Code: 91,
//     LabelIs: 'Hreingerning og þrif',
//     LabelEn: 'Cleaning and helpers',
//   },
//   {
//     Code: 92,
//     LabelIs: 'Landbúnaðar- og fiskvinnslustörf',
//     LabelEn: 'Agricultural and fishery labourers',
//   },
//   {
//     Code: 93,
//     LabelIs: 'Byggingavinna og framleiðsla',
//     LabelEn: 'Building and manufacturing labourers',
//   },
// ]

export const activities: SpecificPhysicalActivity[] = [
  {
    Code: 11,
    FK_Group: 10,
    LabelIs: 'Gagnsetning vélar, stöðvun vélar',
    LabelEn: 'Starting the machine, stopping the machine',
    ValidToSelect: 1,
  },
  {
    Code: 12,
    FK_Group: 10,
    LabelIs: 'Mötun í vél, taka úr vél',
    LabelEn: 'Feeding the machine, unloading the machine',
    ValidToSelect: 1,
  },
  {
    Code: 13,
    FK_Group: 10,
    LabelIs:
      'Umsjón með vél, stýring eða keyrsla vélar (t.d. byggingarkranar og hafnarkranar)',
    LabelEn: 'Monitoring the machine, operating or driving the machine',
    ValidToSelect: 1,
  },
  {
    Code: 19,
    FK_Group: 10,
    LabelIs: 'Önnur vinna við vélar',
    LabelEn:
      'Other group 10 type Specific Physical Activities not listed above',
    ValidToSelect: 1,
  },
  {
    Code: 21,
    FK_Group: 20,
    LabelIs: 'Vinna með handverkfærum (t.d. hnífur, hamar og sög)',
    LabelEn: 'Working with hand-held tools - manual',
    ValidToSelect: 1,
  },
  {
    Code: 22,
    FK_Group: 20,
    LabelIs:
      'Vinna með véldrifnum handverkfærum (t.d. slípirokkur, borvél og hjólsög)',
    LabelEn: 'Working with hand-held tools - motorised',
    ValidToSelect: 1,
  },
  {
    Code: 31,
    FK_Group: 30,
    LabelIs:
      'Stjórna véldrifnu farartæki eða vinnuvél (bifreiðar, lyftarar og aðrar vinnuvélar)',
    LabelEn:
      'Driving a means of transport or handling equipment - mobile and motorised',
    ValidToSelect: 1,
  },
  {
    Code: 32,
    FK_Group: 30,
    LabelIs:
      'Stjórna farartæki eða hreyfanlegu tæki sem eru ekki véldrifin (t.d. reiðhjól og hjólbörur)',
    LabelEn:
      'Driving a means of transport or handling equipment - mobile and non-motorised',
    ValidToSelect: 1,
  },
  {
    Code: 33,
    FK_Group: 30,
    LabelIs: 'Farþegi',
    LabelEn: 'Being a passenger on board a means of transport',
    ValidToSelect: 1,
  },
  {
    Code: 41,
    FK_Group: 40,
    LabelIs:
      'Taka utan um, grípa um, teygja sig í, halda um eða staðsetja - í lárétta stöðu',
    LabelEn:
      'Manually taking hold of, grasping, seizing, holding, placing - on a horizontal level',
    ValidToSelect: 1,
  },
  {
    Code: 42,
    FK_Group: 40,
    LabelIs:
      'Binda, kefla, rífa af, aftengja, kreista, losa skrúfu, festa skrúfu, snúa við',
    LabelEn:
      'Tying, binding, tearing off, undoing, squeezing, unscrewing, screwing, turning',
    ValidToSelect: 1,
  },
  {
    Code: 43,
    FK_Group: 40,
    LabelIs: 'Festa, hengja upp, reisa, setja upp - í lóðrétta stöðu',
    LabelEn: 'Fastening, hanging up, raising, putting up - on a vertical level',
    ValidToSelect: 1,
  },
  {
    Code: 44,
    FK_Group: 40,
    LabelIs: 'Kasta, þeyta í burtu',
    LabelEn: 'Throwing, flinging away',
    ValidToSelect: 1,
  },
  {
    Code: 45,
    FK_Group: 40,
    LabelIs: 'Opna, loka (kassa, pakkningu, pakka)',
    LabelEn: 'Opening, closing (box, package, parcel)',
    ValidToSelect: 1,
  },
  {
    Code: 46,
    FK_Group: 40,
    LabelIs: 'Hella, hella í, fylla upp í, vökva, úða, tæma, hella úr',
    LabelEn:
      'Pouring, pouring into, filling up, watering, spraying, emptying, baling out',
    ValidToSelect: 1,
  },
  {
    Code: 47,
    FK_Group: 40,
    LabelIs: 'Opna (skúffu), ýta á hurð (í vöruhúsi, skrifstofu eða skáp)',
    LabelEn: 'Opening (a drawer), pushing (a warehouse/office /cupboard door)',
    ValidToSelect: 1,
  },
  {
    Code: 51,
    FK_Group: 50,
    LabelIs: 'Lyfta upp eða slaka niður',
    LabelEn: 'Carrying vertically - lifting, raising, lowering an object',
    ValidToSelect: 1,
  },
  {
    Code: 52,
    FK_Group: 50,
    LabelIs: 'Toga, ýta eða rúlla',
    LabelEn: 'Carrying horizontally - pulling, pushing, rolling an object',
    ValidToSelect: 1,
  },
  {
    Code: 53,
    FK_Group: 50,
    LabelIs: 'Bera byrði á milli staða (hluti eða fólk)',
    LabelEn: 'Transporting a load - carried by a person',
    ValidToSelect: 1,
  },
  {
    Code: 61,
    FK_Group: 60,
    LabelIs: 'Ganga, hlaupa, fara upp, fara niður, o.sv.frv.',
    LabelEn: 'Walking, running, going up, going down, etc.',
    ValidToSelect: 1,
  },
  {
    Code: 62,
    FK_Group: 60,
    LabelIs: 'Fara inn eða út',
    LabelEn: 'Getting in or out',
    ValidToSelect: 1,
  },
  {
    Code: 63,
    FK_Group: 60,
    LabelIs: 'Stökkva, snara, o.sv.frv.',
    LabelEn: 'Jumping, hopping, etc.',
    ValidToSelect: 1,
  },
  {
    Code: 64,
    FK_Group: 60,
    LabelIs: 'Skríða, klifra, o.sv.frv.',
    LabelEn: 'Crawling, climbing, etc.',
    ValidToSelect: 1,
  },
  {
    Code: 65,
    FK_Group: 60,
    LabelIs: 'Standa upp, setjast niður',
    LabelEn: 'Getting up, sitting down',
    ValidToSelect: 1,
  },
  {
    Code: 66,
    FK_Group: 60,
    LabelIs: 'Sund, köfun',
    LabelEn: 'Swimming, diving',
    ValidToSelect: 1,
  },
  {
    Code: 67,
    FK_Group: 60,
    LabelIs: 'Staðbundin hreyfing',
    LabelEn: 'Movements on the spot',
    ValidToSelect: 1,
  },
]

// Create an array of DeviationGroup objects
export const deviationGroups: DeviationGroup[] = [
  {
    Code: 10,
    LabelIs: 'Frávik vegna rafmagnsbilunar, sprenginga eða elds',
    LabelEn:
      'Deviation due to electrical problems, explosion, fire - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 20,
    LabelIs: 'Frávik tengd efnum á föstu, fljótandi eða loftkenndu formi',
    LabelEn:
      'Deviation by overflow, overturn, leak, flow, vaporisation, emission - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 30,
    LabelIs: 'Hlutur brotnar, springur, klofnar, rennur, fellur, fellur saman',
    LabelEn:
      'Breakage, bursting, splitting, slipping, fall, collapse of Material Agent - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 40,
    LabelIs:
      'Missa stjórn (að hluta eða öllu leiti) á vél, léttitæki, handverkfæri, hlut eða dýrum',
    LabelEn:
      'Loss of control (total or partial) of machine, means of transport or handling equipment, hand-held tool, object, animal - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 50,
    LabelIs: 'Renna til, hrasa, detta, falla á jafnsléttu eða úr hæð',
    LabelEn:
      'Slipping - Stumbling and falling - Fall of persons - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 60,
    LabelIs: 'Líkamshreyfing án sérstaks álags',
    LabelEn:
      'Body movement without any physical stress (generally leading to an external injury) - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 70,
    LabelIs: 'Líkamshreyfing undir álagi eða með áreynslu',
    LabelEn:
      'Body movement under or with physical stress (generally leading to an internal injury) - Not specified',
    ValidToSelect: 0,
  },
  {
    Code: 80,
    LabelIs: 'Áfall, hræðsla, ofbeldi, árás, hótun, ógn',
    LabelEn:
      'Shock, fright, violence, aggression, threat, presence - Not specified',
    ValidToSelect: 0,
  },
]

export const deviations: Deviation[] = [
  {
    Code: 11,
    FK_Group: 10,
    LabelIs: 'Bilun í rafbúnaði sem veldur slysi',
    LabelEn:
      'Electrical problem due to equipment failure - leading to indirect contact',
    ValidToSelect: 1,
  },
  {
    Code: 12,
    FK_Group: 10,
    LabelIs: 'Bilun í rafbúnaði, bein snerting við rafmagn',
    LabelEn: 'Electrical problem - leading to direct contact',
    ValidToSelect: 1,
  },
  {
    Code: 13,
    FK_Group: 10,
    LabelIs: 'Sprenging',
    LabelEn: 'Explosion',
    ValidToSelect: 1,
  },
  {
    Code: 14,
    FK_Group: 10,
    LabelIs: 'Eldur, blossi',
    LabelEn: 'Fire, flare up',
    ValidToSelect: 1,
  },
  {
    Code: 21,
    FK_Group: 20,
    LabelIs:
      'Efni í föstu formi -  hrun á efni eða jarðveg, búnaður yfirfylltur eða veltur',
    LabelEn: 'Solid state - overflowing, overturning',
    ValidToSelect: 1,
  },
  {
    Code: 22,
    FK_Group: 20,
    LabelIs:
      'Vökvar og fljótandi efni - lekur, seitlar, smitar, flæðir, skvettist, úðast',
    LabelEn: 'Liquid state - leaking, oozing, flowing, splashing, spraying',
    ValidToSelect: 1,
  },
  {
    Code: 23,
    FK_Group: 20,
    LabelIs: 'Gas og gufur - leki, uppgufun, úðamyndun, myndun lofttegunda',
    LabelEn: 'Gaseous state - vaporisation, aerosol formation, gas formation',
    ValidToSelect: 1,
  },
  {
    Code: 24,
    FK_Group: 20,
    LabelIs:
      'Efni í duftkenndu ástandi - reykmyndun, ryk og loftbornar efnisagnir',
    LabelEn:
      'Pulverulent material - smoke generation, dust/particles in suspension/emission of',
    ValidToSelect: 1,
  },
  {
    Code: 31,
    FK_Group: 30,
    LabelIs: 'Efni brotnar - við liði, við samskeyti',
    LabelEn: 'Breakage of material - at joint, at seams',
    ValidToSelect: 1,
  },
  {
    Code: 32,
    FK_Group: 30,
    LabelIs:
      'Brot, sprenging - sem myndar brot eða flísar (viður, gler, málmur, steinn, plast eða annað)',
    LabelEn:
      'Breakage, bursting - causing splinters (wood, glass, metal, stone, plastic, others)',
    ValidToSelect: 1,
  },
  {
    Code: 33,
    FK_Group: 30,
    LabelIs: 'Hlutur fellur úr hæð á slasaða',
    LabelEn:
      'Slip, fall, collapse of Material Agent - from above (falling on the victim)',
    ValidToSelect: 1,
  },
  {
    Code: 34,
    FK_Group: 30,
    LabelIs:
      'Hlutur rennur til eða gefur sig undan slasaða (t.d. stigi, vinnupallur eða jarðvegur)',
    LabelEn:
      'Slip, fall, collapse of Material Agent - from below (dragging the victim down)',
    ValidToSelect: 1,
  },
  {
    Code: 35,
    FK_Group: 30,
    LabelIs: 'Hlutur rennur, fellur, veltur á slasaða á jafnsléttu',
    LabelEn: 'Slip, fall, collapse of Material Agent - on the same level',
    ValidToSelect: 1,
  },
  {
    Code: 41,
    FK_Group: 40,
    LabelIs:
      'Missa stjórn á vél m.a. ótímabær gangsetning eða efni sem unnið er með í vél',
    LabelEn:
      'Loss of control (total or partial) - of machine (including unwanted start-up) or of the material being worked by the machine',
    ValidToSelect: 1,
  },
  {
    Code: 42,
    FK_Group: 40,
    LabelIs:
      'Missa stjórn á flutnings- eða lyftibúnaði (hvort sem hann er vélknúinn eða ekki)',
    LabelEn:
      'Loss of control (total or partial) - of means of transport or handling equipment, (motorised or not)',
    ValidToSelect: 1,
  },
  {
    Code: 43,
    FK_Group: 40,
    LabelIs:
      'Missa stjórn á handverkfærum (véldrifnum eða ekki) eða efni sem verið er að vinna með handverkfærinu',
    LabelEn:
      'Loss of control (total or partial) - of hand-held tool (motorised or not) or of the material being worked by the tool',
    ValidToSelect: 1,
  },
  {
    Code: 44,
    FK_Group: 40,
    LabelIs:
      'Missa stjórn á hlut sem er haldið á, færður, meðhöndlaður, o.s.frv.',
    LabelEn:
      'Loss of control (total or partial) - of object (being carried, moved, handled, etc.)',
    ValidToSelect: 1,
  },
  {
    Code: 45,
    FK_Group: 40,
    LabelIs: 'Missa stjórn á dýrum',
    LabelEn: 'Loss of control (total or partial) - of animal',
    ValidToSelect: 1,
  },
  {
    Code: 51,
    FK_Group: 50,
    LabelIs: 'Fall einstaklings úr hæð',
    LabelEn: 'Fall of person - to a lower level',
    ValidToSelect: 1,
  },
  {
    Code: 52,
    FK_Group: 50,
    LabelIs: 'Fall einstaklings á jafnsléttu',
    LabelEn:
      'Slipping - Stumbling and falling - Fall of person - on the same level',
    ValidToSelect: 1,
  },
  {
    Code: 61,
    FK_Group: 60,
    LabelIs: 'Stíga á oddhvassan hlut',
    LabelEn: 'Walking on a sharp object',
    ValidToSelect: 1,
  },
  {
    Code: 62,
    FK_Group: 60,
    LabelIs: 'Krjúpa, setjast á, halla sér upp að',
    LabelEn: 'Kneeling on, sitting on, leaning against',
    ValidToSelect: 1,
  },
  {
    Code: 63,
    FK_Group: 60,
    LabelIs:
      'Flækist í eða berast með (t.d. flækist í togvír, færibandi o.fl.)',
    LabelEn: 'Being caught or carried away, by something or by momentum',
    ValidToSelect: 1,
  },
  {
    Code: 64,
    FK_Group: 60,
    LabelIs:
      'Ósamhæfðar hreyfingar, óvæntar eða ótímabærar aðgerðir (t.d. slær hendi óvænt til hliðar og meiðist)',
    LabelEn: 'Uncoordinated movements, spurious or untimely actions',
    ValidToSelect: 1,
  },
  {
    Code: 71,
    FK_Group: 70,
    LabelIs: 'Lyfta, bera, standa upp',
    LabelEn: 'Lifting, carrying, standing up',
    ValidToSelect: 1,
  },
  {
    Code: 72,
    FK_Group: 70,
    LabelIs: 'Ýta, toga',
    LabelEn: 'Pushing, pulling',
    ValidToSelect: 1,
  },
  {
    Code: 73,
    FK_Group: 70,
    LabelIs: 'Leggja frá sér, beygja sig niður',
    LabelEn: 'Putting down, bending down',
    ValidToSelect: 1,
  },
  {
    Code: 74,
    FK_Group: 70,
    LabelIs: 'Snúa uppá, snúa',
    LabelEn: 'Twisting, turning',
    ValidToSelect: 1,
  },
  {
    Code: 75,
    FK_Group: 70,
    LabelIs: 'Misstíga sig, snúa fótlegg eða ökkla, renna til án þess að falla',
    LabelEn: 'Treading badly, twisting leg or ankle, slipping without falling',
    ValidToSelect: 1,
  },
  {
    Code: 81,
    FK_Group: 80,
    LabelIs: 'Áfall, ótti, hræðsla',
    LabelEn: 'Shock, fright',
    ValidToSelect: 1,
  },
  {
    Code: 82,
    FK_Group: 80,
    LabelIs: 'Ofbeldi, árás, hótun- af hendi samstarfsfólks',
    LabelEn:
      'Violence, aggression, threat - between company employees subjected to the employer’s authority',
    ValidToSelect: 1,
  },
  {
    Code: 83,
    FK_Group: 80,
    LabelIs:
      'Ofbeldi, árás, hótun - af hendi viðskiptavina og annarra (t.d. sjúklingar, fangar, fólk í annarlegu ástandi)',
    LabelEn:
      'Violence, aggression, threat - from people external to the company towards victims performing their duties (bank holdup, bus drivers, etc.)',
    ValidToSelect: 1,
  },
  {
    Code: 84,
    FK_Group: 80,
    LabelIs:
      'Árás, átroðningur dýra (t.d. kýr sparkar í bónda, hundur bítur póstmann)',
    LabelEn: 'Aggression, jostle - by animal',
    ValidToSelect: 1,
  },
  {
    Code: 85,
    FK_Group: 80,
    LabelIs:
      'Ógn af ástandi fórnarlambs, slasaða eða þriðja aðila sem skapar hættu',
    LabelEn:
      'Presence of the victim or of a third person in itself creating a danger for oneself and possibly others',
    ValidToSelect: 1,
  },
]

export const contactModesOfInjury: ContactModeOfInjuryGroup[] = [
  {
    Code: 10,
    LabelIs: 'Snerting við rafspennu, hita, hættuleg efni',
    LabelEn:
      'Contact with electrical voltage, temperature, hazardous substances - Not specified',
  },
  {
    Code: 20,
    LabelIs: 'Drukknun, grafin/n, umlukinn',
    LabelEn: 'Drowned, buried, enveloped - Not specified',
  },
  {
    Code: 30,
    LabelIs:
      'Fall, árekstur eða högg (samstuð við kyrrstæðan hlut, slasaði var á hreyfingu)',
    LabelEn:
      'Horizontal or vertical impact with or against a stationary object (the victim is in motion) - Not specified',
  },
  {
    Code: 40,
    LabelIs: 'Högg frá hlut á hreyfingu eða samstuð',
    LabelEn: 'Struck by object in motion, collision with - Not specified',
  },
  {
    Code: 50,
    LabelIs: 'Snerting við beittan, oddhvassan eða harðan hlut',
    LabelEn:
      'Contact with sharp, pointed, rough, coarse Material Agent - Not specified',
  },
  {
    Code: 60,
    LabelIs: 'Festast, klemmast, kremjast, rifna',
    LabelEn: 'Trapped, crushed, etc. - Not specified',
  },
  {
    Code: 70,
    LabelIs: 'Líkamlegt eða andlegt álag',
    LabelEn: 'Physical or mental stress - Not specified',
  },
  {
    Code: 80,
    LabelIs: 'Bit, högg, spörk, stunga o.fl. (frá dýri eða manneskju)',
    LabelEn: 'Bite, kick, etc. (animal or human) - Not specified',
  },
  {
    Code: 99,
    LabelIs:
      'Önnur snerting - Ástæður áverka ekki taldar upp í þessari flokkun',
    LabelEn:
      'Other Contacts - Modes of Injury not listed in this classification',
  },
]

export const typeOfInjuryGroups: TypeOfInjuryGroup[] = [
  {
    Code: 10,
    LabelIs: 'Sár og yfirborðsáverkar',
    LabelEn: 'Wounds and superficial injuries',
    ValidToSelect: 0,
  },
  {
    Code: 20,
    LabelIs: 'Beinbrot',
    LabelEn: 'Bone fractures',
    ValidToSelect: 0,
  },
  {
    Code: 30,
    LabelIs: 'Liðhlaup, tognanir',
    LabelEn: 'Dislocations, sprains and strains',
    ValidToSelect: 0,
  },
  {
    Code: 40,
    LabelIs: 'Útlimamissir, aflimun eftir áverka',
    LabelEn: 'Traumatic amputations (Loss of body parts)',
    ValidToSelect: 1,
  },
  {
    Code: 50,
    LabelIs: 'Heilahristingur og innri áverkar á líkama',
    LabelEn: 'Concussion and internal injuries',
    ValidToSelect: 0,
  },
  {
    Code: 60,
    LabelIs: 'Brunasár og kal',
    LabelEn: 'Burns, scalds and frostbites',
    ValidToSelect: 0,
  },
  {
    Code: 70,
    LabelIs: 'Eitranir og sýkingar',
    LabelEn: 'Poisonings and infections',
    ValidToSelect: 0,
  },
  {
    Code: 80,
    LabelIs: 'Köfnun og drukknun',
    LabelEn: 'Drowning and asphyxiation',
    ValidToSelect: 0,
  },
  {
    Code: 90,
    LabelIs: 'Afleiðingar hljóðs, titrings og þrýstings',
    LabelEn: 'Effects of sound, vibration and pressure',
    ValidToSelect: 0,
  },
  {
    Code: 100,
    LabelIs: 'Afleiðingar öfga af hita, kulda, ljóss eða geislunar',
    LabelEn: 'Effects of temperature extremes, light and radiation',
    ValidToSelect: 0,
  },
  { Code: 110, LabelIs: 'Lost eða áfall', LabelEn: 'Shock', ValidToSelect: 0 },
  {
    Code: 120,
    LabelIs: 'Margþættir áverkar',
    LabelEn: 'Multiple injuries',
    ValidToSelect: 0,
  },
]

export const typeOfInjuries: TypeOfInjury[] = [
  {
    Code: 11,
    FK_Group: 10,
    LabelIs: 'Yfirborðsáverkar eða grunnir áverkar',
    LabelEn: 'Superficial injuries',
    ValidToSelect: 1,
  },
  {
    Code: 12,
    FK_Group: 10,
    LabelIs: 'Opin sár',
    LabelEn: 'Open wounds',
    ValidToSelect: 1,
  },
  {
    Code: 21,
    FK_Group: 20,
    LabelIs: 'Beinbrot',
    LabelEn: 'Closed fractures',
    ValidToSelect: 1,
  },
  {
    Code: 22,
    FK_Group: 20,
    LabelIs: 'Opið beinbrot',
    LabelEn: 'Open fractures',
    ValidToSelect: 1,
  },
  {
    Code: 31,
    FK_Group: 30,
    LabelIs: 'Liðhlaup og hlutaliðhlaup',
    LabelEn: 'Dislocations and subluxations',
    ValidToSelect: 1,
  },
  {
    Code: 32,
    FK_Group: 30,
    LabelIs: 'Tognanir og ofálag',
    LabelEn: 'Sprains and strains',
    ValidToSelect: 1,
  },
  {
    Code: 51,
    FK_Group: 50,
    LabelIs: 'Heilahristingur og áverkar á heila',
    LabelEn: 'Concussion and intracranial injuries',
    ValidToSelect: 1,
  },
  {
    Code: 52,
    FK_Group: 50,
    LabelIs: 'Innri áverkar á líkama',
    LabelEn: 'Internal injuries',
    ValidToSelect: 1,
  },
  {
    Code: 61,
    FK_Group: 60,
    LabelIs: 'Brunasár (vegna hita)',
    LabelEn: 'Burns and scalds (thermal)',
    ValidToSelect: 1,
  },
  {
    Code: 62,
    FK_Group: 60,
    LabelIs: 'Brunasár vegna efna (vegna tæringar)',
    LabelEn: 'Chemical burns (corrosions)',
    ValidToSelect: 1,
  },
  {
    Code: 63,
    FK_Group: 60,
    LabelIs: 'Kal, kalsár',
    LabelEn: 'Frostbites',
    ValidToSelect: 1,
  },
  {
    Code: 69,
    FK_Group: 60,
    LabelIs: 'Aðrar gerðir brunasára og kals',
    LabelEn: 'Other types of burns, scalds and frostbites',
    ValidToSelect: 1,
  },
  {
    Code: 71,
    FK_Group: 70,
    LabelIs: 'Bráða eitranir',
    LabelEn: 'Acute poisonings',
    ValidToSelect: 1,
  },
  {
    Code: 72,
    FK_Group: 70,
    LabelIs: 'Bráða sýkingar',
    LabelEn: 'Acute infections',
    ValidToSelect: 1,
  },
  {
    Code: 79,
    FK_Group: 70,
    LabelIs: 'Aðrar gerðir eitrana og sýkinga',
    LabelEn: 'Other types of poisonings and infections',
    ValidToSelect: 1,
  },
  {
    Code: 81,
    FK_Group: 80,
    LabelIs: 'Köfnun',
    LabelEn: 'Asphyxiation',
    ValidToSelect: 1,
  },
  {
    Code: 82,
    FK_Group: 80,
    LabelIs: 'Drukknun og kaffæring (næstum drukknun)',
    LabelEn: 'Drowning and non-fatal submersions',
    ValidToSelect: 1,
  },
  {
    Code: 91,
    FK_Group: 90,
    LabelIs: 'Bráða heyrnartap',
    LabelEn: 'Acute hearing losses',
    ValidToSelect: 1,
  },
  {
    Code: 92,
    FK_Group: 90,
    LabelIs: 'Afleiðingar þrýstings',
    LabelEn: 'Effects of pressure (barotrauma)',
    ValidToSelect: 1,
  },
  {
    Code: 99,
    FK_Group: 90,
    LabelIs: 'Aðrar afleiðingar hljóðs, titrings og þrýstings',
    LabelEn: 'Other effects of sound, vibration and pressure',
    ValidToSelect: 1,
  },
  {
    Code: 101,
    FK_Group: 100,
    LabelIs: 'Hitaslag og sólstingur',
    LabelEn: 'Heat and sunstroke',
    ValidToSelect: 1,
  },
  {
    Code: 102,
    FK_Group: 100,
    LabelIs: 'Afleiðingar geislunar (án hita)',
    LabelEn: 'Effects of radiation (non-thermal)',
    ValidToSelect: 1,
  },
  {
    Code: 103,
    FK_Group: 100,
    LabelIs: 'Afleiðingar kulda eða kælingar',
    LabelEn: 'Effects of reduced temperature',
    ValidToSelect: 1,
  },
  {
    Code: 109,
    FK_Group: 100,
    LabelIs: 'Afleiðingar öfga í birtustigi',
    LabelEn: 'Other effects of temperature extremes, light and radiation',
    ValidToSelect: 1,
  },
  {
    Code: 111,
    FK_Group: 110,
    LabelIs: 'Áfall eftir árás og hótanir',
    LabelEn: 'Shocks after aggression and threats',
    ValidToSelect: 1,
  },
  {
    Code: 112,
    FK_Group: 110,
    LabelIs: 'Lost af völdum slyss',
    LabelEn: 'Traumatic shocks',
    ValidToSelect: 1,
  },
]

export const partOfBodyInjuredGroups: PartOfBodyInjuredGroup[] = [
  {
    Code: 0,
    LabelIs: 'Engir líkamsáverkar (t.d sálræn áföll)',
    LabelEn: 'Part of body injured, not specified',
    ValidToSelect: 0,
  },
  {
    Code: 10,
    LabelIs: 'Höfuð',
    LabelEn: 'Head, not further specified',
    ValidToSelect: 0,
  },
  {
    Code: 20,
    LabelIs: 'Háls, þ.m.t. hryggur og hryggjarliðir í hálsi',
    LabelEn: 'Neck, inclusive spine and vertebra in the neck',
    ValidToSelect: 0,
  },
  {
    Code: 30,
    LabelIs: 'Bak, þ.m.t. hryggur og hryggjarliðir í baki',
    LabelEn: 'Back, including spine and vertebra in the back',
    ValidToSelect: 0,
  },
  {
    Code: 40,
    LabelIs: 'Bolur, brjóstkassi, kviður, mjaðmasvæði og innri líffæri',
    LabelEn: 'Torso and organs, not further specified',
    ValidToSelect: 0,
  },
  {
    Code: 50,
    LabelIs: 'Efri útlimir',
    LabelEn: 'Upper Extremities, not further specified',
    ValidToSelect: 0,
  },
  {
    Code: 60,
    LabelIs: 'Neðri útlimir',
    LabelEn: 'Lower Extremities, not further specified',
    ValidToSelect: 0,
  },
  {
    Code: 70,
    LabelIs: 'Allur líkaminn eða margir hlutar hans',
    LabelEn: 'Whole body and multiple sites, not further specified',
    ValidToSelect: 0,
  },
  {
    Code: 99,
    LabelIs: 'Aðrir líkamshlutar sem urðu fyrir áverkum, t.d. kynfæri eða hár',
    LabelEn: 'Other Parts of body injured, not mentioned above',
    ValidToSelect: 0,
  },
]

export const partOfBodyInjured: PartOfBodyInjured[] = [
  {
    Code: 11,
    FK_Group: 10,
    LabelIs: 'Höfuð, heili og heilataugar- og æðar',
    LabelEn: 'Head (Caput), brain and cranial nerves and vessels',
    ValidToSelect: 1,
  },
  {
    Code: 12,
    FK_Group: 10,
    LabelIs: 'Andlitssvæði',
    LabelEn: 'Facial area',
    ValidToSelect: 1,
  },
  {
    Code: 13,
    FK_Group: 10,
    LabelIs: 'Auga/u',
    LabelEn: 'Eye(s)',
    ValidToSelect: 1,
  },
  {
    Code: 14,
    FK_Group: 10,
    LabelIs: 'Eyra/u',
    LabelEn: 'Ear(s)',
    ValidToSelect: 1,
  },
  {
    Code: 15,
    FK_Group: 10,
    LabelIs: 'Tönn, tennur',
    LabelEn: 'Teeth',
    ValidToSelect: 1,
  },
  {
    Code: 19,
    FK_Group: 10,
    LabelIs: 'Aðrir hlutar höfuðs (t.d. nef og varir)',
    LabelEn: 'Head, other parts not mentioned above',
    ValidToSelect: 1,
  },
  {
    Code: 21,
    FK_Group: 20,
    LabelIs: 'Háls, þ.á.m. hryggur og hryggjarliðir í hálsi',
    LabelEn: 'Neck, inclusive spine and vertebra in the neck',
    ValidToSelect: 1,
  },
  {
    Code: 31,
    FK_Group: 30,
    LabelIs: 'Bak, þ.á.m. hryggur og hryggjarliðir í baki',
    LabelEn: 'Back, including spine and vertebra in the back',
    ValidToSelect: 1,
  },
  {
    Code: 41,
    FK_Group: 40,
    LabelIs: 'Rifbein þ.á.m. liðir, bringubein og herðablöð',
    LabelEn: 'Rib cage, ribs including joints and shoulder blades',
    ValidToSelect: 1,
  },
  {
    Code: 42,
    FK_Group: 40,
    LabelIs: 'Brjóstsvæði ásamt innri líffærum',
    LabelEn: 'Chest area including organs',
    ValidToSelect: 1,
  },
  {
    Code: 43,
    FK_Group: 40,
    LabelIs: 'Mjaðmagrindar- og kviðsvæði þ.á.m. innri líffæri',
    LabelEn: 'Pelvic and abdominal area including organs',
    ValidToSelect: 1,
  },
  {
    Code: 48,
    FK_Group: 40,
    LabelIs: 'Bolur, margir hlutar urðu fyrir áhrifum',
    LabelEn: 'Torso, multiple sites affected',
    ValidToSelect: 1,
  },
  {
    Code: 51,
    FK_Group: 50,
    LabelIs: 'Öxl og axlarliðir',
    LabelEn: 'Shoulder and shoulder joints',
    ValidToSelect: 1,
  },
  {
    Code: 52,
    FK_Group: 50,
    LabelIs: 'Handleggur, þ.m.t. olnbogi',
    LabelEn: 'Arm, including elbow',
    ValidToSelect: 1,
  },
  {
    Code: 53,
    FK_Group: 50,
    LabelIs: 'Hönd eða hendur',
    LabelEn: 'Hand',
    ValidToSelect: 1,
  },
  {
    Code: 54,
    FK_Group: 50,
    LabelIs: 'Fingur',
    LabelEn: 'Finger(s)',
    ValidToSelect: 1,
  },
  {
    Code: 55,
    FK_Group: 50,
    LabelIs: 'Úlnliður',
    LabelEn: 'Wrist',
    ValidToSelect: 1,
  },
  {
    Code: 61,
    FK_Group: 60,
    LabelIs: 'Mjöðm og mjaðmaliður',
    LabelEn: 'Hip and hip joint',
    ValidToSelect: 1,
  },
  {
    Code: 62,
    FK_Group: 60,
    LabelIs: 'Fótleggur, þ.m.t. læri, k knee og kálfi',
    LabelEn: 'Leg, including knee',
    ValidToSelect: 1,
  },
  {
    Code: 63,
    FK_Group: 60,
    LabelIs: 'Ökkli',
    LabelEn: 'Ankle',
    ValidToSelect: 1,
  },
  {
    Code: 64,
    FK_Group: 60,
    LabelIs: 'Fótur, þ.e. rist og il',
    LabelEn: 'Foot',
    ValidToSelect: 1,
  },
  {
    Code: 65,
    FK_Group: 60,
    LabelIs: 'Tá eða tær',
    LabelEn: 'Toe(s)',
    ValidToSelect: 1,
  },
  {
    Code: 71,
    FK_Group: 70,
    LabelIs: 'Allur líkaminn, heildaráhrif (t.d. brunaáverkar, fjöláverkar)',
    LabelEn: 'Whole body (Systemic effects)',
    ValidToSelect: 1,
  },
  {
    Code: 78,
    FK_Group: 70,
    LabelIs: 'Margir hlutar líkamans urðu fyrir áhrifum',
    LabelEn: 'Multiple sites of the body affected',
    ValidToSelect: 1,
  },
]

export const victimsOccupationUnitGroups: VictimsOccupationUnitGroup[] = [
  {
    Code: 1111,
    FK_MinorGroupCode: 111,
    LabelIs: 'Kjörnir fulltrúar',
    LabelEn: 'Legislators',
    ValidToSelect: 1,
  },
  {
    Code: 1112,
    FK_MinorGroupCode: 111,
    LabelIs: 'Æðstu embættismenn ríkisstjórnar',
    LabelEn: 'Senior government officials',
    ValidToSelect: 1,
  },
  {
    Code: 1114,
    FK_MinorGroupCode: 111,
    LabelIs: 'Æðstu stjórnendur hagsmunasamtaka',
    LabelEn: 'Senior officials of special-interest organisations',
    ValidToSelect: 1,
  },
  {
    Code: 1211,
    FK_MinorGroupCode: 121,
    LabelIs: 'Fjármálastjórar',
    LabelEn: 'Finance managers',
    ValidToSelect: 1,
  },
  {
    Code: 1212,
    FK_MinorGroupCode: 121,
    LabelIs: 'Mannauðsstjórar',
    LabelEn: 'Human resource managers',
    ValidToSelect: 1,
  },
  {
    Code: 1219,
    FK_MinorGroupCode: 121,
    LabelIs: 'Forstjórar og aðrir stjórnendur ekki áður taldir',
    LabelEn:
      'Business services and administration managers not elsewhere classified',
    ValidToSelect: 1,
  },
  {
    Code: 1321,
    FK_MinorGroupCode: 132,
    LabelIs: 'Framleiðslustjórar',
    LabelEn: 'Manufacturing managers',
    ValidToSelect: 1,
  },
  {
    Code: 1323,
    FK_MinorGroupCode: 132,
    LabelIs: 'Byggingarstjórar',
    LabelEn: 'Construction managers',
    ValidToSelect: 1,
  },
  {
    Code: 1411,
    FK_MinorGroupCode: 141,
    LabelIs: 'Hótelstjórar',
    LabelEn: 'Hotel managers',
    ValidToSelect: 1,
  },
  {
    Code: 1412,
    FK_MinorGroupCode: 141,
    LabelIs: 'Veitingastjórar',
    LabelEn: 'Restaurant managers',
    ValidToSelect: 1,
  },
  {
    Code: 2142,
    FK_MinorGroupCode: 214,
    LabelIs: 'Byggingarverk- og tæknifræðingar',
    LabelEn: 'Civil engineers',
    ValidToSelect: 1,
  },
  {
    Code: 2143,
    FK_MinorGroupCode: 214,
    LabelIs: 'Umhverfisverk- og tæknifræðingar',
    LabelEn: 'Environmental engineers',
    ValidToSelect: 1,
  },
  {
    Code: 2144,
    FK_MinorGroupCode: 214,
    LabelIs: 'Vélaverk- og tæknifræðingar',
    LabelEn: 'Mechanical engineers',
    ValidToSelect: 1,
  },
  {
    Code: 2145,
    FK_MinorGroupCode: 214,
    LabelIs: 'Efnaverk- og tæknifræðingar',
    LabelEn: 'Chemical engineers',
    ValidToSelect: 1,
  },
  {
    Code: 2149,
    FK_MinorGroupCode: 214,
    LabelIs: 'Aðrir verk- og tæknifræðingar',
    LabelEn: 'Engineering professionals not elsewhere classified',
    ValidToSelect: 1,
  },
  {
    Code: 2151,
    FK_MinorGroupCode: 215,
    LabelIs: 'Rafmagnsverk- og tæknifræðingar',
    LabelEn: 'Electrical engineers',
    ValidToSelect: 1,
  },
  {
    Code: 2152,
    FK_MinorGroupCode: 215,
    LabelIs: 'Rafeindaverk- og tæknifræðingar',
    LabelEn: 'Electronics engineers',
    ValidToSelect: 1,
  },
  {
    Code: 2153,
    FK_MinorGroupCode: 215,
    LabelIs: 'Fjarskiptaverk- og tæknifræðingar',
    LabelEn: 'Telecommunications engineers',
    ValidToSelect: 1,
  },
  {
    Code: 2161,
    FK_MinorGroupCode: 216,
    LabelIs: 'Arkitektar',
    LabelEn: 'Building architects',
    ValidToSelect: 1,
  },
  {
    Code: 2162,
    FK_MinorGroupCode: 216,
    LabelIs: 'Landslagsarkitektar',
    LabelEn: 'Landscape architects',
    ValidToSelect: 1,
  },
  {
    Code: 2163,
    FK_MinorGroupCode: 216,
    LabelIs: 'Vöru- og fatahönnuðir',
    LabelEn: 'Product and garment designers',
    ValidToSelect: 1,
  },
  {
    Code: 2164,
    FK_MinorGroupCode: 216,
    LabelIs: 'Borgar- og umferðarskipulagsfræðingar',
    LabelEn: 'Town and traffic planners',
    ValidToSelect: 1,
  },
  {
    Code: 2165,
    FK_MinorGroupCode: 216,
    LabelIs: 'Kortagerðamenn og landmælingamenn',
    LabelEn: 'Cartographers and surveyors',
    ValidToSelect: 1,
  },
  {
    Code: 2166,
    FK_MinorGroupCode: 216,
    LabelIs: 'Grafískir hönnuðir og margmiðlunarhönnuðir',
    LabelEn: 'Graphic and multimedia designers',
    ValidToSelect: 1,
  },
  {
    Code: 2211,
    FK_MinorGroupCode: 221,
    LabelIs: 'Almennir læknar',
    LabelEn: 'Generalist medical practitioners',
    ValidToSelect: 1,
  },
  {
    Code: 2212,
    FK_MinorGroupCode: 221,
    LabelIs: 'Læknar með sérfræðimenntun',
    LabelEn: 'Specialist medical practitioners',
    ValidToSelect: 1,
  },
  {
    Code: 2221,
    FK_MinorGroupCode: 222,
    LabelIs: 'Hjúkrunarfræðingar',
    LabelEn: 'Nursing professionals',
    ValidToSelect: 1,
  },
  {
    Code: 2222,
    FK_MinorGroupCode: 222,
    LabelIs: 'Ljósmæður',
    LabelEn: 'Midwifery professionals',
    ValidToSelect: 1,
  },
  {
    Code: 2261,
    FK_MinorGroupCode: 226,
    LabelIs: 'Tannlæknar',
    LabelEn: 'Dentists',
    ValidToSelect: 1,
  },
  {
    Code: 2262,
    FK_MinorGroupCode: 226,
    LabelIs: 'Lyfjafræðingar',
    LabelEn: 'Pharmacists',
    ValidToSelect: 1,
  },
  {
    Code: 2263,
    FK_MinorGroupCode: 226,
    LabelIs: 'Iðjuþjálfar og sérfræðingar í vinnuumhverfi og hollustuháttum',
    LabelEn: 'Environmental and occupational health and hygiene professionals',
    ValidToSelect: 1,
  },
  {
    Code: 2264,
    FK_MinorGroupCode: 226,
    LabelIs: 'Sjúkraþjálfarar',
    LabelEn: 'Physiotherapists',
    ValidToSelect: 1,
  },
  {
    Code: 2265,
    FK_MinorGroupCode: 226,
    LabelIs: 'Næringarfræðingar',
    LabelEn: 'Dieticians and nutritionists',
    ValidToSelect: 1,
  },
  {
    Code: 2266,
    FK_MinorGroupCode: 226,
    LabelIs: 'Hljóð- og talmeinafræðingar',
    LabelEn: 'Audiologists and speech therapists',
    ValidToSelect: 1,
  },
  {
    Code: 2267,
    FK_MinorGroupCode: 226,
    LabelIs: 'Sjónglerja- og sjóntækjafræðingar',
    LabelEn: 'Optometrists and ophthalmic opticians',
    ValidToSelect: 1,
  },
  {
    Code: 2269,
    FK_MinorGroupCode: 226,
    LabelIs: 'Annað fagfólk í heilbrigðisþjónustu',
    LabelEn: 'Health professionals not elsewhere classified',
    ValidToSelect: 1,
  },
  {
    Code: 2341,
    FK_MinorGroupCode: 234,
    LabelIs: 'Grunnskólakennarar',
    LabelEn: 'Primary school teachers',
    ValidToSelect: 1,
  },
  {
    Code: 2342,
    FK_MinorGroupCode: 234,
    LabelIs: 'Leikskólakennarar',
    LabelEn: 'Early childhood educators',
    ValidToSelect: 1,
  },
  {
    Code: 2351,
    FK_MinorGroupCode: 235,
    LabelIs: 'Sérfræðingar við námsrannsóknir',
    LabelEn: 'Education methods specialists',
    ValidToSelect: 1,
  },
  {
    Code: 2352,
    FK_MinorGroupCode: 235,
    LabelIs: 'Sérkennarar',
    LabelEn: 'Special needs teachers',
    ValidToSelect: 1,
  },
  {
    Code: 2353,
    FK_MinorGroupCode: 235,
    LabelIs: 'Aðrir tungumálakennarar',
    LabelEn: 'Other language teachers',
    ValidToSelect: 1,
  },
  {
    Code: 2354,
    FK_MinorGroupCode: 235,
    LabelIs: 'Aðrir tónlistarkennarar',
    LabelEn: 'Other music teachers',
    ValidToSelect: 1,
  },
  {
    Code: 2355,
    FK_MinorGroupCode: 235,
    LabelIs: 'Annað starfsfólk sem vinnur með frístundir barna',
    LabelEn: 'Other arts teachers',
    ValidToSelect: 1,
  },
  {
    Code: 2356,
    FK_MinorGroupCode: 235,
    LabelIs: 'Annað starfsfólk sem vinnur með börn með sérþarfir',
    LabelEn: 'Special education teaching professionals',
    ValidToSelect: 1,
  },
  {
    Code: 2411,
    FK_MinorGroupCode: 241,
    LabelIs: 'Endurskoðendur og fjármálaráðgjafar',
    LabelEn: 'Accountants',
    ValidToSelect: 1,
  },
  {
    Code: 2412,
    FK_MinorGroupCode: 241,
    LabelIs: 'Lögfræðingar',
    LabelEn: 'Lawyers',
    ValidToSelect: 1,
  },
  {
    Code: 2413,
    FK_MinorGroupCode: 241,
    LabelIs: 'Stjórnunar- og skipulagsráðgjafar',
    LabelEn: 'Management and organisation analysts',
    ValidToSelect: 1,
  },
  {
    Code: 3111,
    FK_MinorGroupCode: 311,
    LabelIs: 'Tæknimenn í eðlisvísindum og verkfræði',
    LabelEn: 'Chemical and physical science technicians',
    ValidToSelect: 1,
  },
  {
    Code: 3112,
    FK_MinorGroupCode: 311,
    LabelIs: 'Byggingafræðingar',
    LabelEn: 'Civil engineering technicians',
    ValidToSelect: 1,
  },
  {
    Code: 3113,
    FK_MinorGroupCode: 311,
    LabelIs: 'Tæknifólk í rafmagnsverkfræði',
    LabelEn: 'Electrical engineering technicians',
    ValidToSelect: 1,
  },
  {
    Code: 3114,
    FK_MinorGroupCode: 311,
    LabelIs: 'Rafeindatæknar',
    LabelEn: 'Electronics engineering technicians',
    ValidToSelect: 1,
  },
  {
    Code: 3115,
    FK_MinorGroupCode: 311,
    LabelIs: 'Tæknifólk í vélaverkfræði',
    LabelEn: 'Mechanical engineering technicians',
    ValidToSelect: 1,
  },
  {
    Code: 3116,
    FK_MinorGroupCode: 311,
    LabelIs: 'Efnatæknar',
    LabelEn: 'Chemical engineering technicians',
    ValidToSelect: 1,
  },
  {
    Code: 3117,
    FK_MinorGroupCode: 311,
    LabelIs: 'Málmvinnslutæknar',
    LabelEn: 'Mining and metallurgical technicians',
    ValidToSelect: 1,
  },
  {
    Code: 3118,
    FK_MinorGroupCode: 311,
    LabelIs: 'Tækniteiknarar',
    LabelEn: 'Draughtspersons',
    ValidToSelect: 1,
  },
  {
    Code: 3119,
    FK_MinorGroupCode: 311,
    LabelIs: 'Aðrir aðstoðarmenn sérfræðinga innan eðlis-, efna- og verkfræði',
    LabelEn:
      'Physical and engineering science technicians not elsewhere classified',
    ValidToSelect: 1,
  },
  {
    Code: 3121,
    FK_MinorGroupCode: 312,
    LabelIs: 'Verkstjórar í námugreftri',
    LabelEn: 'Mining supervisors',
    ValidToSelect: 1,
  },
  {
    Code: 3122,
    FK_MinorGroupCode: 312,
    LabelIs:
      'Verkstjórar í matvælaiðnaði, fiskiðnaði, þungaiðnaði og öðrum iðnaði (ekki í mannvirkjagerð)',
    LabelEn: 'Supervisor other than construction and mining',
    ValidToSelect: 1,
  },
  {
    Code: 3123,
    FK_MinorGroupCode: 312,
    LabelIs: 'Verkstjórar í byggingarvinnu',
    LabelEn: 'Construction supervisors',
    ValidToSelect: 1,
  },
  {
    Code: 3131,
    FK_MinorGroupCode: 313,
    LabelIs: 'Vélstjórar í orkuverum',
    LabelEn: 'Power production plant operators',
    ValidToSelect: 1,
  },
  {
    Code: 3132,
    FK_MinorGroupCode: 313,
    LabelIs: 'Vélagæslumenn við brennnslustöðvar og hreinsistöðvar',
    LabelEn: 'Incinerator and water treatment plant operators',
    ValidToSelect: 1,
  },
  {
    Code: 3133,
    FK_MinorGroupCode: 313,
    LabelIs: 'Vélstjórar í efnavinnslu',
    LabelEn: 'Chemical processing plant controllers',
    ValidToSelect: 1,
  },
  {
    Code: 3139,
    FK_MinorGroupCode: 313,
    LabelIs: 'Vélfræðingar og vélstjórar í öðrum framleiðslugreinum',
    LabelEn: 'Other',
    ValidToSelect: 1,
  },
  {
    Code: 3151,
    FK_MinorGroupCode: 351,
    LabelIs: 'Skipavélfræðingar, skipaverkfræðingar',
    LabelEn: 'Ships’ engineers',
    ValidToSelect: 1,
  },
  {
    Code: 3152,
    FK_MinorGroupCode: 351,
    LabelIs: 'Yfirmenn skips aðrir en vélstjórar og hafnsögumenn',
    LabelEn: 'Ships’ deck officers and pilots',
    ValidToSelect: 1,
  },
  {
    Code: 3153,
    FK_MinorGroupCode: 351,
    LabelIs: 'Flugmenn',
    LabelEn: 'Aircraft pilots and related associate professionals',
    ValidToSelect: 1,
  },
  {
    Code: 3154,
    FK_MinorGroupCode: 351,
    LabelIs: 'Flugumferðarstjórar',
    LabelEn: 'Air traffic controllers',
    ValidToSelect: 1,
  },
  {
    Code: 3155,
    FK_MinorGroupCode: 351,
    LabelIs: 'Eftirlitsmenn með flugöryggistækjum',
    LabelEn: 'Air traffic safety electronics technicians',
    ValidToSelect: 1,
  },
  {
    Code: 3251,
    FK_MinorGroupCode: 325,
    LabelIs: 'Aðstoðarfólk tannlækna',
    LabelEn: 'Dental Assistants and Therapists',
    ValidToSelect: 1,
  },
  {
    Code: 3252,
    FK_MinorGroupCode: 325,
    LabelIs: 'Læknaritarar og fulltrúar í heilbrigðisþjónustu',
    LabelEn: 'Medical Records and Health Information Technicians',
    ValidToSelect: 1,
  },
  {
    Code: 3254,
    FK_MinorGroupCode: 325,
    LabelIs: 'Sjónfræðingar',
    LabelEn: 'Dispensing Opticians',
    ValidToSelect: 1,
  },
  {
    Code: 3255,
    FK_MinorGroupCode: 325,
    LabelIs: 'Aðstoðarfólk við sjúkraþjálfun',
    LabelEn: 'Physiotherapy Technicians and Assistants',
    ValidToSelect: 1,
  },
  {
    Code: 3257,
    FK_MinorGroupCode: 325,
    LabelIs: 'Eftirlitsmenn hjá heilbrigðiseftirliti og vinnueftirliti',
    LabelEn: 'Enviromental and Occupational Health Inspectors and Associates',
    ValidToSelect: 1,
  },
  {
    Code: 3258,
    FK_MinorGroupCode: 325,
    LabelIs: 'Sjúkraflutningamenn',
    LabelEn: 'Ambulance Workers',
    ValidToSelect: 1,
  },
  {
    Code: 3259,
    FK_MinorGroupCode: 325,
    LabelIs: 'Annað aðstoðarfólk í heilbrigðisþjónustu',
    LabelEn: 'Health Associate Professionals Not Elsewhere Classified',
    ValidToSelect: 1,
  },
  {
    Code: 3351,
    FK_MinorGroupCode: 335,
    LabelIs: 'Tollverðir og landamæraverðir',
    LabelEn: 'Customs and border inspectors',
    ValidToSelect: 1,
  },
  {
    Code: 3352,
    FK_MinorGroupCode: 335,
    LabelIs: 'Fulltrúar á skattstofu',
    LabelEn: 'Government tax and excise officials',
    ValidToSelect: 1,
  },
  {
    Code: 3353,
    FK_MinorGroupCode: 335,
    LabelIs: 'Fulltrúar í almannaþjónustu',
    LabelEn: 'Government social benefits officials',
    ValidToSelect: 1,
  },
  {
    Code: 3355,
    FK_MinorGroupCode: 335,
    LabelIs: 'Varðstjórar og rannsóknarlögreglumenn',
    LabelEn: 'Police inspectors and detectives',
    ValidToSelect: 1,
  },
  {
    Code: 3431,
    FK_MinorGroupCode: 343,
    LabelIs: 'Ljósmyndarar',
    LabelEn: 'Photographers',
    ValidToSelect: 1,
  },
  {
    Code: 3432,
    FK_MinorGroupCode: 343,
    LabelIs: 'Innanhúshönnuðir',
    LabelEn: 'Interior designers and decorators',
    ValidToSelect: 1,
  },
  {
    Code: 3433,
    FK_MinorGroupCode: 343,
    LabelIs: 'Starfsfólk á söfnum',
    LabelEn: 'Gallery, museum, and library technicians',
    ValidToSelect: 1,
  },
  {
    Code: 3434,
    FK_MinorGroupCode: 343,
    LabelIs: 'Matreiðslumeistarar',
    LabelEn: 'Chefs',
    ValidToSelect: 1,
  },
  {
    Code: 3435,
    FK_MinorGroupCode: 343,
    LabelIs:
      'Aðstoðarfólk í listum (ljósamenn, sviðsmenn, búningafólk, staðgenglar os.frv.)',
    LabelEn: 'Other Artistic and Cultural Associate Professionals',
    ValidToSelect: 1,
  },
  {
    Code: 5111,
    FK_MinorGroupCode: 511,
    LabelIs: 'Flugfreyjur og flugþjónar',
    LabelEn: 'Travel attendants and travel stewards',
    ValidToSelect: 1,
  },
  {
    Code: 5113,
    FK_MinorGroupCode: 511,
    LabelIs: 'Fararstjórar og leiðsögumenn',
    LabelEn: 'Travel guides',
    ValidToSelect: 1,
  },
  {
    Code: 5131,
    FK_MinorGroupCode: 513,
    LabelIs: 'Þjónar',
    LabelEn: 'Waiters',
    ValidToSelect: 1,
  },
  {
    Code: 5132,
    FK_MinorGroupCode: 513,
    LabelIs: 'Barþjónar',
    LabelEn: 'Bartenders',
    ValidToSelect: 1,
  },
  {
    Code: 5221,
    FK_MinorGroupCode: 522,
    LabelIs: 'Kaupmenn',
    LabelEn: 'Shop keepers',
    ValidToSelect: 1,
  },
  {
    Code: 5222,
    FK_MinorGroupCode: 522,
    LabelIs: 'Verslunarstjórar',
    LabelEn: 'Shop supervisors',
    ValidToSelect: 1,
  },
  {
    Code: 5223,
    FK_MinorGroupCode: 522,
    LabelIs: 'Afgreiðslufólk',
    LabelEn: 'Shop sales assistants',
    ValidToSelect: 1,
  },
  {
    Code: 5411,
    FK_MinorGroupCode: 541,
    LabelIs: 'Slökkviliðsmenn (brunaverðir)',
    LabelEn: 'Fire-fighters',
    ValidToSelect: 1,
  },
  {
    Code: 5412,
    FK_MinorGroupCode: 541,
    LabelIs: 'Lögreglumenn',
    LabelEn: 'Police officers',
    ValidToSelect: 1,
  },
  {
    Code: 5413,
    FK_MinorGroupCode: 541,
    LabelIs: 'Fangaverðir',
    LabelEn: 'Prison guards',
    ValidToSelect: 1,
  },
  {
    Code: 5414,
    FK_MinorGroupCode: 541,
    LabelIs: 'Öryggisverðir, dyraverðir, lífverðir, safnverðir o.fl',
    LabelEn: 'Security guards',
    ValidToSelect: 1,
  },
  {
    Code: 5419,
    FK_MinorGroupCode: 541,
    LabelIs: 'Vaktmenn, næturverðir, sundlaugaverðir o.fl.',
    LabelEn: 'Protective services workers not elsewhere classified',
    ValidToSelect: 1,
  },
  {
    Code: 6221,
    FK_MinorGroupCode: 622,
    LabelIs: 'Sérmenntað starfsfólk í fiskeldi',
    LabelEn: 'Aquaculture workers',
    ValidToSelect: 1,
  },
  {
    Code: 6222,
    FK_MinorGroupCode: 622,
    LabelIs: 'Sérmenntað starfsfólk í fiskvinnslu',
    LabelEn: 'Inland and coastal waters fishery workers',
    ValidToSelect: 1,
  },
  {
    Code: 6224,
    FK_MinorGroupCode: 622,
    LabelIs: 'Veiðimenn og veiðimenn sem veiða í gildru',
    LabelEn: 'Hunters and trappers',
    ValidToSelect: 1,
  },
  {
    Code: 7111,
    FK_MinorGroupCode: 711,
    LabelIs: 'Húsasmíðameistarar',
    LabelEn: 'House builders',
    ValidToSelect: 1,
  },
  {
    Code: 7112,
    FK_MinorGroupCode: 711,
    LabelIs: 'Múrhleðslumenn og skyld störf',
    LabelEn: 'Bricklayers and related workers',
    ValidToSelect: 1,
  },
  {
    Code: 7113,
    FK_MinorGroupCode: 711,
    LabelIs: 'Múrarar, steinsmiðir, steinhöggvarar',
    LabelEn: 'Stonemasons, stone cutters, splitters and carvers',
    ValidToSelect: 1,
  },
  {
    Code: 7115,
    FK_MinorGroupCode: 711,
    LabelIs: 'Trésmiðir, innréttinga- og húsgagnasmiðir',
    LabelEn: 'Carpenters and joiners',
    ValidToSelect: 1,
  },
  {
    Code: 7119,
    FK_MinorGroupCode: 711,
    LabelIs: 'Járnabindingamenn, grindarsmiðir og skyld störf',
    LabelEn:
      'Building frame and related trades workers not elsewhere classified',
    ValidToSelect: 1,
  },
  {
    Code: 7121,
    FK_MinorGroupCode: 712,
    LabelIs: 'Þaklagningarmenn',
    LabelEn: 'Roofers',
    ValidToSelect: 1,
  },
  {
    Code: 7122,
    FK_MinorGroupCode: 712,
    LabelIs: 'Hellu-, flísa-, og steinlagningamenn',
    LabelEn: 'Floor layers and tile setters',
    ValidToSelect: 1,
  },
  {
    Code: 7123,
    FK_MinorGroupCode: 712,
    LabelIs: 'Múrarar við gifshúðun',
    LabelEn: 'Plasterers',
    ValidToSelect: 1,
  },
  {
    Code: 7125,
    FK_MinorGroupCode: 712,
    LabelIs: 'Glerísetningarmenn',
    LabelEn: 'Glaziers',
    ValidToSelect: 1,
  },
  {
    Code: 7126,
    FK_MinorGroupCode: 712,
    LabelIs: 'Pípulagningamenn',
    LabelEn: 'Plumbers and pipe fitters',
    ValidToSelect: 1,
  },
  {
    Code: 7127,
    FK_MinorGroupCode: 712,
    LabelIs: 'Loftræsti og loftkælitæknar',
    LabelEn: 'Air conditioning and refrigeration mechanics',
    ValidToSelect: 1,
  },
  {
    Code: 7131,
    FK_MinorGroupCode: 713,
    LabelIs: 'Málarar og skyld störf',
    LabelEn: 'Painters and related workers',
    ValidToSelect: 1,
  },
  {
    Code: 7132,
    FK_MinorGroupCode: 713,
    LabelIs: 'Starfsfólk í bílasprautun, bílaréttingum og lakkarar',
    LabelEn: 'Spray painters and varnishers',
    ValidToSelect: 1,
  },
  {
    Code: 7133,
    FK_MinorGroupCode: 713,
    LabelIs: 'Húsaþvottamenn',
    LabelEn: 'Building structure cleaners',
    ValidToSelect: 1,
  },
  {
    Code: 7231,
    FK_MinorGroupCode: 723,
    LabelIs: 'Bifvélavirkjar og bifreiðasmiðir',
    LabelEn: 'Motor vehicle mechanics and repairers',
    ValidToSelect: 1,
  },
  {
    Code: 7232,
    FK_MinorGroupCode: 723,
    LabelIs: 'Flugvirkjar og viðgerðarmenn',
    LabelEn: 'Aircraft engine mechanics and repairers',
    ValidToSelect: 1,
  },
  {
    Code: 7233,
    FK_MinorGroupCode: 723,
    LabelIs: 'Vélvirkjar landbúnaðar- og iðnararvéla og viðgerðarmenn',
    LabelEn: 'Agricultural and industrial machinery mechanics and repairers',
    ValidToSelect: 1,
  },
  {
    Code: 7234,
    FK_MinorGroupCode: 723,
    LabelIs: 'Hjólaviðgerðarmenn og viðgerðarmenn í skyldum störfum',
    LabelEn: 'Bicycle and related repairers',
    ValidToSelect: 1,
  },
  {
    Code: 7311,
    FK_MinorGroupCode: 731,
    LabelIs: 'Úrsmiðir og vinna við ýmiss fíngerð tæki og viðgerðir',
    LabelEn: 'Precision-instrument Makers and Repairers',
    ValidToSelect: 1,
  },
  {
    Code: 7312,
    FK_MinorGroupCode: 731,
    LabelIs: 'Hljóðfærasmiðir og þeir sem stilla hljóðfæri',
    LabelEn: 'Musical Instrument Makers and Tuners',
    ValidToSelect: 1,
  },
  {
    Code: 7313,
    FK_MinorGroupCode: 731,
    LabelIs: 'Skartgripasmiðir og þeir sem vinna með eðalmálma',
    LabelEn: 'Jewellery and Precious Metal Workers',
    ValidToSelect: 1,
  },
  {
    Code: 7314,
    FK_MinorGroupCode: 731,
    LabelIs: 'Leirkerasmeiðir og skyld störf',
    LabelEn: 'Potters and Related Workers',
    ValidToSelect: 1,
  },
  {
    Code: 7315,
    FK_MinorGroupCode: 731,
    LabelIs: 'Glergerðarfólk, glerskerar, slíparar og fínpússarar',
    LabelEn: 'Glass Makers, Cutters, Grinders and Finishers',
    ValidToSelect: 1,
  },
  {
    Code: 7316,
    FK_MinorGroupCode: 731,
    LabelIs: 'Skiltagerðarfólk, listiðnaðarmenn, myndristumenn og þrykkjarar',
    LabelEn: 'Signwriters, Decorative Painters, Engravers and Etchers',
    ValidToSelect: 1,
  },
  {
    Code: 7317,
    FK_MinorGroupCode: 731,
    LabelIs: 'Handverksfólk við körfugerð',
    LabelEn: 'Handicraft Workers in Wood, Basketry and Related Materials',
    ValidToSelect: 1,
  },
  {
    Code: 7318,
    FK_MinorGroupCode: 731,
    LabelIs: 'Handverksfólk sem vinnur með leður, textíl og skyld efni',
    LabelEn: 'Handicraft Workers in Textile, Leather and Related Materials',
    ValidToSelect: 1,
  },
  {
    Code: 7319,
    FK_MinorGroupCode: 731,
    LabelIs: 'Annað handverksfólk, t.d. netagerðarmenn',
    LabelEn: 'Handicraft Workers Not Elsewhere Classified',
    ValidToSelect: 1,
  },
  {
    Code: 7511,
    FK_MinorGroupCode: 751,
    LabelIs:
      'Slátrarar, kjötiðnaðarmenn, fisksalar og skyld matvælavinnslustörf',
    LabelEn: 'Butchers, fishmongers and related food preparers',
    ValidToSelect: 1,
  },
  {
    Code: 7512,
    FK_MinorGroupCode: 751,
    LabelIs: 'Bakarar, köku- og konfektgerðamenn',
    LabelEn: 'Bakers, pastry-cooks and confectionery makers',
    ValidToSelect: 1,
  },
  {
    Code: 7513,
    FK_MinorGroupCode: 751,
    LabelIs: 'Mjólkurfræðingar',
    LabelEn: 'Dairy-products makers',
    ValidToSelect: 1,
  },
  {
    Code: 7514,
    FK_MinorGroupCode: 751,
    LabelIs: 'Niðursuðumenn ávaxta, grænmetis og annarra matvæla',
    LabelEn: 'Fruit, vegetable and related preservers',
    ValidToSelect: 1,
  },
  {
    Code: 7515,
    FK_MinorGroupCode: 751,
    LabelIs: 'Smakkarar og matsmenn matvæla',
    LabelEn: 'Food and beverage tasters and graders',
    ValidToSelect: 1,
  },
  {
    Code: 7541,
    FK_MinorGroupCode: 754,
    LabelIs: 'Kafarar',
    LabelEn: 'Underwater divers',
    ValidToSelect: 1,
  },
  {
    Code: 7544,
    FK_MinorGroupCode: 754,
    LabelIs: 'Meindýraeyðar',
    LabelEn: 'Fumigators and other pest and weed controllers',
    ValidToSelect: 1,
  },
  {
    Code: 8321,
    FK_MinorGroupCode: 832,
    LabelIs: 'Stjórnendur bifhjóla',
    LabelEn: 'Motorcycle drivers',
    ValidToSelect: 1,
  },
  {
    Code: 8322,
    FK_MinorGroupCode: 832,
    LabelIs: 'Bílstjórar fólksbifreiða, leigubílstjórar og sendibílstjórar',
    LabelEn: 'Car, taxi and van drivers',
    ValidToSelect: 1,
  },
  {
    Code: 8331,
    FK_MinorGroupCode: 833,
    LabelIs: 'Strætisvagna- og rútubílstjórar',
    LabelEn: 'Bus and tram drivers',
    ValidToSelect: 1,
  },
  {
    Code: 8332,
    FK_MinorGroupCode: 833,
    LabelIs: 'Vöru- og flutningabílstjórar',
    LabelEn: 'Heavy truck and lorry drivers',
    ValidToSelect: 1,
  },
  {
    Code: 8341,
    FK_MinorGroupCode: 834,
    LabelIs: 'Vinnuvélastjórar í búskap og skógrækt',
    LabelEn: 'Mobile farm and forestry plant operators',
    ValidToSelect: 1,
  },
  {
    Code: 8342,
    FK_MinorGroupCode: 834,
    LabelIs: 'Vinnuvélastjórar í jarðvegsvinnu',
    LabelEn: 'Earthmoving and related plant operators',
    ValidToSelect: 1,
  },
  {
    Code: 8343,
    FK_MinorGroupCode: 834,
    LabelIs: 'Vinnuvélastjórar krana og hífibúnaðar',
    LabelEn: 'Crane, hoist and related plant operators',
    ValidToSelect: 1,
  },
  {
    Code: 8344,
    FK_MinorGroupCode: 834,
    LabelIs: 'Stjórnendur lyftara og annarra lyftitækja',
    LabelEn: 'Lifting truck operators',
    ValidToSelect: 1,
  },
  {
    Code: 9211,
    FK_MinorGroupCode: 921,
    LabelIs: 'Verkafólk við kornrækt',
    LabelEn: 'Crop farm labourers',
    ValidToSelect: 1,
  },
  {
    Code: 9212,
    FK_MinorGroupCode: 921,
    LabelIs: 'Verkafólk við kvikfjárbúskap',
    LabelEn: 'Livestock farm labourers',
    ValidToSelect: 1,
  },
  {
    Code: 9213,
    FK_MinorGroupCode: 921,
    LabelIs: 'Verkafólk við uppskeru og búfé',
    LabelEn: 'Mixed crop and livestock farm labourers',
    ValidToSelect: 1,
  },
  {
    Code: 9214,
    FK_MinorGroupCode: 921,
    LabelIs: 'Verkafólk í görðum og garðykju',
    LabelEn: 'Garden and horticultural labourers',
    ValidToSelect: 1,
  },
  {
    Code: 9215,
    FK_MinorGroupCode: 921,
    LabelIs: 'Verkafólk í skógrækt',
    LabelEn: 'Forestry labourers',
    ValidToSelect: 1,
  },
  {
    Code: 9216,
    FK_MinorGroupCode: 921,
    LabelIs:
      'Verkafólk í fiskvinnslu og fiskeldi (fiskvinnslufólk, fiskverkakona og fiskverkamaður)',
    LabelEn: 'Fishery and aquaculture labourers',
    ValidToSelect: 1,
  },
  {
    Code: 9311,
    FK_MinorGroupCode: 931,
    LabelIs: 'Verkafólk í námugreftri og grjótnámum',
    LabelEn: 'Mining and quarrying labourers',
    ValidToSelect: 1,
  },
  {
    Code: 9312,
    FK_MinorGroupCode: 931,
    LabelIs:
      'Verkafólk í öðrum störfum s.s. vega-, brúa-, hafna-, stíflu- og flugvallagerð',
    LabelEn: 'Civil engineering labourers',
    ValidToSelect: 1,
  },
  {
    Code: 9313,
    FK_MinorGroupCode: 931,
    LabelIs: 'Verkafólk í byggingarvinnu (byggingarverkamaður)',
    LabelEn: 'Civil engineering labourers',
    ValidToSelect: 1,
  },
  {
    Code: 9333,
    FK_MinorGroupCode: 933,
    LabelIs: 'Hlaðmenn (flugvélar) og löndunarmenn (skip)',
    LabelEn: 'Freight handlers',
    ValidToSelect: 1,
  },
  {
    Code: 9334,
    FK_MinorGroupCode: 933,
    LabelIs: 'Lagermaður og áfylling á hillur',
    LabelEn: 'Shelf fillers',
    ValidToSelect: 1,
  },
  {
    Code: 9411,
    FK_MinorGroupCode: 941,
    LabelIs: 'Starfsfólk á skyndibitastað',
    LabelEn: 'Fast food preparers',
    ValidToSelect: 1,
  },
  {
    Code: 9412,
    FK_MinorGroupCode: 941,
    LabelIs: 'Aðstoðarfólk í eldhúsi',
    LabelEn: 'Kitchen helpers',
    ValidToSelect: 1,
  },
  {
    Code: 9621,
    FK_MinorGroupCode: 962,
    LabelIs: 'Sendlar, pakkasendlar, farangursberar og blaðberar',
    LabelEn: 'Messengers, package deliverers and luggage porters',
    ValidToSelect: 1,
  },
  {
    Code: 9623,
    FK_MinorGroupCode: 962,
    LabelIs:
      'Stöðumælaverðir og starfsmenn við áfyllingu sjálfsala og tæmingu stöðumæla',
    LabelEn: 'Meter readers and vending-machine collectors',
    ValidToSelect: 1,
  },
  {
    Code: 9629,
    FK_MinorGroupCode: 962,
    LabelIs: 'Önnur störf verkafólks',
    LabelEn: 'Elementary workers not elsewhere classified',
    ValidToSelect: 1,
  },
]
