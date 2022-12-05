import React, { createContext } from 'react'

interface StepProvider {
  onContinue: () => void
}

export const StepContext = createContext<StepProvider>({ onContinue: () => {} })

// Setting authenticated to true forces current user query in tests
interface Props {
  onContinue: () => void
}

export const StepProvider: React.FC<Props> = ({ onContinue, children }) => {
  return (
    <StepContext.Provider value={{ onContinue }}>
      {children}
    </StepContext.Provider>
  )
}
