const LOCAL_STORAGE_NODES_KEY = "convo_islands_new_nodes"

const getNewNodes = () => {
    const newNodesString = localStorage.getItem(LOCAL_STORAGE_NODES_KEY)
    return newNodesString.split(', ')
}
module.exports.getNewNodes = getNewNodes

const init = () => {
    // WEBSOCKETS connection, to listen for updates
    // to the graph, pulled from Git
    const socket = new WebSocket("ws://localhost:3000/")

    socket.onopen = () => {
        console.log('open!')
    }
    // the only message type coming from the server means
    // that there's a remote update
    socket.onmessage = (msg) => {
        // msg.data will be a string, with a comma separated
        // list of new node ids
        let remoteNodesToView = msg.data

        // lets save this data into localstorage
        // not clobbering what's already there
        // localstorage has the nice feature
        // of persisting across page refreshes and even tab closes and reopens
        const current = localStorage.getItem(LOCAL_STORAGE_NODES_KEY)
        localStorage.setItem(LOCAL_STORAGE_NODES_KEY, `${current}, ${remoteNodesToView}`)

        document.getElementById('updates').className = 'show'
    }
}
module.exports.init = init