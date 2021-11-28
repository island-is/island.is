import { ZodError } from 'zod'

export class ConfigurationError extends Error {
  name = 'ConfigurationError'
}

export class ConfigurationValidationError extends Error {
  public readonly zodError: ZodError

  constructor(message: string, zodError: ZodError) {
    const formattedErrors = zodError.errors
      .map((error) => `- ${error.path.join('.') || '<ROOT>'}: ${error.message}`)
      .join('\n')
    super(`${message}\n${formattedErrors}`)

    this.name = 'ConfigurationValidationError'
    this.zodError = zodError
  }
}
