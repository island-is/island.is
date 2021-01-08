# GitBook Contributions

Adding new content to the handbook (hosted on GitBook at [docs.devland.is](https://docs.devland.is)) is very straight forward.

## Contributing

The documentation works in two different ways:

- `Handbook` which contains all the documentation regarding all the island.is projects. You will find technical overview, architectural decisions, api, devops, code reviews, code standards detailed information and much more. If you need to edit an existing documentation or create a new page inside the handbook directory, you simply have to create a `markdown` file and start writing your content.

- `README.md` which are all the readmes from the `apps` and `libs` directories contained in the sub folders. The same goes for the README.md. Simply add your content using markdown. We only recommend one thing, is to use [this template](../misc/gitbook-template.md) when you create a new app in the `apps` directory.

## Publishing

Once you are done with your changes, you will need to run the following command:

```bash
yarn gitbook
```

It will check for any new files created inside the `handbook` directory or new `README.md` located inside the `apps` or `libs` directories and add it to the `SUMMARY.md` file, which is the file used by GitBook to create the navigation structure.

The script will also format the README.md's title to follow the [APA style convention](https://en.wikipedia.org/wiki/APA_style). All files added the the `SUMMARY.md` will be alphabetically ordered and organised in folders/sub-folders for the `apps` and `libs`.

After your commit get merged into `main`, it will take a few minutes before your changes appears on [docs.devland.is](https://docs.devland.is).

{% hint style="info" %}
For some reason, if you don't want your markdown file to be part of the `SUMMARY.md` file and included inside the GitBook, you can add a html comment as the first line of the file `<!-- gitbook-ignore -->` to ignore.
{% endhint %}

{% hint style="warning" %}
We have an open issue to run this script automatically on our CI pipeline, so you won't have to do it manually.

Since the command is not run automatically at the moment, when running it manually, you might have a lot of new markdown files changed by the formatting script and added to the `SUMMARY.md` file. In this case, simply keep the changes related to your changes and checkout the rest.
{% endhint %}
