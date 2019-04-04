const assert = require('assert')

const {
    // TODO: every single one of the following should be tested
    addParentsAndChildren,
    traverseIsland,
    positionTopic,
    translateCoord,
    adjustIslandBounds,
    generateObjectCoordinates,
    positionIslandsByBounds,
    generateLayoutObject,
    getLayoutForData
} = require('./index')

// for object and array comparison, use assert.deepEqual
// for simple value comparison, use assert.equal

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
            const synapses = [{ topic1_id: 1, topic2_id: 2, category: 'from-to', desc: 'has reply' }]
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
            const synapses = [{ topic1_id: 1, topic2_id: 2, category: 'from-to', desc: 'has reply' }]
            const focalTopicId = 1
            const focalCoords = { x: 0, y: 0 }
            const result = getLayoutForData(topics, synapses, focalTopicId, focalCoords)
            assert.deepEqual(result, { 1: { x: 0, y: 0 }, 2: { x: 250, y: -200 } })
        })
    })

    describe('three nodes in a chain', function () {
        it('should position all nodes in a line on the x-axis', function () {
            const { nodes, edges } = require('./test-data/line-graph.json')
            const focalTopicId = 3
            const focalCoords = { x: 0, y: 0 }
            const result = getLayoutForData(nodes, edges, focalTopicId, focalCoords)
            assert.deepEqual(result, { 1: { x: -500, y: 0 }, 2: { x: -250, y: 0 }, 3: { x: 0, y: 0 } })
        })
    })
})
