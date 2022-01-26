import { join } from 'path'
import fs from 'fs'
import util from 'util'
import { Test } from '@nestjs/testing'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Template } from '../types'
import { AdapterService } from '../tools/adapter.service'
import { EmailService, EMAIL_OPTIONS } from './email.service'

const writeFile = util.promisify(fs.writeFile)

const body: Template['body'] = [
  {
    component: 'Heading',
    context: {
      copy: 'This is the heading',
      align: 'left',
      eyebrow: 'This is the eyebrow',
    },
  },
  {
    component: 'Image',
    context: {
      alt: 'Image alt text',
      src: join(__dirname, `./notification.jpg`),
    },
  },
  {
    component: 'Heading',
    context: {
      copy: 'This is a small heading with no eyebrow and aligned to the right',
      align: 'right',
      small: true,
    },
  },
  {
    component: 'Heading',
    context: {
      copy: 'This is a heading that is centered',
      align: 'center',
    },
  },
  {
    component: 'List',
    context: {
      items: [
        'Here is an item in the list',
        'Here is another item in the list',
        'And a third',
      ],
    },
  },
  {
    component: 'Subtitle',
    context: {
      application: 'application',
      copy: 'This is a subtitle',
    },
  },
  {
    component: 'Button',
    context: {
      copy: 'Here is a button',
      href: 'https://visir.is',
    },
  },
  {
    component: 'Copy',
    context: {
      align: 'left',
      copy:
        'Komið er upp hópsmit í fangelsinu að Litla Hrauni. Fangar eru afar ósáttir við þær sóttvarnaaðgerðir sem verið er að grípa til og sætta sig illa við einangrun.',
    },
  },
  {
    component: 'Copy',
    context: {
      align: 'left',
      style: 'bold',
      copy:
        'Þetta er samkvæmt heimildum Vísis en staðan í fangelsinu í morgun var sú að föngum var ekki hleypt út úr klefum sínum í morgun. Og fylgdir það sögunni að þeir hafi ekki fengið morgunmat á þeim tíma sem þeir eru vanir.',
    },
  },
  {
    component: 'Copy',
    context: {
      style: 'italic',
      copy:
        'Komið er upp hópsmit í fangelsinu að Litla Hrauni. Fangar eru afar ósáttir við þær sóttvarnaaðgerðir sem verið er að grípa til og sætta sig illa við einangrun.',
    },
  },
  {
    component: 'Copy',
    context: {
      small: true,
      copy:
        'Þetta er samkvæmt heimildum Vísis en staðan í fangelsinu í morgun var sú að föngum var ekki hleypt út úr klefum sínum í morgun. Og fylgdir það sögunni að þeir hafi ekki fengið morgunmat á þeim tíma sem þeir eru vanir.',
    },
  },
  {
    component: 'Image',
    context: {
      alt: 'Image alt text',
      src: join(__dirname, `./notification.jpg`),
    },
  },
]

describe('EmailService', () => {
  let emailService: EmailService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: EMAIL_OPTIONS,
          useValue: {
            useTestAccount: true,
          },
        },
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        AdapterService,
      ],
    }).compile()

    emailService = module.get(EmailService)
  })

  it('should make a file...', async () => {
    const rendered = await emailService.renderBody({
      title: 'bla',
      body,
    })

    await writeFile(join('./bla.html'), rendered, { encoding: 'utf-8' })

    expect(true).toBe(true)
  })
})
