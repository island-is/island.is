import { formatText } from '@island.is/application/core'
import { FieldBaseProps, FormValue } from '@island.is/application/types'
import {
  formatPhoneNumber,
  ReviewGroup,
} from '@island.is/application/ui-components'
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
import kennitala from 'kennitala'
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
  hindrances,
  injuredPersonInformation,
  inReview,
  juridicalPerson,
  locationAndPurpose,
  overview,
  sportsClubInfo,
  workMachine,
} from '../../lib/messages'
import {
  getAttachmentTitles,
  getWorkplaceData,
  hideLocationAndPurpose,
  isAgricultureAccident,
  isFishermanAccident,
  isGeneralWorkplaceAccident,
  isHomeActivitiesAccident,
  isMachineRelatedAccident,
  isProfessionalAthleteAccident,
  isReportingOnBehalfOfChild,
  isReportingOnBehalfOfEmployee,
  isReportingOnBehalfOfInjured,
  isWorkAccident,
  returnMissingDocumentsList,
} from '../../utils'
import * as styles from './FormOverview.css'
import { FileValueLine, ValueLine } from './ValueLine'

interface SubmittedApplicationData {
  data?: {
    documentId: string
  }
}

interface FormOverviewProps {
  field: {
    props: {
      isAssignee: boolean
    }
  }
}

export const FormOverview: FC<
  React.PropsWithChildren<FieldBaseProps & FormOverviewProps>
