# Code Reviews

Code reviews are a valuable tool for improving code quality and sharing knowledge across the teams working on the codebase. There are tons of best practices available online, but over time each company (or as in this case a swarm of companies working in the same codebase) adopts practices which suits their needs and culture.

## Culture

Code reviews lose all their value if nobody feels motivated to comment on code that they feel needs improvements or further explaining, or if these comments have a negative effect on the programmer who committed the code.

Reviews should be concise and written in neutral language. Critique the code, not the author. When something is unclear, ask for clarification rather than assuming ignorance.

There are many programmers contributing to this repository, people who have different backgrounds, culture and personalities. It is very likely that without a common code review etiquette, people will receive comments on their pull requests that might offend them, when the commenter meant no harm, or accidentally chose some unfortunate words.

To minimize the likelihood of this happening we want to apply the following language when reviewing code committed by programmers you do not know:

- Start comments with `Consider:` where you want to share knowledge, or do not have a strong opinion on if this change is necessary in order to get an approval for the pull request.
- Start comments with `Should:` where the code in question should be changed because it is buggy, has some dangerous side effect or introduces a bad performance hit. These types of comments often spark a discussion, so try to keep it positive and rational. If you cannot back this comment on with meaningful arguments, you _should_ not have made this comment to begin with.

## Code Coverage

Code coverage is a measurement used to express which lines of code were executed by a test suite.

Code coverage is measured by the test runner which can be configured to generate a coverage report at the end of a test run.

Even though the coverage report can be viewed in a browser by itself it is quite limited.

To enhance the experience we use a code coverage tool called [Codecov](https://about.codecov.io/).

The main features are listed below and instructions on how to use them.

### Dashboard

The [Codecov dashboard](https://app.codecov.io/gh/island-is/island.is/) shows us an aggregated coverage report of all the apps and libraries in the monorepo.

### Pull request comments

The be able to read through a Codecov pull request comment we need to understand Codecov's coverage diff and calculations regarding hits, misses and partials. See the [documentation](https://docs.codecov.com/docs/codecov-delta) for details.

Basically hits are lines are covered by tests, misses are lines that are not covered with tests and partials are lines partially covered with tests.

To calculate the coverage ratio we do `hits / (hits + misses + partials)`

Here is a [coverage diff](https://docs.codecov.com/docs/coverage-diff) to use as a reference while trying out these calcuations.

### Merge checks

Currently merge checks are not configured.
