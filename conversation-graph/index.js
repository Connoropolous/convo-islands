
// This file gets built into convo-graph.bundle.js
// To rebuild it, run `npx webpack` from the main directory

const selection = require('./modules/selection')
const authors = require('./modules/authors')
const input = require('./modules/input')
const setFocal = require('./modules/set-focal')
const keyboardShortcuts = require('./modules/keyboard-shortcuts')
const websockets = require('./modules/websocket')
const reloadButton = require('./modules/reload-button')
const { getLayoutForData } = require('../src/index')
const cytoscapeConverter = require('./modules/cytoscape-converter')
const cytoscapeLoader = require('./modules/cytoscape-loader')

const DEFAULT_FOCAL_TOPIC_ID = "_z0k58fv18" // feature ideas
const FOCAL_COORDS = { x: 0, y: 0 }
const GRAPH_DATA_PATH = "/conversation-graph.json"

const getFocalTopicId = () => {
    const searchParams = new URLSearchParams(window.location.search)
    const focalId = searchParams.get(setFocal.FOCAL_ID_PARAMS_KEY)
    return focalId || DEFAULT_FOCAL_TOPIC_ID
}

// fetchAndLoad is an async function (meaning it contains function calls
// that must be performed asynchronously)
const fetchAndLoad = async () => {
    // get the conversation graph data
    // using the built in browser function `fetch`
    // for making HTTP requests
    const response = await fetch(GRAPH_DATA_PATH)

    // convert the conversation graph data into a parsed JSON object
    // (also a built in function, for the `response` object that `fetch` returns)
    // and
    // destructure the JSON object into its component nodes and edges
    const { nodes, edges } = await response.json()

    // put the graph data through our custom layout algorithm
    const positions = getLayoutForData(nodes, edges, getFocalTopicId(), FOCAL_COORDS)

    // convert the result into cytoscape compatible format
    const cytoscapeData = cytoscapeConverter(nodes, edges, positions)

    // create the cytoscape visualization, with the cytoscape friendly data
    return cytoscapeLoader(cytoscapeData)
}

fetchAndLoad().then(cy => {
    // Pass the `cy` cytoscape object into all the remaining modules that require it
    // since most want to fetch or set data to/from it
    keyboardShortcuts(cy)
    reloadButton()
    websockets.init(cy)
    input.init(cy)
    setFocal.init(cy)
    selection.init(cy)
    authors.init()
})

