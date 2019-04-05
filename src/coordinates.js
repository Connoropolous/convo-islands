const lodash =  require('lodash')

// UTILITIES
const isOdd = n => Math.abs(n % 2) === 1


// CONSTANTS (TODO: make these variable inputs)
const X_GRID_SPACE = 250
module.exports.X_GRID_SPACE = X_GRID_SPACE

const Y_GRID_SPACE = 200
module.exports.Y_GRID_SPACE = Y_GRID_SPACE

const ISLAND_SPACING = 300
module.exports.ISLAND_SPACING = ISLAND_SPACING

// given an island, and a function, call the given function on every node
// in that island by recursing
const traverseIsland = (island, func, parent, child) => {
    func(island, parent, child)

    if (island.parents) {
        island.parents.forEach(p => traverseIsland(p, func, null, island))
    }
    if (island.children) {
        island.children.forEach(c => traverseIsland(c, func, island, null))
    }
}
module.exports.traverseIsland = traverseIsland


const yForX = (coords, topic, parent, child, takenPositions, x, attempt = 0) => {

    // initialize an x key (if there isn't one) to
    // track "taken" y positions for
    // that x value
    let newTakenPositions = {
        ...takenPositions,
        [x]: takenPositions[x] || {}
    }

    let yValue
    let relationSign
    let indexOfTopic
    let relation = parent || child
    let arrayOfTopics = parent ? parent.children : (child ? child.parents : [])

    // first figure out what you'd like it to be
    // then figure out if that spot's taken
    // and if it is then call this function again with another attempt

    // after the focal topic only, ODD indexes will move negatively on the Y axis
    // and EVEN indexes will move positively on the Y axis

    // for everything beyond the direct parents and children of the focal topic
    // maintain the positivity or negativity on the Y axis of its parent or child

    // if there's no parent and no child
    // then just place y as 0
    if (!relation) {
        yValue = 0
    }
    // if this is the first attempt, just use
    // the same y as the relation
    else if (attempt === 0) {
        yValue = coords[relation.id].y
    }
    // if this is greater than the first attempt, we will
    // need to do more work to calculate the y
    else if (attempt > 0) {
        // if the relations sign is 0, alternate between putting this topic into the upper and lower quadrants
        if (coords[relation.id].y === 0) {
            indexOfTopic = lodash.findIndex(arrayOfTopics, t => t.id === topic.id)
            relationSign = isOdd(indexOfTopic) ? 1 : -1
        } else {
            // if the quadrant of the related topic is already decided, make sure to keep it
            relationSign = coords[relation.id].y > 0 ? 1 : -1
        }
        yValue = coords[relation.id].y + (Y_GRID_SPACE * attempt * relationSign)
    }

    // if the y spot is already taken, recurse and increase the attempt
    if (newTakenPositions[x][yValue]) {
        let result = yForX(coords, topic, parent, child, newTakenPositions, x, attempt + 1)
        yValue = result.y
        newTakenPositions = result.takenPositions
    }

    newTakenPositions[x][yValue] = true

    return {
        y: yValue,
        takenPositions: newTakenPositions
    }
}
module.exports.yForX = yForX


// position a topic in an object containing many coordinates
// according to how it sits in the tree of topics
// x is the primary axis along which we are doing the layout
// y is calculated as a function of x
const positionTopic = (coords, takenPositions, topic, parent, child) => {
    // x value is a simple calculation of the degreeFromFocus
    // times the grid spacing times the directionality
    const x = topic.degreeFromFocus * X_GRID_SPACE * (parent ? 1 : -1)
    const result = yForX(coords, topic, parent, child, takenPositions, x)
    return {
        newCoords: {
            ...coords,
            [topic.id]: {
                x,
                y: result.y
            }
        },
        newTakenPositions: result.takenPositions
    }
}
module.exports.positionTopic = positionTopic

// translate a coordinate in an object containing many coordinates
// by an amount (modX, modY)
const translateCoord = (coords, modX, modY, id) => {
    return {
        ...coords,
        [id]: {
            x: coords[id].x + modX,
            y: coords[id].y + modY
        }
    }
}
module.exports.translateCoord = translateCoord

