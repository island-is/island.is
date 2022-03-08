import React, { useState } from 'react'
import {
  Text,
  Box,
  GridColumn,
  GridRow,
  Input,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { Controller, useFormContext } from 'react-hook-form'
import * as m from '../../lib/messages'
import { ApproveOptions, FAFieldBaseProps } from '../../lib/types'
import {
  Employment,
  getNextPeriod,
  HomeCircumstances,
  estimatedBreakDown,
} from '@island.is/financial-aid/shared/lib'

import { Routes } from '../../lib/constants'
import { SummaryBlock, DescriptionText, Breakdown } from '../index'
import {
  formatAddress,
  formatBankInfo,
  getMessageApproveOptions,
  getMessageApproveOptionsForIncome,
  getMessageEmploymentStatus,
  getMessageHomeCircumstances,
} from '../../lib/formatters'
import AllFiles from './AllFiles'
import useApplication from '../../lib/hooks/useApplication'

import cn from 'classnames'
import * as styles from './../Shared.css'

const SummaryForm = ({
  application,
  goToScreen,
  setBeforeSubmitCallback,
}: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { id, answers, externalData } = application
  const [formError, setFormError] = useState(false)

  const { setValue } = useFormContext()

  const formCommentId = 'formComment'

  const { createApplication } = useApplication()

  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
      const createApp = await createApplication(application)
        .then(() => {
          return true
        })
        .catch(() => {
          setFormError(true)
          return false
        })
      if (createApp) {
        return [true, null]
      }
      return [false, 'Failed to update application']
    })

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        marginTop={[2, 2, 4]}
      >
        <Box marginRight={1}>
          <Text as="h3" variant="h3">
            {formatMessage(m.summaryForm.general.descriptionTitle)}
          </Text>
        </Box>

        <Text variant="small">
          {formatMessage(m.summaryForm.general.descriptionSubtitle, {
            nextMonth: getNextPeriod.month,
          })}
        </Text>
      </Box>

      <Box marginTop={2}>
        <DescriptionText text={m.summaryForm.general.description} />
      </Box>

      {externalData.nationalRegistry && (
        <Box marginTop={[4, 4, 5]}>
          {/* TODO get aid amount */}
          <Breakdown calculations={estimatedBreakDown(10, true)} />
        </Box>
      )}

      <Box marginTop={[4, 4, 5]}>
        <DescriptionText text={m.summaryForm.general.calculationsOverview} />
      </Box>

      <Box
        paddingY={[4, 4, 5]}
        marginTop={4}
        borderTopWidth="standard"
        borderColor="blue300"
      >
        <GridRow marginBottom={3}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <Box>
              <Text fontWeight="semiBold">
                {formatMessage(m.summaryForm.userInfo.name)}
              </Text>
              <Text>
                {externalData.nationalRegistry?.data?.applicant?.fullName}
              </Text>
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <Box marginTop={[3, 3, 3, 0]}>
              <Text fontWeight="semiBold">
                {formatMessage(m.summaryForm.userInfo.nationalId)}
              </Text>
              <Text>
                {externalData?.nationalRegistry?.data?.applicant?.nationalId}
              </Text>
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <Box marginTop={3}>
              <Text fontWeight="semiBold">
                {formatMessage(m.summaryForm.userInfo.address)}
              </Text>
              <Text>
                {formatAddress(externalData.nationalRegistry?.data?.applicant)}
              </Text>
            </Box>
          </GridColumn>
        </GridRow>
      </Box>

      <SummaryBlock editAction={() => goToScreen?.(Routes.INRELATIONSHIP)}>
        <Text fontWeight="semiBold">
          {formatMessage(m.inRelationship.general.sectionTitle)}
        </Text>

        {/* TODO  relationship status  */}
        <Text>TODO</Text>
      </SummaryBlock>

      <SummaryBlock editAction={() => goToScreen?.(Routes.HOMECIRCUMSTANCES)}>
        <Text fontWeight="semiBold">
          {formatMessage(m.homeCircumstancesForm.general.sectionTitle)}
        </Text>

        {answers?.homeCircumstances && (
          <Text>
            {answers?.homeCircumstances.type === HomeCircumstances.OTHER
              ? answers?.homeCircumstances?.custom
              : formatMessage(
                  getMessageHomeCircumstances[answers?.homeCircumstances?.type],
                )}
          </Text>
        )}
      </SummaryBlock>

      <SummaryBlock editAction={() => goToScreen?.(Routes.STUDENT)}>
        <Text fontWeight="semiBold">
          {formatMessage(m.studentForm.general.sectionTitle)}
        </Text>

        <Text>
          {formatMessage(getMessageApproveOptions[answers?.student?.isStudent])}
        </Text>

        {answers?.student?.isStudent === ApproveOptions.Yes && (
          <Text marginTop={2}>{answers?.student?.custom}</Text>
        )}
      </SummaryBlock>

      <SummaryBlock editAction={() => goToScreen?.(Routes.EMPLOYMENT)}>
        <Text fontWeight="semiBold">
          {formatMessage(m.employmentForm.general.sectionTitle)}
        </Text>

        {answers?.employment && (
          <Text>
            {answers?.employment.type === Employment.OTHER
              ? answers?.employment.custom
              : formatMessage(
                  getMessageEmploymentStatus[answers.employment?.type],
                )}
          </Text>
        )}
      </SummaryBlock>

      <SummaryBlock editAction={() => goToScreen?.(Routes.INCOME)}>
        <Text fontWeight="semiBold">
          {formatMessage(m.incomeForm.general.sectionTitle)}
        </Text>

        <Text>
          {formatMessage(getMessageApproveOptionsForIncome[answers?.income])}
        </Text>
      </SummaryBlock>

      <SummaryBlock editAction={() => goToScreen?.(Routes.PERSONALTAXCREDIT)}>
        <Text fontWeight="semiBold">
          {formatMessage(m.summaryForm.formInfo.personalTaxCreditTitle)}
        </Text>
        {answers?.personalTaxCredit && (
          <Text>
            {formatMessage(
              getMessageApproveOptions[answers?.personalTaxCredit],
            )}
          </Text>
        )}
      </SummaryBlock>

      <SummaryBlock editAction={() => goToScreen?.(Routes.BANKINFO)}>
        <Text fontWeight="semiBold">
          {formatMessage(m.bankInfoForm.general.sectionTitle)}
        </Text>

        <Text>{formatBankInfo(answers?.bankInfo)}</Text>
      </SummaryBlock>

      <SummaryBlock editAction={() => goToScreen?.(Routes.CONTACTINFO)}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
            <Text fontWeight="semiBold">
              {formatMessage(m.contactInfo.emailInput.label)}{' '}
            </Text>
            <Text marginBottom={[3, 3, 3, 0]}>
              {answers?.contactInfo?.email}
            </Text>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
            <Text fontWeight="semiBold">
              {formatMessage(m.contactInfo.phoneInput.label)}{' '}
            </Text>
            <Text>{answers?.contactInfo?.phone}</Text>
          </GridColumn>
        </GridRow>
      </SummaryBlock>

      <SummaryBlock
        editAction={() =>
          answers.income === ApproveOptions.Yes
            ? goToScreen?.(Routes.INCOMEFILES)
            : goToScreen?.(Routes.TAXRETURNFILES)
        }
      >
        <Text fontWeight="semiBold">Gögn</Text>

        <AllFiles
          taxFiles={answers.taxReturnFiles}
          incomeFiles={answers.incomeFiles}
          applicationId={id}
        />
      </SummaryBlock>

      <Text as="h3" variant="h3">
        {formatMessage(m.summaryForm.formInfo.formCommentLabel)}
      </Text>

      <Box marginTop={[3, 3, 4]} marginBottom={4}>
        <Controller
          name={formCommentId}
          defaultValue={answers?.formComment}
          render={({ value, onChange }) => {
            return (
              <Input
                id={formCommentId}
                name={formCommentId}
                label={formatMessage(m.summaryForm.formInfo.formCommentTitle)}
                placeholder={formatMessage(
                  m.summaryForm.formInfo.formCommentPlaceholder,
                )}
                value={value}
                textarea={true}
                rows={8}
                backgroundColor="blue"
                onChange={(e) => {
                  onChange(e.target.value)
                  setValue(formCommentId, e.target.value)
                }}
              />
            )
          }}
        />
      </Box>
      <Box
        className={cn(styles.errorMessage, {
          [`${styles.showErrorMessage}`]: formError,
        })}
      >
        <Text color="red600" fontWeight="semiBold" variant="small">
          {formatMessage(m.summaryForm.general.errorMessage)}
        </Text>
      </Box>
    </>
  )
}

export default SummaryForm
