import React from 'react'
import {
  Text,
  Box,
  GridColumn,
  GridRow,
  Button,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import DescriptionText from '../DescriptionText/DescriptionText'

import * as m from '../../lib/messages'
import SummaryBlock from '../SummaryBlock/SummaryBlock'
import { FAFieldBaseProps } from '../../lib/types'
import {
  Employment,
  HomeCircumstances,
} from '@island.is/financial-aid/shared/lib'
import {
  getMessageHomeCircumstances,
  getMessageEmploymentStatus,
  getMessageApproveOptions,
} from '../../lib/formatters'

const SummaryForm = ({ application, goToScreen }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers, externalData } = application

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
          {formatMessage(m.summaryForm.general.descriptionSubtitle)}
        </Text>
      </Box>

      <Box marginTop={2}>
        <DescriptionText text={m.summaryForm.general.description} />
      </Box>

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
        sectionTitle={formatMessage(
          m.homeCircumstancesForm.general.sectionTitle,
        )}
        answer={
          answers?.homeCircumstances?.type === HomeCircumstances.OTHER
            ? answers?.homeCircumstances?.custom
            : formatMessage(
                getMessageHomeCircumstances[answers?.homeCircumstances?.type],
              )
        }
        editAction={() => goToScreen?.('homeCircumstances')}
      />

      <SummaryBlock
        sectionTitle={formatMessage(m.incomeForm.general.sectionTitle)}
        answer={formatMessage(getMessageApproveOptions[answers.income])}
        editAction={() => goToScreen?.('income')}
      />

      <SummaryBlock
        sectionTitle={formatMessage(m.employmentForm.general.sectionTitle)}
        answer={
          answers?.employment?.type === Employment.OTHER
            ? answers?.homeCircumstances?.custom
            : formatMessage(
                getMessageEmploymentStatus[answers?.employment?.type],
              )
        }
        editAction={() => goToScreen?.('employment')}
      />

      <SummaryBlock
        sectionTitle={formatMessage(
          m.personalTaxCreditForm.general.sectionTitle,
        )}
        answer={formatMessage(
          getMessageApproveOptions[answers.personalTaxCreditForm],
        )}
        editAction={() => goToScreen?.('personalTaxCredit')}
      />

      <SummaryBlock
        sectionTitle={formatMessage(m.bankInfoForm.general.sectionTitle)}
        answer={
          answers.bankInfoForm.bankNumber &&
          answers.bankInfoForm.ledger &&
          answers.bankInfoForm.accountNumber
            ? answers.bankInfoForm.bankNumber +
              '-' +
              answers.bankInfoForm.ledger +
              '-' +
              answers.bankInfoForm.accountNumber
            : ''
        }
        editAction={() => goToScreen?.('bankInfo')}
      />

      <Box paddingY={[4, 4, 5]} borderTopWidth="standard" borderColor="blue300">
        <GridRow marginBottom={3}>
          <GridColumn span={['6/12', '6/12', '6/12', '10/12']}>
            <GridRow marginBottom={3}>
              <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
                <Text fontWeight="semiBold">Netfang </Text>
                <Text>{externalData?.nationalRegistry?.data?.fullName}</Text>
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
                <Text fontWeight="semiBold">Símanúmer</Text>
                <Text>{externalData?.nationalRegistry?.data?.fullName}</Text>
              </GridColumn>
            </GridRow>
          </GridColumn>
          <GridColumn span={['6/12', '6/12', '6/12', '2/12']}>
            <Box display="flex" justifyContent="flexEnd">
              <Button
                icon="pencil"
                iconType="filled"
                variant="utility"
                onClick={() => console.log('bla')}
              >
                Breyta
              </Button>
            </Box>
          </GridColumn>
        </GridRow>
      </Box>

      <Text as="h3" variant="h3" marginTop={[3, 3, 5]}>
        Annað sem þú vilt koma á framfæri?{' '}
      </Text>
    </>
  )
}

export default SummaryForm
