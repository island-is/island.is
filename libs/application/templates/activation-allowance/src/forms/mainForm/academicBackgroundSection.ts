import {
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildSection,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { academicBackground } from '../../lib/messages'
import { GaldurDomainModelsEducationItem } from '@island.is/clients/vmst-unemployment'

export const academicBackgroundSection = buildSection({
  id: 'academicBackgroundSection',
  title: academicBackground.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'academicBackgroundMultiField',
      title: academicBackground.general.pageTitle,
      description: academicBackground.general.description,
      children: [
        buildDescriptionField({
          id: 'academicBackground.educationDescription',
          title: academicBackground.labels.educationTitle,
          description: academicBackground.labels.educationDescription,
          titleVariant: 'h5',
          marginBottom: 0,
        }),
        buildFieldsRepeaterField({
          id: 'educationHistory.educationHistory',
          formTitle: academicBackground.labels.education,
          formTitleNumbering: 'suffix',
          minRows: 0,
          addItemButtonText: academicBackground.labels.addEducationButton,
          fields: {
            levelOfStudy: {
              label: academicBackground.labels.levelOfStudy,
              component: 'select',
              options: (application, _, locale) => {
                const education = getValueViaPath<
                  GaldurDomainModelsEducationItem[]
                >(
                  application.externalData,
                  'unemploymentApplication.data.supportData.education',
                )
                return (
                  education
                    ?.filter((level) => level.level === 1)
                    .map((level) => ({
                      value: level.id ?? '',
                      label:
                        (locale === 'is'
                          ? level.name
                          : level.english ?? level.name) || '',
                    })) ?? []
                )
              },
            },
            degree: {
              label: academicBackground.labels.degree,
              component: 'select',
              options: (application, activeField, locale) => {
                const education = getValueViaPath<
                  GaldurDomainModelsEducationItem[]
                >(
                  application.externalData,
                  'unemploymentApplication.data.supportData.education',
                )
                const levelOfStudy = (activeField?.levelOfStudy as string) ?? ''
                return (
                  education
                    ?.filter(
                      (level) =>
                        level.level === 2 && level.parentId === levelOfStudy,
                    )
                    .map((level) => ({
                      value: level.id ?? '',
                      label:
                        (locale === 'is'
                          ? level.name
                          : level.english ?? level.name) || '',
                    })) ?? []
                )
              },
            },
            subject: {
              label: academicBackground.labels.subject,
              component: 'select',
              options: (application, activeField) => {
                const education = getValueViaPath<
                  GaldurDomainModelsEducationItem[]
                >(
                  application.externalData,
                  'unemploymentApplication.data.supportData.education',
                )
                const levelOfStudy = (activeField?.levelOfStudy as string) ?? ''
                const degree = (activeField?.degree as string) ?? ''
                return (
                  education
                    ?.find(
                      (level) =>
                        level.level === 2 &&
                        level.parentId === levelOfStudy &&
                        level.id === degree,
                    )
                    ?.relations?.map((relation) => ({
                      value: relation.code ?? '',
                      label: relation.name ?? '',
                    })) ?? []
                )
              },
            },
            checkbox: {
              component: 'checkbox',
              large: false,
              backgroundColor: 'white',
              options: [
                {
                  value: YES,
                  label: academicBackground.labels.currentlyStudying,
                },
              ],
            },
          },
        }),
        // buildFieldsRepeaterField({
        //   id: 'academicBackground.education',
        //   titleVariant: 'h5',
        //   marginTop: 0,
        //   minRows: 0,
        //   formTitleNumbering: 'none',
        //   addItemButtonText: academicBackground.labels.addEducationButton,
        //   fields: {
        //     school: {
        //       component: 'input',
        //       width: 'half',
        // label: academicBackground.labels.school,
        //     },
        //     subject: {
        //       component: 'input',
        //       label: academicBackground.labels.subject,
        //       width: 'half',
        //     },
        //     units: {
        //       component: 'input',
        //       label: academicBackground.labels.units,
        //       width: 'half',
        //       type: 'number',
        //     },
        //     degree: {
        //       component: 'input',
        //       label: academicBackground.labels.degree,
        //       width: 'half',
        //     },
        //     endOfStudies: {
        //       component: 'date',
        //       label: academicBackground.labels.endOfStudies,
        //       width: 'half',
        //     },
        //   },
        // }),
      ],
    }),
  ],
})
