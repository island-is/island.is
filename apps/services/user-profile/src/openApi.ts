import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('User Profile backend')
  .setDescription(
    'Backend providing user profiles for Island.is',
  )
  .setVersion('1.0')
  .addTag('User Profile', 'User profile api for Island.is users ')
  .build()
