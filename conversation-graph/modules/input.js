const { getActiveAuthor } = require('./authors')
const { refreshUrlToSelected } = require('./selection')

const ENTER_KEY_CODE = 13
const ADD_NODE_PATH = "add-node"
const REPLY_INPUT_ID = "reply-input"
const REPLY_SUBMIT_ID = "reply-submit"

const submitNode = (text, author, reply_to) => {
    // make the request to local server to create the node 
    fetch(ADD_NODE_PATH, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            node: {
                text,
                author
            },
            reply_to
        })
    }).then(async response => {
        const newId = await response.text()
        // when you get a response, refresh the page
        // TODO: the page no longer would necessarily need to be refreshed
        refreshUrlToSelected(newId)
    })
}
module.exports.submitNode = submitNode


const getDataAndSubmit = cy => {
    // get a selected node, if any, 
    // and use it as the 'reply' value for the new node
    const selected = cy.$(':selected')
    const replyTo = selected.length ? selected[0].data('id') : ''

    // use the text value of the input as the text for the new node
    const replyInput = document.getElementById(REPLY_INPUT_ID)
    // don't proceed with an empty text value
    if (!replyInput.value) return

    submitNode(replyInput.value, getActiveAuthor(), replyTo)
}

const init = cy => {
    // REPLIES
    const replyInput = document.getElementById(REPLY_INPUT_ID)
    // bring the input into focus on page load
    replyInput.focus()
    // setup keyboard listener for the input
    replyInput.onkeydown = event => {
        // cmd-enter or ctrl-enter both trigger node creation
        if ((event.metaKey || event.ctrlKey) && event.keyCode === ENTER_KEY_CODE) {
            getDataAndSubmit(cy)
        }
    }

    // clicking the 'submit' button triggers node creation
    const replySubmit = document.getElementById(REPLY_SUBMIT_ID)
    replySubmit.onclick = event => {
        event.preventDefault()
        getDataAndSubmit(cy)
    }
}
module.exports.init = init