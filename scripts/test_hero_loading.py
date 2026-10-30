"""Regression check: visible hero while fonts/images/video load slowly.

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
        if self.path.endswith(('.woff2', 'snap-poster.jpg', 'hero.webm', 'hero.mp4')):
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
          window.__heroLoadingSamples = [];
          [300, 1000, 2500, 4000, 6500, 8000].forEach(delay => setTimeout(() => {
            const hero = document.querySelector('.hero-h');
            const poster = document.querySelector('.hero-poster');
            const video = document.querySelector('.hero-vid');
            if (!hero || !video) return;
            window.__heroLoadingSamples.push({
              time: delay, ready: document.readyState,
              titleOpacity: Number(getComputedStyle(hero).opacity),
              titleChildrenVisible: [...hero.querySelectorAll('.ln > div')].every(e => Number(getComputedStyle(e).opacity) > .99),
              posterReady: !!poster && poster.complete && poster.naturalWidth > 0,
              videoReady: video.readyState, videoOpacity: Number(getComputedStyle(video).opacity),
              playing: video.classList.contains('is-playing')
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
            assert all(s['posterReady'] for s in samples), 'Independent poster missing or delayed'
            assert all(s['titleOpacity'] == 1 and s['titleChildrenVisible'] for s in samples), 'Hero text hidden during startup'
            buffering = [s for s in samples if s['videoReady'] < 2]
            assert buffering, 'Slow-video scenario was not exercised'
            assert all(s['videoOpacity'] == 0 for s in buffering), 'Unready video obscures the poster'
            assert any(s['playing'] and s['videoOpacity'] == 1 for s in samples), 'Video never replaced the poster'
            assert not browser('errors'), 'Browser reported JavaScript errors'
            print('PASS: poster and text visible before slow resources; video shown only when playing')
        finally:
            browser('close')
            server.shutdown()


if __name__ == '__main__':
    main()
