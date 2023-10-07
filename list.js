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
