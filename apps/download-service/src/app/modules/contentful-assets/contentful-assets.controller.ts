import { Controller, Get, Param, Res } from '@nestjs/common'
import { Response } from 'express'

@Controller('contentful-assets')
export class ContentfulAssetController {
  @Get('/:spaceId/:assetId/:randomId/:assetFilename')
  async getAsset(
    @Param('spaceId') spaceId: string,
    @Param('assetId') assetId: string,
    @Param('randomId') randomId: string,
    @Param('assetFilename') assetFilename: string,
    @Res() res: Response,
  ) {
    const assetUrl = `https://assets.ctfassets.net/${spaceId}/${assetId}/${randomId}/${assetFilename}`

    const assetResponse = await fetch(assetUrl)

    // https://stackoverflow.com/questions/52665103/using-express-how-to-send-blob-object-as-response
    const assetBlob = await assetResponse.blob()
    res.type(assetBlob.type)
    const buffer = await assetBlob.arrayBuffer()
    res.send(Buffer.from(buffer))

    res.end()
  }
}
