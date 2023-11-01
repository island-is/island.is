import { createContext, useCallback, useContext, useState } from 'react'
import { ChargeItemSubjects } from './FinanceTransactionPeriodsTypes'

type FinanceTransactionPeriodsStateProps = {
  year?: string
  selectedPeriods?: ChargeItemSubjects
}

type FinanceTransactionPeriodsContext = {
  financeTransactionPeriodsState: FinanceTransactionPeriodsStateProps
  setFinanceTransactionPeriodsState: (
    args: FinanceTransactionPeriodsStateProps,
  ) => void
}

const financeTransactionPeriodsStateDefaults = {
  year: '',
  selectedPeriods: [],
}

export const FinanceTransactionPeriodsContext =
  createContext<FinanceTransactionPeriodsContext>({
    financeTransactionPeriodsState: financeTransactionPeriodsStateDefaults,

    setFinanceTransactionPeriodsState: () => null,
  })

export const useFinanceTransactionPeriodsState = () => {
  return useContext(FinanceTransactionPeriodsContext)
}

export const FinanceTransactionPeriodsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [financeTransactionPeriodsState, updateFinanceTransactionPeriodsState] =
    useState<FinanceTransactionPeriodsStateProps>(
      financeTransactionPeriodsStateDefaults,
    )

  const setFinanceTransactionPeriodsState = useCallback(
    (state: FinanceTransactionPeriodsStateProps) => {
      updateFinanceTransactionPeriodsState((prevState) => ({
        ...prevState,
        ...state,
      }))
    },
    [],
  )

  return (
    <FinanceTransactionPeriodsContext.Provider
      value={{
        financeTransactionPeriodsState,
        setFinanceTransactionPeriodsState,
      }}
    >
      {children}
    </FinanceTransactionPeriodsContext.Provider>
  )
}
