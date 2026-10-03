import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { orchardFetch } from "../orchard/orchard-client";

// Define a simple GraphQL query to look up an item by its ID
const GET_ITEM_BY_ID = `
  query GetItemById($contentItemId: String!) {
    contentItem(contentItemId: $contentItemId) {
      contentType
      displayText
    }
  }
`;

export async function POST(request) {
    try {
        // 1. Get the simple notification from the workflow
        const { contentItemId, contentType } = await request.json();

        if (!contentItemId) {
            return NextResponse.json({ message: 'Missing contentItemId' }, { status: 400 });
        }

        // 2. Fetch fresh data using your existing orchardFetch tool
        const data = await orchardFetch({
            query: GET_ITEM_BY_ID,
            variables: { contentItemId },
            revalidate: 0, // Force a fresh bypass fetch right now
        });

        console.log('🔄 Fetched fresh data from Orchard Core:', data);

        // 3. Purge the cached data tags using Next.js native revalidation
        // This instantly invalidates any page that was built using this Content Type tag!
        if (contentType) {
            revalidateTag(contentType);
            console.log(`✅ Next.js Cache cleared for tag: ${contentType}`);
        }

        return NextResponse.json({
            revalidated: true,
            message: `Refreshed content successfully for ${contentType}`
        }, { status: 200 });

    } catch (error) {
        console.error('🚨 Webhook handler failed:', error);
        return NextResponse.json({ message: 'Error updating frontend' }, { status: 500 });
    }
}
