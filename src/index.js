const { generateLayoutObject } = require('./layout-data')
const { generateObjectCoordinates } = require('./coordinates')

/*
step 1
take a node list, and an edge list, and a selected (focal) node
and generate an object/array that represents the intended layout

step 2
take the layout object and generate x,y coordinates for every topic
using a given set of coordinates to position the data relative to
*/
const getLayoutForData = (topics, synapses, focalTopicId, focalCoords) => {
  const layoutObject = generateLayoutObject(topics, synapses, focalTopicId)
  return generateObjectCoordinates(layoutObject, focalCoords)
}
module.exports.getLayoutForData = getLayoutForData
