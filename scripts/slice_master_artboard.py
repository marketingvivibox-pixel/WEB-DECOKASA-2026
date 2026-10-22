import av
import numpy as np
import os

container = av.open('assets/designer_reference_1080x6739.jpg')
full_img = None
for frame in container.decode(video=0):
    full_img = frame.to_ndarray(format='rgb24')
    break

print(f"Loaded master artboard: {full_img.shape}")

# Function to save a cropped region as JPG
def save_crop(arr, y1, y2, x1, x2, out_name):
    crop = arr[y1:y2, x1:x2]
    out_path = os.path.join('assets', out_name)
    out_cont = av.open(out_path, mode='w')
    stream = out_cont.add_stream('mjpeg', rate=1)
    stream.width = crop.shape[1]
    stream.height = crop.shape[0]
    stream.pix_fmt = 'yuvj420p'
    frame = av.VideoFrame.from_ndarray(crop, format='rgb24')
    out_cont.mux(stream.encode(frame))
    out_cont.mux(stream.encode(None))
    out_cont.close()
    print(f"Saved {out_name}: {crop.shape[1]}x{crop.shape[0]} ({os.path.getsize(out_path)} bytes)")

# 1. Swatches carousel box:
save_crop(full_img, 1370, 1610, 80, 1000, "spc_swatches_carousel_box.jpg")

# 2. Exploded 3D plank layers:
save_crop(full_img, 2800, 3450, 480, 1050, "spc_exploded_layers.jpg")

# 3. Testimonial cards (Elena M. and Raúl P.):
save_crop(full_img, 4550, 5200, 480, 740, "spc_testimonial_elena.jpg")
save_crop(full_img, 4550, 5200, 750, 1010, "spc_testimonial_raul.jpg")

# 4. Diagonal box lying down in footer:
save_crop(full_img, 6150, 6700, 480, 1040, "spc_footer_diagonal_box.jpg")

# 5. Isometric 4 planks for testimonials:
save_crop(full_img, 4450, 4950, 40, 480, "spc_isometric_planks_4.jpg")

# 6. Standing packshot (box + 3 planks):
save_crop(full_img, 420, 1320, 260, 820, "spc_hero_packshot_clean.jpg")

if os.path.exists('assets/test.jpg'):
    os.remove('assets/test.jpg')
