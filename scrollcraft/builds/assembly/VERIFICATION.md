# Assembly verification

Local preview: http://localhost:4500. Source branch: redesign/scroll-craft-atlas.

Chrome headless: desktop 1440×1000, phone 390×844, compact 360×640, desktop reduced motion, and a JavaScript-disabled phone. Native pointer lock and capture disabled in automated contexts.

Opening, intermediate hero, hero exit and each room captured. Contact sheets and full-size frames reviewed. Corrected the gallery entrance, which initially clipped the case artwork on phones; it is now a short one-shot reveal. Corrected active dock text contrast. Inspected static reduced-motion composition and selected conversation ticket. Screenshot artifacts live under scrollcraft/lab/assembly and are excluded from git.

Functional checks: no horizontal overflow, missing images, invalid fragment destinations, HTTP errors or JavaScript errors in four configurations. Both CV PDFs return successfully. Add two shortlist items, remove one, verify button states and count, verify selected project names in mailto subject/body. Repository disclosure opens and its save action works. No-JS title and reading remain available. Genuine image alpha checked using canvas pixel data. Desktop pointer-state screenshots change meaningful pixels. Keyboard skip link checked.

Slow-resource regression: hero copy stays visible from 300ms through 8 seconds while local fonts and sculpture are delayed. Sculpture is present when loading finishes. JavaScript syntax and git whitespace checks pass.

Feel check: intrigue → recognition → confidence → connection → agency → readiness, matching the authored curve. Project chapter is the largest chapter; the quiet intro precedes it. Contact carries choices to the final action and holds. Grammar comparison clears all six dimensions against the retained fieldnotes row.

Limits: physical iPhone and actual email sending were not tested. External YouTube playback was not exercised; links lead directly to the existing walkthroughs. This is not a complete screen-reader audit. One built-in imagegen call; no KIE/external media API spend. Built-in tool does not expose a dollar receipt.

Run visual/functional checks with playwright-core available to Node: `NODE_PATH=/tmp/landing-qa/node_modules node scripts/test_assembly.cjs` while a local HTTP server runs on port 4500. Run the slow-resource check with `python3 scripts/test_hero_loading.py` (uses installed agent-browser).
