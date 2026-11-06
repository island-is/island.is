import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export type SdfProblemDetails = {
  type: string
  title: string
  status: number
  detail?: string
  instance?: string
  traceId?: string
}

export class SdfProblemDetailsDto implements SdfProblemDetails {
  @ApiProperty({
    description: 'URI identifying the problem type.',
    example: 'https://island.is/problems/application-system/sdf/bad-request',
  })
  type!: string

  @ApiProperty({
    description: 'Short, stable summary of the problem type.',
    example: 'Bad request',
  })
  title!: string

  @ApiProperty({
    description: 'HTTP status code for this occurrence.',
    example: 400,
  })
  status!: number

  @ApiPropertyOptional({
    description: 'Human-readable explanation for this occurrence.',
    example: 'step must be a non-negative integer',
  })
  detail?: string

  @ApiPropertyOptional({
    description: 'URI identifying this specific occurrence.',
    example: '/sdf/00000000-0000-0000-0000-000000000001/screen',
  })
  instance?: string

  @ApiPropertyOptional({
    description: 'Trace identifier for correlating logs.',
    example: '7kHPSP_X0W1R0fo5h0fG',
  })
  traceId?: string
}

export const createSdfProblem = (
  problem: SdfProblemDetails,
): SdfProblemDetails => {
  const result: SdfProblemDetails = {
    type: problem.type,
    title: problem.title,
    status: problem.status,
  }

  if (problem.detail !== undefined) {
    result.detail = problem.detail
  }
  if (problem.instance !== undefined) {
    result.instance = problem.instance
  }
  if (problem.traceId !== undefined) {
    result.traceId = problem.traceId
  }

  return result
}
