import {
  FieldBaseProps,
  formatText,
  FormValue,
} from '@island.is/application/core'
import { ReviewGroup } from '@island.is/application/ui-components'
import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import cn from 'classnames'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import parseISO from 'date-fns/parseISO'
import React, { FC } from 'react'
import { States, YES } from '../../constants'
import { AccidentNotification } from '../../lib/dataSchema'
import {
  accidentDetails,
  accidentType,
  applicantInformation,
  application as applicationMessages,
  childInCustody,
  fatalAccident,
  injuredPersonInformation,
  juridicalPerson,
  locationAndPurpose,
  overview,
  sportsClubInfo,
} from '../../lib/messages'
import {
  getAttachmentTitles,
  getWorkplaceData,
  isMachineRelatedAccident,
  isProfessionalAthleteAccident,
  isReportingOnBehalfOfChild,
  isReportingOnBehalfOfEmployee,
  isReportingOnBehalfOfInjured,
  returnMissingDocumentsList,
} from '../../utils'
import * as styles from './FormOverview.treat'
import { FileValueLine, ValueLine } from './ValueLine'

export const FormOverview: FC<FieldBaseProps> = ({
  application,
  goToScreen,
}) => {
  const answers = application.answers as AccidentNotification
  const { formatMessage } = useLocale()
  console.log(application)

  const files = getAttachmentTitles(answers)
  const missingDocuments = returnMissingDocumentsList(answers, formatMessage)
  const workplaceData = getWorkplaceData(application.answers)

  const { timeOfAccident, dateOfAccident } = answers.accidentDetails
  const time = `${timeOfAccident.slice(0, 2)}:${timeOfAccident.slice(2, 4)}`
  const date = format(parseISO(dateOfAccident), 'dd.MM.yy', { locale: is })

  const changeScreens = (screen: string) => {
    if (goToScreen) goToScreen(screen)
  }

  const goToAttachmentScreen = () => {
    changeScreens('attachments.multifield')
  }

  return (
    <Box component="section" paddingTop={2}>
      <Text>
        {formatText(overview.general.description, application, formatMessage)}
      </Text>

      <Text variant="h4" paddingTop={10} paddingBottom={3}>
        {formatText(
          applicantInformation.general.title,
          application,
          formatMessage,
        )}
      </Text>
      <ReviewGroup
        isLast
        editAction={() => changeScreens('applicant')}
        isEditable={States.REVIEW !== application.state}
      >
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine
              label={applicantInformation.labels.name}
              value={answers.applicant.name}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine
              label={applicantInformation.labels.nationalId}
              value={answers.applicant.nationalId}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine
              label={applicantInformation.labels.address}
              value={answers.applicant.address}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine
              label={applicantInformation.labels.city}
              value={answers.applicant.city}
            />
          </GridColumn>
          {answers.applicant.email && (
            <GridColumn span={['12/12', '12/12', '6/12']}>
              <ValueLine
                label={applicantInformation.labels.email}
                value={answers.applicant.email}
              />
            </GridColumn>
          )}
          {answers.applicant.phoneNumber && (
            <GridColumn span={['12/12', '12/12', '6/12']}>
              <ValueLine
                label={applicantInformation.labels.tel}
                value={answers.applicant.phoneNumber}
              />
            </GridColumn>
          )}
        </GridRow>
      </ReviewGroup>

      {isReportingOnBehalfOfInjured(answers as FormValue) && (
        <>
          <Text variant="h4" paddingTop={6} paddingBottom={3}>
            {formatText(
              injuredPersonInformation.general.heading,
              application,
              formatMessage,
            )}
          </Text>
          <ReviewGroup
            isLast
            editAction={() => changeScreens('injuredPersonInformation')}
            isEditable={States.REVIEW !== application.state}
          >
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={injuredPersonInformation.labels.name}
                  value={answers.injuredPersonInformation.name}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={injuredPersonInformation.labels.nationalId}
                  value={answers.injuredPersonInformation.nationalId}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={injuredPersonInformation.labels.email}
                  value={answers.injuredPersonInformation.email}
                />
              </GridColumn>
              {answers.injuredPersonInformation.phoneNumber && (
                <GridColumn span={['12/12', '12/12', '6/12']}>
                  <ValueLine
                    label={injuredPersonInformation.labels.tel}
                    value={answers.injuredPersonInformation.phoneNumber}
                  />
                </GridColumn>
              )}
            </GridRow>
          </ReviewGroup>
        </>
      )}

      {isReportingOnBehalfOfChild(answers as FormValue) && (
        <>
          <Text variant="h4" paddingTop={6} paddingBottom={3}>
            {formatText(
              childInCustody.general.sectionTitle,
              application,
              formatMessage,
            )}
          </Text>
          <ReviewGroup
            isLast
            editAction={() => changeScreens('childInCustody.fields')}
            isEditable={States.REVIEW !== application.state}
          >
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={childInCustody.labels.name}
                  value={answers.childInCustody.name}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={childInCustody.labels.nationalId}
                  value={answers.childInCustody.nationalId}
                />
              </GridColumn>
              {answers.childInCustody.email && (
                <GridColumn span={['12/12', '12/12', '6/12']}>
                  <ValueLine
                    label={childInCustody.labels.email}
                    value={answers.childInCustody.email}
                  />
                </GridColumn>
              )}
              {answers.childInCustody.phoneNumber && (
                <GridColumn span={['12/12', '12/12', '6/12']}>
                  <ValueLine
                    label={childInCustody.labels.tel}
                    value={answers.childInCustody.phoneNumber}
                  />
                </GridColumn>
              )}
            </GridRow>
          </ReviewGroup>
        </>
      )}

      {isReportingOnBehalfOfEmployee(answers as FormValue) && (
        <>
          <Text variant="h4" paddingTop={6} paddingBottom={3}>
            {formatText(
              juridicalPerson.general.title,
              application,
              formatMessage,
            )}
          </Text>
          <ReviewGroup
            isLast
            editAction={() => changeScreens('juridicalPerson.company')}
            isEditable={States.REVIEW !== application.state}
          >
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={juridicalPerson.labels.companyName}
                  value={answers.juridicalPerson.companyName}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={juridicalPerson.labels.companyNationalId}
                  value={answers.juridicalPerson.companyNationalId}
                />
              </GridColumn>
            </GridRow>
          </ReviewGroup>
        </>
      )}

      {answers.locationAndPurpose && (
        <>
          <Text variant="h4" paddingTop={6} paddingBottom={3}>
            {formatText(
              locationAndPurpose.general.title,
              application,
              formatMessage,
            )}
          </Text>
          <ReviewGroup
            isLast
            editAction={() => changeScreens('locationAndPurpose')}
            isEditable={States.REVIEW !== application.state}
          >
            <GridRow>
              <GridColumn span="12/12">
                <ValueLine
                  label={locationAndPurpose.labels.location}
                  value={answers.locationAndPurpose.location}
                />
              </GridColumn>
            </GridRow>
          </ReviewGroup>
        </>
      )}

      {workplaceData && !isReportingOnBehalfOfEmployee(answers as FormValue) && (
        <>
          <Text variant="h4" paddingTop={6} paddingBottom={3}>
            {formatText(
              workplaceData.general.title,
              application,
              formatMessage,
            )}
          </Text>
          <ReviewGroup
            isLast
            editAction={() => changeScreens(workplaceData.screenId)}
            isEditable={States.REVIEW !== application.state}
          >
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={workplaceData.labels.nationalId}
                  value={workplaceData.info.nationalRegistrationId ?? ''}
                />
              </GridColumn>
              {isProfessionalAthleteAccident(answers as FormValue) &&
                workplaceData.info.employee && (
                  <GridColumn span="12/12">
                    <ValueLine
                      label={sportsClubInfo.employee.sectionTitle}
                      value={
                        workplaceData.info.employee.radioButton === YES
                          ? applicationMessages.general.yesOptionLabel
                          : applicationMessages.general.noOptionLabel
                      }
                    />
                  </GridColumn>
                )}
            </GridRow>
          </ReviewGroup>

          {answers.isRepresentativeOfCompanyOrInstitue?.toString() !== YES && (
            <>
              <Text variant="h4" paddingTop={6} paddingBottom={3}>
                {formatText(
                  workplaceData.labels.descriptionField,
                  application,
                  formatMessage,
                )}
              </Text>
              <ReviewGroup
                isLast
                editAction={() => changeScreens(workplaceData.screenId)}
                isEditable={States.REVIEW !== application.state}
              >
                <GridRow>
                  <GridColumn span="12/12">
                    <ValueLine
                      label={workplaceData.labels.name}
                      value={workplaceData.info.name}
                    />
                  </GridColumn>
                  <GridColumn span={['12/12', '12/12', '6/12']}>
                    <ValueLine
                      label={workplaceData.labels.email}
                      value={workplaceData.info.email}
                    />
                  </GridColumn>
                  {workplaceData.info.phoneNumber && (
                    <GridColumn span={['12/12', '12/12', '6/12']}>
                      <ValueLine
                        label={workplaceData.labels.tel}
                        value={workplaceData.info.phoneNumber}
                      />
                    </GridColumn>
                  )}
                </GridRow>
              </ReviewGroup>
            </>
          )}
        </>
      )}

      <Text variant="h4" paddingTop={6} paddingBottom={3}>
        {formatText(
          accidentDetails.general.sectionTitle,
          application,
          formatMessage,
        )}
      </Text>
      <ReviewGroup
        isLast
        editAction={() => changeScreens('accidentDetails')}
        isEditable={States.REVIEW !== application.state}
      >
        <GridRow>
          <GridColumn span="12/12">
            <ValueLine
              label={overview.labels.accidentType}
              value={`${formatMessage(
                accidentType.labels[answers.accidentType.radioButton],
              )}${
                answers.wasTheAccidentFatal === YES
                  ? `, ${formatMessage(fatalAccident.labels.fatalAccident)}`
                  : ''
              }`}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine label={accidentDetails.labels.date} value={date} />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine label={accidentDetails.labels.time} value={time} />
          </GridColumn>
          {isMachineRelatedAccident(answers as FormValue) && (
            <GridColumn span={['12/12', '12/12', '9/12']}>
              <ValueLine
                label={overview.labels.workMachine}
                value={answers.workMachine.desriptionOfMachine}
              />
            </GridColumn>
          )}
          <GridColumn span={['12/12', '12/12', '9/12']}>
            <ValueLine
              label={accidentDetails.labels.description}
              value={answers.accidentDetails.descriptionOfAccident}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12']}>
            <FileValueLine label={overview.labels.attachments} files={files} />
            {missingDocuments.length !== 0 && (
              <Box marginBottom={4}>
                <AlertMessage
                  type="warning"
                  title={formatMessage(overview.alertMessage.title)}
                  message={
                    <Text variant="small">
                      {formatMessage(overview.alertMessage.description)}
                      <span className={cn(styles.boldFileNames)}>
                        {missingDocuments}
                      </span>
                    </Text>
                  }
                />
              </Box>
            )}
            {States.REVIEW === application.state ? (
              <Box display="flex" justifyContent="flexEnd">
                <Button
                  icon="attach"
                  variant="utility"
                  onClick={goToAttachmentScreen}
                >
                  {formatMessage(overview.labels.missingDocumentsButton)}
                </Button>
              </Box>
            ) : null}
          </GridColumn>
        </GridRow>
      </ReviewGroup>
    </Box>
  )
}
