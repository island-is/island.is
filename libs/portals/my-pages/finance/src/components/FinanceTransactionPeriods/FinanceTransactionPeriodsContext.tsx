import { createContext, useCallback, useContext, useState } from 'react'
import { SelectedPeriod } from './FinanceTransactionPeriodsTypes'

type FinanceTransactionPeriodsStateProps = {
  searchQuery?: string
  year?: string
  selectedPeriods?: SelectedPeriod[]
}

type FinanceTransactionPeriodsContext = {
  financeTransactionPeriodsState: FinanceTransactionPeriodsStateProps
  setFinanceTransactionPeriodsState: (
    args: FinanceTransactionPeriodsStateProps,
  ) => void
}

const financeTransactionPeriodsStateDefaults = {
  searchQuery: '',
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
