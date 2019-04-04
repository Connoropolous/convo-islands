const {
    getLayoutForData
} = require('./index')


const { nodes, edges } = require('./test-data/big-graph.1.json')

const focalTopicId = 5
const focalCoords = { x: 0, y: 0 }
const positions = getLayoutForData(nodes, edges, focalTopicId, focalCoords)

const mappedNodes = nodes.map((node) => {
    return {
        data: {
            ...node // The ID from the node
        },
        position: {
            ...positions[node.id] //The x:,y: from the positions
        }
    }
})

const mappedEdges = edges.map((edge, index) => {
    return {
        data: {
            id: "edge" + index,
            source: edge.topic1_id,
            target: edge.topic2_id
        }
    }
})

console.log(mappedNodes.concat(mappedEdges))


