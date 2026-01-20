import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const WebSitemapConfigSchema = z.object({
    s3Bucket: z.string(),
})

export const WebSitemapConfig = defineConfig({
    name: 'WebSitemapConfig',
    schema: WebSitemapConfigSchema,
    load: (env) => ({
        s3Bucket: env.required('S3_BUCKET', 'island-is-dev-cms-importer'),
    }),
})
