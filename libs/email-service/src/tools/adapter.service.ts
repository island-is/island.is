import { readFileSync } from 'fs'
import { globSync } from 'glob'
import handlebars from 'handlebars'
import juice from 'juice'
import { Attachment } from 'nodemailer/lib/mailer'
import { basename, extname } from 'path'

import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { ImageComponent, Template } from '../types'
import registerHelpers from './helpers'

@Injectable()
export class AdapterService {
  private cachedComponents: {
    [name: string]: handlebars.TemplateDelegate
  } = {}
  private cachedImages: {
    [name: string]: string
  } = {}

  constructor(@Inject(LOGGER_PROVIDER) private logger: Logger) {
    registerHelpers(handlebars)

    const path =
      process.env.NODE_ENV !== 'production'
        ? 'libs/email-service/src/tools/design/*.hbs'
        : 'email-service-assets/*.hbs'
    const files = globSync(path)

    files.forEach((file) => this.precompile(file))
  }

  private precompile(path: string) {
    const extension = extname(path)
    const name = basename(path, extension)

    if (!this.cachedComponents[name]) {
      try {
        const component = readFileSync(path, 'utf8')

        this.cachedComponents[name] = handlebars.compile(component)
      } catch (e) {
        this.logger.error(`Error when pre-compiling component ${path}`, e)
      }
    }
  }

  private async convertImageToBase64(path: string) {
    if (!this.cachedImages[path]) {
      try {
        const base64 = readFileSync(path, 'base64')

        this.cachedImages[path] = base64

        return base64
      } catch (e) {
        this.logger.error('Cannot convert this image to base64', e)
        return ''
      }
    }

    return this.cachedImages[path]
  }

  private async buildBody(body: Template['body']) {
    const attachments: Attachment[] = []

    const array = await Promise.all(
      body.map(async (item) => {
        try {
          const component = item.component.toLowerCase()

          if (!this.cachedComponents?.[component]) {
            throw new Error(`This component doesn't exist ${component}`)
          }

          if (component === 'image' || component === 'imagewithlink') {
            const image = item as ImageComponent
            const path = image.context.src
            const filename = basename(path)
            const base64 = await this.convertImageToBase64(path)

            attachments.push({
              filename,
              content: base64,
              encoding: 'base64',
              cid: filename,
            })

            item.context = {
              ...item.context,
              src: `cid:${filename}`,
            }
          }

          if (component === 'spacer') {
            item.context = { ...item.context, nbsp: '\u00A0' }
          }

          return this.cachedComponents[component](item.context, {
            partials: this.cachedComponents,
          })
        } catch (e) {
          this.logger.error('Error when passing context to the template', e)
          throw new Error('Error when passing context to the template')
        }
      }),
    )

    return {
      body: array.join(''),
      attachments,
    }
  }

  private buildLayoutAndInlineCss(title: string, body: string) {
    const template = this.cachedComponents['layout'](
      {
        title,
        body,
        nbsp: '\u00A0',
      },
      { partials: this.cachedComponents },
    )

    // We use juice to inline the css within html
    return juice(template, { preserveImportant: true })
  }

  async buildCustomTemplate(template: Template) {
    const { body, attachments } = await this.buildBody(template.body)

    return {
      html: this.buildLayoutAndInlineCss(template.title, body),
      attachments,
    }
  }
}
