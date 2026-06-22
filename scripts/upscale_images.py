from PIL import Image
import os

input_dir = 'public/images/chariscell/'
output_dir = 'public/images/chariscell/'

# Target files
files = [f'main_visual0{i}.jpg' for i in range(1, 9)]

for filename in files:
    filepath = os.path.join(input_dir, filename)
    if os.path.exists(filepath):
        try:
            with Image.open(filepath) as img:
                # Calculate new size (2x)
                new_width = img.width * 2
                new_height = img.height * 2
                
                # Resize using Lanczos resampling (high quality)
                resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                
                # Overwrite original
                resized_img.save(filepath, quality=100, optimize=False)
                print(f"Successfully resized {filename} to {new_width}x{new_height}")
        except Exception as e:
            print(f"Error processing {filename}: {e}")
    else:
        print(f"File not found: {filepath}")

print("Image processing complete.")
