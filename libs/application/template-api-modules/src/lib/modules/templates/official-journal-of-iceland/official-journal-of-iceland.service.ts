import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'

// Move type to appropriate place
export type CaseTemplate = {
  applicationId?: string
  department: string
  category: string
  subCategory?: string
  title: string
  template: string
  documentContents: string
  signatureType: string
  signatureContents: string
  signatureDate?: string
  ministry?: string
  preferedPublicationDate?: string
  fastTrack: boolean
}

@Injectable()
export class OfficialJournalOfIcelandService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.OFFICIAL_JOURNAL_OF_ICELAND)
  }

  async getCaseData() {
    const departments = await this.getDepartmentOptions()
    const categories = await this.getPublicationCategories()
    const templates = await this.getPreviousTemplates() // this will move to client side
    const subCategories = await this.getPublicationSubCategories()
    return {
      departments,
      categories,
      subCategories,
      templates,
    }
  }

  async getDepartmentOptions(): Promise<string[]> {
    return ['B-Deild'] // 'A-Deild', 'C-Deild', 'D-Deild'
  }

  async getPublicationCategories(): Promise<string[]> {
    return [
      'Gjaldskrá',
      'Auglýsing',
      'Reglugerð',
      'Skipulagsskrá',
      'Fjallskilasamþykkt',
      'Reglur',
      'Samþykkt',
    ]
  }

  async getPublicationSubCategories(): Promise<string[]> {
    return ['Skipulagsreglugerð', 'Byggingarreglugerð', 'Hafnarreglugerð']
  }

  async getPublicationTemplates(): Promise<string[]> {
    return ['Skipulagsmál', 'Auglýsing með töflu', 'Breytingar á gjaldskrá']
  }

  async getSignatureTypes(): Promise<string[]> {
    return [
      'Einföld undirritun',
      'Tvöföld undirritun',
      'Undirritun ráðherra',
      'Undirritun nefndar',
    ]
  }

  async getPreviousTemplates(): Promise<CaseTemplate[]> {
    return [
      {
        applicationId: '168c3f3b-fd75-4b65-9662-a19c3a1948e2',
        department: 'B-Deild', // A-Deild, C-Deild, D-Deild
        category: 'Reglugerð', // Gjaldskrá, Auglýsing, Skipulagsskrá, Fjallskilasamþykkt, Reglur, Samþykkt
        subCategory: 'Skipulagsreglugerð', // Only applicable for Reglugerð
        title: 'AUGLÝSING um skipulagsmál í Akureyrarkaupstað',
        template: 'Skipulagsmál', // Auglýsing með töflu, Breytingar á gjaldskrá
        documentContents: `
                            Breyting á deiliskipulagi Verkmenntaskólans á Akureyri.
                            Bæjarstjórn Akureyrarbæjar samþykkti 5. júlí 2023 breytingu á deiliskipulagi fyrir Verkmenntaskólann á Akureyri.
                            Breytingin felur í sér að biðstöð fyrir almenningsvagna við Mímisbraut er aflögð og núverandi biðstöð við hús nr. 10 við Mýrarveg er færð til suðurs til móts við hús nr. 6 og Mýrarvegur þrengdur í eina akrein á þeim stað. Þá verður útbúin gönguleið frá biðstöðinni að aðkomu að Verkmenntaskólanum.
                            Deiliskipulagstillagan hefur hlotið meðferð í samræmi við 2. mgr. 43. gr. og 3. mgr. 44. gr. skipulagslaga nr. 123/210 og öðlast hún þegar gildi.
                            `,
        signatureType: 'Einföld undirritun', // Tvöföld undirritun, Undirritun ráðherra, Undirritun nefndar
        signatureContents: `María Markúsdóttir verkefnastjóri skipulagsmála.`,
        signatureDate: '2020-12-01T00:00:00.000Z', // á ekki alltaf við
        ministry: 'Umhverfis- og auðlindaráðuneyti', // á ekki alltaf við
        preferedPublicationDate: '2020-12-01T00:00:00.000Z', // á ekki alltaf við
        fastTrack: false,
      },
      {
        applicationId: '268caf3b-fd75-4b65-9662-a19c3a1948e2',
        department: 'B-Deild', // A-Deild, C-Deild, D-Deild
        category: 'Reglugerð', // Gjaldskrá, Auglýsing, Skipulagsskrá, Fjallskilasamþykkt, Reglur, Samþykkt
        subCategory: 'Skipulagsreglugerð', // Only applicable for Reglugerð
        title:
          'AUGLÝSING fyrir stuðningsþjónustu í Múlaþingi samkvæmt lögum um félagsþjónustu sveitarfélaga',
        template: 'Skipulagsmál', // Auglýsing með töflu, Breytingar á gjaldskrá
        documentContents: `
                            Breyting á deiliskipulagi Verkmenntaskólans á Akureyri.
                            Bæjarstjórn Akureyrarbæjar samþykkti 5. júlí 2023 breytingu á deiliskipulagi fyrir Verkmenntaskólann á Akureyri.
                            Breytingin felur í sér að biðstöð fyrir almenningsvagna við Mímisbraut er aflögð og núverandi biðstöð við hús nr. 10 við Mýrarveg er færð til suðurs til móts við hús nr. 6 og Mýrarvegur þrengdur í eina akrein á þeim stað. Þá verður útbúin gönguleið frá biðstöðinni að aðkomu að Verkmenntaskólanum.
                            Deiliskipulagstillagan hefur hlotið meðferð í samræmi við 2. mgr. 43. gr. og 3. mgr. 44. gr. skipulagslaga nr. 123/210 og öðlast hún þegar gildi.
                            `,
        signatureType: 'Einföld undirritun', // Tvöföld undirritun, Undirritun ráðherra, Undirritun nefndar
        signatureContents: `María Markúsdóttir verkefnastjóri skipulagsmála.`,
        signatureDate: '2020-12-01T00:00:00.000Z', // á ekki alltaf við
        ministry: 'Umhverfis- og auðlindaráðuneyti', // á ekki alltaf við
        preferedPublicationDate: '2020-12-01T00:00:00.000Z', // á ekki alltaf við
        fastTrack: false,
      },
      {
        applicationId: '368ccf3b-fd75-4b65-9662-a19c3a1948e2',
        department: 'B-Deild', // A-Deild, C-Deild, D-Deild
        category: 'Reglugerð', // Gjaldskrá, Auglýsing, Skipulagsskrá, Fjallskilasamþykkt, Reglur, Samþykkt
        subCategory: 'Skipulagsreglugerð', // Only applicable for Reglugerð
        title:
          'AUGLÝSING fyrir stuðningsþjónustu í Múlaþingi samkvæmt lögum um félagsþjónustu sveitarfélaga',
        template: 'Skipulagsmál', // Auglýsing með töflu, Breytingar á gjaldskrá
        documentContents: `
                            Breyting á deiliskipulagi Verkmenntaskólans á Akureyri.
                            Bæjarstjórn Akureyrarbæjar samþykkti 5. júlí 2023 breytingu á deiliskipulagi fyrir Verkmenntaskólann á Akureyri.
                            Breytingin felur í sér að biðstöð fyrir almenningsvagna við Mímisbraut er aflögð og núverandi biðstöð við hús nr. 10 við Mýrarveg er færð til suðurs til móts við hús nr. 6 og Mýrarvegur þrengdur í eina akrein á þeim stað. Þá verður útbúin gönguleið frá biðstöðinni að aðkomu að Verkmenntaskólanum.
                            Deiliskipulagstillagan hefur hlotið meðferð í samræmi við 2. mgr. 43. gr. og 3. mgr. 44. gr. skipulagslaga nr. 123/210 og öðlast hún þegar gildi.
                            `,
        signatureType: 'Einföld undirritun', // Tvöföld undirritun, Undirritun ráðherra, Undirritun nefndar
        signatureContents: `María Markúsdóttir verkefnastjóri skipulagsmála.`,
        signatureDate: '2020-12-01T00:00:00.000Z', // á ekki alltaf við
        ministry: 'Umhverfis- og auðlindaráðuneyti', // á ekki alltaf við
        preferedPublicationDate: '2020-12-01T00:00:00.000Z', // á ekki alltaf við
        fastTrack: false,
      },
      {
        applicationId: '468c3f5b-fd75-4b65-9662-a19c3a1948e2',
        department: 'B-Deild', // A-Deild, C-Deild, D-Deild
        category: 'Reglugerð', // Gjaldskrá, Auglýsing, Skipulagsskrá, Fjallskilasamþykkt, Reglur, Samþykkt
        subCategory: 'Skipulagsreglugerð', // Only applicable for Reglugerð
        title:
          'REGLUR fyrir stuðningsþjónustu í Múlaþingi samkvæmt lögum um félagsþjónustu sveitarfélaga',
        template: 'Skipulagsmál', // Auglýsing með töflu, Breytingar á gjaldskrá
        documentContents: `
                            Breyting á deiliskipulagi Verkmenntaskólans á Akureyri.
                            Bæjarstjórn Akureyrarbæjar samþykkti 5. júlí 2023 breytingu á deiliskipulagi fyrir Verkmenntaskólann á Akureyri.
                            Breytingin felur í sér að biðstöð fyrir almenningsvagna við Mímisbraut er aflögð og núverandi biðstöð við hús nr. 10 við Mýrarveg er færð til suðurs til móts við hús nr. 6 og Mýrarvegur þrengdur í eina akrein á þeim stað. Þá verður útbúin gönguleið frá biðstöðinni að aðkomu að Verkmenntaskólanum.
                            Deiliskipulagstillagan hefur hlotið meðferð í samræmi við 2. mgr. 43. gr. og 3. mgr. 44. gr. skipulagslaga nr. 123/210 og öðlast hún þegar gildi.
                            `,
        signatureType: 'Einföld undirritun', // Tvöföld undirritun, Undirritun ráðherra, Undirritun nefndar
        signatureContents: `María Markúsdóttir verkefnastjóri skipulagsmála.`,
        signatureDate: '2020-12-01T00:00:00.000Z', // á ekki alltaf við
        ministry: 'Umhverfis- og auðlindaráðuneyti', // á ekki alltaf við
        preferedPublicationDate: '2020-12-01T00:00:00.000Z', // á ekki alltaf við
        fastTrack: false,
      },
    ]
  }
}
