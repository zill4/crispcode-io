import click
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import os
import hashlib
import json

# Initialize Firebase app
cred = credentials.Certificate("firebase-credentials.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

def get_file_hash(file_path):
    """Calculate MD5 hash of file contents."""
    with open(file_path, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()

def process_json_file(file_path):
    """Process a single JSON file."""
    with open(file_path, 'r') as f:
        data = json.load(f)

    file_hash = get_file_hash(file_path)

    project = {
        **data,
        'fileHash': file_hash,
        'filePath': file_path
    }

    return project

@click.command()
@click.option('--projects-dir', '-d', default='../../projects', help='Directory containing project JSON files')
def upload_projects(projects_dir):
    """Upload all JSON files from the specified directory to Firestore."""
    for filename in os.listdir(projects_dir):
        if filename.endswith('.json'):
            file_path = os.path.join(projects_dir, filename)
            project = process_json_file(file_path)

            # Check if project already exists
            existing_projects = db.collection('projects').where('filePath', '==', file_path).limit(1).get()

            if existing_projects:
                existing_project = existing_projects[0]
                existing_data = existing_project.to_dict()
                if existing_data['fileHash'] != project['fileHash']:
                    # Update existing project
                    project['updatedAt'] = datetime.utcnow()
                    project['createdAt'] = existing_data.get('createdAt', datetime.utcnow())
                    db.collection('projects').document(existing_project.id).update(project)
                    click.echo(f"Updated project: {project['title']}")
                else:
                    click.echo(f"No changes detected for: {project['title']}")
            else:
                # Add new project
                current_time = datetime.utcnow()
                project['createdAt'] = current_time
                project['updatedAt'] = current_time
                db.collection('projects').add(project)
                click.echo(f"Added new project: {project['title']}")

if __name__ == '__main__':
    upload_projects()