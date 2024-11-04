import { Page, Text, Document, View, StyleSheet } from '@react-pdf/renderer'
import { accident, information, overview, sections } from '../../lib/messages'
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

interface PdfDocumentProps {
  formatMessage: FormatMessage
}

export const PdfDocument: FC<
  React.PropsWithChildren<FieldBaseProps & PdfDocumentProps>
> = ({ application, formatMessage }) => {
  const employees = getValueViaPath(
    application.answers,
    'employee',
    [],
  ) as EmployeeType[]
  const companyInfo = getCompanyInformationForOverview(
    application.answers,
    application.externalData,
    formatMessage,
  )
  const accidentInfo = getAccidentInformationForOverview(
    application.answers,
    application.externalData,
    formatMessage,
  )
  return (
    <Document>
      <Page size="A4" style={pdfStyles.body}>
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
            )
            const causeandConsequencesInfo = getCauseAndConsequencesForOverview(
              application.externalData,
              application.answers,
              index,
              formatMessage,
            )
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
    fontSize: 24,
    marginBottom: 16,
  },
  employeeHeader: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 5,
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
})
