import { Controller, Post, Header, Res, Body } from '@nestjs/common'
import { Response } from 'express'
import { ApiOkResponse } from '@nestjs/swagger'
import { XlsxDto } from './dto/xlsxDto'
import * as XLSX from 'xlsx'
// const xlsx = require('xlsx')
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

      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data)
      const workbook: XLSX.WorkBook = {
        Sheets: { [fileName]: worksheet },
        SheetNames: [fileName],
      }
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'buffer',
      })

      const streamBuffer = new WritableStreamBuffer({
        initialSize: 100 * 1024,
        incrementAmount: 10 * 1024,
      })

      streamBuffer.write(excelBuffer)
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
