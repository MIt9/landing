"""Regression check: visible hero while fonts and sculpture load slowly.

Run: python3 scripts/test_hero_loading.py (requires agent-browser).
Uses a temporary local server and isolated browser; no project dependencies.
"""
import base64
import functools
import http.server
import json
from pathlib import Path
import subprocess
import tempfile
import threading
import time

ROOT = Path(__file__).resolve().parents[1]


class SlowAssets(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.endswith(('.woff2', 'structure.png')):
            time.sleep(3)
        super().do_GET()

    def log_message(self, *_):
        pass


def main():
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(SlowAssets, directory=str(ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    session = 'hero-loading-regression'

    def browser(*args):
        return subprocess.run(['agent-browser', '--session', session, *args], capture_output=True, text=True, check=True).stdout.strip()

    with tempfile.TemporaryDirectory(prefix='hero-loading-') as folder:
        probe = Path(folder) / 'probe.js'
        probe.write_text('''
          Element.prototype.requestPointerLock = () => {};
          Element.prototype.setPointerCapture = () => {};
          window.__heroLoadingSamples = [];
          [300, 1000, 2500, 4000, 6500, 8000].forEach(delay => setTimeout(() => {
            const hero = document.querySelector('.hero-h');
            const poster = document.querySelector('.sculpture img');
            if (!hero || !poster) return;
            window.__heroLoadingSamples.push({
              time: delay, ready: document.readyState,
              titleOpacity: Number(getComputedStyle(hero).opacity),
              titleChildrenVisible: [...hero.querySelectorAll('.ln > div')].every(e => Number(getComputedStyle(e).opacity) > .99),
              posterReady: !!poster && poster.complete && poster.naturalWidth > 0
            });
          }, delay));
        ''')
        try:
            browser('--init-script', str(probe), 'open', f'http://127.0.0.1:{server.server_port}/')
            js = '''(async () => {
              await new Promise(resolve => {
                const check = () => window.__heroLoadingSamples.length >= 6 ? resolve() : setTimeout(check, 100);
                check();
              });
              return window.__heroLoadingSamples;
            })()'''
            samples = json.loads(browser('eval', '-b', base64.b64encode(js.encode()).decode()))
            print(json.dumps(samples, indent=2))
            assert all(s['titleOpacity'] == 1 and s['titleChildrenVisible'] for s in samples), 'Hero text hidden during startup'
            assert samples[-1]['posterReady'], 'Sculpture failed to load'
            assert not browser('errors'), 'Browser reported JavaScript errors'
            print('PASS: hero title remains visible while slow sculpture and fonts load')
        finally:
            browser('close')
            server.shutdown()


if __name__ == '__main__':
    main()
