import { NextResponse } from 'next/server';
import {revalidateTag} from 'next/cache';

export async function POST(request: Request) {
    // 1. Extract the Authorization header from the incoming request
    const authHeader = request.headers.get('authorization');
    console.log("I'm in the post method in route file "); //delete YAC

    // 2. Check if the header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized: Missing or invalid token format YAC' }, { status: 401 });
    }

    // 3. Extract the token
    const token = authHeader.split(' ')[1];
    
    // 2. Define your secret token (In production, use process.env.MY_SECRET_TOKEN)
    const SECRET_TOKEN = process.env.ORCHARD_AUTH_TOKEN;

    // 3. Validate the token
    if (token!== SECRET_TOKEN) {
        return NextResponse.json({ message: 'Unauthorized Access Denied YAC ' }, { status: 401 });
    }    
    
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
