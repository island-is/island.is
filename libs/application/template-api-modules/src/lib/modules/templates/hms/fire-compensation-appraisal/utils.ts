import { getValueViaPath, YES } from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import { ApplicationDto } from '@island.is/clients/hms-application-system'
import { Fasteign } from '@island.is/clients/assets'
// The payment structure is as follows:
// 1. If the current appraisal is less than 25 million, the payment is 6.000kr
// 2. If the current appraisal is between 25 million and 500 million, the payment is 0.03% of the current appraisal

// 3. If the current appraisal is greater than 500 million, the payment is 0.01% of the current appraisal
export const paymentForAppraisal = (currentAppraisal: number) => {
  if (currentAppraisal < 25000000) {
    return 6000
  }

  if (currentAppraisal > 500000000) {
    return Math.round(currentAppraisal * 0.0001)
  }

  return Math.round(currentAppraisal * 0.0003)
}

const GUID = 'c7c13606-9a03-40ec-837b-ec5d7665a8fe' // HMS does nothing with this but it has to have a certain form for the request to go through

const getApplicant = (answers: FormValue) => {
  return {
    address: getValueViaPath<string>(answers, 'applicant.address'),
    city: getValueViaPath<string>(answers, 'applicant.city'),
    email: getValueViaPath<string>(answers, 'applicant.email'),
    name: getValueViaPath<string>(answers, 'applicant.name'),
    nationalId: getValueViaPath<string>(answers, 'applicant.nationalId'),
    phoneNumber: getValueViaPath<string>(answers, 'applicant.phoneNumber'),
    postalCode: getValueViaPath<string>(answers, 'applicant.postalCode'),
  }
}

export const mapAnswersToApplicationDto = (
  application: Application,
): ApplicationDto => {
  const { answers, externalData } = application
  const applicant = getApplicant(answers)
  const selectedRealEstateId = getValueViaPath<string>(answers, 'realEstate')
  const selectedRealEstate = getValueViaPath<Array<Fasteign>>(
    externalData,
    'getProperties.data',
  )?.find((realEstate) => realEstate.fasteignanumer === selectedRealEstateId)

  return {
    applicationName: 'Brunabótamat - Endurmat',
    status: 40, // Fixed value something from umsóknasmiður
    language: 'IS',
    portalApplicationID: Math.floor(Math.random() * 1000000000).toString(), // swap to application.id when HMS is ready,
    applicationType: 'LscVK9yI7EeXf4WDCOBfww', // This is fixed and comes from HMS
    applicationJson: null,
    dagssetning: new Date(),
    adilar: [
      {
        kennitala: applicant.nationalId,
        heiti: applicant.name,
        heimili: applicant.address,
        postnumer: applicant.postalCode,
        stadur: applicant.city,
        tegund: 0, // 0 is a person and 2 is a company
        hlutverk: 'Umsækjandi',
        netfang: applicant.email,
        simi: applicant.phoneNumber,
      },
    ],
    notandagogn: [
      {
        flokkur: 'Skil á umsókn',
        heiti:
          'Ég lýsi yfir að ég hef kynnt mér efni á island.is um brunabótamat',
        tegund: 'bool',
        gildi:
          getValueViaPath<Array<string>>(
            answers,
            'confirmReadFireCompensationInfo',
          )?.[0] === YES
            ? 'true'
            : 'false',
        guid: GUID,
      },
      {
        flokkur: 'Skil á umsókn',
        heiti: 'Ég hef kynnt mér persónuverndarstefnu HMS',
        tegund: 'bool',
        gildi:
          getValueViaPath<Array<string>>(
            answers,
            'confirmReadFireCompensationInfo',
          )?.[1] === YES
            ? 'true'
            : 'false',
        guid: GUID,
      },
      {
        flokkur: 'Eign',
        heiti: 'Fasteignanumer',
        tegund: 'fastanúmer',
        gildi: selectedRealEstate?.fasteignanumer,
        guid: GUID,
      },
      {
        flokkur: 'FastanúmerAfleiða',
        heiti: 'Heimili',
        tegund: 'string',
        gildi: selectedRealEstate?.sjalfgefidStadfang?.birtingStutt,
        guid: GUID,
      },
      {
        flokkur: 'FastanúmerAfleiða',
        heiti: 'Póstnúmer',
        tegund: 'string',
        gildi: selectedRealEstate?.sjalfgefidStadfang?.postnumer?.toString(),
        guid: GUID,
      },
      {
        flokkur: 'FastanúmerAfleiða',
        heiti: 'Valdar notkunareiningar',
        tegund: 'string',
        gildi: JSON.stringify(
          (getValueViaPath<Array<string>>(answers, 'usageUnits') ?? []).filter(
            Boolean,
          ),
        ),
        guid: GUID,
      },
      {
        flokkur: 'FastanúmerAfleiða',
        heiti: 'Núverandi brunabótamat valdra notkunareininga',
        tegund: 'string',
        gildi:
          getValueViaPath<string>(answers, 'usageUnitsFireCompensation') ?? '',
        guid: GUID,
      },
      {
        flokkur: 'FastanúmerAfleiða',
        heiti: 'Núverandi heildar brunabótamat',
        tegund: 'string',
        gildi: getValueViaPath<string>(answers, 'totalFireCompensation'),
        guid: GUID,
      },
      {
        flokkur: 'Matsaðferð',
        heiti: 'Endurmat vegna endurbóta',
        tegund: 'radio',
        gildi: getValueViaPath<Array<string>>(answers, 'endurmat')?.includes(
          'renovations',
        )
          ? 'Já, vegna endurbóta'
          : 'Nei, ekki vegna endurbóta',
        guid: GUID,
      },
      {
        flokkur: 'Matsaðferð',
        heiti: 'Endurmat vegna viðbyggingar',
        tegund: 'radio',
        gildi: getValueViaPath<Array<string>>(answers, 'endurmat')?.includes(
          'additions',
        )
          ? 'Já, vegna viðbyggingar'
          : 'Nei, ekki vegna viðbyggingar',
        guid: GUID,
      },
      {
        flokkur: 'FastanúmerAfleiða',
        heiti: 'Sveitarfélag',
        tegund: 'string',
        gildi: selectedRealEstate?.sjalfgefidStadfang?.sveitarfelagBirting,
        guid: GUID,
      },
      {
        flokkur: 'Lýsing á fasteign',
        heiti: 'Lýsing á framkvæmdum ',
        tegund: 'multi',
        gildi: getValueViaPath<string>(answers, 'description'),
        guid: GUID,
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
