import { GraphQLError } from 'graphql'
import { ApolloError } from '@apollo/client'
import { ProblemType } from '../ProblemType'
import { findProblemInApolloError } from './findProblemInApolloError'

describe('findProblemInApolloError', () => {
  it('return undefined when passed undefined', () => {
    // Act
    const problem = findProblemInApolloError(undefined)

    // Assert
    expect(problem).toBeUndefined()
  })

  it('return undefined when passed GraphQLError with no problem', () => {
    // Act
    const problem = findProblemInApolloError(
      new ApolloError({ graphQLErrors: [new GraphQLError('Error')] }),
    )

    // Assert
    expect(problem).toBeUndefined()
  })

  it('return undefined when passed network error', () => {
    // Act
    const problem = findProblemInApolloError(
      new ApolloError({ networkError: new Error('Something happened') }),
    )

    // Assert
    expect(problem).toBeUndefined()
  })

  it('return first problem found', () => {
    // Arrange
    const error = new ApolloError({
      graphQLErrors: [
        new GraphQLError('Error', null, null, null, null, null, {
          problem: { type: ProblemType.HTTP_BAD_REQUEST },
        }),
        new GraphQLError('Error', null, null, null, null, null, {
          problem: { type: ProblemType.HTTP_NOT_FOUND },
        }),
      ],
    })

    // Act
    const problem = findProblemInApolloError(error)

    // Assert
    expect(problem).toMatchObject({ type: ProblemType.HTTP_BAD_REQUEST })
  })

  it('return first problem matching types', () => {
    // Arrange
    const error = new ApolloError({
      graphQLErrors: [
        new GraphQLError('Error', null, null, null, null, null, {
          problem: { type: ProblemType.HTTP_BAD_REQUEST },
        }),
        new GraphQLError('Error', null, null, null, null, null, {
          problem: { type: ProblemType.HTTP_NOT_FOUND },
        }),
      ],
    })

    // Act
    const problem = findProblemInApolloError(error, [
      ProblemType.HTTP_NOT_FOUND,
    ])

    // Assert
    expect(problem).toMatchObject({ type: ProblemType.HTTP_NOT_FOUND })
  })

  it('return first problem matching types when problem is nested in exception object', () => {
    // Arrange
    const error = new ApolloError({
      graphQLErrors: [
        new GraphQLError('Error', null, null, null, null, null, {
          exception: {
            problem: { type: ProblemType.HTTP_BAD_REQUEST },
          },
        }),
        new GraphQLError('Error', null, null, null, null, null, {
          exception: {
            problem: { type: ProblemType.HTTP_NOT_FOUND },
          },
        }),
      ],
    })

    // Act
    const problem = findProblemInApolloError(error, [
      ProblemType.HTTP_NOT_FOUND,
    ])

    // Assert
    expect(problem).toMatchObject({ type: ProblemType.HTTP_NOT_FOUND })
  })

  it('return undefined if no problem matches types', () => {
    // Arrange
    const error = new ApolloError({
      graphQLErrors: [
        new GraphQLError('Error', null, null, null, null, null, {
          problem: { type: ProblemType.HTTP_BAD_REQUEST },
        }),
        new GraphQLError('Error', null, null, null, null, null, {
          exception: {
            problem: { type: ProblemType.HTTP_BAD_REQUEST },
          },
        }),
      ],
    })

    // Act
    const problem = findProblemInApolloError(error, [
      ProblemType.HTTP_NOT_FOUND,
    ])

    // Assert
    expect(problem).toBeUndefined()
  })
})
