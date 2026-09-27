const ORCHARD_ENDPOINT = `${process.env.NEXT_PUBLIC_ORCHARD_URL}/api/graphql/`;

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
    try {
        const res = await fetch(ORCHARD_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables }),
            next: { revalidate, tags },
        });
       // console.log({'res from Orchard Fetch':res}); //uncomment for debugging
        if (!res.ok) {
            // Read the server's JSON error response
            const errorJson = await res.json();
            const errorBody= `Orchard HTTP Error: ${res.status} ${res.statusText}`;
            throw new Error(errorBody);
            console.error("🚨 Orchard 400 Details:", errorBody);
        }

        const json = await res.json();

        if (json.errors?.length) {
            const message = json.errors.map((e: { message: string }) => e.message).join(', ');
            throw new Error(`Orchard GraphQL Error: ${message}`);
        }
      //  console.log({'json from Orchard Fetch': json.data}); //uncomment for debugging
        return json.data;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('🚨 Orchard Fetch Failed:', message);
        throw error;
    }
}