import { z } from 'zod'
import * as kennitala from 'kennitala'
import { YesOrNoEnum } from '@island.is/application/core'
import { parseCurrency } from '../../utils/utils'
import {
  RentalAmountPaymentDateOptions,
  RentalPaymentMethodOptions,
} from '../../utils/enums'
import * as m from '../messages'

export const rentalAmountSchema = z
  .object({
    amount: z.string().optional(),
    rentalPeriodIsDefinite: z.string().array().optional(),
    rentalPeriodStartDate: z.string(),
    rentalPeriodEndDate: z.string().optional(),
    indexValue: z.string().optional(),
    isIndexConnected: z.string().array().optional(),
    indexDate: z.string().optional(),
    indexRate: z.string().optional(),
    paymentDateOptions: z.nativeEnum(RentalAmountPaymentDateOptions).optional(),
    paymentDateOther: z.string().optional(),
    paymentMethodOptions: z.nativeEnum(RentalPaymentMethodOptions).optional(),
    paymentMethodNationalId: z.string().optional(),
    paymentMethodBankAccountNumber: z
      .object({
        bankNumber: z.string().optional(),
        ledger: z.string().optional(),
        accountNumber: z.string().optional(),
      })
      .optional(),
    paymentMethodOtherTextField: z.string().optional(),
    securityDepositRequired: z.string().array().optional(),
  })
  .superRefine((data, ctx) => {
    const {
      amount,
      rentalPeriodStartDate,
      rentalPeriodEndDate,
      isIndexConnected,
      paymentDateOptions,
      paymentDateOther,
      paymentMethodOptions,
      paymentMethodNationalId,
      paymentMethodBankAccountNumber,
      paymentMethodOtherTextField,
      rentalPeriodIsDefinite,
    } = data

    if (!amount || !amount?.trim().length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.dataSchema.requiredErrorMsg,
        path: ['amount'],
      })
    }

    // Using hidden fields to check length of rental period and if it is definite
    const startDate = rentalPeriodStartDate
      ? new Date(rentalPeriodStartDate)
      : undefined
    const endDate = rentalPeriodEndDate
      ? new Date(rentalPeriodEndDate)
      : undefined
    const periodIsDefinite = rentalPeriodIsDefinite?.includes(YesOrNoEnum.YES)
    const indexIsConnected = isIndexConnected?.includes(YesOrNoEnum.YES)

    if (periodIsDefinite && startDate && endDate && indexIsConnected) {
      // Calculate the difference in milliseconds
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
      // Convert milliseconds to days (1000ms * 60s * 60min * 24h)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      // 365.25 accounts for leap years more accurately
      const diffMonthsApprox = diffDays / 30.44 // Average days in a month (365.25/12)

      if (diffMonthsApprox <= 12) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.rentalAmount.indexNotAllowedForShortTermRentalError,
          path: ['isIndexConnected'],
        })
      }
    }

    const numericAmount = parseCurrency(amount ?? '')
    if (numericAmount !== undefined && numericAmount < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.dataSchema.negativeNumberError,
        path: ['amount'],
      })
    }
    if (numericAmount !== undefined && numericAmount > 1500000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.rentalAmount.tooHighNumberError,
        path: ['amount'],
      })
    }
    if (numericAmount !== undefined && numericAmount < 15000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.rentalAmount.tooLowNumberError,
        path: ['amount'],
      })
    }

    if (
      paymentDateOptions === RentalAmountPaymentDateOptions.OTHER &&
      !paymentDateOther?.trim().length
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.rentalAmount.paymentDateOtherOptionRequiredError,
        path: ['paymentDateOther'],
      })
    }

    if (paymentMethodOptions === RentalPaymentMethodOptions.BANK_TRANSFER) {
      if (!paymentMethodNationalId?.trim().length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.rentalAmount.paymentMethodNationalIdRequiredError,
          path: ['paymentMethodNationalId'],
        })
      }

      if (
        paymentMethodNationalId &&
        paymentMethodNationalId?.trim().length &&
        !kennitala.isValid(paymentMethodNationalId)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.rentalAmount.paymentMethodNationalIdInvalidError,
          path: ['paymentMethodNationalId'],
        })
      }

      // Validate bank account fields with proper length constraints
      const bankNumber =
        paymentMethodBankAccountNumber?.bankNumber?.trim() || ''
      const ledger = paymentMethodBankAccountNumber?.ledger?.trim() || ''
      const accountNumber =
        paymentMethodBankAccountNumber?.accountNumber?.trim() || ''

      // Bank number validation (required, 1-4 characters)
      if (bankNumber.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.rentalAmount.bankNumberError,
          path: ['paymentMethodBankAccountNumber', 'bankNumber'],
        })
      }

      // Ledger validation (required, 1-2 characters)
      if (ledger.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.rentalAmount.ledgerError,
          path: ['paymentMethodBankAccountNumber', 'ledger'],
        })
      }

      // Account number validation (required, 3-6 characters)
      if (accountNumber.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.rentalAmount.accountNumberError,
          path: ['paymentMethodBankAccountNumber', 'accountNumber'],
        })
      }
    }

    if (paymentMethodOptions === RentalPaymentMethodOptions.OTHER) {
      if (!paymentMethodOtherTextField?.trim().length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.rentalAmount.paymentMethodOtherTextFieldRequiredError,
          path: ['paymentMethodOtherTextField'],
        })
      }
    }
  })
