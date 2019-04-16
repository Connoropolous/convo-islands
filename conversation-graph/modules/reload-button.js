const { getNewNodes, removeNodeFromNewNodes } = require('./websocket')
const { refreshUrlToSelected } = require('./selection')

const RELOAD_BUTTON_ID = "reload-button"
const UPDATES_DIV_ID = "updates"
const UPDATES_SHOW_CLASS = "show"

module.exports = function() {

    const newNodes = getNewNodes()
    if (newNodes.length) {
        // display the reload for update element
        document.getElementById(UPDATES_DIV_ID).className = UPDATES_SHOW_CLASS
    }

    // you click this button to reload, because you've been 
    // notified by the server that there's remote updates that
    // have been pulled
    document.getElementById(RELOAD_BUTTON_ID).onclick = () => {
        const newNodeToView = getNewNodes()[0]
        if (newNodeToView) {
            // remove it from the list, since you're about to view it
            removeNodeFromNewNodes(newNodeToView)
            // reload the page focusing on that node
            refreshUrlToSelected(newNodeToView)
        }
    }
}