const LOCAL_STORAGE_NODES_KEY = "convo_islands_new_nodes"

// retrieve an array of the list of new nodes to view
const getNewNodes = () => {
    const newNodesString = localStorage.getItem(LOCAL_STORAGE_NODES_KEY)
    return newNodesString ? newNodesString.split(', ') : []
}
module.exports.getNewNodes = getNewNodes

// add nodes to the list of new nodes
// without removing what was there
const addNewNodes = (newNodesString) => {
    // lets save this data into localstorage
    // not clobbering what's already there
    // localstorage has the nice feature
    // of persisting across page refreshes and even tab closes and reopens
    const current = localStorage.getItem(LOCAL_STORAGE_NODES_KEY)
    const newValue = current ? `${current}, ${newNodesString}` : newNodesString
    localStorage.setItem(LOCAL_STORAGE_NODES_KEY, newValue)
}

// can remove a single node id from the list stored in localstorage
// used primarily when you actually view (or "clear") a node
const removeNodeFromNewNodes = id => {
    const newNodes = getNewNodes()
    const newList = newNodes.filter(nodeId => nodeId !== id)
    const newValue = newList.length ? newList.join(', ') : ""
    localStorage.setItem(LOCAL_STORAGE_NODES_KEY, newValue)
}
module.exports.removeNodeFromNewNodes = removeNodeFromNewNodes

const init = () => {
    // WEBSOCKETS connection, to listen for updates
    // to the graph, pulled from Git
    const socket = new WebSocket("ws://localhost:3000/")

    socket.onopen = () => {
        console.log('socket connection is open')
    }
    // the only message type coming from the server means
    // that there's a remote update
    socket.onmessage = (msg) => {
        console.log('new remote nodes message', msg.data)
        // msg.data will be a string, with a comma separated
        // list of new node ids
        let remoteNodesToView = msg.data
        addNewNodes(remoteNodesToView)

        // display the 
        document.getElementById('updates').className = 'show'
    }
}
module.exports.init = init