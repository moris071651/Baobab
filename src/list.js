// Fetch the list of repositories.
async function getData(page)
{
    const api = 'https://api.github.com/search/repositories?q=topic:science'
    const token = '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'
    const header = { Authorization: `token ${token}` };

    try {
        const response = await fetch(`${api}&page=${page}`, { header })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.status} - ${response.statusText}`);
                }

                return response;
            })
        const data = await response.json()
        return data.items
    }
    catch (error) {
        console.error('Error fetching data:', error)
        return null
    }
}

function renderPageNumber(page)
{
    const pageNav = document.getElementById('page')
    pageNav.textContent = `${page}`

    const left = document.getElementById('left')
    left.onclick = () => location.href = `list.html?page=${page - 1}`

    const right = document.getElementById('right')
    right.onclick = () => location.href = `list.html?page=${page + 1}`
}

// Render all cards
async function renderData(page)
{
    const data = await getData(page)
    const main = document.querySelector('main')
    data.forEach((project) => {
        const link = document.createElement('a')
        const card = document.createElement('div')
        const img  = document.createElement('img')
        const proj = document.createElement('h3')
        const desc = document.createElement('p')

        img.alt = project.owner.login
        img.src = project.owner.avatar_url
        proj.textContent = project.name
        desc.textContent = project.description

        link.href = project.html_url

        card.classList.add('card')
        card.append(img)
        card.append(proj)
        card.append(desc)

        link.append(card)
        main.append(link)
    });
}

function getPageNumber()
{
    const url = new URLSearchParams(window.location.search);
    return parseInt(url.get('page')) || 1; 
}



const page = getPageNumber()
renderPageNumber(page)
renderData(page)
