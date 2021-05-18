import React, { createContext, useEffect, useState } from 'react'

export interface Form {
  customAddress?: boolean
  customHomeAddress?: string
  customPostalCode?: number
  homeCircumstances?: string
  homeCircumstancesCustom?: string
  student?: string
  employment?: string
  employmentCustom?: string
  hasIncome?: boolean
  incomeFiles?: any
  usePersonalTaxCredit?: boolean
  bankNumber?: string
  ledger?: string
  accountNumber?: string
  emailAddress?: string
  interview?: boolean
  submitted: boolean
  section?: Array<string>
}

export const initialState = { submitted: false, incomeFiles: [] }

interface FormProvider {
  form?: Form
  updateForm?: any
}

export const FormContext = createContext<FormProvider>({})

const FormProvider: React.FC = ({ children }) => {
  const getSessionStorageOrDefault = (key: any) => {
    const stored = sessionStorage.getItem(key)
    if (!stored) {
      return initialState
    }
    return JSON.parse(stored)
  }

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

  return (
    <FormContext.Provider value={{ form, updateForm }}>
      {children}
    </FormContext.Provider>
  )
}

export default FormProvider
