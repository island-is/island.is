import { z } from 'zod'
import * as kennitala from 'kennitala'
import { YesOrNoEnum } from '@island.is/application/core'
import { parseCurrency } from '../../utils/utils'
import {
  RentalAmountIndexTypes,
  RentalAmountPaymentDateOptions,
  RentalPaymentMethodOptions,
} from '../../utils/enums'
import * as m from '../messages'

export const rentalAmount = z
  .object({
    amount: z.string().optional(),
    indexTypes: z.nativeEnum(RentalAmountIndexTypes).optional(),
    indexValue: z.string().optional(),
    isIndexConnected: z.string().array().optional(),
    paymentDateOptions: z.nativeEnum(RentalAmountPaymentDateOptions).optional(),
    paymentDateOther: z.string().optional(),
    paymentMethodOptions: z.nativeEnum(RentalPaymentMethodOptions).optional(),
    paymentMethodNationalId: z.string().optional(),
    paymentMethodBankAccountNumber: z.string().optional(),
    paymentMethodOtherTextField: z.string().optional(),
    securityDepositRequired: z.string().array().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.amount || !data.amount.trim().length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.dataSchema.requiredErrorMsg,
        path: ['amount'],
      })
    }

    const numericAmount = parseCurrency(data.amount ?? '')
    if (numericAmount !== undefined && numericAmount < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.dataSchema.negativeNumberError,
        path: ['amount'],
      })
    }

    if (data.isIndexConnected?.includes(YesOrNoEnum.YES) && !data.indexTypes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.rentalAmount.indexValueRequiredError,
        path: ['indexTypes'],
      })
    }
    if (
      data.paymentDateOptions?.includes(RentalAmountPaymentDateOptions.OTHER) &&
      !data.paymentDateOther?.trim().length
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.rentalAmount.paymentDateOtherOptionRequiredError,
        path: ['paymentDateOther'],
      })
    }

    if (
      data.paymentMethodOptions === RentalPaymentMethodOptions.BANK_TRANSFER
    ) {
      if (!data.paymentMethodNationalId?.trim().length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.rentalAmount.paymentMethodNationalIdRequiredError,
          path: ['paymentMethodNationalId'],
        })
      }
      if (
        data.paymentMethodNationalId &&
        data.paymentMethodNationalId?.trim().length &&
        !kennitala.isValid(data.paymentMethodNationalId)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.rentalAmount.paymentMethodNationalIdInvalidError,
          path: ['paymentMethodNationalId'],
        })
      }
      if (!data.paymentMethodBankAccountNumber?.trim().length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.rentalAmount.paymentMethodBankAccountNumberRequiredError,
          path: ['paymentMethodBankAccountNumber'],
        })
      }
      if (
        data.paymentMethodBankAccountNumber?.trim().length &&
        data.paymentMethodBankAccountNumber.length < 7
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.rentalAmount.paymentMethodBankAccountNumberInvalidError,
          path: ['paymentMethodBankAccountNumber'],
        })
      }
    }

    if (data.paymentMethodOptions === RentalPaymentMethodOptions.OTHER) {
      if (!data.paymentMethodOtherTextField?.trim().length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.rentalAmount.paymentMethodOtherTextFieldRequiredError,
          path: ['paymentMethodOtherTextField'],
        })
      }
    }
  })
