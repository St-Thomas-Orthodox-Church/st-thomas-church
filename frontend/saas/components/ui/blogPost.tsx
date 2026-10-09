"use client"
import { useState } from 'react';
import './blogPost.css';
import  {BlogItem} from "@/app/types/blog";
import Image from 'next/image';
import PageBanner from "@/components/images/PageBanner";

export const BlogPost=({blog} : {blog:BlogItem} )=>{
    // 🚀 State to track if the post is expanded or collapsed
    const [isExpanded, setIsExpanded] = useState(false);
    if (!blog) return <p>Loading post...</p>;
    
    return (
    <article className="blog-post">
        {/* Header */}
        <header>
            <h2>
                {blog.displayText || ""}
            </h2>
        </header>

        {blog.image?.files[0] &&
            <section>
                <PageBanner
                    src={blog.image?.files[0]?.url??''}
                    imageDescription={blog.image?.files[0]?.fileName || "Blog image"}
                    width={800}  // maximum estimated width it will ever be on screen
                    height={600} // e matching estimated height
                />
            </section>
        }
     
        {/* Body Content with Smart CSS Clamping */}
        <div className="post-body"
            /* 🪄 The magic truncate recipe when collapsed */
             style={{
                 display: isExpanded ? 'block' : '-webkit-box',
                 WebkitLineClamp: isExpanded ? 'unset' : 3, /* Shows only 3 lines of text */
                 WebkitBoxOrient: 'vertical',
                 overflow: isExpanded ? 'visible' : 'hidden',
             }}>
            {blog.markdownBody ? (
                /* Using dangerouslySetInnerHTML because Orchard Core HTML fields return raw HTML strings */
                <div dangerouslySetInnerHTML={{ __html: blog.markdownBody.html || ''}}/>
            ) : (
                <p>No content available for this post.</p>
            )}
        </div>
        {/* "...more" / "show less" Action Toggle Link */}
        {blog.markdownBody && (
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--highlight-solid, #b7906e)',
                    padding: '0',
                    marginTop: '0.5rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    display: 'inline-flex',
                    alignItems: 'center'
                }}
            >
                {isExpanded ? 'Show less ▲' : '...more ▼'}
            </button>
        )}
    </article>
)
}
