const fs = require('fs') // nodejs file system lib
// shell lets you run commands (equivalent to the command line)
const shell = require('shelljs')

if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
}

const express = require('express')
const app = express()
const expressWs = require('express-ws')(app)
const port = 3000

// this handles parsing http request bodies
// into JSON objects automagically
app.use(express.json())
// this serves a static files server out of the conversation-graph
// folder
app.use(express.static('conversation-graph'))

// a utility ID generator for added nodes
const ID = () => {
    return '_' + Math.random().toString(36).substr(2, 9)
}

/* POLLING of the remote git repository
    for updates. can be stopped, started,
    and changed in its frequency
*/
const DEFAULT_POLL_INTERVAL = 5000 // milliseconds
let pollInterval // value to store the current interval amount in memory
let polltimer
let localsocket
const createPollTimer = (newInterval) => {
    if (polltimer) clearInterval(polltimer)
    polltimer = setInterval(() => {
        const cmd = shell.exec('git pull', { silent: true })
        // means there's updates
        if (cmd.stdout.indexOf('Already up to date') === -1) {
            console.log('Fetched an update from git')

            const updatingReg = /(\w+)..(\w+)  master/g

            const shaResults = updatingReg.exec(cmd.stdout)

            if (!shaResults) {
                console.log('Did not see two SHAs to check, not proceeding')
                return
            }

            const logcmd = shell.exec(`git log ${shaResults[1]}..${shaResults[2]}`, { silent: true })
            let match
            let matches = []
            const nodeReg = /node:(\w+):/g
            while ((match = nodeReg.exec(logcmd.stdout)) != null) {
                matches.push(match[1])
            }

            // don't bother to send a message to the UI
            // if the change doesn't affect it
            if (matches.length === 0) {
                console.log('Did not see any new nodes in the diff, not proceeding')
                return
            }

            // push notification to the client
            // letting it know the HTML has been updated
            // with updates to the graph from the remote repo
            if (localsocket) {
                localsocket.send(matches.join(', '))
            }
        }
    }, newInterval)
    // save the interval in memory for future stops/restarts
    pollInterval = newInterval
}
createPollTimer(DEFAULT_POLL_INTERVAL)

// mount a websocket server at main route
app.ws('/', (ws, req) => {
    localsocket = ws
    ws.on('close', () => {
        localsocket = null
    })
})


/* ROUTES */

// routes for adjusting git polling
app.post('/polling', (req, res) => {
    createPollTimer(req.body.pollInterval)
    res.sendStatus(200)
})
app.get('/stoppolling', (req, res) => {
    console.log('stopping polling')
    clearInterval(polltimer)
    res.sendStatus(200)
})
app.get('/startpolling', (req, res) => {
    console.log('starting polling')
    createPollTimer(pollInterval)
    res.sendStatus(200)
})

// a route to handle the adding of a node
// from the UI
app.post('/add-node', (req, res) => {

    // this data comes off the request body, from the client
    const { node, reply_to } = req.body

    // update the graph
    const { nodes, edges } = JSON.parse(fs.readFileSync('./conversation-graph/conversation-graph.json', 'utf-8'))
    node.id = ID()
    nodes.push(node)
    if (reply_to) {
        const edge = {
            from: reply_to,
            to: node.id,
            category: 'from-to',
            desc: 'has reply'
        }
        edges.push(edge)
    }
    fs.writeFileSync('./conversation-graph/conversation-graph.json', JSON.stringify({ nodes, edges }, null, 4), 'utf-8')

    // respond with the node id so that the UI
    // can trigger a page refresh, with the newly minted
    // node in focus
    res.status(200).send(node.id)

    // immediately after modifying the JSON file
    // commit the change, but don't block
    setTimeout(() => {
        shell.exec('git add conversation-graph/conversation-graph.json', { silent: true })
        shell.exec(`git commit -m "node:${node.id}: ${node.text}"`, { silent: true })
        shell.exec('git push', { silent: true })
    }, 1000)
})

app.listen(port, () => console.log(`Editor app listening on port ${port}!`))