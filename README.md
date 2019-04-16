[![CircleCI](https://circleci.com/gh/Connoropolous/convo-islands.svg?style=svg)](https://circleci.com/gh/Connoropolous/convo-islands)

# convo-islands

clone the repo

`npm install`

`npm run test`

test framework uses `mocha`: https://mochajs.org/#getting-started

## Concept

We have developed the concept of "islands" of conversation. There is a "focal node" which is a node that currently has the users attention.
Other aspects of the islands revolve around this focal node.

An island has the following assumptions at this time:
- all nodes in an island must be direct ancestors, or direct descendants, of the focal node
- cousins of the focal node are not going to be included in that island

## Visualizing

Run `node generate-vis-data.js`
Then open `UI/index.html` in a browser.

How it works: it takes the data from `test-data/big-graph.json` and feeds it through our algorithm, then writes that data to the `UI/graph-vis.js` file, after injecting the values into the `graph-vis.template.js` template for that file.

## Live Testing and Having "Conversation"

Run `node editor-server.js` and then open `localhost:3000`.

Add responses one at a time. You can add 'unrelated' thoughts, by NOT having any node selected, typing in the text area, then hitting submit.

OR

You can submit a related 'reply' response by selecting a node, then typing in the text area, then hitting submit.

The conversation graph is stored in `conversation-graph/conversation-graph.json`.


## Next Steps
- [ ]
