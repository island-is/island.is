import { HttpMethod, Response } from '@anev/ts-mountebank'
import { Frigg } from '../../../../../../../../infra/src/dsl/xroad'
import { addXroadMock } from '../../../../../support/wire-mocks'
import { uuid } from 'uuidv4'

export const loadNewPrimarySchoolXroadMocks = async () => {
  await addXroadMock({
    config: Frigg,
    prefix: 'XROAD_MMS_FRIGG_PATH',
    apiPath: '/students/1111111119',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      id: 'fda34e23-f838-4a59-8bb9-90a0b52a6cd4',
      nationalId: '1111111119',
      name: 'Stubbur Maack',
      preferredName: null,
      pronouns: [],
      email: null,
      primaryOrgId: '05ffcc36-7e44-45f0-8cb2-8f296a7f0808',
      memberships: [
        {
          id: 'cda47c98-ae75-4939-8659-1b7fe45c8097',
          role: 'student',
          beginDate: '2024-08-26T01:48:24.888Z',
          endDate: null,
          organization: {
            id: '05ffcc36-7e44-45f0-8cb2-8f296a7f0808',
            name: 'Hlíðaskóli',
            // eslint-disable-next-line local-rules/disallow-kennitalas
            nationalId: '5509244710',
            type: 'school',
          },
        },
      ],
      agents: [
        {
          id: '982afa53-0b47-4f57-8eec-53f16563bc93',
          nationalId: '0101303019',
          name: 'Gervimaður Afríka',
          phone: '555-1234',
          email: 'frika@gervimadur.is',
          role: 'guardian',
          domicile: {
            id: 'fb94c164-c037-49ac-ae31-7501c9a90467',
            address: 'S 4th Street 66',
            municipality: 'Dillontown',
            postCode: '103',
            country: 'IS',
            createdAt: '2025-02-05T15:52:53.728Z',
            updatedAt: '2025-02-05T15:52:53.728Z',
          },
        },
      ],
      gradeLevel: '01',
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
            id: '6bb71a28-2177-496b-a38b-034c83ae5f6a',
            key: 'he',
            value: [
              {
                content: 'He/Him',
                language: 'is',
              },
            ],
          },
          {
            id: '105b1208-fd7b-4b18-9bb2-041dbc65f580',
            key: 'hes',
            value: [
              {
                content: 'Hé/Hés',
                language: 'is',
              },
            ],
          },
          {
            id: 'de4ca207-7add-4a50-9411-2bb298dbde14',
            key: 'hun',
            value: [
              {
                content: 'Hún/Hennar',
                language: 'is',
              },
            ],
          },
          {
            id: '13def032-c733-48cf-b214-122c249313db',
            key: 'she',
            value: [
              {
                content: 'She/Her',
                language: 'is',
              },
            ],
          },
          {
            id: 'f92087e5-f020-46af-959f-572b7f95a400',
            key: 'hin',
            value: [
              {
                content: 'Hín/Híns',
                language: 'is',
              },
            ],
          },
          {
            id: '4330c443-29b6-4773-a870-f35e485449f7',
            key: 'they',
            value: [
              {
                content: 'They/Them',
                language: 'is',
              },
            ],
          },
          {
            id: 'ed47b45a-f733-47ce-92c2-8409f5c39178',
            key: 'hann',
            value: [
              {
                content: 'Hann/Hans',
                language: 'is',
              },
            ],
          },
          {
            id: 'eaa15c86-f7cd-493e-b368-2d66da2ab809',
            key: 'hed',
            value: [
              {
                content: 'Héð/Héðs',
                language: 'is',
              },
            ],
          },
          {
            id: 'f7f7f6a5-2e29-4eae-8345-03d3af73a6b6',
            key: 'han',
            value: [
              {
                content: 'Hán/Háns',
                language: 'is',
              },
            ],
          },
          {
            id: '0f16870b-c796-4fde-8cfc-a015ce6e5662',
            key: 'thad',
            value: [
              {
                content: 'Það/Því',
                language: 'is',
              },
            ],
          },
          {
            id: '454440af-e3d4-4e28-9810-30ab9a79957d',
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
            id: '4fc642a2-6268-4de5-8f78-8f6a66840a95',
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
            id: 'c66345c5-22af-47a9-891c-a8ab6a9f487d',
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
            id: '451a61ee-80b2-4d4f-ae26-9bcb6c23dc7a',
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
            id: '0063446c-ecbf-42c6-a277-c2b82bcbdeef',
            key: 'relative',
            value: [
              {
                content: 'Frænd fólk',
                language: 'is',
              },
              {
                content: 'Relative',
                language: 'en',
              },
            ],
          },
          {
            id: '3734709c-a6a4-4c00-9a0f-a6466983e353',
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
            id: 'cc09ed0e-af86-4ef7-a18d-6d6a40ed9eec',
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
            id: 'a9ad6d6f-59b6-47ca-a5b9-7261f3f7f4b5',
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
            id: '6352fa7a-03d2-45b2-9d48-6e19448a64b2',
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
            id: '203eea2b-df15-4d60-a2ef-24b1bf948707',
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
            id: 'de0d4b39-824a-4ea3-83cd-8e020fd3ac91',
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
            id: '1062a711-1970-4c62-b89e-0abeadf86266',
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
            id: 'f05096f6-5d2d-4ae7-ae59-b81087829f39',
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
            id: 'd6f66018-bfd7-46bc-8c47-3412d1734f4a',
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
            id: 'e82101e6-bd18-41d4-b123-758e9c4315ff',
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
            id: 'bc87de56-9999-4b91-ab59-7ff832c6d987',
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
            id: '5efdbc33-56d5-4c1f-824f-8d469c19dfb6',
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
            id: '900bbc89-a459-444c-943f-f6ff55291e33',
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
            id: '8622c1fa-0ba0-46d8-a621-016202d1e648',
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
            id: '7d1fc5a1-18b5-45dc-98d3-96f6cf4bf366',
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
            id: '70a48a9b-f671-4f69-9d19-bc2d5becb377',
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
    apiPath: '/schools',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody([
      {
        id: '86ee7c01-bbfb-428c-b4c6-801f8525a70a',
        // eslint-disable-next-line local-rules/disallow-kennitalas
        nationalId: '5612241530',
        name: 'Kópavogur',
        type: 'municipality',
        children: [
          {
            id: 'cf2b139b-11af-466f-8705-54d341deae88',
            // eslint-disable-next-line local-rules/disallow-kennitalas
            nationalId: '6403244490',
            name: 'Smáraskóli',
            type: 'school',
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
            children: null,
          },
        ],
      },
      {
        id: '9b9b9989-72d4-4310-b206-0069ffbdcc1b',
        // eslint-disable-next-line local-rules/disallow-kennitalas
        nationalId: '6605247030',
        name: 'Reykjavíkurborg',
        type: 'municipality',
        children: [
          {
            id: '05ffcc36-7e44-45f0-8cb2-8f296a7f0808',
            // eslint-disable-next-line local-rules/disallow-kennitalas
            nationalId: '5509244710',
            name: 'Hlíðaskóli',
            type: 'school',
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
            children: null,
          },
          {
            id: 'f4819ff5-ca00-40db-8bd6-a7dc41a82fe3',
            // eslint-disable-next-line local-rules/disallow-kennitalas
            nationalId: '4801253980',
            name: 'Háteigsskóli',
            type: 'school',
            gradeLevels: ['01', '02', '03', '04'],
            children: null,
          },
        ],
      },
    ]),
  })
  await addXroadMock({
    config: Frigg,
    prefix: 'XROAD_MMS_FRIGG_PATH',
    apiPath: '/forms',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      state: 'pending',
      formId: uuid(),
      reviewId: uuid(),
      reviewSourceId: uuid(),
    }),
    method: HttpMethod.POST,
  })
}
