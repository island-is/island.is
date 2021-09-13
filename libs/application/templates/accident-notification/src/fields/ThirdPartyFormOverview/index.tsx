import { useMutation } from '@apollo/client'
import {
  DefaultEvents,
  FieldBaseProps,
  formatText,
  FormValue,
} from '@island.is/application/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
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
  locationAndPurpose,
  overview,
  sportsClubInfo,
} from '../../lib/messages'
import {
  getWorkplaceData,
  isMachineRelatedAccident,
  isProfessionalAthleteAccident,
  isReportingOnBehalfOfEmployee,
  returnMissingDocumentsList,
} from '../../utils'
import * as styles from '../FormOverview/FormOverview.treat'
import { FileValueLine, ValueLine } from '../FormOverview/ValueLine'
import { ThirdPartyReviewGroup } from './ThirdPartyReviewGroup'

export const ThirdPartyFormOverview: FC<FieldBaseProps> = ({
  application,
  refetch,
  goToScreen,
}) => {
  const answers = application.answers as AccidentNotification
  const { formatMessage } = useLocale()
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => console.error(e.message),
    },
  )

  const [commentOnApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  const missingDocuments = returnMissingDocumentsList(answers, formatMessage)

  const { timeOfAccident, dateOfAccident } = answers.accidentDetails
  const time = `${timeOfAccident.slice(0, 2)}:${timeOfAccident.slice(2, 4)}`
  const date = format(parseISO(dateOfAccident), 'dd.MM.yy', { locale: is })

  const workplaceData = getWorkplaceData(application.answers)

  const attachments = [
    ...(answers.attachments.deathCertificateFile
      ? answers.attachments.deathCertificateFile
      : []),
    ...(answers.attachments.injuryCertificateFile
      ? answers.attachments.injuryCertificateFile
      : []),
    ...(answers.attachments.powerOfAttorneyFile
      ? answers.attachments.powerOfAttorneyFile
      : []),
  ]

  const changeScreens = (screen: string) => {
    if (goToScreen) goToScreen(screen)
  }

  return (
    <Box component="section" paddingTop={2}>
      <Text>
        {formatText(
          overview.forThirdParty.description,
          application,
          formatMessage,
        )}
      </Text>

      <Text variant="h4" paddingTop={10} paddingBottom={3}>
        {formatText(
          applicantInformation.forThirdParty.title,
          application,
          formatMessage,
        )}
      </Text>
      <ThirdPartyReviewGroup isEditable={false}>
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
      </ThirdPartyReviewGroup>

      {answers.locationAndPurpose && (
        <>
          <Text variant="h4" paddingTop={6} paddingBottom={3}>
            {formatText(
              locationAndPurpose.general.title,
              application,
              formatMessage,
            )}
          </Text>
          <ThirdPartyReviewGroup isEditable={false}>
            <GridRow>
              <GridColumn span="12/12">
                <ValueLine
                  label={locationAndPurpose.labels.location}
                  value={answers.locationAndPurpose.location}
                />
              </GridColumn>
            </GridRow>
          </ThirdPartyReviewGroup>
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
          <ThirdPartyReviewGroup isEditable={false}>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={workplaceData.labels.companyName}
                  value={workplaceData.info.companyName}
                />
              </GridColumn>
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
          </ThirdPartyReviewGroup>

          {answers.isRepresentativeOfCompanyOrInstitue?.toString() !== YES && (
            <>
              <Text variant="h4" paddingTop={6} paddingBottom={3}>
                {formatText(
                  workplaceData.labels.descriptionField,
                  application,
                  formatMessage,
                )}
              </Text>
              <ThirdPartyReviewGroup isEditable={false}>
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
                  <GridColumn span={['12/12', '12/12', '6/12']}>
                    <ValueLine
                      label={workplaceData.labels.tel}
                      value={workplaceData.info.phoneNumber}
                    />
                  </GridColumn>
                </GridRow>
              </ThirdPartyReviewGroup>
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
      <ThirdPartyReviewGroup
        editAction={
          States.OVERVIEW === application.state
            ? async () => {
                const res = await commentOnApplication({
                  variables: {
                    input: {
                      id: application.id,
                      event: 'COMMENT',
                      answers: application.answers,
                    },
                  },
                })

                if (res?.data) {
                  // Takes them to the next state (which loads the relevant form)
                  refetch?.()
                }
              }
            : () => changeScreens('comment.multifield')
        }
      >
        <GridRow>
          <GridColumn span="12/12">
            <ValueLine
              label={overview.labels.accidentType}
              value={accidentType.labels[answers.accidentType.radioButton]}
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
          {answers.comment?.description && (
            <GridColumn span={'12/12'}>
              <Box
                background="roseTinted100"
                padding={3}
                borderRadius="standard"
              >
                <Text variant="eyebrow">Athugasemd</Text>
                <Text>{answers.comment.description}</Text>
              </Box>
            </GridColumn>
          )}
          <GridColumn span={['12/12', '12/12', '12/12']}>
            <FileValueLine
              label={overview.labels.attachments}
              files={attachments}
            />
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
            {States.OVERVIEW === application.state ||
            States.ADD_DOCUMENTS === application.state ||
            States.THIRD_PARTY_COMMENT ? (
              <Box display="flex" justifyContent="flexEnd">
                <Button
                  icon="attach"
                  variant="utility"
                  loading={loadingSubmit}
                  disabled={loadingSubmit}
                  onClick={
                    States.OVERVIEW === application.state ||
                    States.THIRD_PARTY_COMMENT === application.state
                      ? async () => {
                          const res = await submitApplication({
                            variables: {
                              input: {
                                id: application.id,
                                event: DefaultEvents.EDIT,
                                answers: application.answers,
                              },
                            },
                          })

                          if (res?.data) {
                            // Takes them to the next state (which loads the relevant form)
                            refetch?.()
                          }
                        }
                      : () => changeScreens('attachments.multifield')
                  }
                >
                  {formatMessage(overview.labels.missingDocumentsButton)}
                </Button>
              </Box>
            ) : null}
          </GridColumn>
        </GridRow>
      </ThirdPartyReviewGroup>
    </Box>
  )
}
