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
const port = 3000

app.use(express.json())
app.use(express.static('conversation-graph'))

const ID = () => {
    return '_' + Math.random().toString(36).substr(2, 9)
}

const refreshJs = (nodes, edges) => {
    const focalTopicId = "1"
    const focalCoords = { x: 0, y: 0 }
    const positions = getLayoutForData(nodes, edges, focalTopicId, focalCoords)
    const cytoscapeData = cytoscapeConverter(nodes, edges, positions)
    const js = fs.readFileSync('./conversation-graph/conversation-graph.template.js', 'utf-8')
    let newjs = html.replace(/{{data}}/gim, `${JSON.stringify(cytoscapeData)}`)
    fs.writeFileSync('./conversation-graph/conversation-graph.js', newjs, 'utf-8')
}

// initialize the js file on startup, based on the graph we have,
// if no js file is found
try {
    fs.readFileSync('./conversation-graph/conversation-graph.js', 'utf-8')
} catch (e) {
    const { nodes, edges } = JSON.parse(fs.readFileSync('./conversation-graph/conversation-graph.json', 'utf-8'))
    refreshJs(nodes, edges)
}

// a route to handle the adding of a node
// from the UI
app.post('/add-node', (req, res) => {
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

    if (shell.exec('git commit -am "auto-commit"').code !== 0) {
        // 500 server side error
        res.sendStatus(500)
    }

    // update the js based on the new graph
    refreshJs(nodes, edges)

    // respond with the node id so that the UI
    // can trigger a page refresh, with the newly minted
    // node in focus
    res.status(200).send(node.id)
})

// a route to manually trigger a rebuild of the JS file
// based on the current graph
app.get('/refresh', (req, res) => {
    const { nodes, edges } = JSON.parse(fs.readFileSync('./conversation-graph/conversation-graph.json', 'utf-8'))
    refreshJs(nodes, edges)
    res.sendStatus(200)
})

app.listen(port, () => console.log(`Editor app listening on port ${port}!`))