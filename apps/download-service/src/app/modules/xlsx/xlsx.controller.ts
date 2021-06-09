import { Controller, Post, Header, Res, Body } from '@nestjs/common'
import { Response } from 'express'
import { ApiOkResponse } from '@nestjs/swagger'
import { XlsxDto } from './dto/xlsxDto'
import * as xlsx from 'node-xlsx'
import { WritableStreamBuffer } from 'stream-buffers'

@Controller()
export class XlsxController {
  @Post('xlsx')
  @Header('Content-Type', 'application/json')
  @ApiOkResponse({
    content: {
      'application/json': {},
    },
    description: 'Create and get a Excel document',
  })
  async getXlsx(@Res() res: Response, @Body() resource: XlsxDto) {
    if (resource.headers && resource.data) {
      const data = [resource.headers, ...resource.data]

      res.header('Content-length', data.length.toString())
      res.header('Pragma: no-cache')
      res.header('Cache-Control: no-cache')
      res.header('Cache-Control: nmax-age=0')

      const dateString = new Date().toISOString().split('T')[0]
      const fileName = `Yfirlit - ${dateString}`

      const widths = resource.headers.map((item) => ({ wch: 25 }))
      const buffer = xlsx.build([{ name: fileName, data: data }], {
        '!cols': widths,
      })

      const streamBuffer = new WritableStreamBuffer({
        initialSize: 100 * 1024,
        incrementAmount: 10 * 1024,
      })

      streamBuffer.write(buffer)
      streamBuffer.end()
      return res.status(200).json({
        file: streamBuffer.getContentsAsString('base64'),
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        filename: fileName,
      })
    }

    console.log('error here')

    res.status(400).json({ error: 'Data missing from body' })
    return
  }
}
