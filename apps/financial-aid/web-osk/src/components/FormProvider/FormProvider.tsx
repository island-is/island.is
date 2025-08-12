import React, { createContext, ReactNode, useEffect, useState } from 'react'

import {
  HomeCircumstances,
  Employment,
  FamilyStatus,
  FormSpouse,
  DirectTaxPayment,
} from '@island.is/financial-aid/shared/lib'
import { UploadFileDeprecated } from '@island.is/island-ui/core'
import { uuid } from 'uuidv4'

export interface Form {
  applicationId?: string
  customAddress?: boolean
  customHomeAddress?: string
  customPostalCode?: number
  homeCircumstances?: HomeCircumstances
  homeCircumstancesCustom?: string
  student?: boolean
  studentCustom?: string
  employment?: Employment
  employmentCustom?: string
  hasIncome?: boolean
  incomeFiles: UploadFileDeprecated[]
  taxReturnFiles: UploadFileDeprecated[]
  taxReturnFromRskFile: UploadFileDeprecated[]
  otherFiles: UploadFileDeprecated[]
  usePersonalTaxCredit?: boolean
  bankNumber?: string
  ledger?: string
  accountNumber?: string
  emailAddress?: string
  interview?: boolean
  submitted: boolean
  section?: Array<string>
  formComment?: string
  fileUploadComment?: string
  familyStatus?: FamilyStatus
  spouse?: FormSpouse
  phoneNumber?: string
  directTaxPayments: DirectTaxPayment[]
  hasFetchedPayments: boolean
  fileFolderId: string
}

export const initialState = {
  submitted: false,
  incomeFiles: [],
  taxReturnFiles: [],
  taxReturnFromRskFile: [],
  otherFiles: [],
  directTaxPayments: [],
  hasFetchedPayments: false,
  fileFolderId: uuid(),
}

interface FormProvider {
  form: Form
  updateForm?: any
  initializeFormProvider?: any
}

interface Props {
  children: ReactNode
}

export const FormContext = createContext<FormProvider>({ form: initialState })

const FormProvider = ({ children }: Props) => {
  const storageKey = 'formState'

  const [form, updateForm] = useState(initialState)

  useEffect(() => {
    const storedFormJson = sessionStorage.getItem(storageKey)
    if (storedFormJson === null) {
      return
    }
    const storedState = JSON.parse(storedFormJson)
    updateForm(storedState)
  }, [])

  useEffect(() => {
    // Watches the user state and writes it to local storage on change
    sessionStorage.setItem(storageKey, JSON.stringify(form))
  }, [form])

  const initializeFormProvider = () => {
    updateForm({
      submitted: false,
      incomeFiles: [],
      taxReturnFiles: [],
      otherFiles: [],
      taxReturnFromRskFile: [],
      directTaxPayments: [],
      hasFetchedPayments: false,
      fileFolderId: uuid(),
    })
  }

  return (
    <FormContext.Provider value={{ form, updateForm, initializeFormProvider }}>
      {children}
    </FormContext.Provider>
  )
}

export default FormProvider
