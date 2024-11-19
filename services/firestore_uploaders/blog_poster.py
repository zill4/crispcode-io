import click
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import os
import hashlib

# Initialize Firebase app
cred = credentials.Certificate("firebase-credentials.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

def get_file_hash(file_path):
    """Calculate MD5 hash of file contents."""
    with open(file_path, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()

def process_markdown_file(file_path):
    """Process a single markdown file."""
    with open(file_path, 'r') as f:
        content = f.read()
    
    lines = content.split('\n')
    title = lines[0].lstrip('#').strip()
    content = '\n'.join(lines[1:]).strip()
    
    file_hash = get_file_hash(file_path)
    
    post = {
        'authorId': 'MDAFRgSWFHfkyRdXL46AQPDNWAF3',
        'authorName': 'Zill4',
        'content': content,
        'title': title,
        'fileHash': file_hash,
        'filePath': file_path
    }
    
    return post

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