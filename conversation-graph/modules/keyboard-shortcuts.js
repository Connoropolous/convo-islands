const { getSelected, setSelected } = require('./selection')

const REPLY_INPUT_ID = "reply-input"

const LEFT_ARROW = 37
const UP_ARROW = 38
const RIGHT_ARROW = 39
const DOWN_ARROW = 40
const F_KEY = 70
const ESC_KEY = 27

// KEYBOARD LISTENERS FOR NAVIGATION of SELECTION
module.exports = function (cy) {

  // setup the onkeyup event listener
  document.onkeyup = event => {
    if (event.keyCode === ESC_KEY) document.getElementById(REPLY_INPUT_ID).blur()
    // only listen to arrow keys,
    // if focus is not on the input box
    if (event.target.id !== REPLY_INPUT_ID) {
      let selectedNode,
        parentNodeId,
        childIds,
        childrenList,
        sortedChildrenList,
        siblingIds,
        siblingList,
        sortedSiblingList,
        nextNodeUp,
        nextNodeOver,
        nextNodeDown

      const selectedId = getSelected()

      switch (event.keyCode) {
        case F_KEY:
          document.getElementById(REPLY_INPUT_ID).focus()
          break
        case LEFT_ARROW:
          setSelected(cy.elements(`edge[target="${selectedId}"]`)[0].data('source'), cy)
          break;
        case UP_ARROW:
          selectedNode = cy.$(`#${selectedId}`)
          parentNodeId = cy.elements(`edge[target="${selectedId}"]`)[0].data('source')
          siblingIds = cy.elements(`edge[source="${parentNodeId}"]`).map(e => `#${e.data('target')}`).join(', ')
          siblingList = cy.elements(siblingIds)
          // sort them highest y to lowest y
          sortedSiblingList = siblingList.sort((a, b) => b.position().y - a.position().y)
          nextNodeUp = sortedSiblingList.toArray().find(n => n.position().y < selectedNode.position().y)
          setSelected(nextNodeUp.data('id'), cy)
          break
        case RIGHT_ARROW:
          selectedNode = cy.$(`#${selectedId}`)
          childIds = cy.elements(`edge[source="${selectedId}"]`).map(e => `#${e.data('target')}`).join(', ')
          childrenList = cy.elements(childIds)
          // sort them lowest y to highest y
          sortedChildrenList = childrenList.sort((a, b) => a.position().y - b.position().y)
          nextNodeOver = sortedChildrenList.toArray().find(n => n.position().y >= selectedNode.position().y)
          if (!nextNodeOver) {
            sortedChildrenList = childrenList.sort((a, b) => b.position().y - a.position().y)
            nextNodeOver = sortedChildrenList.toArray().find(n => n.position().y <= selectedNode.position().y)
          }
          setSelected(nextNodeOver.data('id'), cy)
          break
        case DOWN_ARROW:
          selectedNode = cy.$(`#${selectedId}`)
          parentNodeId = cy.elements(`edge[target="${selectedId}"]`)[0].data('source')
          siblingIds = cy.elements(`edge[source="${parentNodeId}"]`).map(e => `#${e.data('target')}`).join(', ')
          siblingList = cy.elements(siblingIds)
          // sort them lowest y to highest y
          sortedSiblingList = siblingList.sort((a, b) => a.position().y - b.position().y)
          nextNodeDown = sortedSiblingList.toArray().find(n => n.position().y > selectedNode.position().y)
          setSelected(nextNodeDown.data('id'), cy)
          break
      }
    }
  }
}