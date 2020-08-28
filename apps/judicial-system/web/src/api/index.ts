import 'isomorphic-fetch'

interface Case {
  id: string
  created: Date
  modified: Date
  description: string
}

export const getCases = () => {
  return fetch('http://localhost:3333/cases')
}
