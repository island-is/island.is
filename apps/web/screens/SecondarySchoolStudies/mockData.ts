import {
  SecondarySchoolAllProgrammesQuery,
  SecondarySchoolProgrammeFilterOptionsQuery,
} from '@island.is/web/graphql/schema'

export const mockFilterOptions: SecondarySchoolProgrammeFilterOptionsQuery['secondarySchoolProgrammeFilterOptions'] =
  {
    studyTracks: [
      {
        isced: '0314',
        name: 'Félagsvísindi, viðskipti og lögfræði',
      },
      {
        isced: '0500',
        name: 'Náttúruvísindi, stærðfræði og tölfræði',
      },
    ],
    levels: [
      {
        id: 3,
        name: 'Stig 3',
        description: 'Framhaldsskólastig',
        shortDescription: 'Bóknámsbrautir til stúdentsprófs',
      },
      {
        id: 4,
        name: 'Stig 4',
        description: 'Framhaldsskólastig - starfsnám',
        shortDescription: 'Starfsbrautir',
      },
    ],
    countryAreas: [
      {
        id: 'area-001',
        name: 'Höfuðborgarsvæðið',
        description: 'Reykjavík og nágrenni',
      },
      {
        id: 'area-002',
        name: 'Suðurland',
        description: 'Suðurland og Vestmannaeyjar',
      },
      {
        id: 'area-003',
        name: 'Norðurland',
        description: 'Norðurland eystra og vestra',
      },
    ],
    schools: [
      {
        id: 'school-001',
        name: 'Menntaskólinn við Hamrahlíð',
        abbreviation: 'MH',
        countryArea: {
          id: 'area-001',
          name: 'Höfuðborgarsvæðið',
          description: 'Reykjavík og nágrenni',
        },
      },
      {
        id: 'school-002',
        name: 'Menntaskólinn í Reykjavík',
        abbreviation: 'MR',
        countryArea: {
          id: 'area-001',
          name: 'Höfuðborgarsvæðið',
          description: 'Reykjavík og nágrenni',
        },
      },
      {
        id: 'school-003',
        name: 'Verzlunarskóli Íslands',
        abbreviation: 'Verzló',
        countryArea: {
          id: 'area-001',
          name: 'Höfuðborgarsvæðið',
          description: 'Reykjavík og nágrenni',
        },
      },
      {
        id: 'school-004',
        name: 'Menntaskólinn á Akureyri',
        abbreviation: 'MA',
        countryArea: {
          id: 'area-003',
          name: 'Norðurland',
          description: 'Norðurland eystra og vestra',
        },
      },
    ],
  }

export const mockProgrammes: SecondarySchoolAllProgrammesQuery['secondarySchoolAllProgrammes'] =
  [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      ministrySerial: '26-575-3-6',
      title: 'Félagsfræðabraut',
      studyTrack: {
        isced: '0314',
        name: 'Félagsvísindi, viðskipti og lögfræði',
      },
      qualification: {
        id: 'qual-001',
        uniqueIdentifier: 6,
        title: 'Stúdentspróf',
        description: 'Stúdentspróf af bóknámsbraut',
        level: {
          id: 3,
          name: 'Stig 3',
          description: 'Framhaldsskólastig',
          shortDescription: 'Bóknámsbrautir til stúdentsprófs',
        },
      },
      specialization: {
        id: 'spec-001',
        title: 'Félagsfræði',
        description: 'Sérhæfing í félagsfræði og samfélagsgreinum',
        tags: [{ value: 'Félagsfræði' }, { value: 'Samfélag' }],
      },
      credits: 200,
      description:
        'Félagsfræðabraut er ætlað nemendum sem hafa áhuga á samfélagsgreinum og vilja undirbúa sig fyrir háskólanám í félagsvísindum, lögfræði eða skyldum greinum.',
      schools: [
        {
          id: 'school-001',
          name: 'Menntaskólinn við Hamrahlíð',
          abbreviation: 'MH',
          countryArea: {
            id: 'area-001',
            name: 'Höfuðborgarsvæðið',
            description: 'Reykjavík og nágrenni',
          },
        },
      ],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      ministrySerial: '26-580-3-7',
      title: 'Náttúrufræðibraut',
      studyTrack: {
        isced: '0500',
        name: 'Náttúruvísindi, stærðfræði og tölfræði',
      },
      qualification: {
        id: 'qual-002',
        uniqueIdentifier: 7,
        title: 'Stúdentspróf',
        description: 'Stúdentspróf af náttúrufræðibraut',
        level: {
          id: 3,
          name: 'Stig 3',
          description: 'Framhaldsskólastig',
          shortDescription: 'Bóknámsbrautir til stúdentsprófs',
        },
      },
      specialization: {
        id: 'spec-002',
        title: 'Náttúrufræði',
        description: 'Sérhæfing í náttúruvísindum og stærðfræði',
        tags: [{ value: 'Náttúrufræði' }, { value: 'Stærðfræði' }],
      },
      credits: 200,
      description:
        'Náttúrufræðibraut er ætlað nemendum sem hafa áhuga á náttúruvísindum, stærðfræði og verkfræði og vilja undirbúa sig fyrir háskólanám í þessum greinum.',
      schools: [
        {
          id: 'school-002',
          name: 'Menntaskólinn í Reykjavík',
          abbreviation: 'MR',
          countryArea: {
            id: 'area-001',
            name: 'Höfuðborgarsvæðið',
            description: 'Reykjavík og nágrenni',
          },
        },
        {
          id: 'school-003',
          name: 'Verzlunarskóli Íslands',
          abbreviation: 'Verzló',
          countryArea: {
            id: 'area-001',
            name: 'Höfuðborgarsvæðið',
            description: 'Reykjavík og nágrenni',
          },
        },
      ],
    },
  ]
