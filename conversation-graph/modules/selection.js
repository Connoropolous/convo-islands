const DEFAULT_SELECTED_NODE_ID = "_z0k58fv18"
const VIEW_PADDING = 350
const SELECTED_URL_KEY = "selected"

// this updates the browser history (back/forward)
// without reloading the page
// we do this so that when you DO reload the page
// you keep your current selected focus
const updateUrlToSelected = id => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set(SELECTED_URL_KEY, id)
    const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + searchParams.toString()
    window.history.pushState(null, document.title, newurl)
}

// this sets the selected and actually refreshes the page
const refreshUrlToSelected = id => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set(SELECTED_URL_KEY, id)
    window.location.search = searchParams.toString()
}
module.exports.refreshUrlToSelected = refreshUrlToSelected

// GET THE SELECTED ID from the url, or a default
const getSelected = () => {
    // this is an object containing
    // easy access to the kinds of query keys that can be in the URL
    // like ?author=connor&selected=_dijas34
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get(SELECTED_URL_KEY) || DEFAULT_SELECTED_NODE_ID
}
module.exports.getSelected = getSelected

const setSelected = (id, cy) => {
    cy.$('node').unselect()
    cy.$(`#${id}`).select()
    // http://cytoscape.github.io/cytoscape.js/#core/viewport-manipulation/cy.fit
    cy.fit(cy.$(':selected'), VIEW_PADDING)
    updateUrlToSelected(id)
}
module.exports.setSelected = setSelected

// called on page initialization
module.exports.init = function (cy) {

    // SET THE SELECTED from the url, or a default
    setSelected(getSelected(), cy)

    // UPDATE SELECTED ID WHEN CLICKING TO SELECT NODE
    cy.on('select', 'node', event => {
        updateUrlToSelected(event.target.data('id'))
    })
}