const fs = require('fs') // nodejs file system lib
// import our layout algorithm
const { getLayoutForData } = require('./src/index')
// import our test data
const { nodes, edges } = require('./test-data/big-graph.1.json')


const focalTopicId = 6
const focalCoords = { x: 0, y: 0 }
const positions = getLayoutForData(nodes, edges, focalTopicId, focalCoords)

// combine the nodes with their positions, creating a
// cytoscape compatible list of nodes
const mappedNodes = nodes.map((node) => {
    return {
        data: {
            ...node // copy the ID (and potentially other properties) from the node
        },
        position: {
            ...positions[node.id] // copy the x:,y: from the positions object
        }
    }
})

// create a cytoscape compatible list of edges
const mappedEdges = edges.map((edge, index) => {
    return {
        data: {
            id: "edge" + index,
            source: edge.from,
            target: edge.to
        }
    }
})

// combine the nodes and edges list into a single array
// which is the cytoscape compatible format
const cytoscapeData = mappedNodes.concat(mappedEdges)

// update the graph-vis.js file based off the template file, injecting our
// data into it
const html = fs.readFileSync('./UI/graph-vis.template.js', 'utf-8')
let newhtml = html.replace(/{{data}}/gim, `${JSON.stringify(cytoscapeData)}`)
fs.writeFileSync('./UI/graph-vis.js', newhtml, 'utf-8')
console.log('successfully updated /UI/graph-vis.js with new data, open or refresh UI/index.html to view')


