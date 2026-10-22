import av
import numpy as np
import os

p = r"C:\Users\D. Cordova\.gemini\antigravity-ide\brain\7b583022-4831-43de-aa58-62243bf9998a\.user_uploaded\media_1792532093758.jpg"
c = av.open(p)
for f in c.decode(video=0):
    img = f.to_ndarray(format='rgb24')
    break

def save(arr, y1, y2, x1, x2, name):
    crop = arr[y1:y2, x1:x2]
    out_cont = av.open(os.path.join('assets', name), mode='w')
    s = out_cont.add_stream('mjpeg', rate=1)
    s.width, s.height, s.pix_fmt = crop.shape[1], crop.shape[0], 'yuvj420p'
    out_cont.mux(s.encode(av.VideoFrame.from_ndarray(crop, format='rgb24')))
    out_cont.mux(s.encode(None))
    out_cont.close()
    print(f"Saved {name}: {crop.shape[1]}x{crop.shape[0]} ({os.path.getsize(os.path.join('assets', name))} bytes)")

# 1. Exploded layers 3D diagram (right side of anatomy, Y: 450 to 555, X: 80 to 169)
save(img, 452, 555, 78, 169, "spc_diagram_exploded.jpg")

# 2. Carousel 3 plank stacks (Y: 275 to 330, X: 10 to 160)
save(img, 275, 330, 8, 160, "spc_carousel_swatches.jpg")

# 3. Diagonal box & plank in footer (Y: 935 to 1015, X: 75 to 169)
save(img, 935, 1015, 75, 169, "spc_diagonal_box_footer.jpg")

# 4. Elena avatar (Y: 710 to 745, X: 88 to 118)
save(img, 710, 745, 88, 118, "spc_avatar_elena.jpg")

# 5. Raul avatar (Y: 710 to 745, X: 125 to 155)
save(img, 710, 745, 125, 155, "spc_avatar_raul.jpg")

# 6. Isometric 4 planks (Y: 690 to 770, X: 0 to 65)
save(img, 690, 770, 0, 65, "spc_isometric_planks_left.jpg")
