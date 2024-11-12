<script lang="ts">
    import { apiBaseURL } from '$lib';
    let route = 0, pass = "", method = "";
    let status = 0, data = "Response body here", loading = false;
    const routes = [
        "/git/clone",
        "/git/pull",
        "/git/rm",
        "/db/sync",
        "/db/raw",
    ];

    async function doRequest(e: Event) {
        e.preventDefault();
        loading = true;
        
        const params = (new URLSearchParams({
            pass
        })).toString();
        const res = await fetch(apiBaseURL + routes[route] + '?' + params, {
            method: method,
        });

        status = res.status;
        data = (
            res.headers.get('Content-Type')?.includes('application/json') ?
            JSON.stringify(await res.json(), null, 2) :
            await res.text()
        );
        loading = false;
    }
</script>

<main class="flex flex-col md:flex-row justify-center items-center gap-2">
    <div class="bg-ctp-base p-4">
        <h1 class="text-2xl"><a href="https://github.com/partofmyid/api">API Control Request Client</a></h1>
        <span>Base URL: {apiBaseURL}</span>
        <form on:submit={doRequest} class="mt-4 flex flex-wrap justify-center items-center gap-2">
            <select class="p-1" required bind:value={route}>
                {#each routes as r,i}
                    <option value={i}>{r}</option>
                {/each}
            </select>
            <select class="p-1" required bind:value={method}>
                <option value="POST">POST</option>
                <option value="GET">GET</option>
            </select>
            <input class="p-1 w-32" type="password" placeholder="password" bind:value={pass}>
            <button class="py-1" type="submit">Submit</button>
        </form>
    </div>
    <div class="bg-ctp-base p-4">
        <h1 class="text-2xl">{loading ? 'Loading...' : status}</h1>
        <pre class="max-w-64 w-64 text-wrap max-h-64">{data}</pre>
    </div>
</main>