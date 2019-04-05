const lodash = require('lodash')

// edges = [{ from: 4, to: 5, category: 'from-to', desc: 'has reply' }]

// recursively use an edge list to generate a tree structure of a node and its ancestors and descendants
// only the root node should have getParents = true and getChildren = true
// if it is in the child direction, getChildren should be true and getParents = false
// and vice versa
const addParentsAndChildren = (usedNodes, edges, node, getParents = true, getChildren = true, degreeFromFocus = 0) => {
    if (!node.id) return node

    let newUsedNodes = {
        ...usedNodes,
        [node.id]: true
    }

    node.degreeFromFocus = degreeFromFocus
    const nextDegree = degreeFromFocus + 1

    if (getChildren) {
        // add an empty list of children
        node.children = []
        edges
            // look inside the list of edges for the ones
            // that represent parent-child relationships
            // where the current node is the parent
            // and filter to just an array of those edges
            .filter(synapse => {
                return synapse.from === node.id
                    && !newUsedNodes[synapse.to]
                    && synapse.category === 'from-to'
            })
            // convert that array into an array of the
            // ids of those children
            .map(synapse => synapse.to)
            // iterate on that array
            // creating a node from that id
            // and adding it to the array of
            // children
            .forEach(childId => {
                // get that node as a child by recursing
                const result = addParentsAndChildren(newUsedNodes, edges, { id: childId }, false, true, nextDegree)
                // override the usedNodes list, with the new list
                newUsedNodes = result.usedNodes
                // add the new child to the children array
                node.children.push(result.node)
            })

        node.children = lodash.orderBy(node.children, 'maxDescendants', 'desc')
        node.maxDescendants = node.children.length ? node.children[0].maxDescendants + 1 : 0
    }

    if (getParents) {
        // add an empty list of parents
        node.parents = []
        edges
            // look inside the list of edges for the ones
            // that represent parent-child relationships
            // where the current node is the child
            // and filter to just an array of those edges
            .filter(synapse => {
                return synapse.to === node.id
                    && !newUsedNodes[synapse.from]
                    && synapse.category === 'from-to'
            })
            // convert that array into an array of the
            // ids of those children
            .map(synapse => synapse.from)
            // iterate on that array
            // creating a node from that id
            // and adding it to the array of
            // children
            .forEach(parentId => {
                // get that node as a parent by recursing
                const result = addParentsAndChildren(newUsedNodes, edges, { id: parentId }, true, false, nextDegree)
                // override the usedNodes list, with the new list
                newUsedNodes = result.usedNodes
                // add the new parent to the parents array
                node.parents.push(result.node)
            })

        node.parents = lodash.orderBy(node.parents, 'maxAncestors', 'desc')
        node.maxAncestors = node.parents.length ? node.parents[0].maxAncestors + 1 : 0
    }

    if (getParents && getChildren) {
        node.longestThread = node.maxDescendants + node.maxAncestors + 1
    }

    return {
        node,
        usedNodes: newUsedNodes
    }
}
module.exports.addParentsAndChildren = addParentsAndChildren


const generateLayoutObject = (nodes, edges, focalNodeId) => {
    let layout = [] // will be the final output
    // will act as a store of the nodes that have been placed into islands
    // to begin with, no nodes have been placed into islands
    let usedNodes = {}

    // start with the focal node, and build its island
    const currentNode = nodes.find(node => node.id === focalNodeId)
    if (!currentNode) {
        throw new Error(`a node with id ${focalNodeId} was not found in the array of nodes`)
    }
    const result = addParentsAndChildren(usedNodes, edges, { id: currentNode.id })
    // to avoid side effects, calling addParentsAndChildren
    // also returns the new "list" of usedNodes
    usedNodes = result.usedNodes
    layout.push(result.node)

    // right now there's no reasoning going on about the selection of focal nodes
    // its just whichever ones happen to be found in the array first
    nodes
        .filter(node => node && node.id && !usedNodes[node.id])
        .forEach((node) => {
            const result = addParentsAndChildren(usedNodes, edges, { id: node.id })
            usedNodes = result.usedNodes
            layout.push(result.node)
        })

    return layout
}
module.exports.generateLayoutObject = generateLayoutObject