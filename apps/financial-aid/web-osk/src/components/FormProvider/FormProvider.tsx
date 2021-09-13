import React, { createContext, ReactNode, useEffect, useState } from 'react'

import {
  HomeCircumstances,
  Employment,
} from '@island.is/financial-aid/shared/lib'
import { UploadFile } from '@island.is/island-ui/core'

export interface Form {
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
}

export const initialState = {
  submitted: false,
  incomeFiles: [],
  taxReturnFiles: [] as UploadFile[],
  otherFiles: [],
}

interface FormProvider {
  form: Form
  updateForm?: any
  emptyformProvider?: any
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

  const emptyformProvider = () => {
    updateForm({
      submitted: false,
      incomeFiles: [],
      taxReturnFiles: [],
      otherFiles: [],
    })
  }

  return (
    <FormContext.Provider value={{ form, updateForm, emptyformProvider }}>
      {children}
    </FormContext.Provider>
  )
}

export default FormProvider
