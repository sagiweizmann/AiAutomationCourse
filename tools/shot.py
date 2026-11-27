# Crop the newest Browser-pane screenshot into site/assets/<dir>/<name>.jpg
# usage: PYTHONPATH=<pillow> python3 tools/shot.py s09 NAME x0 y0 x1 y1 [blur x0 y0 x1 y1 ...]
import sys, glob, os
from PIL import Image, ImageFilter
T = os.path.expanduser('~/.claude/projects/-Users-sagi-repos-source-AiAutomationCourse/46fa4601-f649-4613-8f27-5983e1ed0e0a/tool-results/')
f = os.environ.get('SRC') or sorted(glob.glob(T + 'mcp-Claude_Browser-blob-*'), key=os.path.getmtime)[-1]
im = Image.open(f).convert('RGB')
a = sys.argv; d, name = a[1], a[2]; box = tuple(map(int, a[3:7])); rest = a[7:]
while rest and rest[0] == 'blur':
    b = tuple(map(int, rest[1:5])); im.paste(im.crop(b).filter(ImageFilter.GaussianBlur(8)), b); rest = rest[5:]
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'site', 'assets', d, name + '.jpg')
os.makedirs(os.path.dirname(out), exist_ok=True)
im.crop(box).save(out, quality=90); print(os.path.normpath(out), im.crop(box).size)
