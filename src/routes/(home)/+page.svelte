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
    <meta name="description" content="your id on the web" />
    <meta name="theme-color" content="#89dceb" />

    <meta property="og:title" content="part-of.my.id" />
    <meta property="og:description" content="your id on the web" />
    <meta property="og:url" content="https://part-of.my.id" />
    <meta property="og:type" content="website" />
</svelte:head>

<main>
    <div class="flex flex-col justify-center items-center gap-8 min-h-[84vh]">
        <div class="flex flex-col justify-center items-center">
            <!-- <span class="bg-ctp-yellow px-2 py-0.5 rounded-full text-ctp-crust font-bold opacity-50">coming soon</span> -->
            <h1 class="text-3xl md:text-4xl lg:text-5xl text-center my-2">
                <span class="bg-gradient-to-tl from-ctp-sky to-ctp-green bg-clip-text text-transparent">{exampleName}</span>.part-of.<span class="text-transparent bg-gradient-to-tl from-ctp-subtext0 to-ctp-red bg-clip-text">my.id</span>
            </h1>
            <p class="lg:text-xl text-ctp-subtext1 text-center">your id on the web</p>
        </div>
        <form action="/search" class="flex flex-wrap justify-center items-center">
            <input type="text" name="q" placeholder="your-name" autocomplete="off" class="px-6 py-3 sm:rounded-l-full w-40 pr-0" pattern="[a-z0-9-]+" required />
            <span class="bg-ctp-surface0 py-3 pr-4 italic">.part-of.my.id</span>
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
    <p class="text-center" id="introduction"><a href="/#introduction">scroll down:</a></p>
    <section class="lg:flex-row items-start lg:items-center flex-col">
        <div>
            <h2>Sleek and memorable web address</h2>
            <p>
                <u>Your name is unique, so why not your web address for your website?</u> With part-of.my.id, you can have a nice subdomain for your website thats is easy to remember and share like <b>your-name.part-of.my.id</b>.
            </p>
        </div>
        <div class="flex flex-col justify-end text-2xl sm:text-3xl md:text-4xl xl:text-right">
            <span class="text-ctp-red"><i><s>you.github.io/portfolio</s></i></span>
            <span class="text-ctp-green"><b>you.part-of.my.id</b></span>
        </div>
    </section>
    <section class="lg:flex-row items-end lg:items-center flex-col">
        <a href="https://www.cloudflare.com/" target="_blank">
            <img src="/cf.png" alt="cloudflare logo" class="w-32 lg:w-72 h-16 aspect-video object-cover">
        </a>
        <div class="text-right">
            <h2>Powered by Cloudflare</h2>
            <p>
                With Cloudflare's global network, your subdomain can opt in to get all the proxy features like <u>SSL, DDoS protection, and caching.</u> It's fast, secure, and reliable so no need to worry about downtime or slow loading times.
            </p>
        </div>
    </section>
    <section class="lg:flex-row items-start lg:items-center flex-col">
        <div>
            <h2>Community-driven project</h2>
            <p>
                <u>part-of.my.id is maintained by a group of volunteers</u> who are passionate about web development and want to make it easier for everyone to have their own unique web address. We are very active and your pull requests will be merged in no time.
        </div>
        <div class="grid gap-1 grid-cols-[4rem_4rem_4rem_4rem]">
            {#each maintainers as maintainer}
                <a href={`//github.com/${maintainer.login}`} target="_blank" rel="noopener">
                    <img src={maintainer.avatar_url} alt={maintainer.login} class="size-16 border-2 shadow-md border-ctp-overlay1 rounded-full" />
                </a>
            {/each}
        </div>
    </section>
    <section class="lg:flex-row-reverse items-end flex-col-reverse">
        <div class="text-right">
            <h2>Free and open-source</h2>
            <p>
                <u>part-of.my.id is an open-source project</u> that is hosted on GitHub. You can help maintain the code by reporting or fixing issues. We understand getting a domain is sometimes too expensive, thats why this project is created.
            </p>
        </div>
        <a href="https://github.com" target="_blank" class="flex gap-2">
            <img src="/gh.png" alt="github logo" class="size-16 min-w-16 aspect-video object-cover">
        </a>
    </section>
    <section class="lg:flex-row items-end flex-col-reverse">
        <div>
            <h2>Treated as a separate website (<a href="https://github.com/publicsuffix/list/">PSL</a>)</h2>
            <p>
                All registered subdomains are treated as a separate website by the browser and other applications. This means you can have your own website with its own cookies, local storage, and cache. <u>It's like having your own domain!</u>
            </p>
            <span class="text-ctp-crust bg-ctp-yellow font-bold px-2 py-0.5 rounded-full my-8">coming soon: when high demand</span>
        </div>
        <div>

        </div>
    </section>
    <section class="flex-col items-center text-center my-32 gap-2">
        <h2>Ready to get one?</h2>
        <p>
            <u>Get your own subdomain now</u> by searching for your name in the search bar above!
        </p>
    </section>
</main>
