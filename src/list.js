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
                    if (response.status == 422) {
                        location.href = `list.html?page=${page - 1}`
                    }
                    else if (response.status == 403 && response.headers.has('X-RateLimit-Reset')) {
                        alert("GitHub API Rate Limit Exceeded")
                        alert("Wait Until The Site Refreshes Itself")
                        const current = Math.floor(Date.now() / 1000);
                        const reset = parseInt(response.headers.get('X-RateLimit-Reset'));

                        const wait = reset - current;
                        if (wait > 0) {
                            setTimeout(() => {
                                location.reload()
                            }, (wait + 1) * 1000)
                        }
                      }

                    throw new Error(`GitHub API error: ${response.status} - ${response.statusText}`);
                }
                
                return response;
            })
            .catch((response) => {
                console.log(response)
            })

        const data = await response.json()
        console.log(data)
        return [data.items, !(30 * page > data.total_count )]
    }
    catch (error) {
        console.error('Error fetching data:', error)
        return [null, null]
    }
}

function renderPageNumber(page)
{
    const pageNav = document.getElementById('page')
    pageNav.textContent = `${page}`

    const left = document.getElementById('left')
    if(page > 1) {
        left.onclick = () => location.href = `list.html?page=${page - 1}`
    }
    else {
        left.style = 'opacity: 0;'
        left.disabled = true
    }
    
    const right = document.getElementById('right')
    right.onclick = () => location.href = `list.html?page=${page + 1}`
    right.disabled = true
}

// Render all cards
async function renderData(page)
{
    const [data, more] = await getData(page)
    if (!data) return

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

    if (more) {
        document.getElementById('right').disabled = false
    }
    else {
        document.getElementById('right').style = 'opacity: 0;'
    }
}

function getPageNumber()
{
    const url = new URLSearchParams(window.location.search);
    return parseInt(url.get('page')) || 1; 
}



const page = getPageNumber()
renderPageNumber(page)
renderData(page)
