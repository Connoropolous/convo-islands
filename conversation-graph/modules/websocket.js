

module.exports = function () {
    // WEBSOCKETS connection, to listen for updates
    // to the graph, pulled from Git
    const socket = new WebSocket("ws://localhost:3000/")

    // the only message type coming from the server means
    // that there's a remote update
    socket.onmessage = (msg) => {
        // msg.data will be a string, with a comma separated
        // list of new node ids
        let remoteNodesToView = msg.data.split(', ')
        document.getElementById('updates').className = 'show'
    }
}