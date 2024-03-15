import { ProblemTypes } from '../components/problems/problem.types'

export class NotFoundError extends Error {
  code = ProblemTypes.notFound
  title: string | undefined
  description: string | undefined

  constructor(title?: string, description?: string) {
    super(title)
    this.title = title
    this.description = description
  }
}
