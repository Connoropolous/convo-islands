const AUTHORS = ["connor", "robert"]
const DEFAULT_AUTHOR = AUTHORS[0]
const AUTHOR_URL_KEY = "author"
const ACTIVE_AUTHOR_CLASS = "activeAuthor"
const AUTHORS_DIV_ID = "authors"

const getActiveAuthor = () => {
    // get the name, if one is set, of the 'active author'
    // from the URL search params e.g. /?author=robert
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get(AUTHOR_URL_KEY) || DEFAULT_AUTHOR
}
module.exports.getActiveAuthor = getActiveAuthor

const init = () => {
    const activeAuthor = getActiveAuthor()
    const authorDiv = document.getElementById(AUTHORS_DIV_ID)
    AUTHORS.forEach(author => {
        // Create and append to the list of authors
        // every author that is set in the list constant
        // AUTHORS, marking the one that is 'active'
        // as such, and relying on the default if none
        // was explicitly set
        const buttonEl = document.createElement("button")
        buttonEl.textContent = author
        if (author === activeAuthor) {
            buttonEl.className = ACTIVE_AUTHOR_CLASS
        }
        authorDiv.appendChild(buttonEl)

        // setup an onclick listener on each
        // button, which will cause the author param
        // in the URL to change, and the page to refresh
        // which will change the selected author
        buttonEl.onclick = () => {
            const search = new URLSearchParams(window.location.search)
            search.set(AUTHOR_URL_KEY, author)
            // this actually triggers a page reload
            window.location.search = search.toString()
        }
    })
}
module.exports.init = init