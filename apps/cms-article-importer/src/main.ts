import readXlsxFile from 'read-excel-file/node'
import curry from 'curry'
import Bottleneck from 'bottleneck'
import slugifyFunction from 'slugify'
import { ContentfulImporter } from '@island.is/contentful-importer'
import { environment } from './environments/environment'

const { accessToken, spaceId, environmentId } = environment

const slugify = (text) => slugifyFunction(text, { lower: true })
const getPages = (data, column) => {
  let currentGroup = 'none'
  return data.reduce(
    (groupedData, row) => {
      const cell = row[column]
      if (!isNaN(parseFloat(cell)) && isFinite(cell)) {
        // if cell content is numeric it is an id add it to current group
        groupedData[currentGroup].push(cell)
      } else if (cell) {
        // if cell is not null it is a string
        currentGroup = cell
        groupedData[currentGroup] = []
      } else {
        // the cell is null and we no longer have a group
        currentGroup = 'none'
      }
      return groupedData
    },
    { none: [] },
  )
}

const getGroups = (data) => {
  // get the top level categories
  const categories = data.shift()

  // find sub categories for each categories
  return categories.reduce((groupedCategories, category, index) => {
    groupedCategories[category] = getPages(data, index)
    return groupedCategories
  }, {})
}

const getDataFromExcelFile = () => {
  const dataFile = './import_data.xlsx'
  const sheets = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16]
  return Promise.all(
    sheets.map((sheet) => {
      return readXlsxFile(dataFile, { sheet })
    }),
  )
}

const createCategorizedData = (data) => {
  return data.reduce((groupedGategories, categoryData) => {
    // first cell in first row contains category name we remove it to ease grouping
    const topLevelCategory = categoryData.shift()[0]
    groupedGategories[topLevelCategory] = getGroups(categoryData)
    return groupedGategories
  }, {})
}

const createContentfulField = (type, value) => ({ type, value })

const dataFileField = curry((data, fieldName) => {
  const dataFileFieldMap = {
    id: 0,
    title: 1,
    orginalCategory: 2,
    ministry: 3,
    processType: 4,
    organization: 5,
    audience: 6,
    summary: 7,
    body: 8,
    processLink: 9,
    language: 17,
    translationId: 18,
  }
  return data[dataFileFieldMap[fieldName]]
})

const groupDataByContentTypes = (groupedCategories, articlesContent) => {
  const categoriesData = []
  const groupsData = []
  const articlesData = []
  const organizationData = {}
  for (const [category, groups] of Object.entries(groupedCategories)) {
    // create category import data
    categoriesData.push(category)
    for (const [group, articles] of Object.entries(groups)) {
      // create group import data
      groupsData.push(group)
      for (const [title, articleIds] of Object.entries(articles)) {
        // some groups have no articles dont try to create articles
        if (!articleIds.length) {
          continue
        }

        const organizations = {}
        const content = []
        for (const id of articleIds) {
          const pageData = articlesContent.find(
            (row) => dataFileField(row, 'id') === id,
          )

          if (!pageData) {
            console.log('No data for id', id)
            continue
          }

          const getDataField = dataFileField(pageData)
          const organization = getDataField('organization')

          // add organization as key to group tags
          if (organization) {
            organizations[organization] = organization
          }

          content.push({
            id: getDataField('id'),
            title: getDataField('title'),
            orginalCategory: getDataField('orginalCategory') ?? '',
            ministry: getDataField('ministry') ?? '',
            processType: getDataField('processType') ?? '',
            audience: getDataField('audience') ?? '',
            summary: getDataField('summary') ?? '',
            body: getDataField('body') ?? '',
            processLink: getDataField('processLink') ?? '',
            language: getDataField('language') ?? '',
            translationId: getDataField('translationId') ?? '',
            organization: organization ?? '',
          })
        }

        // add organizations to organization tag list
        const uniqueOrganizations = Object.keys(organizations)
        for (const organization of uniqueOrganizations) {
          organizationData[organization] = organization
        }

        // we create an object to use as reference when we create the contentful article object
        articlesData.push({
          contentId: articleIds.join(''), // so we can map content blocks to this page later
          organizations: uniqueOrganizations, // one page can belong to multiple organizations
          title,
          group,
          category,
          content,
        })
      }
    }
  }
  return {
    articleCategory: categoriesData,
    articleGroup: groupsData,
    organization: Object.keys(organizationData), // we use object to group the tags
    articles: articlesData,
  }
}

const createContentTypeMap = (keys, entities) => {
  return entities.reduce((map, entity, index) => {
    if (!map[keys[index]]) {
      map[keys[index]] = []
    }
    map[keys[index]].push(entity.sys.id)
    return map
  }, {})
}

