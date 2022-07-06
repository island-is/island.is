import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { LoggingModule } from '@island.is/logging'
import { HttpExceptionFilter } from './httpException.filter'
import { ProblemFilter } from './problem.filter'
import { ErrorFilter } from './error.filter'
import { ApolloErrorFilter } from './apolloError.filter'
import { ProblemOptions, PROBLEM_OPTIONS } from './problem.options'

@Module({
  imports: [LoggingModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ApolloErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ProblemFilter,
    },
    {
      provide: PROBLEM_OPTIONS,
      useValue: { logAllErrors: false },
    },
  ],
})
export class ProblemModule {
  static forRoot(options: ProblemOptions) {
    return {
      module: ProblemModule,
      providers: [
        {
          provide: PROBLEM_OPTIONS,
          useValue: options,
        },
      ],
    }
  }
}
