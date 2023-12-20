import type { User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { isDefined } from '@island.is/shared/utils'
import { Inject, Injectable } from '@nestjs/common'
import { Case } from './models/Case.model'
import { CaseCategoryType } from './models/CaseCategory'
import { CaseDepartmentType } from './models/CaseDepartment.model'
import { CaseSignatureType } from './models/CaseSignatureType'
import { CaseSubCategoryType } from './models/CaseSubCategory'
import { CaseTemplateType } from './models/CaseTemplate.model'
import { SearchCaseTemplateInput } from './models/SearchCaseTemplate.input'
import { SearchCaseTemplateResponse } from './models/SearchCaseTemplate.response'

const MOCK_CASE_TEMPLATES = [
  {
    applicationId: '168c3f3b-fd75-4b65-9662-a19c3a1948e2',
    department: CaseDepartmentType.A,
    category: CaseCategoryType.ANNOUNCEMENT,
    subCategory: undefined,
    title: 'AUGLÝSING um skipulagsmál í Akureyrarkaupstað',
    template: undefined,
    documentContents: `
                        Breyting á deiliskipulagi Verkmenntaskólans á Akureyri.
                        Bæjarstjórn Akureyrarbæjar samþykkti 5. júlí 2023 breytingu á deiliskipulagi fyrir Verkmenntaskólann á Akureyri.
                        Breytingin felur í sér að biðstöð fyrir almenningsvagna við Mímisbraut er aflögð og núverandi biðstöð við hús nr. 10 við Mýrarveg er færð til suðurs til móts við hús nr. 6 og Mýrarvegur þrengdur í eina akrein á þeim stað. Þá verður útbúin gönguleið frá biðstöðinni að aðkomu að Verkmenntaskólanum.
                        Deiliskipulagstillagan hefur hlotið meðferð í samræmi við 2. mgr. 43. gr. og 3. mgr. 44. gr. skipulagslaga nr. 123/210 og öðlast hún þegar gildi.
                        `,
    signatureType: CaseSignatureType.SINGLE,
    signatureContents: `María Markúsdóttir verkefnastjóri skipulagsmála.`,
    signatureDate: '2020-12-01T00:00:00.000Z',
    ministry: 'Umhverfis- og auðlindaráðuneyti',
    preferedPublicationDate: '2020-12-01T00:00:00.000Z',
    fastTrack: false,
  },
  {
    applicationId: '268caf3b-fd75-4b65-9662-a19c3a1948e2',
    department: CaseDepartmentType.B,
    category: CaseCategoryType.REGULATION,
    subCategory: CaseSubCategoryType.PORT_REGULATION,
    title:
      'AUGLÝSING fyrir stuðningsþjónustu í Múlaþingi samkvæmt lögum um félagsþjónustu sveitarfélaga',
    template: undefined,
    documentContents: `
                        Breyting á deiliskipulagi Verkmenntaskólans á Akureyri.
                        Bæjarstjórn Akureyrarbæjar samþykkti 5. júlí 2023 breytingu á deiliskipulagi fyrir Verkmenntaskólann á Akureyri.
                        Breytingin felur í sér að biðstöð fyrir almenningsvagna við Mímisbraut er aflögð og núverandi biðstöð við hús nr. 10 við Mýrarveg er færð til suðurs til móts við hús nr. 6 og Mýrarvegur þrengdur í eina akrein á þeim stað. Þá verður útbúin gönguleið frá biðstöðinni að aðkomu að Verkmenntaskólanum.
                        Deiliskipulagstillagan hefur hlotið meðferð í samræmi við 2. mgr. 43. gr. og 3. mgr. 44. gr. skipulagslaga nr. 123/210 og öðlast hún þegar gildi.
                        `,
    signatureType: CaseSignatureType.SINGLE,
    signatureContents: `María Markúsdóttir verkefnastjóri skipulagsmála.`,
    signatureDate: '2020-12-01T00:00:00.000Z',
    ministry: 'Umhverfis- og auðlindaráðuneyti',
    preferedPublicationDate: '2020-12-01T00:00:00.000Z',
    fastTrack: false,
  },
  {
    applicationId: '368ccf3b-fd75-4b65-9662-a19c3a1948e2',
    department: CaseDepartmentType.C,
    category: CaseCategoryType.ANNOUNCEMENT,
    subCategory: undefined,
    title:
      'AUGLÝSING fyrir stuðningsþjónustu í Múlaþingi samkvæmt lögum um félagsþjónustu sveitarfélaga',
    template: CaseTemplateType.ANNOUNCEMENT_WITH_TABLE,
    documentContents: `
                        Breyting á deiliskipulagi Verkmenntaskólans á Akureyri.
                        Bæjarstjórn Akureyrarbæjar samþykkti 5. júlí 2023 breytingu á deiliskipulagi fyrir Verkmenntaskólann á Akureyri.
                        Breytingin felur í sér að biðstöð fyrir almenningsvagna við Mímisbraut er aflögð og núverandi biðstöð við hús nr. 10 við Mýrarveg er færð til suðurs til móts við hús nr. 6 og Mýrarvegur þrengdur í eina akrein á þeim stað. Þá verður útbúin gönguleið frá biðstöðinni að aðkomu að Verkmenntaskólanum.
                        Deiliskipulagstillagan hefur hlotið meðferð í samræmi við 2. mgr. 43. gr. og 3. mgr. 44. gr. skipulagslaga nr. 123/210 og öðlast hún þegar gildi.
                        `,
    signatureType: CaseSignatureType.SINGLE,
    signatureContents: `María Markúsdóttir verkefnastjóri skipulagsmála.`,
    signatureDate: '2020-12-01T00:00:00.000Z',
    ministry: 'Umhverfis- og auðlindaráðuneyti',
    preferedPublicationDate: '2020-12-01T00:00:00.000Z',
    fastTrack: false,
  },
  {
    applicationId: '468c3f5b-fd75-4b65-9662-a19c3a1948e2',
    department: CaseDepartmentType.D,
    category: CaseCategoryType.ANNOUNCEMENT,
    subCategory: undefined,
    title:
      'REGLUR fyrir stuðningsþjónustu í Múlaþingi samkvæmt lögum um félagsþjónustu sveitarfélaga',
    template: undefined,
    documentContents: `
                        Breyting á deiliskipulagi Verkmenntaskólans á Akureyri.
                        Bæjarstjórn Akureyrarbæjar samþykkti 5. júlí 2023 breytingu á deiliskipulagi fyrir Verkmenntaskólann á Akureyri.
                        Breytingin felur í sér að biðstöð fyrir almenningsvagna við Mímisbraut er aflögð og núverandi biðstöð við hús nr. 10 við Mýrarveg er færð til suðurs til móts við hús nr. 6 og Mýrarvegur þrengdur í eina akrein á þeim stað. Þá verður útbúin gönguleið frá biðstöðinni að aðkomu að Verkmenntaskólanum.
                        Deiliskipulagstillagan hefur hlotið meðferð í samræmi við 2. mgr. 43. gr. og 3. mgr. 44. gr. skipulagslaga nr. 123/210 og öðlast hún þegar gildi.
                        `,
    signatureType: CaseSignatureType.SINGLE,
    signatureContents: `María Markúsdóttir verkefnastjóri skipulagsmála.`,
    signatureDate: '2020-12-01T00:00:00.000Z',
    ministry: 'Umhverfis- og auðlindaráðuneyti',
    preferedPublicationDate: '2020-12-01T00:00:00.000Z',
    fastTrack: false,
  },
] satisfies Case[]

@Injectable()
export class MinistryOfJusticeService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  private async wait(ms: number) {
    new Promise((resolve) => setTimeout(resolve, ms))
  }

  async searchCaseTemplates(
    user: User,
    input: SearchCaseTemplateInput,
  ): Promise<SearchCaseTemplateResponse> {
    const { q } = input

    await this.wait(5000)

    if (!q) {
      return {
        items: MOCK_CASE_TEMPLATES,
        count: MOCK_CASE_TEMPLATES.length,
      }
    }

    const templates = MOCK_CASE_TEMPLATES.filter((template) => {
      if (!template.title) return false
      return template.title?.toLowerCase().indexOf(q.toLowerCase()) > -1
    }).filter(isDefined).map((template) => ({...template, signatureType: CaseSignatureType.MINISTER}))

    return {
      items: templates,
      count: templates.length,
    }
  }
}
