const assert = require('assert')
const sinon = require('sinon')

const {
    // TODO: every single one of the following should be tested
    addParentsAndChildren,
    generateLayoutObject,
} = require('./layout-data')
const {
    // TODO: every single one of the following should be tested
    positionTopic,
    yForX,
    generateObjectCoordinates,
    positionIslandsByBounds,
    traverseIsland,
    translateCoord,
    adjustIslandBounds,
} = require('./coordinates')
const { getLayoutForData } = require('./index')

// for object and array comparison, use assert.deepEqual
// for simple value comparison, use assert.equal

describe('traverseIsland', function () {
    it('calls a given callback function for every node in an island', function () {
        const island = {
            id: 1,
            degreeFromFocus: 0,
            children: [{
                id: 2,
                degreeFromFocus: 1,
                children: [],
                maxDescendants: 0
            }],
            maxDescendants: 1,
            parents: [{
                id: 3,
                degreeFromFocus: 1,
                parents: [],
                maxAncestors: 0
            }],
            maxAncestors: 0,
            longestThread: 2
        }
        const forEachInIsland = sinon.fake()
        traverseIsland(island, forEachInIsland)
        // forEachInIsland should now have been called 3 times
        // once for each node in the island
        assert.equal(forEachInIsland.callCount, 3)

        // for the root node, parent and child are undefined
        assert.equal(forEachInIsland.firstCall.args[0].id, 1)
        assert.equal(forEachInIsland.firstCall.args[1], undefined)
        assert.equal(forEachInIsland.firstCall.args[2], undefined)

        // for parents, descendant is in the 'child' argument, the thir
        assert.equal(forEachInIsland.secondCall.args[0].id, 3)
        assert.equal(forEachInIsland.secondCall.args[1], undefined)
        assert.equal(forEachInIsland.secondCall.args[2].id, 1)

        // for children, ancestor is in the 'parent' argument, the second
        assert.equal(forEachInIsland.thirdCall.args[0].id, 2)
        assert.equal(forEachInIsland.thirdCall.args[1].id, 1)
        assert.equal(forEachInIsland.thirdCall.args[2], undefined)
    })
})

describe('translateCoord', function () {
    it('tests translating a node 10 in both positive directions', function () {
        const coords = { 1: { x: 1, y: 1 } }
        const modX = 10
        const modY = 10
        const id = 1
        const result = translateCoord(coords, modX, modY, id)
        assert.deepEqual(result, {
            1: { x: 11, y: 11 }
        })
    })
})

describe('adjustIslandBounds', function () {
    it('should increase max bounds for an island according to whether the given coordinates are outside the bounds', function () {
        const islandBounds = {
            minX: 0,
            maxX: 0,
            minY: 0,
            maxY: 0
        }
        const coords = { x: 10, y: 10 }
        const result = adjustIslandBounds(islandBounds, coords)
        assert.deepEqual(result, {
            minX: 0,
            maxX: 10,
            minY: 0,
            maxY: 10
        })
    })

    it('should decrease max bounds for an island according to whether the given coordinates are outside the bounds', function () {
        const islandBounds = {
            minX: 0,
            maxX: 0,
            minY: 0,
            maxY: 0
        }
        const coords = { x: -10, y: -10 }
        const result = adjustIslandBounds(islandBounds, coords)
        assert.deepEqual(result, {
            minX: -10,
            maxX: 0,
            minY: -10,
            maxY: 0
        })
    })
})

