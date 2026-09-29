import {getBlogs} from '@/app/api/orchard/blogs';
import {BlogItem} from "@/app/types/blog";
import {BlogPost} from '@/components/ui/blogPost';


export default async function BlogsPage() {

        const blogs: BlogItem[] | null= await getBlogs().catch(()=>null);
       
        if (blogs === null) {
            return (
                <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
                    <h1>Blogs</h1>
                    <p>No blog posts found. Make sure you have created and published posts in Orchard Core.</p>
                </div>
            );
        }
    if (blogs.length === 0) {
        return (
            <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
                <h1>Blogs</h1>
                <p>No blog posts found. Make sure you have created and published posts in Orchard Core.</p>
            </div>
        );
    }

    // 1. Sort the blog posts by date: oldest  first
    
    const sortedAndFilteredBlogs = [...blogs]
        .filter(b => b.blogType === 'aboutFaith')
        .sort((a, b) =>
            new Date(a.created).getTime() - new Date(b.created).getTime()
        );

    if (sortedAndFilteredBlogs.length === 0) {
        return (
            <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
                <h1>Blogs</h1>
                <p>No blog posts found. Make sure you have created and published posts in Orchard Core.</p>
            </div>
        );
    }     
        
        
    return (
        <div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem'}}>
                {sortedAndFilteredBlogs.map((blog, id) => (
                    <BlogPost key={id} blog={blog}/>))}
            </div>
        </div>
    )

}