import { gql, useQuery } from '@apollo/client'
import React, { createContext, useEffect, useState ,useReducer} from 'react'
import { CSRF_COOKIE_NAME } from '@island.is/judicial-system/consts'
import Cookies from 'js-cookie'


export interface Form {
  address?:number
  customHomeAddress?: string
  customPostalCode?: number
  homeCircumstances?: string
  homeCircumstancesCustom?: string
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

  console.log(form)

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
    <FormContext.Provider value={{  form, updateForm }}>
      {children}
    </FormContext.Provider>
  )
}

export default FormProvider