const createContentfulTag = (tagArray) => {
  return tagArray.map((tag) => ({
    title: createContentfulField('text', tag),
    slug: createContentfulField('text', slugify(tag)),
  }))
}

const connectedImport = curry(
  async (connection, contentTypeId, contentTypes) => {
    const limiter = new Bottleneck({
      minTime: 120, // contentful is limited to 10 request per second, we limit request count to prevent errors
    })

    return Promise.all(
      contentTypes.map((contentType) => {
        return limiter.schedule(() =>
          connection.importContentType(contentTypeId, contentType),
        )
      }),
    )
  },
)

const getContentfulConnection = async () => {
  // create connection with contentful
  const contentfulOptions = {
    accessToken,
    spaceId,
    environmentId,
  }
  const contentfulImporter = new ContentfulImporter(contentfulOptions)
  const connection = await contentfulImporter.connect()
  return connectedImport(connection)
}

const getContentfulProcessType = (type) => {
  const typeMap = {
    'Stafræn þjónusta': 'Digital',
    'Eyðublað á pappír': 'Not digital',
    'Eyðublað á pappír|Stafræn þjónusta': 'Not digital',
  }
  return typeMap[type] ?? 'Not digital'
}

const createContentfulProcessEntriesContentTypes = (articles) => {
  return articles.reduce(
    (data, article) => {
      for (const content of article.content) {
        // Add goverment process entry point type
        data.content.push({
          title: createContentfulField('text', content['title']),
          subtitle: createContentfulField('text', ''),
          details: createContentfulField('html', { content: content['body'] }),
          type: createContentfulField(
            'text',
            getContentfulProcessType(content['processType']),
          ),
          processTitle: createContentfulField('text', content['title']),
          processDescription: createContentfulField('text', content['summary']),
          processLink: createContentfulField('text', content['processLink']),
        })
        data.map.push(article.contentId)
      }
      return data
    },
    {
      map: [],
      content: [],
    },
  )
}

const createContentfulArticleContentTypes = (articles, maps) => {
  return articles.map((article) => {
    return {
      title: createContentfulField('text', article.title),
      slug: createContentfulField('text', slugify(article.title)),
      content: createContentfulField('html', {
        content: '',
        references: maps['processEntry'][article.contentId],
      }), // <- content blocks as references
      group: createContentfulField(
        'reference',
        maps['articleGroup'][article.group][0],
      ), // can only have one value
      category: createContentfulField(
        'reference',
        maps['articleCategory'][article.category][0],
      ), // can only have one value
      organization: createContentfulField(
        'reference',
        article.organizations.map(
          (organization) => maps['organization'][organization][0],
        ),
      ), // can have nultiple values
    }
  })
}

/**
 * The importer will group data from excel sheets into categories and groups
 * We then convert the groups and categories into Contentful content type objects and import
 * We store the entry ids for groups and categories so we can reference them when we create the articles
 * We the pull out data that requires dynamic content blocks and import using the same method as above
 * We then populate the articles with data provided by the excel sheet and add refrences as needed from previous steps
 * As a last step articles are imported
 */
const main = async () => {
  // get all required sheets from excel file
  const data = await getDataFromExcelFile()
  // first sheet contains all pages data
  const articlesContent = data.shift()
  const categorizedData = createCategorizedData(data)
  const { articles, ...allTags } = groupDataByContentTypes(
    categorizedData,
    articlesContent,
  )

  // get contentful connection so we can import data
  const importContentType = await getContentfulConnection()
  const tagsMap = {}
  for (const [contentType, tags] of Object.entries(allTags)) {
    const contentfulTags = createContentfulTag(tags)

    console.log('Importing tags', contentType, contentfulTags.length)

    // import categories and create map of entity ids
    const tagEntities = await importContentType(contentType, contentfulTags)
    tagsMap[contentType] = createContentTypeMap(tags, tagEntities)
  }

  // create the required content blocks for pages
  const contentfulProcessEntries = createContentfulProcessEntriesContentTypes(
    articles,
  )

  console.log(
    'Importing content blocks',
    contentfulProcessEntries.content.length,
  )

  const processEntryEntities = await importContentType(
    'processEntry',
    contentfulProcessEntries.content,
  )
  const processEntryMap = createContentTypeMap(
    contentfulProcessEntries.map,
    processEntryEntities,
  )

  const contentfulArticles = createContentfulArticleContentTypes(articles, {
    processEntry: processEntryMap,
    ...tagsMap,
  })
  console.log('Importing articles', contentfulArticles.length)

  const articleEntries = await importContentType('article', contentfulArticles)

  console.log('Done!')

  return true
}
main()
