import { FormValue } from '@island.is/application/types'
import { ApplicationDto } from '@island.is/clients/hms-application-system'

// The payment structure is as follows:
// 1. If the current appraisal is less than 25 million, the payment is 6.000kr
// 2. If the current appraisal is between 25 million and 500 million, the payment is 0.03% of the current appraisal

// 3. If the current appraisal is greater than 500 million, the payment is 0.01% of the current appraisal
export const paymentForAppraisal = (currentAppraisal: number) => {
  if (currentAppraisal < 25000000) {
    return 6000
  }

  if (currentAppraisal > 500000000) {
    return currentAppraisal * 0.0001
  }

  return currentAppraisal * 0.0003
}

export const mapAnswersToApplicationDto = (
  _answers: FormValue,
): ApplicationDto => {
  console.log('mapping answers to application dto')

  return {
    applicationName: 'Brunabótamat - Endurmat',
    status: 40, // What is this???
    language: 'IS',
    portalApplicationID: '1234567890', // Get the id of the application
    applicationType: 'LscVK9yI7EeXf4WDCOBfww', // This is fixed
    applicationJson: null,
    dagssetning: new Date(),
    adilar: [
      {
        kennitala: '123456789',
        heiti: 'Gervimaður Færeyjar',
        heimili: 'Gervimaður Færeyjar',
        postnumer: '1234',
        stadur: 'Reykjavík',
        tegund: 0, // What is this???
        hlutverk: 'Umsækjandi',
        netfang: 'gf@island.is',
        simi: '123456789',
      },
    ],
    notandagogn: [
      {
        flokkur: 'Eign',
        heiti: 'Fasteignanumer',
        tegund: 'fastanúmer',
        gildi: '1234567',
        countryCode: null,
        nafn: null,
        guid: '1234567890', // Where does guid come from???
      },
      {
        flokkur: 'FastanúmerAfleiða',
        heiti: 'Heimili',
        tegund: 'string',
        gildi: 'Dúfnahólar 10',
        countryCode: null,
        nafn: null,
        guid: '1234567890',
      },
      {
        flokkur: 'FastanúmerAfleiða',
        heiti: 'Póstnúmer',
        tegund: 'string',
        gildi: '110',
        countryCode: null,
        nafn: null,
        guid: '1234567890',
      },
      {
        flokkur: 'FastanúmerAfleiða',
        heiti: 'Merking',
        tegund: 'string',
        gildi: '10',
        countryCode: null,
        nafn: null,
        guid: '1234567890',
      },
      {
        flokkur: 'FastanúmerAfleiða',
        heiti: 'staður',
        tegund: 'string',
        gildi: 'Reykjavík',
        countryCode: null,
        nafn: null,
        guid: '1234567890',
      },
      {
        flokkur: 'FastanúmerAfleiða',
        heiti: 'Land',
        tegund: 'string',
        gildi: '',
        countryCode: null,
        nafn: null,
        guid: '1234567890',
      },
      {
        flokkur: 'FastanúmerAfleiða',
        heiti: 'Sveitarfélag',
        tegund: 'string',
        gildi: 'Reykjavík',
        countryCode: null,
        nafn: null,
        guid: '1234567890',
      },
      {
        flokkur: 'FastanúmerAfleiða',
        heiti: 'Skráning eignar',
        tegund: 'string',
        gildi: 'fastaNRValid',
        countryCode: null,
        nafn: null,
        guid: '1234567890',
      },
      {
        flokkur: 'Lýsing á fasteign',
        heiti:
          'Vinsamlegast listaðu upp þær framkvæmdir sem ráðist hefur verið í og hvaða ár þær voru gerðar. ',
        tegund: 'multi',
        gildi: 'Skipt um innréttingar og .... málað 2020.\r\n\r\n',
        countryCode: null,
        nafn: null,
        guid: '1234567890',
      },
      {
        flokkur: 'Umsækjandi',
        heiti: 'Vinsamlegast veldu',
        tegund: 'radio',
        gildi: 'Umsækjandi er eigandi fasteignar',
        countryCode: null,
        nafn: null,
        guid: '1234567890',
      },
      {
        flokkur: 'Matsaðferð',
        heiti: 'Endurmat vegna endurbóta',
        tegund: 'radio',
        gildi: 'Já, vegna endurbóta',
        countryCode: null,
        nafn: null,
        guid: '1234567890',
      },
      {
        flokkur: 'Matsaðferð',
        heiti: 'Endurmat vegna viðbyggingar',
        tegund: 'radio',
        gildi: 'Nei, ekki vegna viðbyggingar',
        countryCode: null,
        nafn: null,
        guid: '1234567890',
      },
      {
        flokkur: 'Skil á umsókn',
        heiti:
          'g lýsi yfir að ég hef kynnt mér efni á island.is um brunabótamat',
        tegund: 'bool',
        gildi: 'true',
        countryCode: null,
        nafn: null,
        guid: '1234567890',
      },
      {
        flokkur: 'Skil á umsókn',
        heiti: 'Ég hef kynnt mér persónuverndarstefnu HMS',
        tegund: 'bool',
        gildi: 'true',
        countryCode: null,
        nafn: null,
        guid: '1234567890',
      },
    ],
    greidsla: {
      upphaed: null,
      dags: null,
      korthafi: null,
      kortanumer: null,
      tegundKorts: null,
    },
    files: [
      {
        flokkur: 2,
        heiti: 'Mynd 1',
        dags: new Date(),
        tegund: 'image/jpeg',
        fileID: '1234567890',
        ending: '.jpg',
      },
      {
        flokkur: 2,
        heiti: 'Mynd 2',
        dags: new Date(),
        tegund: 'image/jpeg',
        fileID: '1234567890',
        ending: '.jpg',
      },
      {
        flokkur: 5,
        heiti: 'Mynd 3',
        dags: new Date(),
        tegund: 'application/pdf',
        fileID: '1234567890',
        ending: '.pdf',
      },
    ],
  }
}
