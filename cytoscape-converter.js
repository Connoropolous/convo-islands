

module.exports = function (nodes, edges, positions) {
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

    return cytoscapeData
}