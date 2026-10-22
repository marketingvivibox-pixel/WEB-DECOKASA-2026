import re
import zlib

pdf_path = r"C:\Users\D. Cordova\Documents\SHOPIFY\landing spc\Intento de landing (wip).pdf"
with open(pdf_path, "rb") as f:
    data = f.read()

# Find all streams and decompress
streams = []
for m in re.finditer(rb'stream\r?\n(.*?)\r?\nendstream', data, re.DOTALL):
    raw = m.group(1)
    try:
        dec = zlib.decompress(raw)
        streams.append(dec)
    except Exception:
        pass

print(f"Total decompressed streams: {len(streams)}")

# Find commands in content streams
all_content = b"\n".join(streams)
do_calls = re.findall(rb'([0-9\.\-\s]+)cm\s+/([A-Za-z0-9_]+)\s+Do', all_content)
print(f"Found {len(do_calls)} Do calls with transform matrices:")
for matrix, name in do_calls:
    nums = [float(x) for x in matrix.strip().split()]
    # nums: [a, b, c, d, e, f] where e=x, f=y, a=width, d=height
    if len(nums) == 6:
        w, h, x, y = nums[0], nums[3], nums[4], nums[5]
        print(f"Image /{name.decode()}: x={x:.1f}, y={y:.1f}, w={w:.1f}, h={h:.1f}")
