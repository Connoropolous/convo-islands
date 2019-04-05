const lodash = require('lodash')

// edges = [{ from: 4, to: 5, category: 'from-to', desc: 'has reply' }]

// CONSTANTS
const CHILDREN_KEY = 'children'
const PARENTS_KEY = 'parents'
const MAX_ANCESTORS_KEY = 'maxAncestors'
const MAX_DESCENDANTS_KEY = 'maxDescendants'
const EDGE_FROM_KEY = 'from'
const EDGE_TO_KEY = 'to'


// plays recursively with addParentsAndChildren, which also calls this function
const recurseUpOrDown = (edges, arrayKey, directionKeys, maxKey, usedNodes, node, toGet) => {
    // add an empty list of relatives
    // to the node, which we will populate
    // if there are any to populate it with from the edge list
    let newNode = {
        ...node,
        [arrayKey]: []
    }
    // make no changes to usedNodes list at this point
    // but changes will be made within this function
    let newUsedNodes = {
        ...usedNodes
    }

    edges
        // look inside the list of edges for the ones
        // that represent parent-child relationships
        // and filter to just an array of those edges
        .filter(edge => edge[directionKeys[0]] === newNode.id
            && !newUsedNodes[edge[directionKeys[1]]]
            && edge.category === 'from-to')
        // convert that array into an array of the
        // ids of those relatives
        .map(edge => edge[directionKeys[1]])
        // iterate on that array
        // creating a node from that id
        // and adding it to the array of
        // relatives
        .forEach(relativeId => {
            // get that node as a relative by recursing
            const result = addParentsAndChildren(newUsedNodes, edges, { id: relativeId }, node.degreeFromFocus + 1, toGet)
            // override the usedNodes list, with the new list
            newUsedNodes = result.usedNodes
            // add the new relative to the relatives array
            newNode[arrayKey].push(result.node)
        })

    // sort the relatives array by the ones with the longest threads to the shortest (desc is short for descending)
    newNode[arrayKey] = lodash.orderBy(newNode[arrayKey], maxKey, 'desc')
    // set the max in the direction (maxDescendants or maxAncestors) to be equal to 0 if there are
    // none, and to be one greater than the max relatives if there is some
    // this is possible because of the sorting we do above
    newNode[maxKey] = newNode[arrayKey].length > 0 ? newNode[arrayKey][0][maxKey] + 1 : 0

    return {
        node: newNode,
        usedNodes: newUsedNodes
    }
}


// recursively use an edge list to generate a tree structure of a node and its ancestors and descendants
// only the root node should have getParents = true and getChildren = true
// if it is in the child direction, getChildren should be true and getParents = false
// and vice versa
const addParentsAndChildren = (usedNodes, edges, node, degreeFromFocus = 0, toGet = { children: true, parents: true }) => {
    // assigns a degreeFromFocus to the node,
    // which refers to degrees of separation from the focused node
    // e.g. grandchild -> grandparent = 2 degrees of separation
    let newNode = {
        ...node,
        degreeFromFocus
    }
    // declares this node as being "used" in the layout
    // before getting into anything recursive
    let newUsedNodes = {
        ...usedNodes,
        [newNode.id]: true
    }
    const recurseRelatives = (arrayKey, directionKeys, maxKey, innerToGet) => {
        const relativesResult = recurseUpOrDown(edges, arrayKey, directionKeys, maxKey, newUsedNodes, newNode, innerToGet)
        newUsedNodes = relativesResult.usedNodes
        newNode = relativesResult.node
    }
    if (toGet.children) {
        recurseRelatives(CHILDREN_KEY, [EDGE_FROM_KEY, EDGE_TO_KEY], MAX_DESCENDANTS_KEY, { children: true, parents: false })
    }
    if (toGet.parents) {
        recurseRelatives(PARENTS_KEY, [EDGE_TO_KEY, EDGE_FROM_KEY], MAX_ANCESTORS_KEY, { children: false, parents: true })
    }
    if (toGet.children && toGet.parents) {
        newNode.longestThread = newNode.maxDescendants + newNode.maxAncestors + 1
    }
    return {
        node: newNode,
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