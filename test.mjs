import {
    generateObjectCoordinates,
    generateLayoutObject,
    getLayoutForData
} from './index'


const topics = [{ id: 1}]
const synapses = []
const focalTopicId = 1
const focalCoords = { x: 0, y: 0 }
console.log('getLayoutForData single node: ', getLayoutForData(topics, synapses, focalTopicId, focalCoords))