import { HttpMethod, Response } from '@anev/ts-mountebank'
import { uuid } from 'uuidv4'
import { Frigg } from '../../../../../../../../infra/src/dsl/xroad'
import { addXroadMock } from '../../../../../support/wire-mocks'

export const loadNewPrimarySchoolXroadMocks = async () => {
  await addXroadMock({
    config: Frigg,
    prefix: 'XROAD_MMS_FRIGG_PATH',
    apiPath: '/students/1111111119',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      id: 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',
      nationalId: '1111111119',
      nationalIdType: 'individual',
      nationality: 'ER',
      name: 'Stubbur Maack',
      preferredName: null,
      agents: [
        {
          id: 'a8fa8072-3180-4a5c-aa98-1864a1f7b4b3',
          relationTypeId: null,
          type: 'guardian',
          name: 'Gervimaður Afríka',
          nationalId: '0101303019',
          preferredName: null,
          nationality: 'KP',
          pronouns: [],
          requiresInterpreter: false,
          preferredLanguage: 'de',
        },
        {
          id: 'f02d7b50-5a42-40e7-b793-a4db5ab8c9a2',
          relationTypeId: null,
          type: 'guardian',
          name: 'Gervimaður útlönd',
          nationalId: '0101307789',
          preferredName: null,
          nationality: 'NO',
          pronouns: [],
          requiresInterpreter: false,
          preferredLanguage: 'de',
        },
      ],
      affiliations: [
        {
          id: '2858fa15-118f-4961-8e0a-add30b928769',
          role: 'student',
          beginDate: '2024-11-27T23:04:21.517Z',
          endDate: null,
          email: null,
          phone: null,
          organization: {
            id: '0f34ddd5-4fe5-40cb-976e-f092e93bceff',
            // eslint-disable-next-line local-rules/disallow-kennitalas
            nationalId: '5901821929',
            name: 'Hlíðaskóli',
            type: 'school',
            subType: 'generalSchool',
            sector: 'public',
          },
        },
      ],
      pronouns: [],
      gradeLevel: '01',
      primaryOrgId: '0f34ddd5-4fe5-40cb-976e-f092e93bceff',
    }),
  })
  await addXroadMock({
    config: Frigg,
    prefix: 'XROAD_MMS_FRIGG_PATH',
    apiPath: '/students/1111111119/preferred-schools',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      id: '0f34ddd5-4fe5-40cb-976e-f092e93bceff',
      unitId: 'G-1247-A',
      name: 'Hlíðaskóli',
      type: 'school',
      subType: 'generalSchool',
      sector: 'public',
      gradeLevels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
    }),
  })
  await addXroadMock({
    config: Frigg,
    prefix: 'XROAD_MMS_FRIGG_PATH',
    apiPath: '/key-options?type=pronoun',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody([
      {
        type: 'pronoun',
        options: [
          {
            id: '3f2e1543-6640-4350-87b2-ca6a7c7db80b',
            key: 'he',
            value: [
              {
                content: 'He/Him',
                language: 'en',
              },
            ],
          },
          {
            id: '9f5a1b91-6771-4721-8638-32f962413fc9',
            key: 'hes',
            value: [
              {
                content: 'Hé/Hés',
                language: 'is',
              },
            ],
          },
          {
            id: 'e0e75084-94a5-4b4b-864c-a7b390af93d0',
            key: 'hun',
            value: [
              {
                content: 'Hún/Hennar',
                language: 'is',
              },
            ],
          },
          {
            id: 'bce83310-7976-4edd-b10e-e7f4be5cf4f0',
            key: 'she',
            value: [
              {
                content: 'She/Her',
                language: 'en',
              },
            ],
          },
          {
            id: '68c8fdce-4ab6-4cfe-a12a-d5c9541c5d4f',
            key: 'hin',
            value: [
              {
                content: 'Hín/Híns',
                language: 'is',
              },
            ],
          },
          {
            id: 'ea7d625e-8a81-42ca-a453-48c24aa7366e',
            key: 'they',
            value: [
              {
                content: 'They/Them',
                language: 'en',
              },
            ],
          },
          {
            id: 'f045321d-516f-490e-9173-bcb3622c85a3',
            key: 'hann',
            value: [
              {
                content: 'Hann/Hans',
                language: 'is',
              },
            ],
          },
          {
            id: 'e133d945-1c5e-4176-aac2-a2cb20de92af',
            key: 'hed',
            value: [
              {
                content: 'Héð/Héðs',
                language: 'is',
              },
            ],
          },
          {
            id: '56ca5fb5-129a-4027-b8e5-9cd5337b044a',
            key: 'han',
            value: [
              {
                content: 'Hán/Háns',
                language: 'is',
              },
            ],
          },
          {
            id: '86a1b4a3-8968-4447-a901-ad7e83a0da2a',
            key: 'thad',
            value: [
              {
                content: 'Það/Því',
                language: 'is',
              },
            ],
          },
          {
            id: '44679dbf-a1fe-4666-b5da-5d74f7b9863b',
            key: 'thau',
            value: [
              {
                content: 'Þau/Þeirra',
                language: 'is',
              },
            ],
          },
        ],
      },
    ]),
  })
  await addXroadMock({
    config: Frigg,
    prefix: 'XROAD_MMS_FRIGG_PATH',
    apiPath: '/key-options?type=relation',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody([
      {
        type: 'relation',
        options: [
          {
            id: '2ebab655-5f3c-4904-9625-3084ed75c690',
            key: 'parent',
            value: [
              {
                content: 'Foreldri',
                language: 'is',
              },
              {
                content: 'Parent',
                language: 'en',
              },
            ],
          },
          {
            id: '7a7fb161-ee0a-4293-831c-532cf818f314',
            key: 'grandparent',
            value: [
              {
                content: 'Stórforeldri',
                language: 'is',
              },
              {
                content: 'Grandparent',
                language: 'en',
              },
            ],
          },
          {
            id: 'b3acc6d0-9818-43ad-856d-7e2a5f58d4a8',
            key: 'stepParent',
            value: [
              {
                content: 'Stjúpforeldri',
                language: 'is',
              },
              {
                content: 'Stepparent',
                language: 'en',
              },
            ],
          },
          {
            id: 'f3cf7a83-0168-4f8e-b4aa-73cafbedbb18',
            key: 'relative',
            value: [
              {
                content: 'Frændfólk',
                language: 'is',
              },
              {
                content: 'Relative',
                language: 'en',
              },
            ],
          },
          {
            id: 'da93fec9-8b6c-431d-b3d9-10ae0d3c8725',
            key: 'sibling',
            value: [
              {
                content: 'Systkini',
                language: 'is',
              },
              {
                content: 'Sibling',
                language: 'en',
              },
            ],
          },
          {
            id: '270e2b6b-05f7-436e-b56b-236b5c41750c',
            key: 'fosterParent',
            value: [
              {
                content: 'Fósturforeldri',
                language: 'is',
              },
              {
                content: 'Foster parent',
                language: 'en',
              },
            ],
          },
          {
            id: '2faef52f-dc65-4991-9506-ef63ec28ada0',
            key: 'other',
            value: [
              {
                content: 'Annað',
                language: 'is',
              },
              {
                content: 'Other',
                language: 'en',
              },
            ],
          },
          {
            id: '59c82abb-a66a-4554-9765-c71034c98dcb',
            key: 'friend',
            value: [
              {
                content: 'Vinafólk',
                language: 'is',
              },
              {
                content: 'Friend',
                language: 'en',
              },
            ],
          },
        ],
      },
    ]),
  })
  await addXroadMock({
    config: Frigg,
    prefix: 'XROAD_MMS_FRIGG_PATH',
    apiPath: '/key-options?type=registrationReason',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody([
      {
        type: 'registrationReason',
        options: [
          {
            id: '4ccf4dfa-db38-4a8a-9d76-a95f66146f65',
            key: 'custodianParliamentarianship',
            value: [
              {
                content: 'Þingmennska foreldra',
                language: 'is',
              },
              {
                content: 'Custodian’s parliamentarianship',
                language: 'en',
              },
            ],
          },
          {
            id: 'ec8bdd62-be1b-4672-a9c1-f3a830a5d2e6',
            key: 'livesInTwoPlaces',
            value: [
              {
                content: 'Býr á tveimur heimilum',
                language: 'is',
              },
              {
                content: 'Has two places of residence',
                language: 'en',
              },
            ],
          },
          {
            id: 'd103e34d-d27c-4ec4-9d83-b78c56cb0728',
            key: 'temporaryFoster',
            value: [
              {
                content: 'Tímabundið fóstur',
                language: 'is',
              },
              {
                content: 'Temporary foster care',
                language: 'en',
              },
            ],
          },
          {
            id: '32bb4e56-1f2d-4c6b-909c-afa82b2b565c',
            key: 'specialService',
            value: [
              {
                content: 'Sérfræðiþjónusta',
                language: 'is',
              },
              {
                content: 'Special support service',
                language: 'en',
              },
            ],
          },
          {
            id: '114fa891-4e22-4181-8dde-df17173437ff',
            key: 'hospitalization',
            value: [
              {
                content: 'Sjúkralega',
                language: 'is',
              },
              {
                content: 'Hospitalization',
                language: 'en',
              },
            ],
          },
          {
            id: '4c6db4ae-62ba-495d-9aba-f08092f705f5',
            key: 'movingMuniciplaity',
            value: [
              {
                content: 'Flutningur lögheimilis',
                language: 'is',
              },
              {
                content: 'Moving legal domicile',
                language: 'en',
              },
            ],
          },
          {
            id: '85b18dc9-ffa4-4a43-a427-4cccbdba725c',
            key: 'custodianStudyStay',
            value: [
              {
                content: 'Námsdvöl foreldra',
                language: 'is',
              },
              {
                content: 'Custodians‘s study stay',
                language: 'en',
              },
            ],
          },
          {
            id: 'c2ddef92-c7ef-4f9d-85f0-14429e01e69d',
            key: 'other',
            value: [
              {
                content: 'Aðrar ástæður',
                language: 'is',
              },
              {
                content: 'Other',
                language: 'en',
              },
            ],
          },
          {
            id: '5fd059f2-9019-49e7-be43-a88421f95635',
            key: 'generalSchoolPolicy',
            value: [
              {
                content: 'Skólastefna',
                language: 'is',
              },
              {
                content: 'General school policy',
                language: 'en',
              },
            ],
          },
          {
            id: '1e1ad64d-1626-42d8-8448-45661816a0f0',
            key: 'siblingsInSameSchool',
            value: [
              {
                content: 'Systkini í sama skóla',
                language: 'is',
              },
              {
                content: 'Siblings in the same school',
                language: 'en',
              },
            ],
          },
          {
            id: '98f41e34-7c95-4412-976d-4fe3023a65f6',
            key: 'personalReasons',
            value: [
              {
                content: 'Persónulegar ástæður',
                language: 'is',
              },
              {
                content: 'Personal reasons',
                language: 'en',
              },
            ],
          },
        ],
      },
    ]),
  })
  await addXroadMock({
    config: Frigg,
    prefix: 'XROAD_MMS_FRIGG_PATH',
    apiPath: '/key-options?type=languageEnvironment',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody([
      {
        type: 'languageEnvironment',
        options: [
          {
            id: '7237f5e1-4d3d-4459-8809-b2069b6f9e74',
            key: 'onlyIcelandic',
            value: [
              {
                content: 'Aðeins töluð íslenska',
                language: 'is',
              },
              {
                content: 'Only Icelandic spoken',
                language: 'en',
              },
            ],
          },
          {
            id: '68d9d4b2-6f3f-4519-92dd-4af8c163cf2a',
            key: 'icelandicAndOther',
            value: [
              {
                content: 'Töluð íslenska og annað/önnur tungumál',
                language: 'is',
              },
              {
                content: 'Icelandic and other languages spoken',
                language: 'en',
              },
            ],
          },
          {
            id: 'bdec05bf-ced2-4ad2-b708-e7bcb5c00379',
            key: 'onlyOtherThanIcelandic',
            value: [
              {
                content: 'Aðeins töluð önnur tungumál en íslenska',
                language: 'is',
              },
              {
                content: 'Only other languages than Icelandic spoken',
                language: 'en',
              },
            ],
          },
        ],
      },
    ]),
  })
  await addXroadMock({
    config: Frigg,
    prefix: 'XROAD_MMS_FRIGG_PATH',
    apiPath: '/key-options?type=foodAllergyAndIntolerance',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody([
      {
        type: 'foodAllergyAndIntolerance',
        options: [
          {
            id: 'a8c70062-fe9c-4cbf-929b-8acd8e5c8860',
            key: 'meat',
            value: [
              {
                content: 'Kjöt',
                language: 'is',
              },
              {
                content: 'Meat',
                language: 'en',
              },
            ],
          },
          {
            id: '25871a50-561a-4839-b9bd-39ab79070bbf',
            key: 'dairy',
            value: [
              {
                content: 'Mjólkurvörur',
                language: 'is',
              },
              {
                content: 'Dairy products',
                language: 'en',
              },
            ],
          },
          {
            id: '9092c358-207e-4b18-bea9-8a9aed438675',
            key: 'vegetables',
            value: [
              {
                content: 'Grænmeti',
                language: 'is',
              },
              {
                content: 'Vegetables',
                language: 'en',
              },
            ],
          },
          {
            id: 'e12761e5-4cfb-4449-ba49-602612d9cfa0',
            key: 'other',
            value: [
              {
                content: 'Annað',
                language: 'is',
              },
              {
                content: 'Other',
                language: 'en',
              },
            ],
          },
          {
            id: 'd6453939-3c18-4bb8-969c-e7d866f9899d',
            key: 'egg',
            value: [
              {
                content: 'Egg',
                language: 'is',
              },
              {
                content: 'Eggs',
                language: 'en',
              },
            ],
          },
          {
            id: 'a4c38d10-3950-411d-8bd1-a0dd348744e4',
            key: 'fish',
            value: [
              {
                content: 'Fiskur',
                language: 'is',
              },
              {
                content: 'Fish',
                language: 'en',
              },
            ],
          },
          {
            id: '56cc7690-ecfd-44ae-9808-182567f7183e',
            key: 'coconut',
            value: [
              {
                content: 'Kókos',
                language: 'is',
              },
              {
                content: 'Coconut',
                language: 'en',
              },
            ],
          },
          {
            id: 'a1be3cf7-3bf7-48f0-9a5e-2c4e18aeaf25',
            key: 'peanuts',
            value: [
              {
                content: 'Hnetur',
                language: 'is',
              },
              {
                content: 'Peanuts',
                language: 'en',
              },
            ],
          },
          {
            id: 'c80807c4-9c8e-4a27-9b9c-4ae70c5d3ddc',
            key: 'sesame',
            value: [
              {
                content: 'Sesamfræ',
                language: 'is',
              },
              {
                content: 'Sesame seeds',
                language: 'en',
              },
            ],
          },
          {
            id: '02b740f1-110c-43a1-98dd-95cad6ce3fc9',
            key: 'fruits',
            value: [
              {
                content: 'Ávextir',
                language: 'is',
              },
              {
                content: 'Fruits',
                language: 'en',
              },
            ],
          },
          {
            id: '5299d73b-1bcd-42ef-ad40-8d6d6c0f13ee',
            key: 'wheat',
            value: [
              {
                content: 'Hveiti',
                language: 'is',
              },
              {
                content: 'Wheat',
                language: 'en',
              },
            ],
          },
          {
            id: '0957e2c4-78d3-47e3-9c94-a0ce31d923ed',
            key: 'soy',
            value: [
              {
                content: 'Sojaafurðir',
                language: 'is',
              },
              {
                content: 'Soy products',
                language: 'en',
              },
            ],
          },
          {
            id: '1a7c7c93-9dee-4277-92bb-5ec8bb72a47a',
            key: 'beans',
            value: [
              {
                content: 'Baunir',
                language: 'is',
              },
              {
                content: 'Beans',
                language: 'en',
              },
            ],
          },
        ],
      },
    ]),
  })
  await addXroadMock({
    config: Frigg,
    prefix: 'XROAD_MMS_FRIGG_PATH',
    apiPath: '/key-options?type=allergy',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody([
      {
        type: 'allergy',
        options: [
          {
            id: 'e88699d3-6695-40d5-8853-4b0ed0ba11e8',
            key: 'antiInflammatoryDrugs',
            value: [
              {
                content: 'Bólgueyðandi lyf',
                language: 'is',
              },
              {
                content: 'Anti-inflammatory drugs',
                language: 'en',
              },
            ],
          },
          {
            id: 'f13cc515-1186-4983-bc4b-4b3965f368e6',
            key: 'wasp',
            value: [
              {
                content: 'Geitunga-/skordýrabit',
                language: 'is',
              },
              {
                content: 'Wasp/insect bites',
                language: 'en',
              },
            ],
          },
          {
            id: '43e04eff-e981-4225-8e04-0b9cf7c12de0',
            key: 'pollen',
            value: [
              {
                content: 'Frjókorn/gras/birki',
                language: 'is',
              },
              {
                content: 'Pollen/grass/birch',
                language: 'en',
              },
            ],
          },
          {
            id: 'da6978a0-8ebd-40e2-bb32-482a8469a4c4',
            key: 'latex',
            value: [
              {
                content: 'Latex',
                language: 'is',
              },
              {
                content: 'Latex',
                language: 'en',
              },
            ],
          },
          {
            id: 'b2e847a8-ebcb-46ca-85b7-f66a8a35f7d2',
            key: 'nickel',
            value: [
              {
                content: 'Nikkel',
                language: 'is',
              },
              {
                content: 'Nickel',
                language: 'en',
              },
            ],
          },
          {
            id: 'f6ce169d-9791-44cc-976b-43cd428af823',
            key: 'animals',
            value: [
              {
                content: 'Hundar/kettir/önnur dýr',
                language: 'is',
              },
              {
                content: 'Dogs/cats/other animals',
                language: 'en',
              },
            ],
          },
          {
            id: '7267c3ae-ebb1-4622-86f2-a426b36dbe53',
            key: 'other',
            value: [
              {
                content: 'Annað',
                language: 'is',
              },
              {
                content: 'Other',
                language: 'en',
              },
            ],
          },
        ],
      },
    ]),
  })
  await addXroadMock({
    config: Frigg,
    prefix: 'XROAD_MMS_FRIGG_PATH',
    apiPath: '/organizations?type=school&limit=1000',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody([
      {
        id: '0ccde57c-debd-4c94-a25e-c47a12ce8631',
        unitId: 'G-1356-A',
        name: 'Hvassaleitisskóli',
        type: 'school',
        subType: 'generalSchool',
        sector: 'public',
        gradeLevels: ['01', '02', '03', '04', '05', '06', '07'],
        settings: {
          applicationConfigs: [
            {
              applicationFeatures: [
                {
                  key: 'consents',
                },
                {
                  key: 'applicant_info',
                },
                {
                  key: 'guardians',
                },
                {
                  key: 'emergency_contacts',
                },
                {
                  key: 'current_organization',
                },
                {
                  key: 'application_reason',
                },
                {
                  key: 'siblings',
                },
                {
                  key: 'timeframe',
                },
                {
                  key: 'language_info',
                },
                {
                  key: 'health_info',
                },
                {
                  key: 'social_info',
                },
              ],
            },
          ],
        },
      },
      {
        id: '0f34ddd5-4fe5-40cb-976e-f092e93bceff',
        unitId: 'G-1247-A',
        name: 'Hlíðaskóli',
        type: 'school',
        subType: 'generalSchool',
        sector: 'public',
        gradeLevels: [
          '01',
          '02',
          '03',
          '04',
          '05',
          '06',
          '07',
          '08',
          '09',
          '10',
        ],
        settings: {
          applicationConfigs: [
            {
              applicationFeatures: [
                {
                  key: 'consents',
                },
                {
                  key: 'applicant_info',
                },
                {
                  key: 'guardians',
                },
                {
                  key: 'emergency_contacts',
                },
                {
                  key: 'current_organization',
                },
                {
                  key: 'application_reason',
                },
                {
                  key: 'siblings',
                },
                {
                  key: 'timeframe',
                },
                {
                  key: 'language_info',
                },
                {
                  key: 'health_info',
                },
                {
                  key: 'social_info',
                },
              ],
            },
          ],
        },
      },
      {
        id: '29e6e2b3-6563-4dd3-ac87-cc18813bfe9c',
        unitId: 'G-1438-A',
        name: 'Árbæjarskóli',
        type: 'school',
        subType: 'generalSchool',
        sector: 'public',
        gradeLevels: [
          '01',
          '02',
          '03',
          '04',
          '05',
          '06',
          '07',
          '08',
          '09',
          '10',
        ],
        settings: {
          applicationConfigs: [
            {
              applicationFeatures: [
                {
                  key: 'consents',
                },
                {
                  key: 'applicant_info',
                },
                {
                  key: 'guardians',
                },
                {
                  key: 'emergency_contacts',
                },
                {
                  key: 'current_organization',
                },
                {
                  key: 'application_reason',
                },
                {
                  key: 'siblings',
                },
                {
                  key: 'timeframe',
                },
                {
                  key: 'language_info',
                },
                {
                  key: 'health_info',
                },
                {
                  key: 'social_info',
                },
              ],
            },
          ],
        },
      },
      {
        id: '65438698-6b8c-4369-a854-5c78dff445a8',
        unitId: 'G-1269-A',
        name: 'Háteigsskóli',
        type: 'school',
        subType: 'generalSchool',
        sector: 'public',
        gradeLevels: [
          '01',
          '02',
          '03',
          '04',
          '05',
          '06',
          '07',
          '08',
          '09',
          '10',
        ],
        settings: {
          applicationConfigs: [
            {
              applicationFeatures: [
                {
                  key: 'consents',
                },
                {
                  key: 'applicant_info',
                },
                {
                  key: 'guardians',
                },
                {
                  key: 'emergency_contacts',
                },
                {
                  key: 'current_organization',
                },
                {
                  key: 'application_reason',
                },
                {
                  key: 'siblings',
                },
                {
                  key: 'timeframe',
                },
                {
                  key: 'language_info',
                },
                {
                  key: 'health_info',
                },
                {
                  key: 'social_info',
                },
              ],
            },
          ],
        },
      },
    ]),
  })
  await addXroadMock({
    config: Frigg,
    prefix: 'XROAD_MMS_FRIGG_PATH',
    apiPath: '/organizations?type=municipality&limit=1000',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody([
      {
        id: '8145246a-3ea7-4d64-8518-1247f22d1a7a',
        unitId: '1000',
        name: 'Kópavogsbær',
        type: 'municipality',
        subType: null,
        sector: null,
        settings: null,
      },
      {
        id: '91a3d936-15f3-4cae-9df1-6bdad7b012be',
        unitId: '1300',
        name: 'Garðabær',
        type: 'municipality',
        subType: null,
        sector: null,
        settings: null,
      },
      {
        id: '9694a721-b042-4f0e-877b-7dd559012f00',
        unitId: '1400',
        name: 'Hafnarfjarðarkaupstaður',
        type: 'municipality',
        subType: null,
        sector: null,
        settings: null,
      },
      {
        id: 'fb432b1e-4899-475d-8dcf-3d27271bf1d7',
        unitId: '0000',
        name: 'Reykjavíkurborg',
        type: 'municipality',
        subType: null,
        sector: null,
        settings: null,
      },
    ]),
  })
  await addXroadMock({
    config: Frigg,
    prefix: 'XROAD_MMS_FRIGG_PATH',
    apiPath:
      '/organizations?type=school&municipalityCode=0000&gradeLevels=01%2C02&limit=1000',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody([
      {
        id: '0ccde57c-debd-4c94-a25e-c47a12ce8631',
        unitId: 'G-1356-A',
        name: 'Hvassaleitisskóli',
        type: 'school',
        subType: 'generalSchool',
        sector: 'public',
        gradeLevels: ['01', '02', '03', '04', '05', '06', '07'],
        settings: null,
      },
      {
        id: '0f34ddd5-4fe5-40cb-976e-f092e93bceff',
        unitId: 'G-1247-A',
        name: 'Hlíðaskóli',
        type: 'school',
        subType: 'generalSchool',
        sector: 'public',
        gradeLevels: [
          '01',
          '02',
          '03',
          '04',
          '05',
          '06',
          '07',
          '08',
          '09',
          '10',
        ],
        settings: null,
      },
      {
        id: '29e6e2b3-6563-4dd3-ac87-cc18813bfe9c',
        unitId: 'G-1438-A',
        name: 'Árbæjarskóli',
        type: 'school',
        subType: 'generalSchool',
        sector: 'public',
        gradeLevels: [
          '01',
          '02',
          '03',
          '04',
          '05',
          '06',
          '07',
          '08',
          '09',
          '10',
        ],
        settings: null,
      },
      {
        id: '65438698-6b8c-4369-a854-5c78dff445a8',
        unitId: 'G-1269-A',
        name: 'Háteigsskóli',
        type: 'school',
        subType: 'generalSchool',
        sector: 'public',
        gradeLevels: [
          '01',
          '02',
          '03',
          '04',
          '05',
          '06',
          '07',
          '08',
          '09',
          '10',
        ],
        settings: null,
      },
    ]),
  })
  await addXroadMock({
    config: Frigg,
    prefix: 'XROAD_MMS_FRIGG_PATH',
    apiPath: '/forms/registrations',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      applicationId: uuid(),
      state: 'pending',
    }),
    method: HttpMethod.POST,
  })
}