describe('generateLayoutObject', function () {
    describe('single node', function () {
        it('should create a layout object with one island', function () {
            const topics = [{ id: 1 }]
            const synapses = []
            const focalTopicId = 1
            const result = generateLayoutObject(topics, synapses, focalTopicId)
            assert.deepEqual(result, [{
                id: 1,
                degreeFromFocus: 0,
                children: [],
                maxDescendants: 0,
                parents: [],
                maxAncestors: 0,
                longestThread: 1
            }])
        })
    })

    describe('two nodes with link', function () {
        it('should create a layout object with two nodes in one island', function () {
            const topics = [{ id: 1 }, { id: 2 }]
            // TODO: this synapse format isn't great, fix it
            const synapses = [{ from: 1, to: 2, category: 'from-to', desc: 'has reply' }]
            const focalTopicId = 1
            const result = generateLayoutObject(topics, synapses, focalTopicId)
            assert.deepEqual(result, [
                {
                    id: 1,
                    degreeFromFocus: 0,
                    children: [{
                        id: 2,
                        degreeFromFocus: 1,
                        children: [],
                        maxDescendants: 0
                    }],
                    maxDescendants: 1,
                    parents: [],
                    maxAncestors: 0,
                    longestThread: 2
                }
            ])
        })
    })
})

describe('getLayoutForData', function () {
    describe('single node', function () {
        it('should position the focal node at its original position', function () {
            const topics = [{ id: 1 }]
            const synapses = []
            const focalTopicId = 1
            const focalCoords = { x: 0, y: 0 }
            const result = getLayoutForData(topics, synapses, focalTopicId, focalCoords)
            assert.deepEqual(result, { 1: { x: 0, y: 0 } })
        })
    })

    describe('two nodes with link', function () {
        it('should position the child node to the lower right of the focal node', function () {
            const topics = [{ id: 1 }, { id: 2 }]
            const synapses = [{ from: 1, to: 2, category: 'from-to', desc: 'has reply' }]
            const focalTopicId = 1
            const focalCoords = { x: 0, y: 0 }
            const result = getLayoutForData(topics, synapses, focalTopicId, focalCoords)
            assert.deepEqual(result, { 1: { x: 0, y: 0 }, 2: { x: 250, y: -200 } })
        })
    })

    describe('three nodes in a chain', function () {
        it('should position all nodes in a line on the x-axis', function () {
            const { nodes, edges } = require('../test-data/line-graph.json')
            const focalTopicId = 3
            const focalCoords = { x: 0, y: 0 }
            const result = getLayoutForData(nodes, edges, focalTopicId, focalCoords)
            assert.deepEqual(result, { 1: { x: -500, y: 0 }, 2: { x: -250, y: 0 }, 3: { x: 0, y: 0 } })
        })
    })

    describe('big graph', function () {
        const { nodes, edges } = require('../test-data/big-graph.json')
        const focalTopicId = 3
        const focalCoords = { x: 0, y: 0 }
        const result = getLayoutForData(nodes, edges, focalTopicId, focalCoords)
        assert.deepEqual(result, {"1":{"x":-500,"y":0},"2":{"x":-250,"y":0},"3":{"x":0,"y":0},"4":{"x":250,"y":-200},"5":{"x":500,"y":-200},"6":{"x":750,"y":-200},"7":{"x":1000,"y":-200},"8":{"x":1250,"y":-200},"9":{"x":1500,"y":-200},"10":{"x":1750,"y":-200},"11":{"x":2000,"y":-200},"12":{"x":2250,"y":-200},"13":{"x":1000,"y":-400},"14":{"x":1250,"y":-400},"15":{"x":1500,"y":-400},"16":{"x":1750,"y":-400},"17":{"x":2000,"y":-400},"18":{"x":500,"y":-400},"19":{"x":750,"y":-400},"20":{"x":1000,"y":-600},"21":{"x":1250,"y":-600},"22":{"x":500,"y":200},"23":{"x":250,"y":200},"24":{"x":-1250,"y":500},"25":{"x":-1000,"y":500},"26":{"x":-750,"y":500},"27":{"x":-500,"y":500},"28":{"x":-250,"y":500},"29":{"x":0,"y":500},"30":{"x":-500,"y":700},"31":{"x":-250,"y":700},"32":{"x":0,"y":700}})
    })
})
