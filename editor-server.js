const fs = require('fs') // nodejs file system lib
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

const refreshHtml = (nodes, edges) => {
    const focalTopicId = "1"
    const focalCoords = { x: 0, y: 0 }
    const positions = getLayoutForData(nodes, edges, focalTopicId, focalCoords)
    const cytoscapeData = cytoscapeConverter(nodes, edges, positions)
    const html = fs.readFileSync('./conversation-graph/conversation-graph.template.js', 'utf-8')
    let newhtml = html.replace(/{{data}}/gim, `${JSON.stringify(cytoscapeData)}`)
    fs.writeFileSync('./conversation-graph/conversation-graph.js', newhtml, 'utf-8')
}

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

    // update the html
    refreshHtml(nodes, edges)
    res.sendStatus(200)
})

app.post('/remove-node', (req, res) => {
    const { id } = req.body
    // update the graph
    let { nodes, edges } = JSON.parse(fs.readFileSync('./conversation-graph/conversation-graph.json', 'utf-8'))
    nodes = nodes.filter(n => n.id !== id)
    edges = edges.filter(e => e.from !== id && e.to !== id)
    fs.writeFileSync('./conversation-graph/conversation-graph.json', JSON.stringify({ nodes, edges }, null, 4), 'utf-8')

    // update the html
    refreshHtml(nodes, edges)
    res.sendStatus(200)
})

app.get('/refresh', (req, res) => {
    const { nodes, edges } = JSON.parse(fs.readFileSync('./conversation-graph/conversation-graph.json', 'utf-8'))
    refreshHtml(nodes, edges)
    res.sendStatus(200)
})

app.listen(port, () => console.log(`Editor app listening on port ${port}!`))