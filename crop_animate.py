import os
from PIL import Image

src_path = '/home/admin/.gemini/antigravity/brain/c8d35451-bd93-414e-9464-56defd850f1e/.user_uploaded/media__1786135631742.jpg'
out_dir = '/home/admin/.gemini/antigravity/scratch/neirostudio-twa/public/animate'
os.makedirs(out_dir, exist_ok=True)

img = Image.open(src_path)
width, height = img.size # 1024, 576

# Quad 1 (Top Left): x (0, 510), y (0, 286)
# Quad 2 (Top Right): x (514, 1024), y (0, 286)
# Quad 3 (Bottom Left): x (0, 510), y (290, 576)
# Quad 4 (Bottom Right): x (514, 1024), y (290, 576)

crops = {
    'animate_gaze.jpg': (0, 0, 510, 286),
    'animate_smile.jpg': (514, 0, 1024, 286),
    'animate_talking.jpg': (0, 290, 510, 576),
    'animate_archive.jpg': (514, 290, 1024, 576),
}

for filename, box in crops.items():
    cropped = img.crop(box)
    save_path = os.path.join(out_dir, filename)
    cropped.save(save_path, quality=95)
    print(f"Saved {filename} ({cropped.size})")

