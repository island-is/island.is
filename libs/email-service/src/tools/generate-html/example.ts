import { resolve } from 'path'

import { Template } from '../../types'

const example: Template['body'] = [
  {
    component: 'Heading',
    context: {
      align: 'left',
      copy: 'This is a heading',
      eyebrow: 'Here is an eybrow',
    },
  },
  {
    component: 'Image',
    context: {
      alt: 'Image alt text',
      src: resolve(__dirname, '../..', 'assets/example.jpg'),
    },
  },
  {
    component: 'Copy',
    context: {
      align: 'left',
      style: 'bold',
      copy: 'Nullam varius dolor eros, vitae faucibus risus viverra eget.',
    },
  },
  {
    component: 'Copy',
    context: {
      align: 'left',
      copy: 'Maecenas sagittis dui vel congue posuere. Phasellus venenatis odio et rutrum dapibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus in egestas risus.',
    },
  },
  {
    component: 'List',
    context: {
      items: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        'Vivamus velit ex, rhoncus id tempus nec, dapibus ut diam',
        'Fusce mollis, nisl non tempus dictum, dolor tortor scelerisque ex, non laoreet turpis arcu eu massa',
      ],
    },
  },
  {
    component: 'Copy',
    context: {
      align: 'left',
      small: true,
      copy: 'Ut at placerat lacus. Nam sollicitudin malesuada elementum. Fusce euismod fringilla lectus ac lobortis. Aliquam posuere convallis dictum. Phasellus volutpat varius velit vel pulvinar. Ut ut rutrum quam. Donec tempus nisl ac tincidunt tempor. Phasellus ultricies ipsum dolor, vitae posuere sem tempus in. Phasellus feugiat ultricies metus a fringilla. Nulla facilisi. Morbi tempor risus nisi, non tincidunt massa egestas at. Cras sollicitudin, sapien eu maximus lacinia, nisl ante tempus odio, non euismod tortor risus sit amet magna.',
    },
  },
  {
    component: 'Button',
    context: {
      copy: 'Click here',
      href: 'https://visir.is',
    },
  },
]

export default example
