import { buildSection } from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import { supportingDocuments } from '../../../lib/messages'
import { PassportSubSection } from './PassportSubSection'
import { OtherDocumentsSubSection } from './OtherDocumentsSubSection'
import { CitizenshipExternalData } from '../../../shared/types'
import { ExternalData } from '../../../types'
import { Citizenship } from '../../../lib/dataSchema'

export const SupportingDocumentsSection = (index: number) =>
  buildSection({
    id: `supportingDocuments${index}`,
    // title: supportingDocuments.general.sectionTitle,
    title: (application: Application) => {
      const externalData = application.externalData as ExternalData
      const custodyChildren = externalData?.childrenCustodyInformation?.data
      const selectedChildren = application.answers.selectedChildren
      
      console.log('application answers', application.answers)
      console.log('custodyChildren', custodyChildren)

      return {
        ...supportingDocuments.general.sectionTitleWithPerson,
        values: {
          person: index === 0 ? `${externalData?.individual?.data?.fullName}` : `${custodyChildren && custodyChildren.length > index-1 ? custodyChildren[index-1].fullName : ''}`,
        },
      }
    },
    condition: (formValue: FormValue, externalData) => {
      const external = externalData as ExternalData
      const answers = formValue as Citizenship
      const custodyChildren = external?.childrenCustodyInformation?.data
      const selectedChildren = answers.selectedChildren

      const childrenInCustodyAndSelected = selectedChildren && selectedChildren.filter(x => {
        let found = false
        custodyChildren?.map(c => {
          if(c.nationalId === x){
            found = true
          }
        })
        return found
      })


      return index === 0 || !!childrenInCustodyAndSelected && childrenInCustodyAndSelected.length > index-1
    },
    children: [PassportSubSection, OtherDocumentsSubSection],
  })
