import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import Article from '@island.is/web/screens/Article' ///////////////////////////


function Car() {
    return (
        <div className="Car">
          <h3>Iframes in React</h3>
          <iframe frameBorder="0" width="100%" height="1500px" src="https://islandis.featureupvote.com/"></iframe>
        </div>
      );
  }

  
const screen = withMainLayout(Car)

export default withApollo(withLocale('is')(screen))
