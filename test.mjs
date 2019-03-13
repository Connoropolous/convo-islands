import {
    generateObjectCoordinates,
    generateLayoutObject,
    getLayoutForData
} from './index'

// single node

const topics = [{ id: 1}]
const synapses = []
const focalTopicId = 1
const focalCoords = { x: 0, y: 0 }

console.log('generateLayoutObject single node: ', generateLayoutObject(topics, synapses, focalTopicId))
console.log('getLayoutForData single node: ', getLayoutForData(topics, synapses, focalTopicId, focalCoords))

// multi node

const topics2 = [{ id: 1 }, { id: 2 }]
const synapses2 = [{ topic1_id: 1, topic2_id: 2, category: 'from-to', desc: 'has reply'}]
const focalTopicId2 = 1
const focalCoords2 = { x: 0, y: 0 }

console.log('generateLayoutObject two nodes: ', JSON.stringify(generateLayoutObject(topics2, synapses2, focalTopicId2)))
console.log('getLayoutForData two nodes: ', getLayoutForData(topics2, synapses2, focalTopicId2, focalCoords2))