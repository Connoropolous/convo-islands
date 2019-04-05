const lodash =  require('lodash')

// synapses = [{ topic1_id: 4, topic2_id: 5, category: 'from-to', desc: 'has reply' }]

// recursively use an edge list to generate a tree structure of a node and its ancestors and descendants
// only the root node should have getParents = true and getChildren = true
// if it is in the child direction, getChildren should be true and getParents = false
// and vice versa
const addParentsAndChildren = (usedTopics, synapses, topic, getParents, getChildren, degreeFromFocus) => {
    if (!topic.id) return topic
  
    let newUsedTopics = {
      ...usedTopics,
      [topic.id]: true
    }
  
    topic.degreeFromFocus = degreeFromFocus
    const nextDegree = degreeFromFocus + 1
  
    if (getChildren) {
      // add an empty list of children
      topic.children = []
      synapses
        // look inside the list of synapses for the ones
        // that represent parent-child relationships
        // where the current topic is the parent
        // and filter to just an array of those synapses
        .filter(synapse => {
          return synapse.topic1_id === topic.id
                && !newUsedTopics[synapse.topic2_id]
                && synapse.category === 'from-to'
        })
        // convert that array into an array of the
        // ids of those children
        .map(synapse => synapse.topic2_id)
        // iterate on that array
        // creating a node from that id
        // and adding it to the array of
        // children
        .forEach(childId => {
          // get that node as a child by recursing
          const result = addParentsAndChildren(newUsedTopics, synapses, {id: childId}, false, true, nextDegree)
          // override the usedTopics list, with the new list
          newUsedTopics = result.usedTopics
          // add the new child to the children array
          topic.children.push(result.topic)
        })
  
      topic.children = lodash.orderBy(topic.children, 'maxDescendants', 'desc')
      topic.maxDescendants = topic.children.length ? topic.children[0].maxDescendants + 1 : 0
    }
  
    if (getParents) {
      // add an empty list of parents
      topic.parents = []
      synapses
        // look inside the list of synapses for the ones
        // that represent parent-child relationships
        // where the current topic is the child
        // and filter to just an array of those synapses
        .filter(synapse => {
          return synapse.topic2_id === topic.id
                && !newUsedTopics[synapse.topic1_id]
                && synapse.category === 'from-to'
        })
        // convert that array into an array of the
        // ids of those children
        .map(synapse => synapse.topic1_id)
        // iterate on that array
        // creating a node from that id
        // and adding it to the array of
        // children
        .forEach(parentId => {
          // get that node as a parent by recursing
          const result = addParentsAndChildren(newUsedTopics, synapses, {id: parentId}, true, false, nextDegree)
          // override the usedTopics list, with the new list
          newUsedTopics = result.usedTopics
          // add the new parent to the parents array
          topic.parents.push(result.topic)
        })
  
      topic.parents = lodash.orderBy(topic.parents, 'maxAncestors', 'desc')
      topic.maxAncestors = topic.parents.length ? topic.parents[0].maxAncestors + 1 : 0
    }
  
    if (getParents && getChildren) {
      topic.longestThread = topic.maxDescendants + topic.maxAncestors + 1
    }
  
    return {
      topic,
      usedTopics: newUsedTopics
    }
  }
  // export for testing
  module.exports.addParentsAndChildren = addParentsAndChildren
  
  
  const generateLayoutObject = (topics, synapses, focalTopicId) => {
    let layout = [] // will be the final output
    // will act as a store of the topics that have been placed into islands
    // to begin with, no topics have been placed into islands
    let usedTopics = {}
  
    // start with the focal node, and build its island
    const currentTopic = topics.find(topic => topic.id === focalTopicId)
    if (!currentTopic) {
      console.log('you didnt pass a valid focalTopicId')
      return layout
    }
    const result = addParentsAndChildren(usedTopics, synapses, { id: currentTopic.id }, true, true, 0)
    // to avoid side effects, calling addParentsAndChildren
    // also returns the new "list" of usedTopics
    usedTopics = result.usedTopics
    layout.push(result.topic)
    
    // right now there's no reasoning going on about the selection of focal topics
    // its just whichever ones happen to be found in the array first
    topics
      .filter(topic => topic && topic.id && !usedTopics[topic.id])
      .forEach((topic) => {
        const result = addParentsAndChildren(usedTopics, synapses, { id: topic.id }, true, true, 0)
        usedTopics = result.usedTopics
        layout.push(result.topic)
      })
  
    return layout
  }
  module.exports.generateLayoutObject = generateLayoutObject