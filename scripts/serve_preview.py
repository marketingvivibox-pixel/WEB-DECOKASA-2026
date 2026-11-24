import http.server
import socketserver
import os
import sys

PORT = 8820
DIRECTORY = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'preview')

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        path_lower = self.path.split('?', 1)[0].lower()
        if path_lower.endswith(('.webp', '.png', '.jpg', '.jpeg', '.ttf', '.woff2', '.ico')):
            self.send_header('Cache-Control', 'public, max-age=600')
        else:
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()

def run():
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    with http.server.ThreadingHTTPServer(("", PORT), NoCacheHandler) as httpd:
        print(f"Serving preview on http://localhost:{PORT} from {DIRECTORY} (multi-threaded)")
        sys.stdout.flush()
        httpd.serve_forever()

if __name__ == '__main__':
    run()
