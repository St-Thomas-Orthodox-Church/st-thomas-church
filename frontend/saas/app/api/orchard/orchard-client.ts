// Fallback to the public URL if ORCHARD_ENDPOINT is undefined in the browser
const BASE_URL = process.env.NEXT_PUBLIC_ORCHARD_URL || '';
const ORCHARD_ENDPOINT = `${BASE_URL}/api/graphql/`;



//const ORCHARD_ENDPOINT: string = process.env.NEXT_PUBLIC_ORCHARD_URL as string;

interface GraphQLRequestOptions {
    query: string;
    variables?: Record<string, unknown>;
    revalidate?: number | false;
    tags?: string[];
}

/**
 * Generic fetch wrapper for all Orchard CMS GraphQL requests.
 */
export async function orchardFetch<T>({
                                          query,
                                          variables,
                                          revalidate = 60,
                                          tags,
                                      }: GraphQLRequestOptions): Promise<T> {
    // Debug log to confirm the browser can see the URL
    console.log("🌐 Client-side fetching to:", ORCHARD_ENDPOINT);
    try {
        // If the working version required the query in the URL string, construct it here:
        const queryParam = encodeURIComponent(query);
        const finalUrl = `${ORCHARD_ENDPOINT}?query=${queryParam}`;

        const res = await fetch(finalUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({query, variables}),
            next: {revalidate, tags},
        });
        
        // console.log({'res from Orchard Fetch':res}); //uncomment for debugging

        if (!res?.ok) {
            let errorDetails = "";
            try {
                errorDetails = await res.text();
            } catch (streamError) {
                errorDetails = "Could not read response stream body.";
            }
            throw new Error(`Orchard HTTP Error: ${res.status} - ${errorDetails}`);
        }


        const json = await res.json();

        if (json.errors?.length) {
            const message = json.errors.map((e: { message: string }) => e.message).join(', ');
            throw new Error(`Orchard GraphQL Error: ${message}`);
        }
        //  console.log({'json from Orchard Fetch': json.data}); //uncomment for debugging
        return json.data;
    } catch (error) {
        console.error("🚨 Fetch network failure:", error);
        throw error;


    } 
}