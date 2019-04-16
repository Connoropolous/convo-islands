
// This file gets built into convo-graph.bundle.js

const selection = require('./modules/selection')
const authors = require('./modules/authors')
const input = require('./modules/input')
const keyboardShortcuts = require('./modules/keyboard-shortcuts')
const websockets = require('./modules/websocket')
const reloadButton = require('./modules/reload-button')
const { getLayoutForData } = require('../src/index')
const cytoscapeConverter = require('./modules/cytoscape-converter')
const cytoscapeLoader = require('./modules/cytoscape-loader')

const FOCAL_TOPIC_ID = "_z0k58fv18" // feature ideas
const FOCAL_COORDS = { x: 0, y: 0 }
const GRAPH_DATA_PATH = "/conversation-graph.json"

// fetchAndLoad is an async function (meaning it contains function calls
// that must be performed asynchronously)
const fetchAndLoad = async () => {
    // get the conversation graph data
    const res = await fetch(GRAPH_DATA_PATH)

    // convert the conversation graph data into a parsed JSON object
    // and
    // destructure the JSON object into its component nodes and edges
    const { nodes, edges } = await res.json()

    // put the graph data through our custom layout algorithm
    const positions = getLayoutForData(nodes, edges, FOCAL_TOPIC_ID, FOCAL_COORDS)

    // convert the result into cytoscape compatible format
    const cytoscapeData = cytoscapeConverter(nodes, edges, positions)

    // create the cytoscape visualization, with the cytoscape friendly data
    return cytoscapeLoader(cytoscapeData)
}

fetchAndLoad().then(cy => {
    // Pass the `cy` cytoscape object into all the remaining modules that require it
    // since most want to fetch or set data to/from it
    keyboardShortcuts(cy)
    websockets(cy)
    reloadButton()
    input.init(cy)
    selection.init(cy)
    authors.init()
})

