import { Page, Text, Document, View, StyleSheet } from '@react-pdf/renderer'
import {
  accident,
  information,
  overview,
  sections,
  shared,
} from '../../lib/messages'
import { getValueViaPath } from '@island.is/application/core'
import { EmployeeType } from '../../lib/dataSchema'
import { FieldBaseProps, FormatMessage } from '@island.is/application/types'
import {
  getAccidentInformationForOverview,
  getCompanyInformationForOverview,
} from '../../utils'
import { FC } from 'react'
import { getEmployeeInformationForOverview } from '../../utils/getEmployeeInformationForOverview'
import { getCauseAndConsequencesForOverview } from '../../utils/getCauseAndConsequencesForOverview'
import { Vinnueftirlitid } from '../../assets/vinnueftirlitid'

interface PdfDocumentProps {
  formatMessage: FormatMessage
}

const regEx = /\*\*/g // RegEx to remove ** from the text

export const PdfDocument: FC<
  React.PropsWithChildren<FieldBaseProps & PdfDocumentProps>
> = ({ application, formatMessage }) => {
  const employees =
    getValueViaPath<EmployeeType[]>(application.answers, 'employee') ?? []
  const companyInfo = getCompanyInformationForOverview(
    application.answers,
    application.externalData,
    formatMessage,
  ).map((info) => info?.replace(regEx, ''))
  const accidentInfo = getAccidentInformationForOverview(
    application.answers,
    application.externalData,
    formatMessage,
  ).map((info) => info?.replace(regEx, ''))
  return (
    <Document>
      <Page size="A4" style={pdfStyles.body}>
        {/* Header */}
        <View style={pdfStyles.row}>
          <Vinnueftirlitid />
          <Text style={pdfStyles.headerTitle}>
            {formatMessage(shared.application.name)}
          </Text>
        </View>

        {/* Body */}
        <View style={pdfStyles.listInfo}>
          <Text style={pdfStyles.title}>
            {formatMessage(accident.about.pageTitle)}
          </Text>
          <View style={pdfStyles.view}>
            <Text style={pdfStyles.header}>
              {formatMessage(information.labels.company.pageTitle)}
            </Text>
            {companyInfo.map((info) => {
              return <Text style={pdfStyles.text}>{info}</Text>
            })}
            <Text style={pdfStyles.header}>
              {formatMessage(sections.draft.accident)}
            </Text>
            {accidentInfo.map((info) => {
              return <Text style={pdfStyles.text}>{info}</Text>
            })}
          </View>
          <Text style={pdfStyles.title}>
            {formatMessage(overview.employee.employees)}
          </Text>
          {employees.map((employee, index) => {
            const employeeInfo = getEmployeeInformationForOverview(
              application.externalData,
              employee,
              formatMessage,
            ).map((info) => info?.replace(regEx, ''))
            const causeandConsequencesInfo = getCauseAndConsequencesForOverview(
              application.externalData,
              application.answers,
              index,
              formatMessage,
            ).map((info) => info?.replace(regEx, ''))
            return (
              <View key={`employee-${index}`} style={pdfStyles.view}>
                <Text style={pdfStyles.employeeHeader}>
                  {employee.nationalField.name}
                </Text>
                <Text style={pdfStyles.header}>
                  {formatMessage(overview.labels.employee)}
                </Text>
                {employeeInfo.map((info) => {
                  return <Text style={pdfStyles.text}>{info}</Text>
                })}
                <Text style={pdfStyles.header}>
                  {formatMessage(overview.labels.events)}
                </Text>
                {causeandConsequencesInfo.map((info) => {
                  return <Text style={pdfStyles.text}>{info}</Text>
                })}
              </View>
            )
          })}
        </View>
      </Page>
    </Document>
  )
}

export const pdfStyles = StyleSheet.create({
  body: {
    paddingTop: 40,
    paddingBottom: 70,
    paddingHorizontal: 60,
    fontSize: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  employeeHeader: {
    fontSize: 16,
    fontWeight: 600,
  },
  header: {
    fontSize: 14,
    fontWeight: 600,
    marginTop: 12,
    marginBottom: 5,
  },
  text: {
    marginBottom: 4,
  },
  listInfo: {
    paddingBottom: 30,
  },
  view: {
    marginBottom: 20,
  },
  image: {
    width: 120,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 600,
  },
})
