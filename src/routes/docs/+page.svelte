<main class="flex flex-col justify-center items-center gap-8 max-w-3xl mx-auto">
    <article>
        <h2>Table of contents</h2>
        <ul>
            <li><a href="#introduction">What is part-of.my.id?</a></li>
            <li><a href="#structure">Domain JSON file structure</a></li>
            <li><a href="#faq">Frequently Asked Questions</a></li>
        </ul>

        <hr id="introduction">

        <h2>What is part-of.my.id?</h2>
        <p>
            <a href="/">part-of.my.id</a> is a personal project by <a href="//satr14.my.id">satr14</a> to provide subdomains for personal websites, open-source projects, and more. Registering a subdomain is easy on the web dashboard. Just choose one and register it. We have support for <code>A</code>, <code>AAAA</code>, <code>CNAME</code>, and <code>TXT</code> records.

        <h3>Example use case:</h3>
        <p>
            Say your hosting a portfolio on <a href="https://github.io">GitHub Pages</a> and want to use a custom domain, you can use <a href="/">part-of.my.id</a> to create a subdomain and point it to your GitHub repository rather than buying a domain or using the default <code>github.io</code> domain.
        </p>
        <h3>Report a website</h3>
        <p>
            Everything to manage <a href="/">part-of.my.id</a> is done through the root domain only. Any subdomain is a separate website and is not created by us. If you find a website thats abusing our service or claims to be us, <a href="//github.com/SX-9/part-of-my-id/issues/new">please report it</a>.
        </p>

        <hr id="structure">

        <h2>Domain JSON file structure</h2>
        <p>Each subdomain has a corresponding <code>domains/*.json</code> file that contains its records and owner.</p>
        <details>
            <summary>Example JSON file:</summary>
            <pre>{JSON.stringify({
                "description": "Project Description (optional)",
                "owner": {
                    "username": "github-username"
                },
                "record": {
                    "A": ["1.1.1.1", "1.0.0.1"],
                    "AAAA": ["::1", "::2"],
                    "CNAME": "example.com",
                    "MX": ["mx1.example.com", "mx2.example.com"],
                    "TXT": ["example_verification=1234567890"],
                    "SRV": [
                        { "priority": 10, "weight": 60, "port": 5060, "target": "sipserver.example.com" },
                        { "priority": 20, "weight": 10, "port": 5061, "target": "sipbackup.example.com" }
                    ]
                },
                "proxied": false
            }, null, 4)}</pre>
        </details>
        <h3>Filename</h3>
        <p>
            The filename of the JSON file should be the subdomain name with the <code>.json</code> extension and the file must be placed in the <code>domains</code> directory. For example, <code>domains/example.json</code> to get <code>example.part-of.my.id</code>. But we do have requirements for subdomain names:
        </p>
        <ul>
            <li>Must be alphanumeric, in lowercase, with dashes as separators.</li>
            <li>Must be at least 1 character.</li>
            <li>Must have a .json file extension.</li>
        </ul>
        <h3>Structure</h3>
        <h4><code>description</code> (optional)</h4>
        <p>
            A short description of the project or website. This is optional and can be left out.
        </p>
        <h4><code>owner</code> (required)</h4>
        <p>
            The owner of the subdomain. This should be an object with the <code>username</code> key and the GitHub username as the value. you can also include other contact information and social media links. This is required so that we can reach out to you if there are any issues with your subdomain.
        </p>
        <h4><code>record</code> (required)</h4>
        <p>
            The DNS records for the subdomain. This should be an object with the record type as the key and the value as an array of strings or an object. The supported record types are:
        </p>
        <ul>
            <li><code>A</code> - array of IPv4 addresses as strings</li>
            <li><code>AAAA</code> - array of IPv6 addresses as strings</li>
            <li><code>CNAME</code> - string of the hostname</li>
            <li><code>MX</code> - array of strings of the mail server hostname</li>
            <li><code>TXT</code> - array of strings of the text record</li>
            <li><code>SRV</code> - array of objects with the keys <code>priority</code> (number), <code>weight</code> (number), <code>port</code> (number), and <code>target</code> (string)</li>
        </ul>
        <h4><code>proxied</code> (optional)</h4>
        <p>
            A boolean value that determines if the subdomain is proxied through Cloudflare. This is optional and defaults to <code>false</code>. If you want to use Cloudflare's services like SSL, caching, and DDoS protection, set this to <code>true</code>.
        </p>

        <hr id="faq">

        <h2>Frequently Asked Questions</h2>
        <h3>How do I register a subdomain?</h3>
        <p>
            To register a subdomain, visit the <a href="//github.com/partofmyid/register">register repository</a> and create a new file in the <code>domains</code> directory with the name of your subdomain and the JSON structure above. Then create a pull request and wait for it to be merged.
        </p>
        <h3>Why is my subdomain not working?</h3>
        <p>
            Be patient, it can take up to 24 hours for DNS records to update by the github actions script. If it still doesn't work, check the JSON file for typos and make sure the records are correct. You can also try clearing your DNS cache.
        </p>
        <h3>Can I use a CNAME record with any other records?</h3>
        <p>
            You cannot request a subdomain nor submit changes containing a CNAME with any other records (TXT, A, MX, etc...)
        </p>
        <h3>When will you merge my PR?</h3>
        <p>
            When we get into it. We always want you to wait for as short as possible. But maintainers cannot always be online. We have school and work, this is just a side project. Just be patient and we'll get to it as soon as possible! For a chance for a quicker review, send your PR in the discord server.
        </p>
        <h3>Can I create nested subdomains?</h3>
        <p>
            Yes, you can create nested subdomains. Just create a new file in the <code>domains</code> directory with the name of the subdomain like <code>blog.my-name.json</code>.
        </p>
        <h3>Can I be a maintainer/join the team?</h3>
        <p>
            No, we hand pick maintainers. If we need more maintainers, we will reach out to trusted people. If you want to help, you can contribute to the codebase or help others in the discord server which can give you a higher chance of getting picked.
        </p>
    </article>
</main>