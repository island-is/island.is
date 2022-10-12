import React, { Fragment, useState } from 'react'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { getErrorViaPath } from '@island.is/application/core'

import {
  Box,
  Checkbox,
  Divider,
  GridColumn,
  GridRow,
  InputError,
  Text,
} from '@island.is/island-ui/core'
import { Controller, useFormContext } from 'react-hook-form'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import * as Sentry from '@sentry/react'
import { useMutation } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { currencyStringToNumber, formatCurrency } from '../../lib/utils/helpers'
import { FinancialStatementsInao } from '../../lib/utils/dataSchema'
import { format as formatNationalId } from 'kennitala'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { useSubmitApplication } from '../../hooks/useSubmitApplication'
import { m } from '../../lib/messages'
import { FileValueLine, ValueLine } from '../Shared'
import {
  columnStyle,
  starterColumnStyle,
} from '../Shared/styles/overviewStyles.css'
import BottomBar from '../../components/BottomBar'

export const CemetryOverview = ({
  application,
  goToScreen,
  refetch,
}: FieldBaseProps) => {
  const { errors, setError, setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const [approveOverview, setApproveOverview] = useState(false)

  const [submitApplication, { error: submitError }] = useSubmitApplication({
    application,
    refetch,
    event: DefaultEvents.SUBMIT,
  })

  const answers = application.answers as FinancialStatementsInao
  const fileName = answers.attachment?.file?.[0]?.name
  const careTakerLimit = answers.cemetryOperation.incomeLimit ?? '0'

  const onBackButtonClick = () => {
    const cemeteryIncome = currencyStringToNumber(answers.cemetryIncome?.total)
    const currentAssets = answers.cemetryAsset?.current
    const longTermDebt = answers.cemetryLiability?.longTerm
    if (
      cemeteryIncome < Number(careTakerLimit) &&
      currentAssets === '0' &&
      longTermDebt === '0'
    ) {
      goToScreen && goToScreen('caretakers')
    } else {
      goToScreen && goToScreen('attachment.file')
    }
  }

  const onSendButtonClick = () => {
    if (approveOverview) {
      submitApplication()
    } else {
      setError('applicationApprove', {
        type: 'error',
      })
    }
  }

  return (
    <Box marginBottom={2}>
      <Divider />
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.operatingYear}
            value={
              answers.conditionalAbout?.operatingYear
                ? answers.conditionalAbout.operatingYear
                : '-'
            }
          />
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.nationalId}
            value={
              answers.about?.nationalId
                ? formatNationalId(answers.about.nationalId)
                : '-'
            }
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine label={m.fullName} value={answers.about.fullName} />
        </GridColumn>
      </GridRow>
      <GridRow>
        {answers.about.powerOfAttorneyName ? (
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.powerOfAttorneyName}
              value={answers.about.powerOfAttorneyName}
            />
          </GridColumn>
        ) : null}
        {answers.about.powerOfAttorneyNationalId ? (
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.powerOfAttorneyNationalId}
              value={formatNationalId(answers.about.powerOfAttorneyNationalId)}
            />
          </GridColumn>
        ) : null}
      </GridRow>

      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine label={m.email} value={answers.about.email} />
        </GridColumn>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.phoneNumber}
            value={formatPhoneNumber(answers.about.phoneNumber)}
          />
        </GridColumn>
      </GridRow>
      <Divider />
      <Box className={starterColumnStyle}>
        <Text variant="h3" as="h3">
          {formatMessage(m.keyNumbersIncomeAndExpenses)}
        </Text>
      </Box>
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.otherIncome}
            value={formatCurrency(answers.cemetryIncome?.otherIncome)}
          />
          <ValueLine
            label={m.caretaking}
            value={formatCurrency(answers.cemetryIncome?.caretaking)}
          />
          <ValueLine
            label={m.cemetryFundDonations}
            value={formatCurrency(answers.cemetryIncome?.cemetryFundDonations)}
          />
          <ValueLine
            label={m.graveIncome}
            value={formatCurrency(answers.cemetryIncome?.graveIncome)}
          />
          <ValueLine
            label={m.totalIncome}
            value={formatCurrency(answers.cemetryIncome?.total)}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.chapelExpense}
            value={formatCurrency(answers.cemetryExpense?.chapelExpense)}
          />
          <ValueLine
            label={m.donationsToOther}
            value={formatCurrency(answers.cemetryExpense?.donationsToOther)}
          />
          <ValueLine
            label={m.funeralCost}
            value={formatCurrency(answers.cemetryExpense?.funeralCost)}
          />
          <ValueLine
            label={m.otherOperationCost}
            value={formatCurrency(answers.cemetryExpense?.otherOperationCost)}
          />
          <ValueLine
            label={m.payroll}
            value={formatCurrency(answers.cemetryExpense?.payroll)}
          />
          <ValueLine
            label={m.writtenOffExpense}
            value={formatCurrency(answers.cemetryExpense?.writtenOffExpense)}
          />
          <ValueLine
            label={m.totalExpenses}
            value={formatCurrency(answers.cemetryExpense.total)}
          />
        </GridColumn>
      </GridRow>
      <Divider />
      <Box className={starterColumnStyle}>
        <Text variant="h3" as="h3">
          {formatMessage(m.capitalNumbers)}
        </Text>

        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.capitalIncome}
              value={formatCurrency(answers.capitalNumbers?.capitalIncome)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.capitalIncome}
              value={formatCurrency(answers.capitalNumbers?.capitalCost)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.totalCapital}
              value={formatCurrency(answers.capitalNumbers?.total)}
            />
          </GridColumn>
        </GridRow>
        <Divider />

        <Box className={starterColumnStyle}>
          <Text variant="h3" as="h3">
            {formatMessage(m.keyNumbersDebt)}
          </Text>

          <GridRow>
            <GridColumn span={['12/12', '6/12']}>
              <ValueLine
                label={m.currentAssets}
                value={formatCurrency(answers.cemetryAsset?.current)}
              />
            </GridColumn>
            <GridColumn span={['12/12', '6/12']}>
              <ValueLine
                label={m.tangibleAssets}
                value={formatCurrency(answers.cemetryAsset?.tangible)}
              />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['12/12', '6/12']}>
              <ValueLine
                label={m.totalAssets}
                value={formatCurrency(answers.cemetryAsset.total)}
              />
            </GridColumn>
          </GridRow>

          <GridRow>
            <GridColumn span={['12/12', '6/12']}>
              <ValueLine
                label={m.shortTerm}
                value={formatCurrency(answers.cemetryLiability?.shortTerm)}
              />
            </GridColumn>
            <GridColumn span={['12/12', '6/12']}>
              <ValueLine
                label={m.longTerm}
                value={formatCurrency(answers.cemetryLiability?.longTerm)}
              />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['12/12', '6/12']}>
              <ValueLine
                label={m.totalLiabilities}
                value={formatCurrency(answers.cemetryLiability?.total)}
              />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['12/12', '6/12']}>
              <ValueLine
                label={m.newYearequity}
                value={formatCurrency(answers.cemetryEquity?.newYearEquity)}
              />
            </GridColumn>
            <GridColumn span={['12/12', '6/12']}>
              <ValueLine
                label={m.operationResult}
                value={formatCurrency(answers.cemetryEquity?.operationResult)}
              />
            </GridColumn>
          </GridRow>
        </Box>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.reevaluatePrice}
              value={formatCurrency(answers.cemetryEquity?.reevaluatePrice)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.reevaluateOther}
              value={formatCurrency(answers.cemetryEquity?.reevaluateOther)}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.totalEquity}
              value={formatCurrency(answers.cemetryEquity?.total)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Divider />
      {parseInt(answers.cemetryIncome?.total, 10) < Number(careTakerLimit) &&
      answers.cemetryCaretaker?.length > 0 ? (
        <Fragment>
          <Box className={starterColumnStyle}>
            <Text variant="h3" as="h3">
              {formatMessage(m.cemeteryBoardmembers)}
            </Text>
          </Box>
          {answers.cemetryCaretaker.map((careTaker) => {
            return (
              <Fragment>
                <Box className={columnStyle}>
                  <GridRow>
                    <GridColumn span={['12/12', '6/12']}>
                      <ValueLine label={m.fullName} value={careTaker.name} />
                    </GridColumn>
                    <GridColumn span={['12/12', '6/12']}>
                      <ValueLine
                        label={m.nationalId}
                        value={formatNationalId(careTaker.nationalId)}
                      />
                    </GridColumn>
                  </GridRow>
                </Box>
                <Box className={columnStyle}>
                  <GridRow>
                    <GridColumn span={['12/12', '6/12']}>
                      <ValueLine label={m.role} value={careTaker.role} />
                    </GridColumn>
                  </GridRow>
                </Box>
                <Divider />
              </Fragment>
            )
          })}
        </Fragment>
      ) : null}
      {fileName ? (
        <Fragment>
          <FileValueLine label={answers.attachment?.file?.[0]?.name} />
          <Divider />
        </Fragment>
      ) : null}
      <Box paddingY={3}>
        <Text variant="h3" as="h3">
          {formatMessage(m.overview)}
        </Text>
      </Box>
      <Box background="blue100" padding={3}>
        <Controller
          name="applicationApprove"
          defaultValue={approveOverview}
          rules={{ required: true }}
          render={({ value, onChange }) => {
            return (
              <Checkbox
                onChange={(e) => {
                  onChange(e.target.checked)
                  setApproveOverview(e.target.checked)
                  setValue('applicationApprove' as string, e.target.checked)
                }}
                checked={value}
                name="applicationApprove"
                id="applicationApprove"
                label={formatMessage(m.overviewCorrect)}
                large
              />
            )
          }}
        />
      </Box>
      {errors && getErrorViaPath(errors, 'applicationApprove') ? (
        <InputError errorMessage={formatMessage(m.errorApproval)} />
      ) : null}
      <BottomBar
        onSendButtonClick={onSendButtonClick}
        onBackButtonClick={onBackButtonClick}
      />
    </Box>
  )
}
