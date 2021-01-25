# contentful-translation-extension

This is the Contentful extension responsible of translations for namespaces for your application. It works in pair with the [localization](../localization/README.md) library.

![](https://user-images.githubusercontent.com/937328/105497145-626c4c80-5cb6-11eb-8df8-1b8f19076768.png)

## Usage

The following commands are handle using contentful's [`contentful-extension-scripts`](https://github.com/jeremybarbet/create-contentful-extension). It uses a custom `tsconfig.json` and not the shared one from the root project.

{% hint style="warning" %}
To be able to run the `start` and `deploy` commands you will need to pass a `managementToken`.
{% endhint %}

### Start

Will start the local development server. You are then able to go to Contentful to see your changes.

```bash
yarn start contentful-translation-extension --token managementToken
```

{% hint style="warning" %}
Be careful, once you are running this command, it will replaces the production's extension and only the local extension will be accessible. In short, others users trying to display the extension in their contentful dashboard will get an error message.
{% endhint %}

### Build

Bundles the extension's files.

```bash
yarn build contentful-translation-extension
```

### Deploy

Will build and deploy the changes to Contentful. If you want your extension to be hosted by contentful it has to be under 512KB.

```bash
yarn deploy contentful-translation-extension --token managementToken
```
