# Email Service

## About

This library defines the emailService, which allows its users to send email using nodemailer.

The service currently supports the following transports:

- AWS SES
- Nodemailer's test account
- NodemailerApp

You can easily be extended to include other transports supported by nodemailer.

## NestJS Standalone - not recommended

Add `EmailModule` to your Module imports:

```typescript
@Module({
  imports: [EmailModule],
})
```

Add `emailModuleConfig` to your App Module imports:

```typescript
@Module(
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [emailModuleConfig],
    }),
  ]
)
```

## Test account

You can get a preview link in the console by setting the following environment variable:

```bash
EMAIL_USE_TEST_ACCOUNT=true
```

When using the `sendEmail` method, the email will use [Ethereal](https://ethereal.email/) and return a link where you will be able to preview the email on their website.

## NodemailerApp

You can use the [nodemailer app](https://nodemailer.com/app/) to preview the emails sent on your local environment. When using the `sendEmail` method, the emails sent will be visible in the UI.

![NodemailerApp example](https://user-images.githubusercontent.com/937328/123276714-f310b800-d4f4-11eb-88ad-1299ae7f75f5.png)

To use the app:

- Install the NodemailerApp from the link above
- Add the following environnement variable:

```bash
USE_NODEMAILER_APP=true
```

## Design template

Instead of sending raw html, you are able to use a few components based on this [Figma design](https://www.figma.com/file/ine6cGn7cnrJJK43fzUZTF/Templates-%2F-h%C3%B6nnunarkerfi-fyrir-ums%C3%B3knir?node-id=1258%3A24214).

The following components and their props are available:

- Image

```typescript
{
  component: 'Image',
  context: {
    src: 'image-path',
    alt: 'Alt text',
  },
}
```

- Heading

```typescript
{
  component: 'Heading',
  context: {
    copy: 'A mind-blowing heading',
    align: 'left' | 'center' | 'right'
    small: false
    eyebrow: 'A tiny bit of text displayed above the heading'
  },
}
```

- Copy

```typescript
{
  component: 'Copy',
  context: {
    copy: 'Some beautiful lorem ipsum',
    align: 'left' | 'center' | 'right'
    small: false
    eyebrow: 'A tiny bit of text displayed above the heading'
  },
}
```

- Button

```typescript
{
  component: 'Button',
  context: {
    copy: 'Button copy',
    href: 'Button url',
  },
}
```

- Subtitle

```typescript
{
  component: 'Subtitle'
  context: {
    copy: 'Some text - esp. suited for application-related emails'
    application: 'Name of an application'
  }
}
```

- Bulleted list

```typescript
{
  component: 'List'
  context: {
    items: ['Item 1', 'Item 2']
  }
}
```

To use theses components, define a template object in your email message, instead of the html object:

```typescript
const message = {
  to: 'recipient@gmail.com',
  ...
  template: {
    title: 'Email title',
    body: [
      {
        component: 'Image',
        context: {
          src: 'logo.jpg',
          alt: 'Logo name',
        },
      },
      {
        component: 'Heading',
        context: {
          copy: 'Email heading',
        },
      },
    ],
  }
}
```

{% hint style="info" %}
[Email example](https://github.com/island-is/island.is/blob/main/libs/application/template-api-modules/src/lib/modules/templates/parental-leave/emailGenerators/assignEmployerEmail.ts) for the parental leave application.
{% endhint %}

## Generate an example email template into an html file

If you are curious to see what your template will look like or simply want to play around with the template components you can modify `libs/email-service/src/tools/generate-html/example.ts` and then run:

```bash
yarn nx run email-service:generate-html
```

Once generated, the output html file will appear in `libs/email-service/src/tools/generate-html/output`

### Under the hood

It is based on [Foundation emails template](https://github.com/foundation/foundation-emails) and Handlebars to create each components. The foundation based styles has been minified and is coming from [here](https://github.com/jeremybarbet/foundation-emails/tree/master). Is has been minified and embed within `foundation.hbs` to avoid adding heavy CSS preprocessor/pipeline to handle everything. We are using [Juice](https://github.com/Automattic/juice) to inline the styles within the HTML, not because we like inline CSS, but because emails.

## Code owners and maintainers

- [Kolibri](https://github.com/orgs/island-is/teams/kolibri/members)
