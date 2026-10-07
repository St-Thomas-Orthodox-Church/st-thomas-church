import {NextRequest, NextResponse } from 'next/server';
import {revalidateTag} from 'next/cache';


// Define a simple GraphQL query to look up an item by its ID
const GET_ITEM_BY_ID = `
  query GetItemById($contentItemId: String!) {
    contentItem(contentItemId: $contentItemId) {
      contentType
      displayText
    }
  }
`;

export async function POST(request: NextRequest) {
    try {
        // 1. Parse the incoming JSON from Orchard Workflow
        const body = await request.json();
        const { contentType } = body;
        console.log(contentType);

        if ( !contentType) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        console.log(`♻️ Revalidation triggered for [${contentType}]`);

        // 2. Trigger revalidation on your main blogs page
        // Change '/blogs' to whatever your actual blog listing route is (e.g., '/blog' or '/')
        revalidateTag(contentType, 'max');

        return NextResponse.json({
            revalidated: true,
            message: `Successfully revalidated ${contentType}`, 
            now: Date.now()
        });
    } catch (err) {
        return NextResponse.json({message: 'Error revalidating'}, {status: 500});
    }
}