// modify an islandBounds object
const adjustIslandBounds = (islandBounds, coord) => {
    return {
        minX: Math.min(islandBounds.minX, coord.x),
        maxX: Math.max(islandBounds.maxX, coord.x),
        minY: Math.min(islandBounds.minY, coord.y),
        maxY: Math.max(islandBounds.maxY, coord.y)
    }
}
module.exports.adjustIslandBounds = adjustIslandBounds


const positionIslandsByBounds = (layoutObject, coords, islandBoundArray, focalCoords) => {
    // newCoords represents the final
    // value that will be repeatedly adjusted,
    // and eventuall returned
    let newCoords = {
        ...coords
    }
    // reposition the islands according to the bounds
    let maxYForIslands = 0 // the highest Y value that has thus been placed
    let minYForIslands = 0 // the lowest Y value that has thus been placed
    layoutObject.forEach((island, index) => {
        const islandHeight = islandBoundArray[index].maxY - islandBoundArray[index].minY
        if (index === 0) {
            // FLAG: this is a less efficient way than necessary to do this
            traverseIsland(island, topic => {
                // Here we actually modify the final output
                newCoords = translateCoord(newCoords, focalCoords.x, focalCoords.y, topic.id)
            })
            maxYForIslands = focalCoords.y + islandBoundArray[0].maxY
            minYForIslands = focalCoords.y + islandBoundArray[0].minY
        }
        else if (isOdd(index)) {
            let oddXTranslate = focalCoords.x - islandBoundArray[index].maxX
            let oddYTranslate = maxYForIslands + ISLAND_SPACING + Math.abs(islandBoundArray[index].minY)
            traverseIsland(island, topic => {
                // Here we actually modify the final output
                newCoords = translateCoord(newCoords, oddXTranslate, oddYTranslate, topic.id)
            })
            maxYForIslands = maxYForIslands + ISLAND_SPACING + islandHeight
        }
        else {
            let evenXTranslate = focalCoords.x - islandBoundArray[index].maxX
            let evenYTranslate = minYForIslands - ISLAND_SPACING - islandBoundArray[index].maxY
            traverseIsland(island, topic => {
                // Here we actually modify the final output
                newCoords = translateCoord(newCoords, evenXTranslate, evenYTranslate, topic.id)
            })
            minYForIslands = minYForIslands - ISLAND_SPACING - islandHeight
        }
    })
    return newCoords
}
module.exports.positionIslandsByBounds = positionIslandsByBounds

// primary exported function from this file
// takes a layoutObject generated from a graph, and a set of x,y coordinates
// for the focal (root) used to position the nodes relative to
const generateObjectCoordinates = (layoutObject, focalCoords) => {
    let coords = {}
    // lay each island out as if there were no other islands
    // the point here is to position the nodes WITHIN a given island
    layoutObject.forEach((island, index) => {
        let takenPositions = {}
        // since the first island is the island with the focal node in it
        // we treat it special
        if (index === 0) {
            // "take up" the position immediately to the right (by the grid spacing) of the focal node
            // this is the location where "new replies" would be made, in response
            // to the focal node
            takenPositions[X_GRID_SPACE] = {
                0: true // 0 represents a value on the y axis
            }
        }
        traverseIsland(island, (topic, parent, child) => {
            const result = positionTopic(coords, takenPositions, topic, parent, child)
            coords = result.newCoords
            takenPositions = result.newTakenPositions
        })
    })

    // calculate the bounds of each island
    // and store them in the islandBoundArray
    // the point here is to figure out how "big" each island is
    const islandBoundArray = layoutObject.map(island => {
        let islandBounds = {
            minX: coords[island.id].x,
            maxX: coords[island.id].x,
            minY: coords[island.id].y,
            maxY: coords[island.id].y
        }
        traverseIsland(island, topic => {
            islandBounds = adjustIslandBounds(islandBounds, coords[topic.id])
        })
        return islandBounds
    })

    // adjust the positions of the islands according to the bounds of each
    coords = positionIslandsByBounds(layoutObject, coords, islandBoundArray, focalCoords)

    return coords
}
module.exports.generateObjectCoordinates = generateObjectCoordinates