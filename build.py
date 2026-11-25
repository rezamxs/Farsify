#!/usr/bin/env python3
"""بیلد افزونه برای کروم/بریو/اج (service_worker) و فایرفاکس (scripts)"""
import json, os, shutil, zipfile

SRC = os.path.dirname(os.path.abspath(__file__))
VERSION = json.load(open(os.path.join(SRC, "manifest.json")))["version"]
DIST = os.path.join(SRC, "dist")

FILES = ["content.js", "font.js", "background.js", "popup.html", "popup.js", "icon.png"]

def make(dest_name, manifest_mod, readme_name="README.md"):
    work = os.path.join(DIST, dest_name.replace(".zip", ""))
    shutil.rmtree(work, ignore_errors=True)
    os.makedirs(work)
    manifest = json.load(open(os.path.join(SRC, "manifest.json")))
    manifest.update(manifest_mod)
    with open(os.path.join(work, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    for fn in FILES:
        shutil.copy(os.path.join(SRC, fn), os.path.join(work, fn))
    shutil.copy(os.path.join(SRC, readme_name), os.path.join(work, "README.md"))
    out = os.path.join(DIST, dest_name)
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for root, _, fns in os.walk(work):
            for fn in fns:
                p = os.path.join(root, fn)
                z.write(p, os.path.relpath(p, work))
    print("built:", out)

# کروم / بریو / اج — Manifest V3 با service worker
make(f"chrome-farsify-v{VERSION}.zip", {})

# فایرفاکس — پس‌زمینه به صورت event page + شناسه gecko
make(f"firefox-farsify-v{VERSION}.zip", {
    "background": {"scripts": ["background.js"]},
    "browser_specific_settings": {
        "gecko": {"id": "farsify@example.com", "strict_min_version": "115.0"}
    }
})

print("done")
