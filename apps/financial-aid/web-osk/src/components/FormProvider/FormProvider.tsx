import React, { createContext, ReactNode, useEffect, useState } from 'react'

import {
  HomeCircumstances,
  Employment,
  FamilyStatus,
  FormSpouse,
} from '@island.is/financial-aid/shared/lib'
import { UploadFile } from '@island.is/island-ui/core'

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
  incomeFiles: UploadFile[]
  taxReturnFiles: UploadFile[]
  otherFiles: UploadFile[]
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
}

export const initialState = {
  submitted: false,
  incomeFiles: [],
  taxReturnFiles: [],
  otherFiles: [],
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
    })
  }

  return (
    <FormContext.Provider value={{ form, updateForm, initializeFormProvider }}>
      {children}
    </FormContext.Provider>
  )
}

export default FormProvider
