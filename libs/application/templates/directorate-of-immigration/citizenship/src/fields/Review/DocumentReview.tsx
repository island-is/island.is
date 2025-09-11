import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { FC } from 'react'
import { review } from '../../lib/messages'
import { Citizenship } from '../../lib/dataSchema'
import { getSelectedCustodyChildren } from '../../utils/childrenInfo'
import { Routes } from '../../lib/constants'
import SummaryBlock from '../../components/SummaryBlock'
import { useLocale } from '@island.is/localization'
import { DescriptionFormField } from '@island.is/application/ui-fields'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  route: Routes
}

export const DocumentReview: FC<Props> = ({
  application,
  goToScreen,
  route,
}) => {
  const answers = application.answers as Citizenship
  const { formatMessage } = useLocale()

  const selectedChildren = getSelectedCustodyChildren(
    application.externalData,
    application.answers,
  )

  return (
    <SummaryBlock editAction={() => goToScreen?.(route)}>
      <Box paddingBottom={4}>
        <GridRow>
          <GridColumn span="1/1" paddingBottom={1}>
            {DescriptionFormField({
              application: application,
              showFieldName: false,
              field: {
                id: 'title',
                title: '',
                description: formatMessage(review.labels.documents, {
                  name: answers?.userInformation?.name,
                }),
                titleVariant: 'h4',
                type: FieldTypes.DESCRIPTION,
                component: FieldComponents.DESCRIPTION,
                children: undefined,
              },
            })}
            {answers?.passport?.attachment?.map((file) => {
              return <Text>{file.name}</Text>
            })}
            {answers?.supportingDocuments.birthCertificate &&
              answers?.supportingDocuments?.birthCertificate.map((file) => {
                return <Text>{file.name}</Text>
              })}
            {answers?.supportingDocuments.subsistenceCertificate &&
              answers?.supportingDocuments?.subsistenceCertificate.map(
                (file) => {
                  return <Text>{file.name}</Text>
                },
              )}
            {answers?.supportingDocuments.subsistenceCertificateForTown &&
              answers?.supportingDocuments?.subsistenceCertificateForTown.map(
                (file) => {
                  return <Text>{file.name}</Text>
                },
              )}
            {answers?.supportingDocuments.certificateOfLegalResidenceHistory &&
              answers?.supportingDocuments?.certificateOfLegalResidenceHistory.map(
                (file) => {
                  return <Text>{file.name}</Text>
                },
              )}
            {answers?.supportingDocuments.icelandicTestCertificate &&
              answers?.supportingDocuments?.icelandicTestCertificate.map(
                (file) => {
                  return <Text>{file.name}</Text>
                },
              )}
            {answers?.supportingDocuments.criminalRecord &&
              answers?.supportingDocuments?.criminalRecord.map((file) => {
                return file.attachment?.map((file) => {
                  return <Text>{file.name}</Text>
                })
              })}
          </GridColumn>
          {selectedChildren &&
            selectedChildren.map((child) => {
              if (child) {
                return (
                  <GridColumn span="1/1" paddingBottom={1}>
                    {DescriptionFormField({
                      application: application,
                      showFieldName: false,
                      field: {
                        id: 'title',
                        title: '',
                        description: formatMessage(review.labels.documents, {
                          name: `${child.givenName} ${child.familyName}`,
                        }),
                        titleVariant: 'h4',
                        type: FieldTypes.DESCRIPTION,
                        component: FieldComponents.DESCRIPTION,
                        children: undefined,
                      },
                    })}
                    {answers.childrenPassport?.map((passportFiles) => {
                      return passportFiles?.attachment?.map((file) => {
                        return <Text>{file.name}</Text>
                      })
                    })}
                    {answers.childrenSupportingDocuments
                      ?.filter(
                        (document) => document?.nationalId === child.nationalId,
                      )
                      .map((documentItems) => {
                        const FileList: Array<JSX.Element> = []
                        const birthCertificates: Array<JSX.Element> =
                          documentItems?.birthCertificate?.map((file) => {
                            return <Text>{file.name}</Text>
                          }) || []
                        FileList.push(...birthCertificates)

                        const writtenConsentsFromChild: Array<JSX.Element> =
                          documentItems?.writtenConsentFromChild?.map(
                            (file) => {
                              return <Text>{file.name}</Text>
                            },
                          ) || []
                        FileList.push(...writtenConsentsFromChild)

                        const writtenConsentsFromOtherParent: Array<JSX.Element> =
                          documentItems?.writtenConsentFromOtherParent?.map(
                            (file) => {
                              return <Text>{file.name}</Text>
                            },
                          ) || []
                        FileList.push(...writtenConsentsFromOtherParent)

                        const custodyDocuments: Array<JSX.Element> =
                          documentItems?.custodyDocuments?.map((file) => {
                            return <Text>{file.name}</Text>
                          }) || []
                        FileList.push(...custodyDocuments)

                        return FileList
                      })}
                  </GridColumn>
                )
              }

              return null
            })}
        </GridRow>
      </Box>
    </SummaryBlock>
  )
}
