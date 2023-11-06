import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { HttpProblem, ProblemType } from '@island.is/shared/problem'

export class HttpProblemResponse implements HttpProblem {
  @ApiProperty({
    description: 'A URI reference that identifies the problem type',
  })
  type!:
    | ProblemType.HTTP_BAD_REQUEST
    | ProblemType.HTTP_UNAUTHORIZED
    | ProblemType.HTTP_FORBIDDEN
    | ProblemType.HTTP_NOT_FOUND

  @ApiProperty({
    description: 'A short, human-readable summary of the problem type',
  })
  title!: string

  @ApiPropertyOptional({
    description: 'The HTTP status code',
  })
  status?: number

  @ApiPropertyOptional({
    description:
      'A human-readable explanation specific to this occurrence of the problem',
    oneOf: [
      {
        type: 'string',
      },
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
  })

  /**
   * The RFC describes this fields only as a string https://datatracker.ietf.org/doc/html/rfc7807#section-3.1
   * But due to how class-validator work for our NestJS APIs it can respond with array of string,
   * where each string indicates a validation error for a specific field.
   */
  detail?: string | string[]

  @ApiPropertyOptional({
    description:
      'A URI reference that identifies the specific occurrence of the problem.',
  })
  instance?: string
}
