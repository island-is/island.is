import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildTextField,
} from '@island.is/application/core'
import { information, personal } from '../../../lib/messages'
import { Answer, Application } from '@island.is/application/types'
import { Citizenship } from '../../../lib/dataSchema'

export const ParentsSubSection = buildSubSection({
  id: 'parents',
  title: information.labels.parents.subSectionTitle,
  children: [
    buildMultiField({
      id: 'parentsMultiField',
      title: information.labels.parents.pageTitle,
      condition: (answer: Answer) => {
        const answers = answer as Citizenship
        if(answers.residenceCondition?.radio === 'childOfIcelander'){
          return true
        }
        return false
      },
      children: [
        buildDescriptionField({
          id: 'parentOnetitle',
          title: information.labels.parents.parentOneTitle,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'parentOne.nationalId',
          title: personal.labels.userInformation.nationalId,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) => {
            const a = application.externalData?.nationalRegistryParents?.data as any
            let firstparent
            if(a.length > 0){
              firstparent = a[0]
            }
            return firstparent.nationalId
          }
        }),
        buildTextField({
          id: 'parentOne.name',
          title: personal.labels.userInformation.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const a = application.externalData?.nationalRegistryParents?.data as any
            let firstparent
            if(a.length > 0){
              firstparent = a[0]
            }
            return firstparent.name
          }
        }),
        buildDescriptionField({
          id: 'parentTwotitle',
          title: information.labels.parents.parentTwoTitle,
          titleVariant: 'h5',
          space: 'gutter'
        }),
        buildTextField({
          id: 'parenttwo.nationalId',
          title: personal.labels.userInformation.nationalId,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) => {
            const parents = application.externalData?.nationalRegistryParents?.data as any
            if(parents.length > 1){
              return parents[1].nationalId
            }else{
              return ''
            }
            
          }
        }),
        buildTextField({
          id: 'parenttwo.name',
          title: personal.labels.userInformation.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const parents = application.externalData?.nationalRegistryParents?.data as any
            if(parents.length > 1){
              return parents[1].name
            }else{
              return ''
            }
          }
        }),
      ],
    }),
  ],
})
