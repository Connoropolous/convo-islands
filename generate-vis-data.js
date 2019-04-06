const fs = require('fs') // nodejs file system lib
// import our layout algorithm
const { getLayoutForData } = require('./src/index')
const cytoscapeConverter = require('./cytoscape-converter')
// import our test data
const { nodes, edges } = require('./test-data/big-graph.json')

const focalTopicId = 1
const focalCoords = { x: 0, y: 0 }
const positions = getLayoutForData(nodes, edges, focalTopicId, focalCoords)
const cytoscapeData = cytoscapeConverter(nodes, edges, positions)

// update the graph-vis.js file based off the template file, injecting our
// data into it
const html = fs.readFileSync('./UI/graph-vis.template.js', 'utf-8')
let newhtml = html.replace(/{{data}}/gim, `${JSON.stringify(cytoscapeData)}`)
fs.writeFileSync('./UI/graph-vis.js', newhtml, 'utf-8')
console.log('successfully updated /UI/graph-vis.js with new data, open or refresh UI/index.html to view')


