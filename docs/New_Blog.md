# I Updated my Blog!
I should probably write a post about it.

So basically now I have a service that uploads my markdown files to my blog via firestore. Its pretty neat and simple, and if it words correctly everything should have a createdAt and updatedAt timestamp.

__Here is the basic code for the service:__
```
@click.command()
@click.option('--docs-dir', '-d', default='../../docs', help='Directory containing markdown files')
def upload_blog_posts(docs_dir):
    """Upload all markdown files from the specified directory to Firestore."""
    for filename in os.listdir(docs_dir):
        if filename.endswith('.md'):
            file_path = os.path.join(docs_dir, filename)
            post = process_markdown_file(file_path)
            
            # Check if post already exists
            existing_posts = db.collection('blogPosts').where('filePath', '==', file_path).limit(1).get()
            
            if existing_posts:
                existing_post = existing_posts[0]
                existing_data = existing_post.to_dict()
                if existing_data['fileHash'] != post['fileHash']:
                    # Update existing post
                    post['updatedAt'] = datetime.utcnow()
                    # Ensure createdAt exists, if not, set it to current time
                    post['createdAt'] = existing_data.get('createdAt', datetime.utcnow())
                    db.collection('blogPosts').document(existing_post.id).update(post)
                    click.echo(f"Updated blog post: {post['title']}")
                else:
                    click.echo(f"No changes detected for: {post['title']}")
            else:
                # Add new post
                current_time = datetime.utcnow()
                post['createdAt'] = current_time
                post['updatedAt'] = current_time
                doc_ref = db.collection('blogPosts').add(post)
                click.echo(f"Added new blog post: {post['title']}")

if __name__ == '__main__':
    upload_blog_posts()
```

In the future I'd like to maybe add a cron job for this or potentially executes a bunch of actions updating my X profile, my website, and potentially other things. I'm kind of thinking of something like George Jetson with a big button to press and call it a day...

![george_and_the_button](https://github.com/zill4/crispcode-io/blob/main/media/jetsons.jpg?raw=true)