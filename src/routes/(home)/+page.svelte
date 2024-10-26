<script lang="ts">
    import { apiBaseURL } from "$lib";
    import { onMount, onDestroy } from "svelte";

    let maintainers: any[] = [];
    let exampleName = "your-name";
    let i = -1;
    
    let starsCount = 0;
    let forksCount = 0;
    let domainsCount = 0;
    
    let typingEffectInterval: NodeJS.Timeout;
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    onMount(() => {
        fetch('https://api.github.com/orgs/partofmyid/members')
            .then(res => res.json()).then(data => {
                let names = data.map((member: { login: string }) => member.login?.toLocaleLowerCase() || "");
                maintainers = data;
                names.push("your-name");
                typingEffectInterval = setInterval(async () => {
                    i++;
                    if (i >= names.length) clearInterval(typingEffectInterval);
                
                    for (let j = 0; j < names[i].length; j++) {
                        await sleep(150);
                        exampleName = names[i].slice(0, j + 1);
                    }
                }, 1700);
            });
        fetch("https://api.github.com/repos/partofmyid/register")
            .then(res => res.json()).then(data => {
                starsCount = data.stargazers_count || 0;
                forksCount = data.forks_count || 0;
            });
        fetch(`${apiBaseURL}/query/count`)
            .then(res => res.json()).then(data => domainsCount = data.count || 0);
    });
    onDestroy(() => clearInterval(typingEffectInterval));
</script>

<svelte:head>
    <title>part-of.my.id</title>
    <meta property="og:title" content="part-of.my.id" />
    <meta property="og:description" content="your id on the web" />
    <meta property="og:url" content="https://part-of.my.id" />
    <meta property="og:type" content="website" />
    <meta name="theme-color" content="#89dceb" />
</svelte:head>

<main>
    <div class="flex flex-col justify-center items-center gap-8 min-h-[85vh]">
        <div class="flex flex-col justify-center items-center">
            <!-- <span class="bg-ctp-yellow px-2 py-0.5 rounded-full text-ctp-crust font-bold opacity-50">coming soon</span> -->
            <h1 class="text-3xl md:text-4xl lg:text-5xl text-center my-2">
                <span class="bg-gradient-to-tl from-ctp-sky to-ctp-green bg-clip-text text-transparent">{exampleName}</span>.part-of.<span class="text-transparent bg-gradient-to-tl from-ctp-subtext0 to-ctp-red bg-clip-text">my.id</span>
            </h1>
            <p class="lg:text-xl text-ctp-subtext1 text-center">your id on the web</p>
        </div>
        <form action="/search" class="flex flex-wrap justify-center items-center">
            <input type="text" name="q" placeholder="your-name" autocomplete="off" class="px-6 py-3 sm:rounded-l-full w-40 pr-0" pattern="[a-z0-9-]+" required />
            <span class="bg-ctp-base p-3 pl-0 italic">.part-of.my.id</span>
            <button type="submit" class="px-6 py-3 text-ctp-crust font-bold bg-gradient-to-br from-ctp-green to-ctp-sky sm:rounded-r-full">search</button>
        </form>
        <div class="flex justify-center items-center text-center gap-2">
            <div class="p-2 rounded-sm text-ctp-yellow">
                <h2>{starsCount}</h2>
                <p class="text-sm">stars</p>
            </div>
            <div class="p-2 rounded-sm text-ctp-blue">
                <h2>{domainsCount}</h2>
                <p class="text-sm">subdomains</p>
            </div>
            <div class="p-2 rounded-sm text-ctp-green">
                <h2>{forksCount}</h2>
                <p class="text-sm">forks</p>
            </div>
        </div>
    </div>
    <p class="text-center" id="introduction"><a href="/#introduction">Introduction:</a></p>
    <article class="max-w-2xl mx-auto">
        <h2>What is part-of.my.id?</h2>
        <p>
            <a href="/">part-of.my.id</a> is a personal project by <a href="//satr14.my.id">satr14</a> to provide subdomains for personal websites, open-source projects, and more. Registering a subdomain is easy on the web dashboard. Just choose one and register it. We have support for <code>A</code>, <code>AAAA</code>, <code>CNAME</code>, and <code>TXT</code> records.
        </p>
        <h2>Example use case:</h2>
        <p>
            Say your hosting a portfolio on <a href="https://github.io">GitHub Pages</a> and want to use a custom domain, you can use <a href="/">part-of.my.id</a> to create a subdomain and point it to your GitHub repository rather than buying a domain or using the default <code>github.io</code> domain.
        </p>
        <h2>Report a website</h2>
        <p>
            Everything to manage <a href="/">part-of.my.id</a> is done through the root domain only. Any subdomain is a separate website and is not created by us. If you find a website thats abusing our service or claims to be us, <a href="//github.com/SX-9/part-of-my-id/issues/new">please report it</a>.
        </p>
    </article>
    <p class="text-center">Maintained by {maintainers.length} people</p>
    <div class="flex flex-wrap justify-center items-center max-w-2xl mx-auto mb-4">
        {#each maintainers as maintainer}
            <a href={`//github.com/${maintainer.login}`} target="_blank" rel="noopener" class="flex flex-col justify-center items-center gap-2 p-2">
                <img src={maintainer.avatar_url} alt={maintainer.login} class="size-16 border-2 shadow-md border-ctp-overlay1 rounded-full" />
            </a>
        {/each}
    </div>
</main>
