const fs = require('fs') // nodejs file system lib
// shell lets you run commands (equivalent to the command line)
const shell = require('shelljs')

if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
}

// import our layout algorithm
const { getLayoutForData } = require('./src/index')
const cytoscapeConverter = require('./cytoscape-converter')

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

// take a node list and edge list
// and run it through our layout algorithm,
// then convert that into a graph vis friendly format
// and inject that into the JS file which is referenced in the
// main index.html file
const refreshJs = () => {
    const { nodes, edges } = JSON.parse(fs.readFileSync('./conversation-graph/conversation-graph.json', 'utf-8'))
    const focalTopicId = "1"
    const focalCoords = { x: 0, y: 0 }
    const positions = getLayoutForData(nodes, edges, focalTopicId, focalCoords)
    const cytoscapeData = cytoscapeConverter(nodes, edges, positions)
    const js = fs.readFileSync('./conversation-graph/conversation-graph.template.js', 'utf-8')
    let newjs = js.replace(/{{data}}/gim, `${JSON.stringify(cytoscapeData)}`)
    fs.writeFileSync('./conversation-graph/conversation-graph.js', newjs, 'utf-8')
}

// initialize the js file on startup, based on the graph we have,
// if no js file is found
try {
    fs.readFileSync('./conversation-graph/conversation-graph.js', 'utf-8')
} catch (e) {
    refreshJs()
}

/* polling of the remote git repository
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

            // since there's updates
            // refresh the js
            refreshJs()

            // push notification to the client
            // letting it know the HTML has been updated
            // with updates to the graph from the remote repo
            if (localsocket) {
                localsocket.send('update')
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

    // update the js based on the new graph
    refreshJs()

    // respond with the node id so that the UI
    // can trigger a page refresh, with the newly minted
    // node in focus
    res.status(200).send(node.id)

    // immediately after modifying the JSON file
    // commit the change, but don't block
    setTimeout(() => {
        if (shell.exec(`git commit -am "${node.text}"`, { silent: true }).code !== 0) {
            console.log('There was an error committing')
        } else {
            if (shell.exec('git push', { silent: true }).code !== 0) {
                console.log('There was an error pushing')
            }
        }
    }, 1000)
})

// a route to manually trigger a rebuild of the JS file
// based on the current graph
app.get('/refresh', (req, res) => {
    refreshJs()
    res.sendStatus(200)
})

app.listen(port, () => console.log(`Editor app listening on port ${port}!`))