import React from 'react'
import {
  Text,
  Box,
  GridColumn,
  GridRow,
  Button,
  Icon,
  Input,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import DescriptionText from '../DescriptionText/DescriptionText'
import { Controller, useFormContext } from 'react-hook-form'
import * as m from '../../lib/messages'
import SummaryBlock from '../SummaryBlock/SummaryBlock'
import { ApproveOptions, FAFieldBaseProps } from '../../lib/types'
import {
  Employment,
  getNextPeriod,
  HomeCircumstances,
} from '@island.is/financial-aid/shared/lib'
import {
  getMessageHomeCircumstances,
  getMessageEmploymentStatus,
  getMessageApproveOptions,
  getMessageApproveOptionsForIncome,
} from '../../lib/formatters'

const SummaryForm = ({ application, goToScreen }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers, externalData } = application

  const { setValue } = useFormContext()

  const formCommentId = 'formComment'

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
      {/* TODO estimated aid */}
      <Box marginTop={2}>
        <DescriptionText text={m.summaryForm.general.calculationsOverview} />
      </Box>

      <Box paddingY={[4, 4, 5]} borderTopWidth="standard" borderColor="blue300">
        <GridRow marginBottom={3}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <Box>
              <Text fontWeight="semiBold">
                {formatMessage(m.summaryForm.userInfo.name)}
              </Text>
              <Text>{externalData?.nationalRegistry?.data?.fullName}</Text>
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <Box marginTop={[3, 3, 3, 0]}>
              <Text fontWeight="semiBold">
                {formatMessage(m.summaryForm.userInfo.nationalId)}
              </Text>
              <Text>{externalData?.nationalRegistry?.data?.nationalId}</Text>
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <Box marginTop={3}>
              <Text fontWeight="semiBold">
                {formatMessage(m.summaryForm.userInfo.address)}
              </Text>
              <Text>{externalData?.nationalRegistry?.data?.address}</Text>
            </Box>
          </GridColumn>
        </GridRow>
      </Box>

      <SummaryBlock
        sectionTitle={formatMessage(m.inRelationship.general.sectionTitle)}
        editAction={() => goToScreen?.('inRelationship')}
      >
        {/* TODO */}
        <Text>TODO</Text>
      </SummaryBlock>

      <SummaryBlock
        sectionTitle={formatMessage(
          m.homeCircumstancesForm.general.sectionTitle,
        )}
        editAction={() => goToScreen?.('homeCircumstances')}
      >
        <Text>
          {answers?.homeCircumstances?.type === HomeCircumstances.OTHER
            ? answers?.homeCircumstances?.custom
            : formatMessage(
                getMessageHomeCircumstances[answers?.homeCircumstances?.type],
              )}
        </Text>
      </SummaryBlock>

      <SummaryBlock
        sectionTitle={formatMessage(m.studentForm.general.sectionTitle)}
        editAction={() => goToScreen?.('student')}
      >
        <Text>
          {formatMessage(getMessageApproveOptions[answers?.student?.isStudent])}
        </Text>

        {answers?.student?.isStudent === ApproveOptions.Yes && (
          <Text marginTop={2}>{answers?.student?.custom}</Text>
        )}
      </SummaryBlock>

      <SummaryBlock
        sectionTitle={formatMessage(m.employmentForm.general.sectionTitle)}
        editAction={() => goToScreen?.('employment')}
      >
        <Text>
          {answers?.employment?.type === Employment.OTHER
            ? answers?.homeCircumstances?.custom
            : formatMessage(
                getMessageEmploymentStatus[answers?.employment?.type],
              )}
        </Text>
      </SummaryBlock>

      <SummaryBlock
        sectionTitle={formatMessage(m.incomeForm.general.sectionTitle)}
        editAction={() => goToScreen?.('income')}
      >
        <Text>
          {formatMessage(getMessageApproveOptionsForIncome[answers?.income])}
        </Text>
      </SummaryBlock>

      <SummaryBlock
        sectionTitle={formatMessage(
          m.summaryForm.formInfo.personalTaxCreditTitle,
        )}
        editAction={() => goToScreen?.('personalTaxCredit')}
      >
        <Text>
          {formatMessage(getMessageApproveOptions[answers?.personalTaxCredit])}
        </Text>
      </SummaryBlock>

      <SummaryBlock
        sectionTitle={formatMessage(m.bankInfoForm.general.sectionTitle)}
        editAction={() => goToScreen?.('bankInfo')}
      >
        <Text>
          {answers?.bankInfo?.bankNumber &&
          answers?.bankInfo?.ledger &&
          answers?.bankInfo?.accountNumber
            ? answers?.bankInfo?.bankNumber +
              '-' +
              answers?.bankInfo?.ledger +
              '-' +
              answers?.bankInfo?.accountNumber
            : ''}
        </Text>
      </SummaryBlock>

      <Box paddingY={[4, 4, 5]} borderTopWidth="standard" borderColor="blue300">
        <GridRow>
          <GridColumn span={['6/12', '6/12', '6/12', '10/12']}>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
                <Text fontWeight="semiBold">Netfang </Text>
                <Text marginBottom={[3, 3, 3, 0]}>
                  {answers?.contactInfo?.email}
                </Text>
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
                <Text fontWeight="semiBold">Símanúmer</Text>
                <Text>{answers?.contactInfo?.phone}</Text>
              </GridColumn>
            </GridRow>
          </GridColumn>
          <GridColumn span={['6/12', '6/12', '6/12', '2/12']}>
            <Box display="flex" justifyContent="flexEnd">
              <Button
                icon="pencil"
                iconType="filled"
                variant="utility"
                // onClick={() => TODO }
              >
                Breyta
              </Button>
            </Box>
          </GridColumn>
        </GridRow>
      </Box>

      <SummaryBlock
        sectionTitle="Gögn"
        editAction={() => goToScreen?.('bankInfo')}
      >
        {/* TODO */}
        <Box display="flex">
          <Box marginRight={1} display="flex" alignItems="center">
            <Icon color="blue400" icon="document" size="small" type="outline" />
          </Box>

          <Text>filename todo</Text>
        </Box>
      </SummaryBlock>

      <Text as="h3" variant="h3">
        Annað sem þú vilt koma á framfæri?
      </Text>

      <Box marginTop={[3, 3, 4]}>
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
    </>
  )
}

export default SummaryForm