> = ({ application, goToScreen, field }) => {
  const isAssignee = field?.props?.isAssignee || false
  const answers = application.answers as AccidentNotification
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
          isAssignee
            ? applicantInformation.forThirdParty.title
            : applicantInformation.general.title,
          application,
          formatMessage,
        )}
      </Text>
      <ReviewGroup
        isLast
        editAction={() => changeScreens('applicant')}
        isEditable={application.state === States.DRAFT}
      >
        <GridRow>
          <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
            <ValueLine
              label={applicantInformation.labels.name}
              value={answers.applicant.name}
            />
          </GridColumn>
          <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
            <ValueLine
              label={applicantInformation.labels.nationalId}
              value={kennitala.format(answers.applicant.nationalId)}
            />
          </GridColumn>
          <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
            <ValueLine
              label={applicantInformation.labels.address}
              value={answers.applicant.address}
            />
          </GridColumn>
          <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
            <ValueLine
              label={applicantInformation.labels.city}
              value={answers.applicant.city}
            />
          </GridColumn>
          {answers.applicant.email && (
            <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
              <ValueLine
                label={applicantInformation.labels.email}
                value={answers.applicant.email}
              />
            </GridColumn>
          )}
          {answers.applicant.phoneNumber && (
            <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
              <ValueLine
                label={applicantInformation.labels.tel}
                value={formatPhoneNumber(answers.applicant.phoneNumber)}
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
            isEditable={application.state === States.DRAFT}
          >
            <GridRow>
              <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
                <ValueLine
                  label={injuredPersonInformation.labels.name}
                  value={answers.injuredPersonInformation.name}
                />
              </GridColumn>
              <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
                <ValueLine
                  label={injuredPersonInformation.labels.nationalId}
                  value={kennitala.format(
                    answers.injuredPersonInformation.nationalId,
                  )}
                />
              </GridColumn>
              <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
                <ValueLine
                  label={injuredPersonInformation.labels.email}
                  value={answers.injuredPersonInformation.email}
                />
              </GridColumn>
              {answers.injuredPersonInformation.phoneNumber && (
                <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
                  <ValueLine
                    label={injuredPersonInformation.labels.tel}
                    value={formatPhoneNumber(
                      answers.injuredPersonInformation.phoneNumber,
                    )}
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
            isEditable={application.state === States.DRAFT}
          >
            <GridRow>
              <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
                <ValueLine
                  label={childInCustody.labels.name}
                  value={answers.childInCustody.name}
                />
              </GridColumn>
              <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
                <ValueLine
                  label={childInCustody.labels.nationalId}
                  value={kennitala.format(answers.childInCustody.nationalId)}
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
            isEditable={application.state === States.DRAFT}
          >
            <GridRow>
              <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
                <ValueLine
                  label={juridicalPerson.labels.companyName}
                  value={answers.juridicalPerson.companyName}
                />
              </GridColumn>
              <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
                <ValueLine
                  label={juridicalPerson.labels.companyNationalId}
                  value={kennitala.format(
                    answers.juridicalPerson.companyNationalId,
                  )}
                />
              </GridColumn>
            </GridRow>
          </ReviewGroup>
        </>
      )}

      {answers.locationAndPurpose &&
        !isFishermanAccident(answers as FormValue) &&
        !hideLocationAndPurpose(answers as FormValue) && (
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
              isEditable={application.state === States.DRAFT}
            >
              <GridRow>
                <GridColumn span={['9/12', '9/12', '9/12', '10/12']}>
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
            isEditable={application.state === States.DRAFT}
          >
            <GridRow>
              <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
                <ValueLine
                  label={workplaceData.companyInfoMsg.labels.name}
                  value={workplaceData.companyInfo.name}
                />
              </GridColumn>
              <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
                <ValueLine
                  label={workplaceData.companyInfoMsg.labels.nationalId}
                  value={
                    kennitala.format(
                      workplaceData.companyInfo?.nationalRegistrationId,
                    ) ?? ''
                  }
                />
              </GridColumn>
              {isProfessionalAthleteAccident(answers as FormValue) &&
                workplaceData.companyInfo?.onPayRoll && (
                  <GridColumn span={['9/12', '9/12', '9/12', '10/12']}>
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
                isEditable={application.state === States.DRAFT}
              >
                <GridRow>
                  <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
                    <ValueLine
                      label={fishingCompanyInfo.labels.shipName}
                      value={answers.fishingShipInfo.shipName}
                    ></ValueLine>
                  </GridColumn>
                  <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
                    <ValueLine
                      label={fishingCompanyInfo.labels.shipCharacters}
                      value={answers.fishingShipInfo.shipCharacters}
                    ></ValueLine>
                  </GridColumn>
                </GridRow>
                <GridRow>
                  <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
                    <ValueLine
                      label={fishingCompanyInfo.labels.homePort}
                      value={answers.fishingShipInfo.homePort}
                    ></ValueLine>
                  </GridColumn>
                  <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
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
                isEditable={application.state === States.DRAFT}
              >
                <GridRow>
                  <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
                    <ValueLine
                      label={workplaceData.representitiveMsg.labels.name}
                      value={workplaceData.representitive.name}
                    />
                  </GridColumn>
                  <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
                    <ValueLine
                      label={workplaceData.representitiveMsg.labels.nationalId}
                      value={kennitala.format(
                        workplaceData.representitive.nationalId,
                      )}
                    />
                  </GridColumn>
                  <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
                    <ValueLine
                      label={workplaceData.representitiveMsg.labels.email}
                      value={workplaceData.representitive.email}
                    />
                  </GridColumn>
                  {workplaceData.representitive.phoneNumber && (
                    <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
                      <ValueLine
                        label={workplaceData.representitiveMsg.labels.tel}
                        value={formatPhoneNumber(
                          workplaceData.representitive.phoneNumber,
                        )}
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
            isEditable={application.state === States.DRAFT}
          >
            <GridRow>
              <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
                <ValueLine
                  label={accidentLocation.homeAccidentLocation.address}
                  value={answers.homeAccident.address}
                ></ValueLine>
              </GridColumn>
              <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
                <ValueLine
                  label={accidentLocation.homeAccidentLocation.postalCode}
                  value={answers.homeAccident.postalCode}
                ></ValueLine>
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
                <ValueLine
                  label={accidentLocation.homeAccidentLocation.community}
                  value={answers.homeAccident.community}
                ></ValueLine>
              </GridColumn>
              <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
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
        {formatMessage(hindrances.general.sectionTitle)}
      </Text>
      <ReviewGroup
        isLast
        editAction={() => changeScreens('timePassedHindrance')}
        isEditable={application.state === States.DRAFT}
      >
        <GridRow>
          <GridColumn span={['9/12', '9/12', '9/12', '10/12']}>
            <ValueLine
              label={hindrances.carAccident.radioFieldTitle}
              value={
                answers.carAccidentHindrance === YES
                  ? applicationMessages.general.yesOptionLabel
                  : applicationMessages.general.noOptionLabel
              }
            />
          </GridColumn>
          <GridColumn span={['9/12', '9/12', '9/12', '10/12']}>
            <ValueLine
              label={hindrances.timePassedHindrance.radioFieldTitle}
              value={
                answers.timePassedHindrance === YES
                  ? applicationMessages.general.yesOptionLabel
                  : applicationMessages.general.noOptionLabel
              }
            />
          </GridColumn>
          {isProfessionalAthleteAccident(answers as FormValue) && (
            <GridColumn span={['9/12', '9/12', '9/12', '10/12']}>
              <ValueLine
                label={sportsClubInfo.employee.title}
                value={
                  answers.onPayRoll.answer === YES
                    ? applicationMessages.general.yesOptionLabel
                    : applicationMessages.general.noOptionLabel
                }
              />
            </GridColumn>
          )}
          {(isGeneralWorkplaceAccident(answers as FormValue) ||
            isAgricultureAccident(answers as FormValue)) && (
            <GridColumn span={['9/12', '9/12', '9/12', '10/12']}>
              <ValueLine
                label={workMachine.general.workMachineRadioTitle}
                value={
                  answers.workMachineRadio === YES
                    ? applicationMessages.general.yesOptionLabel
                    : applicationMessages.general.noOptionLabel
                }
              />
            </GridColumn>
          )}
        </GridRow>
      </ReviewGroup>

      <Text variant="h4" paddingTop={6} paddingBottom={3}>
        {formatMessage(accidentDetails.general.sectionTitle)}
      </Text>
      <ReviewGroup
        isLast
        editAction={() => changeScreens('accidentDetails')}
        isEditable={application.state === States.DRAFT}
      >
        <GridRow>
          <GridColumn span={['9/12', '9/12', '9/12', '10/12']}>
            <ValueLine
              label={overview.labels.accidentType}
              value={`${formatMessage(
                accidentType.labels[answers.accidentType.radioButton],
              )}${
                answers.wasTheAccidentFatal === YES
                  ? `, ${formatMessage(fatalAccident.labels.fatalAccident)}`
                  : ''
              }${
                isWorkAccident(answers as FormValue)
                  ? `, ${formatMessage(
                      accidentType.workAccidentType[answers.workAccident.type],
                    )}`
                  : ''
              }`}
            />
          </GridColumn>
          <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
            <ValueLine label={accidentDetails.labels.date} value={date} />
          </GridColumn>
          <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
            <ValueLine label={accidentDetails.labels.time} value={time} />
          </GridColumn>
          {isMachineRelatedAccident(answers as FormValue) && (
            <GridColumn span={['9/12', '9/12', '9/12', '10/12']}>
              <ValueLine
                label={overview.labels.workMachine}
                value={answers.workMachine.desriptionOfMachine}
              />
            </GridColumn>
          )}
          <GridColumn span={['9/12', '9/12', '9/12', '10/12']}>
            <ValueLine
              label={accidentDetails.labels.description}
              value={answers.accidentDetails.descriptionOfAccident}
            />
          </GridColumn>
          <GridColumn span="12/12">
            <FileValueLine label={overview.labels.attachments} files={files} />
            {missingDocuments.length !== 0 && (
              <Box marginBottom={2}>
                <AlertMessage
                  type="warning"
                  title={formatMessage(overview.alertMessage.title)}
                  message={
                    <Text variant="small">
                      {formatMessage(overview.alertMessage.description)}
                      <span
                        className={cn(
                          styles.boldFileNames,
                          styles.paddingLeftForFileNames,
                        )}
                      >
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
