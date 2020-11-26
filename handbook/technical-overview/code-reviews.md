# Code reviews

Code reviews are a valuable tool for improving code quality and sharing knowledge across the teams working on the codebase. There are tons of best practices available online, but over time each company (or as in this case a swarm of companies working in the same codebase) adopts practices which suits their needs and culture.

## Culture

Code reviews lose all their value if nobody feels motivated to comment on code that they feel needs improvements or further explaining, or if these comments have a negative effect on the programmer who committed the code.

Reviews should be concise and written in neutral language. Critique the code, not the author. When something is unclear, ask for clarification rather than assuming ignorance.

There are many programmers contributing to this repository, people who have different backgrounds, culture and personalities. It is very likely that without a common code review etiquette, people will receive comments on their pull requests that might offend them, when the commenter meant no harm, or accidentally chose some unfortunate words.

To minimize the likelihood of this happening we want to apply the following language when reviewing code committed by programmers you do not know:

- Start comments with `Consider:` where you want to share knowledge, or do not have a strong opinion on if this change is necessary in order to get an approval for the pull request.
- Start comments with `Should:` where the code in question should be changed because it is buggy, has some dangerous side effect or introduces a bad performance hit. These types of comments often spark a discussion, so try to keep it positive and rational. If you cannot back this comment on with meaningful arguments, you _should_ not have made this comment to begin with.
