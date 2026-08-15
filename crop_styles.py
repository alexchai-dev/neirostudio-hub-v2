import os
from PIL import Image

src_path = '/home/admin/.gemini/antigravity/brain/c8d35451-bd93-414e-9464-56defd850f1e/.user_uploaded/media__1786132891105.jpg'
out_dir = '/home/admin/.gemini/antigravity/scratch/neirostudio-twa/public/styles'
os.makedirs(out_dir, exist_ok=True)

img = Image.open(src_path)

# Remove the bottom text overlay (approx 28px from bottom of each cell)
crops = {
    'male_forbes.jpg': (0, 44, 253, 338),
    'male_dubai.jpg': (257, 44, 510, 338),
    'female_forbes.jpg': (514, 44, 767, 338),
    'female_dubai.jpg': (771, 44, 1024, 338),

    'male_oldmoney.jpg': (0, 372, 253, 666),
    'male_cinematic.jpg': (257, 372, 510, 666),
    'female_oldmoney.jpg': (514, 372, 767, 666),
    'female_cinematic.jpg': (771, 372, 1024, 666),

    'male_speaker.jpg': (0, 700, 510, 996),
    'female_speaker.jpg': (514, 700, 1024, 996),
}

for filename, box in crops.items():
    cropped = img.crop(box)
    save_path = os.path.join(out_dir, filename)
    cropped.save(save_path, quality=95)
    print(f"Saved {filename} ({cropped.size})")

