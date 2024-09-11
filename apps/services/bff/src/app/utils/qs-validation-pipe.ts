import { ValidationPipe } from '@nestjs/common'

export const qsValidationPipe = new ValidationPipe({
  transform: true,
  transformOptions: { enableImplicitConversion: true },
  forbidNonWhitelisted: true,
})
