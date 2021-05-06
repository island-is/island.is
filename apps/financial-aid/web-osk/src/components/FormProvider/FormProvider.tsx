import React, { createContext, useEffect, useState, useReducer } from 'react'

export interface Form {
  address?: number // TODO: kill me
  customHomeAddress?: string
  customPostalCode?: number
  homeCircumstances?: string
  homeCircumstancesCustom?: string
  student?: boolean
  employment?: string
  employmentCustom?: string
  hasIncome?: boolean
  incomeFiles?: any
  usePersonalTaxAllowance?: boolean
  bankNumber?: string
  ledger?: string
  accountNumber?: string
  emailAddress?: string
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
    if (form === initialState) {
      sessionStorage.removeItem(storageKey)
    }
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
