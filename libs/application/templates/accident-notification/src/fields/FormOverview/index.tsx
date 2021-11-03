import {
  FieldBaseProps,
  formatText,
  FormValue,
} from '@island.is/application/core'
import { ReviewGroup } from '@island.is/application/ui-components'
import {
  AlertMessage,
  Box,
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
  accidentLocation,
  accidentType,
  applicantInformation,
  application as applicationMessages,
  childInCustody,
  fatalAccident,
  fishingCompanyInfo,
  injuredPersonInformation,
  juridicalPerson,
  locationAndPurpose,
  overview,
  sportsClubInfo,
  inReview,
} from '../../lib/messages'
import {
  getAttachmentTitles,
  getWorkplaceData,
  isFishermanAccident,
  isHomeActivitiesAccident,
  isMachineRelatedAccident,
  isProfessionalAthleteAccident,
  isReportingOnBehalfOfChild,
  isReportingOnBehalfOfEmployee,
  isReportingOnBehalfOfInjured,
  returnMissingDocumentsList,
} from '../../utils'
import * as styles from './FormOverview.css'
import { FileValueLine, ValueLine } from './ValueLine'

interface SubmittedApplicationData {
  data?: {
    documentId: string
  }
}

export const FormOverview: FC<FieldBaseProps> = ({
  application,
  goToScreen,
}) => {
  const answers = application.answers as AccidentNotification
  console.log(answers)
  const { formatMessage } = useLocale()

  const files = getAttachmentTitles(answers)
  const missingDocuments = returnMissingDocumentsList(answers, formatMessage)
  const workplaceData = getWorkplaceData(application.answers)

  const { timeOfAccident, dateOfAccident } = answers.accidentDetails
  const time = `${timeOfAccident.slice(0, 2)}:${timeOfAccident.slice(2, 4)}`
  const date = format(parseISO(dateOfAccident), 'dd.MM.yy', { locale: is })

  const changeScreens = (screen: string) => {
    if (goToScreen) goToScreen(screen)
  }

  const subAppData = application.externalData
    .submitApplication as SubmittedApplicationData

  return (
    <Box component="section" paddingTop={2}>
      <Text>
        {formatText(overview.general.description, application, formatMessage)}
      </Text>
      {subAppData?.data?.documentId && (
        <Box paddingTop={5}>
          <AlertMessage
            title={formatMessage(inReview.application.documentIdAlertTitle)}
            type={'info'}
            message={
              <Text>
                <span>
                  {formatMessage(inReview.application.documentIdAlertMessage)}
                </span>
                <span className={styles.valueLabel}>
                  {` ${subAppData.data?.documentId}`}
                </span>
              </Text>
            }
          />
        </Box>
      )}
      <Text variant="h4" paddingTop={5} paddingBottom={3}>
        {formatText(
          applicantInformation.general.title,
          application,
          formatMessage,
        )}
      </Text>
      <ReviewGroup
        isLast
        editAction={() => changeScreens('applicant')}
        isEditable={States.DRAFT === application.state}
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
            isEditable={States.DRAFT === application.state}
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
            isEditable={States.DRAFT === application.state}
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
            isEditable={States.DRAFT === application.state}
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
            isEditable={States.DRAFT === application.state}
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
              workplaceData.companyInfoMsg.general.title,
              application,
              formatMessage,
            )}
          </Text>
          <ReviewGroup
            isLast
            editAction={() => changeScreens(workplaceData.screenId)}
            isEditable={States.DRAFT === application.state}
          >
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={workplaceData.companyInfoMsg.labels.name}
                  value={workplaceData.companyInfo.name}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={workplaceData.companyInfoMsg.labels.nationalId}
                  value={
                    workplaceData.companyInfo?.nationalRegistrationId ?? ''
                  }
                />
              </GridColumn>
              {isProfessionalAthleteAccident(answers as FormValue) &&
                workplaceData.companyInfo?.onPayRoll && (
                  <GridColumn span="12/12">
                    <ValueLine
                      label={sportsClubInfo.employee.sectionTitle}
                      value={
                        workplaceData.companyInfo?.onPayRoll.answer === YES
                          ? applicationMessages.general.yesOptionLabel
                          : applicationMessages.general.noOptionLabel
                      }
                    />
                  </GridColumn>
                )}
            </GridRow>
          </ReviewGroup>
          {isFishermanAccident(answers as FormValue) && (
            <>
              <Text variant="h4" paddingTop={6} paddingBottom={3}>
                {formatMessage(
                  fishingCompanyInfo.general.informationAboutShipTitle,
                )}
              </Text>
              <ReviewGroup
                isLast
                editAction={() => changeScreens('fishingShipInfo')}
              >
                <GridRow>
                  <GridColumn span={['12/12', '12/12', '6/12']}>
                    <ValueLine
                      label={fishingCompanyInfo.labels.shipName}
                      value={answers.fishingShipInfo.shipName}
                    ></ValueLine>
                  </GridColumn>
                  <GridColumn span={['12/12', '12/12', '6/12']}>
                    <ValueLine
                      label={fishingCompanyInfo.labels.shipCharacters}
                      value={answers.fishingShipInfo.shipCharacters}
                    ></ValueLine>
                  </GridColumn>
                </GridRow>
                <GridRow>
                  <GridColumn span={['12/12', '12/12', '6/12']}>
                    <ValueLine
                      label={fishingCompanyInfo.labels.homePort}
                      value={answers.fishingShipInfo.homePort}
                    ></ValueLine>
                  </GridColumn>
                  <GridColumn span={['12/12', '12/12', '6/12']}>
                    <ValueLine
                      label={fishingCompanyInfo.labels.shipRegisterNumber}
                      value={answers.fishingShipInfo.shipRegisterNumber}
                    ></ValueLine>
                  </GridColumn>
                </GridRow>
              </ReviewGroup>
            </>
          )}

          {answers.isRepresentativeOfCompanyOrInstitue?.toString() !== YES && (
            <>
              <Text variant="h4" paddingTop={6} paddingBottom={3}>
                {formatText(
                  workplaceData.companyInfoMsg.labels.descriptionField,
                  application,
                  formatMessage,
                )}
              </Text>
              <ReviewGroup
                isLast
                editAction={() => changeScreens(workplaceData.screenId)}
                isEditable={States.DRAFT === application.state}
              >
                <GridRow>
                  <GridColumn span={['12/12', '12/12', '6/12']}>
                    <ValueLine
                      label={workplaceData.representitiveMsg.labels.name}
                      value={workplaceData.representitive.name}
                    />
                  </GridColumn>
                  <GridColumn span={['12/12', '12/12', '6/12']}>
                    <ValueLine
                      label={workplaceData.representitiveMsg.labels.nationalId}
                      value={workplaceData.representitive.nationalId}
                    />
                  </GridColumn>
                  <GridColumn span={['12/12', '12/12', '6/12']}>
                    <ValueLine
                      label={workplaceData.representitiveMsg.labels.email}
                      value={workplaceData.representitive.email}
                    />
                  </GridColumn>
                  {workplaceData.representitive.phoneNumber && (
                    <GridColumn span={['12/12', '12/12', '6/12']}>
                      <ValueLine
                        label={workplaceData.representitiveMsg.labels.tel}
                        value={workplaceData.representitive.phoneNumber}
                      />
                    </GridColumn>
                  )}
                </GridRow>
              </ReviewGroup>
            </>
          )}
        </>
      )}

      {isHomeActivitiesAccident(answers as FormValue) && (
        <>
          <Text variant="h4" paddingTop={6} paddingBottom={3}>
            {formatMessage(accidentLocation.homeAccidentLocation.title)}
          </Text>
          <ReviewGroup
            isLast
            editAction={() => changeScreens('accidentLocation.homeAccident')}
          >
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={accidentLocation.homeAccidentLocation.address}
                  value={answers.homeAccident.address}
                ></ValueLine>
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={accidentLocation.homeAccidentLocation.postalCode}
                  value={answers.homeAccident.postalCode}
                ></ValueLine>
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={accidentLocation.homeAccidentLocation.community}
                  value={answers.homeAccident.community}
                ></ValueLine>
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={accidentLocation.homeAccidentLocation.moreDetails}
                  value={answers.homeAccident.moreDetails || ''}
                ></ValueLine>
              </GridColumn>
            </GridRow>
          </ReviewGroup>
        </>
      )}

      <Text variant="h4" paddingTop={6} paddingBottom={3}>
        {formatMessage(accidentDetails.general.sectionTitle)}
      </Text>
      <ReviewGroup
        isLast
        editAction={() => changeScreens('accidentDetails')}
        isEditable={States.DRAFT === application.state}
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
              <Box marginBottom={2}>
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
          </GridColumn>
        </GridRow>
      </ReviewGroup>
    </Box>
  )
}
