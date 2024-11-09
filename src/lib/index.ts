export const apiBaseURL = 'https://partofmyid-api.satr14.my.id';

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