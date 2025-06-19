import { addXroadMock } from '@island.is/testing/e2e'
import { Response } from '@anev/ts-mountebank'
import { Education } from '../../../../../../infra/src/dsl/xroad'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { StudentAssessmentViewModel } from '@island.is/clients/mms/grade'

const mockObject: StudentAssessmentViewModel = {
  einkunnir: [
    {
      bekkur: 4,
      namsgreinar: [
        {
          heiti: 'Testlenskan',
          dagsetning: new Date(1990, 1, 1),
          haefnieinkunn: 'Glæsó',
          haefnieinkunnStada: 'A+123',
          samtals: {
            heiti: 'bing',
            radeinkunn: {
              einkunn: '99',
              heiti: 'Raðeinkunn',
              vaegi: 0,
            },
            grunnskolaeinkunn: {
              einkunn: '67',
              heiti: 'Grunnskólaeinkunn',
              vaegi: 0,
            },
          },
          framfaraTexti: {
            einkunn: 'Framfarir eru flottar og mikilvægar jibbí',
            heiti: 'Framfaratexti',
            vaegi: 0,
          },
          einkunnir: [
            {
              heiti: 'Lesskilningur',
              radeinkunn: {
                einkunn: '896',
                heiti: 'Lesskilningur, raðeinkunn',
                vaegi: 97,
              },
              grunnskolaeinkunn: {
                einkunn: '2',
                heiti: 'Lesskilningur, Grunnskólaeinkunn',
                vaegi: 97,
              },
            },
            {
              heiti: 'Málnotkun',
              radeinkunn: {
                einkunn: '896',
                heiti: 'Málnotkun, raðeinkunn',
                vaegi: 64,
              },
              grunnskolaeinkunn: {
                einkunn: '2',
                heiti: 'Málnotkun, Grunnskólaeinkunn',
                vaegi: 965,
              },
            },
          ],
          ordOgTalnadaemi: {
            einkunn: 'Test svipað gott í öllum fögum',
            heiti: 'Frammistaða í hinu og þessu',
            vaegi: 0,
          },
        },
        {
          heiti: 'Stærðófræðó',
          dagsetning: new Date(1650, 1, 1),
          haefnieinkunn: 'Slæm',
          haefnieinkunnStada: 'F--',
          samtals: {
            heiti: 'bunrb',
            radeinkunn: {
              einkunn: '3',
              heiti: 'Raðeinkunn',
              vaegi: 0,
            },
            grunnskolaeinkunn: {
              einkunn: '8765',
              heiti: 'Grunnskólaeinkunn',
              vaegi: 0,
            },
          },
          framfaraTexti: {
            einkunn: 'Framfarir eru lit',
            heiti: 'Framfaratexti',
            vaegi: 0,
          },
          einkunnir: [
            {
              heiti: 'Samlagning',
              radeinkunn: {
                einkunn: '88',
                heiti: 'Samlagning, raðeinkunn',
                vaegi: 97,
              },
              grunnskolaeinkunn: {
                einkunn: '287692',
                heiti: 'Samlagning, Grunnskólaeinkunn',
                vaegi: 97,
              },
            },
            {
              heiti: 'Ekki gera vitlaust',
              radeinkunn: {
                einkunn: '89756',
                heiti: 'Málnotkun, raðeinkunn',
                vaegi: 64,
              },
              grunnskolaeinkunn: {
                einkunn: '-7654',
                heiti: 'Málnotkun, Grunnskólaeinkunn',
                vaegi: 965,
              },
            },
          ],
          ordOgTalnadaemi: {
            einkunn: 'L+elegt',
            heiti: 'Frekar',
            vaegi: 0,
          },
        },
      ],
    },
    {
      bekkur: 9,
      namsgreinar: [
        {
          heiti: 'Bíngó',
          dagsetning: new Date(1990, 1, 1),
          haefnieinkunn: 'Glæsó',
          haefnieinkunnStada: 'A+123',
          samtals: {
            heiti: 'goieo',
            radeinkunn: {
              einkunn: '99',
              heiti: 'Raðeinkunn',
              vaegi: 0,
            },
            grunnskolaeinkunn: {
              einkunn: '67',
              heiti: 'Grunnskólaeinkunn',
              vaegi: 0,
            },
          },
          framfaraTexti: {
            einkunn: 'Framfarir eru flottar og mikilvægar jibbí',
            heiti: 'Framfaratexti',
            vaegi: 0,
          },
          einkunnir: [
            {
              heiti: 'Lesskilningur',
              radeinkunn: {
                einkunn: '896',
                heiti: 'Lesskilningur, raðeinkunn',
                vaegi: 97,
              },
              grunnskolaeinkunn: {
                einkunn: '2',
                heiti: 'Lesskilningur, Grunnskólaeinkunn',
                vaegi: 97,
              },
            },
            {
              heiti: 'Málnotkun',
              radeinkunn: {
                einkunn: '896',
                heiti: 'Málnotkun, raðeinkunn',
                vaegi: 64,
              },
              grunnskolaeinkunn: {
                einkunn: '2',
                heiti: 'Málnotkun, Grunnskólaeinkunn',
                vaegi: 965,
              },
            },
          ],
          ordOgTalnadaemi: {
            einkunn: 'Bah',
            heiti: 'Hab',
            vaegi: 0,
          },
        },
      ],
    },
  ],
}

export const loadEducationXroadMocks = async () => {
  await addXroadMock({
    prefixType: 'only-base-path',
    config: Education,
    prefix: 'XROAD_MMS_GRADE_SERVICE_ID',
    apiPath: '/api/v2/public/studentAssessments/0101302399',
    response: [new Response().withJSONBody(mockObject)],
  })
}
