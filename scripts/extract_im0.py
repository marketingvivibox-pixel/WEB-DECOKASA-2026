import re

pdf_path = r"C:\Users\D. Cordova\Documents\SHOPIFY\landing spc\Intento de landing (wip).pdf"
with open(pdf_path, "rb") as f:
    data = f.read()

match = re.search(rb'/Im0\s+(\d+)\s+(\d+)\s+R', data)
if match:
    obj_num = int(match.group(1))
    gen_num = int(match.group(2))
    print(f"/Im0 points to object {obj_num} {gen_num} R")
    
    pattern = rf'{obj_num}\s+{gen_num}\s+obj\b'.encode('ascii')
    start_pos = data.find(pattern)
    if start_pos != -1:
        end_pos = data.find(b'endobj', start_pos)
        obj_data = data[start_pos:end_pos]
        
        # stream bounds
        s_marker = b'stream\r\n'
        s_start = obj_data.find(s_marker)
        if s_start == -1:
            s_marker = b'stream\n'
            s_start = obj_data.find(s_marker)
        
        if s_start != -1:
            stream_start = s_start + len(s_marker)
            stream_end = obj_data.find(b'endstream', stream_start)
            stream_bytes = obj_data[stream_start:stream_end].rstrip(b'\r\n')
            print(f"Found stream! Length: {len(stream_bytes)} bytes")
            if stream_bytes.startswith(b'\xff\xd8\xff'):
                with open("assets/spc_artboard_full.jpg", "wb") as out:
                    out.write(stream_bytes)
                print("SAVED assets/spc_artboard_full.jpg!")
            else:
                import zlib
                try:
                    decomp = zlib.decompress(stream_bytes)
                    print(f"Decompressed length: {len(decomp)} bytes")
                except Exception as e:
                    print("Decompression error:", e)
