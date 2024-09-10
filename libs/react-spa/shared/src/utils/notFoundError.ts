import { ProblemTypes } from '../components/problems/problem.types'

export class NotFoundError extends Error {
  code
  title: string | undefined
  description: string | undefined

  constructor(title?: string, description?: string) {
    super(title)
    this.code = ProblemTypes.notFound
    this.title = title
    this.description = description
  }
}
