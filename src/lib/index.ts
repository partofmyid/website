export type SubdomainJSON = {
    owner: {
        username: string,
    },
    record: {
        "A"?: string[],
        "AAAA"?: string[],
        "MX"?: string[],
        "NS"?: string[],
        "TXT"?: string[],
        "PTR"?: string[],
        "CNAME"?: string,
        "ALIAS"?: string,
    },
    proxy?: boolean,
}