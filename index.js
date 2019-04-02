const lodash =  require('lodash')

/*
step 1
generate an object/array that represents the intended layout


step 2
generate x,y coordinates for every topic in the layout object

*/

// synapses = [{ topic1_id: 4, topic2_id: 5, category: 'from-to', desc: 'has reply' }]

const isEven = n => n % 2 === 0
const isOdd = n => Math.abs(n % 2) === 1

const X_GRID_SPACE = 250
module.exports.X_GRID_SPACE = X_GRID_SPACE

const Y_GRID_SPACE = 200
module.exports.Y_GRID_SPACE = Y_GRID_SPACE

const ISLAND_SPACING = 300
module.exports.ISLAND_SPACING = ISLAND_SPACING

// recursively use an edge list to generate a tree structure of a node and its ancestors and descendants
const addParentsAndChildren = (usedTopics, synapses, topic, getParents, getChildren, degreeFromFocus) => {
  if (!topic.id) return topic

  // TODO: eliminate this side effect
  usedTopics[topic.id] = true
  topic.degreeFromFocus = degreeFromFocus
  const nextDegree = degreeFromFocus + 1

  if (getChildren) {
    // recursive to add children
    topic.children = []
    synapses.filter(synapse => {
      return synapse.topic1_id === topic.id
             && !usedTopics[synapse.topic2_id]
             && synapse.category === 'from-to'
    })
    .map(synapse => synapse.topic2_id)
    .forEach(childId => topic.children.push(addParentsAndChildren(usedTopics, synapses, {id: childId}, false, true, nextDegree)))

    topic.children = lodash.orderBy(topic.children, 'maxDescendants', 'desc')
    topic.maxDescendants = topic.children.length ? topic.children[0].maxDescendants + 1 : 0
  }

  if (getParents) {
    // recursive to add parents
    topic.parents = []
    synapses.filter(synapse => {
      return synapse.topic2_id === topic.id
             && !usedTopics[synapse.topic1_id]
             && synapse.category === 'from-to'
    })
    .map(synapse => synapse.topic1_id)
    .forEach(parentId => topic.parents.push(addParentsAndChildren(usedTopics, synapses, {id: parentId}, true, false, nextDegree)))

    topic.parents = lodash.orderBy(topic.parents, 'maxAncestors', 'desc')
    topic.maxAncestors = topic.parents.length ? topic.parents[0].maxAncestors + 1 : 0
  }

  if (getParents && getChildren) {
    topic.longestThread = topic.maxDescendants + topic.maxAncestors + 1
  }

  return topic
}
// export for testing
module.exports.addParentsAndChildren = addParentsAndChildren


const generateLayoutObject = (topics, synapses, focalTopicId) => {
  let layout = [] // will be the final output
  const usedTopics = {} // will store the topics that have been placed into islands

  // start with the focal node, and build its island
  const currentTopic = topics.find(t => t.id === focalTopicId)
  if (!currentTopic) {
    console.log('you didnt pass a valid focalTopicId')
    return layout
  }
  layout.push(addParentsAndChildren(usedTopics, synapses, { id: currentTopic.id }, true, true, 0))
  
  // right now there's no reasoning going on about the selection of focal topics
  // its just whichever ones happen to be found in the array first
  topics.filter(topic => topic && topic.id && !usedTopics[topic.id]).forEach(
    topic => layout.push(addParentsAndChildren(usedTopics, synapses, { id: topic.id }, true, true, 0)))

  return layout
}
module.exports.generateLayoutObject = generateLayoutObject


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


// position a topic in an object containing many coordinates
// according to how it sits in the tree of topics
const positionTopic = (coords, tempPosStore, topic, parent, child) => {

  // this is a function nested too deep, it should be stripped out too
  const yForX = (x, attempt = 0) => {
    tempPosStore[x] = tempPosStore[x] || {}
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

    if (!relation) yValue = 0
    else if (attempt === 0) yValue = coords[relation.id].y
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

    if (tempPosStore[x][yValue]) yValue = yForX(x, attempt + 1)
    // TODO: eliminate this side effect on tempPosStore
    tempPosStore[x][yValue] = true
    return yValue
  }

  const x = topic.degreeFromFocus * X_GRID_SPACE * (parent ? 1 : -1)
  return {
    ...coords,
    [topic.id]: {
      x,
      y: yForX(x)
    }
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

const generateObjectCoordinates = (layoutObject, focalCoords) => {
  let coords = {}
  // lay each island out as if there were no other islands
  layoutObject.forEach((island, index) => {
    const tempPosStore = {}
    if (index === 0) tempPosStore[X_GRID_SPACE] = { 0: true }
    traverseIsland(island, (topic, parent, child) => {
      coords = positionTopic(coords, tempPosStore, topic, parent, child)
    })
  })

  // calculate the bounds of each island
  // and store them in the islandBoundArray
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

  coords = positionIslandsByBounds(layoutObject, coords, islandBoundArray, focalCoords)

  return coords
}
module.exports.generateObjectCoordinates = generateObjectCoordinates

// nothing interesting happening here, just combining other functions
// doesn't need to be tested
const getLayoutForData = (topics, synapses, focalTopicId, focalCoords) => {
  const layoutObject = generateLayoutObject(topics, synapses, focalTopicId)
  return generateObjectCoordinates(layoutObject, focalCoords)
}
module.exports.getLayoutForData = getLayoutForData
