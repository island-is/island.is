import { registerAs } from '@nestjs/config'

export const applicationConfiguration = registerAs('application', () => ({
  attachmentBucket: process.env.APPLICATION_ATTACHMENT_BUCKET,
  region: process.env.APPLICATION_ATTACHMENT_REGION || 'eu-west-1',
}))
