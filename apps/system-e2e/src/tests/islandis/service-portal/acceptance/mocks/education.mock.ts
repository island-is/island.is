import { addXroadMock } from '../../../../../support/wire-mocks'
import { Response } from '@anev/ts-mountebank'
import { Education } from '../../../../../../../../infra/src/dsl/xroad'

export const loadEducationsXroadMocks = async () => {
  await addXroadMock({
    prefixType: 'only-base-path',
    config: Education,
    prefix: 'XROAD_MMS_GRADE_SERVICE_ID',
    apiPath: '/api/v2/public/studentAssessments/0101704359',
    response: [
      new Response().withJSONBody([
        {
          fullName: 'Óþekkt',
          // eslint-disable-next-line local-rules/disallow-kennitalas
          id: 'EducationExamResult0101010101',
          grades: [
            {
              studentYear: '2020',
              courses: [
                {
                  label: 'Íslenska',
                  gradeSum: {
                    label: 'gradeSumLabel',
                    serialGrade: {
                      grade: '61',
                      label: 'serialGradeLabel',
                      weight: '61%',
                    },
                    elementaryGrade: {
                      grade: '83',
                      label: 'elementaryGradeLabel',
                      weight: '83%',
                    },
                  },
                  competence: 'competence',
                  competenceStatus: 'competenceStatus',
                  grades: [
                    {
                      label: 'gradesLabel',
                      serialGrade: {
                        grade: '61',
                        label: 'serialGradeLabel',
                        weight: '61%',
                      },
                      elementaryGrade: {
                        grade: '83',
                        label: 'elementaryGradeLabel',
                        weight: '83%',
                      },
                    },
                    {
                      label: 'gradeSumLabel',
                      serialGrade: {
                        grade: '61',
                        label: 'serialGradeLabel',
                        weight: '61%',
                      },
                      elementaryGrade: {
                        grade: '83',
                        label: 'elementaryGradeLabel',
                        weight: '83%',
                      },
                    },
                  ],
                  wordAndNumbers: {
                    grade: '61',
                    label: 'wordAndNumbersLabel',
                    weight: '61%',
                  },
                  progressText: {
                    grade: '61',
                    label: 'progressTextLabel',
                    weight: '61%',
                  },
                },
              ],
            },
          ],
        },
      ]),
    ],
  }),
    await addXroadMock({
      prefixType: 'only-base-path',
      config: Education,
      prefix: 'XROAD_MMS_GRADE_SERVICE_ID',
      apiPath: '/api/v2/public/studentAssessments/0101704359',
      response: [
        new Response().withJSONBody([
          {
            einkunnir: [
              {
                bekkur: '7.bekkur',
                namsgreinar: [
                  {
                    heiti: 'Íslenska',
                    dagsetning: '2023-01-19T12:16:07.÷157Z',
                    haefnieinkunn: '9.3',
                    haefnieinkunnStada: 'lokið',
                    samtals: {
                      heiti: 'samtals heiti',
                      radeinkunn: {
                        einkunn: '8.4',
                        heiti: 'Raðeinkunn',
                        vaegi: 4,
                      },
                      grunnskolaeinkunn: {
                        einkunn: '8.4',
                        heiti: 'Grunnskólaeinkunn',
                        vaegi: 4,
                      },
                    },
                    framfaraTexti: {
                      einkunn: '8.4',
                      heiti: 'Framfaratexti',
                      vaegi: 4,
                    },
                    einkunnir: [
                      {
                        einkunn: '5.3',
                        heiti: 'Einkunnir',
                        vaegi: 4,
                      },
                      {
                        einkunn: '9.5',
                        heiti: 'Einkunni',
                        vaegi: 4,
                      },
                    ],
                    ordOgTalnadaemi: {
                      einkunn: '3.4',
                      heiti: 'Orð & talnadæmi',
                      vaegi: 4,
                    },
                  },
                ],
              },
            ],
          },
        ]),
      ],
    })
}
