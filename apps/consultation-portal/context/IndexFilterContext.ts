import { createContext } from 'react'


const IndexFilterContext = createContext({
  query: '',
  sorting: {},
  caseStatuses: {},
  caseTypes: {},
  policyAreas: {},
  institutions: {},
  period: undefined
})

export default IndexFilterContext
