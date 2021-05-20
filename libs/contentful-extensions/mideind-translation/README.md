# Contentful Extension for Miðeind Machine Translations

This is the Contentful extension responsible for automatic translations of articles from Icelandic to English.
![image](https://user-images.githubusercontent.com/77672665/117131050-6f5a0b00-ad90-11eb-8483-da5dbadd6929.png)

## Deployment

This extension is hosted by Contentful as long as its compilation remains under 512 KB. After that point the extension will have to be hosted in a similar fashion to the [translation](../translation/README.md) extension.

### Configuration and environment variables

You will need to configure your environment variables for Contentful.
This can be done with `yarn run login` and then `yarn run configure`. Make sure you select the correct space and environment.
You will need to have login access to Contentful to do this.

{% hint style="info" %}
You will have to set the `MIDEIND_TOKEN` which allows for connecting to their API, otherwise the extension will not work.
The build step will detect a `.env` file at the root directory.

```bash
# example .env
MIDEIND_TOKEN=ABCDEFGHIJKLMNOPQRSTUVXYZ.123456789
```

{% endhint %}

### Deployment to Contentful

After having run `yarn run configure` you can deploy the extension with `yarn run deploy`. This will publish a new version on Contentful. Make sure the extension name matches the expected name in the affected content models.
