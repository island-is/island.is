import { ApiProperty } from '@nestjs/swagger'

import { SubpoenaStatistics } from '../../subpoena/models/subpoenaStatistics.response'

export class IndictmentCaseStatistics {
  @ApiProperty({ type: Number })
  count!: number

  @ApiProperty({ type: Number })
  inProgressCount!: number

  @ApiProperty({ type: Number })
  rulingCount!: number

  @ApiProperty({ type: Number })
  averageRulingTimeMs!: number

  @ApiProperty({ type: Number })
  averageRulingTimeDays!: number
}

export class RequestCaseStatistics {
  @ApiProperty({ type: Number })
  count!: number

  @ApiProperty({ type: Number })
  inProgressCount!: number

  @ApiProperty({ type: Number})
  completedCount!: number
}

export class CaseStatistics {
  @ApiProperty({ type: Number })
  count!: number

  @ApiProperty({ type: RequestCaseStatistics })
  requestCases!: RequestCaseStatistics

  @ApiProperty({ type: IndictmentCaseStatistics })
  indictmentCases!: IndictmentCaseStatistics

  @ApiProperty({ type: SubpoenaStatistics })
  subpoenas!: SubpoenaStatistics
}
