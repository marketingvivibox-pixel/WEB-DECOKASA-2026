from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json,re,zipfile
root=Path(__file__).resolve().parents[1]
out=root/'preview'
class Check(HTMLParser):
    def __init__(self):super().__init__();self.ids=[];self.links=[];self.forms=[];self.calcs=0;self.h1=0
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='a':self.links.append(a.get('href',''))
        if tag=='form' and 'data-request-form' in a:self.forms.append(a)
        if 'data-pvc' in a:self.calcs+=1
        if tag=='h1':self.h1+=1
pages=[p for p in out.glob('*.html') if p.name!='DECOKASA-movil.html']
assert len(pages) in (7, 8), 'Se esperan las páginas de demostración generadas'
for page in pages:
    c=Check();c.feed(page.read_text(encoding='utf-8'))
    assert len(c.ids)==len(set(c.ids)),page
    assert c.h1==1,page
    assert c.calcs==(1 if page.name=='landing-pisos-pvc.html' else 0),page
    assert all(f['method']=='post' for f in c.forms),page
    for href in c.links:
        url=urlsplit(href)
        if url.scheme or not url.path:continue
        target=page.parent/unquote(url.path)
        assert target.exists(),(page,href)
        if url.fragment:
            anchor=Check();anchor.feed(target.read_text(encoding='utf-8'));assert url.fragment in anchor.ids,(page,href)
for directory in ['config','locales','templates','docs','preview']:
    for p in (root/directory).rglob('*.json'):json.loads(p.read_text(encoding='utf-8'))
for p in (root/'sections').glob('*.liquid'):
    for schema in re.findall(r'{% schema %}(.*?){% endschema %}',p.read_text(encoding='utf-8'),re.S):json.loads(schema)
theme_dirs=['assets','config','layout','locales','sections','snippets','templates']
zip_path=root/'releases'/'DECOKASA-tema-0.1.0.zip'
zip_path.parent.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED) as z:
    for directory in theme_dirs:
        for f in sorted((root/directory).rglob('*')):
            if f.is_file():z.write(f,f.relative_to(root).as_posix())
with zipfile.ZipFile(zip_path) as z:assert z.testzip() is None
print(json.dumps({'html_pages':len(pages),'links_ids_routes_json':'valid','theme_zip':str(zip_path),'theme_files':len(z.namelist())}))
