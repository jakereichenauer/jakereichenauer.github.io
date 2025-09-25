import os
import json
import random

def generate_gallery_json(folder_path='images/model-tests', output_file='gallery-data.json'):
    """
    Scan the specified folder (recursive for subfolders) and generate gallery-data.json.
    - Auto-paths: images/model-tests/filename.jpg (keeps subfolder)
    - Alts: Simple "Portfolio Image: filename" (edit later)
    - Types: Random 'normal', 'tall', 'wide' for mosaic variety
    - Categories: Auto-detect from subfolder (e.g., 'portfolio' default, 'bodywear' if in bodywear/)
    """
    images = []
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):  # Handles jpg/JPG
                rel_path = os.path.relpath(os.path.join(root, file), 'images').replace('\\', '/')
                alt = f"Portfolio Image: {file}"  # Customize prompt if needed
                types = ['normal', 'tall', 'wide']
                type_ = random.choice(types)
                category = 'portfolio'  # Default
                rel_path_lower = rel_path.lower()
                if 'bodywear' in rel_path_lower:
                    category = 'bodywear'
                elif 'swim' in rel_path_lower:
                    category = 'swim'
                elif 'model-tests' in rel_path_lower:
                    category = 'portfolio'
                images.append({
                    "src": f"images/{rel_path}",
                    "alt": alt,
                    "type": type_,
                    "category": category
                })
    
    data = {"images": images}
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Generated {len(images)} entries in {output_file}")
    print("Upload the new gallery-data.json and images to GitHub, then refresh your site!")

# Run it (scans only 'images/model-tests' folder by default)
generate_gallery_json()
