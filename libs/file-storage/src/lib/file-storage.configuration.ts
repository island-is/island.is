import { registerAs } from '@nestjs/config'

export const fileStorageConfiguration = registerAs('fileStorage', () => ({
  uploadBucket: process.env.FILE_STORAGE_UPLOAD_BUCKET,
}))
