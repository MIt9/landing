#!/usr/bin/env python3
"""Build the Weekly Circular OG image SVG. arg1 = greyscale portrait path."""
import sys, base64, pathlib

portrait = sys.argv[1]
b = pathlib.Path(portrait).read_bytes()
uri = "data:image/jpeg;base64," + base64.b64encode(b).decode()

PAPER = "#FAF7F0"
INK = "#1B1A17"
RED = "#E4002B"

# text column: x 44 .. 786 (width 742); portrait column x 802 .. 1156
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="{PAPER}"/>
  <!-- portrait column -->
  <clipPath id="pc"><rect x="802" y="44" width="354" height="542"/></clipPath>
  <image xlink:href="{uri}" x="742" y="44" width="474" height="542"
         preserveAspectRatio="xMidYMid slice" clip-path="url(#pc)"/>
  <rect x="802" y="44" width="354" height="542" fill="none" stroke="{INK}" stroke-width="1.5"/>

  <!-- nameplate -->
  <line x1="44" y1="46" x2="786" y2="46" stroke="{INK}" stroke-width="3"/>
  <text x="44" y="112" font-family="Arial Black, Arial, sans-serif" font-weight="900"
        font-size="74" fill="{INK}" textLength="742" lengthAdjust="spacingAndGlyphs"
        letter-spacing="-1">DMYTRO BILUKHA</text>
  <line x1="44" y1="126" x2="786" y2="126" stroke="{INK}" stroke-width="1.5"/>
  <rect x="44" y="132" width="742" height="6" fill="{RED}"/>

  <!-- dateline -->
  <text x="44" y="164" font-family="Arial, Helvetica, sans-serif" font-weight="700"
        font-size="15.5" fill="{INK}" letter-spacing="3"
        textLength="742" lengthAdjust="spacingAndGlyphs">FRONTEND TECH LEAD  ·  VINNYTSIA, UKRAINE  ·  THE WEEKLY CIRCULAR</text>
  <line x1="44" y1="178" x2="786" y2="178" stroke="{INK}" stroke-width="1"/>

  <!-- headline -->
  <text font-family="Georgia, 'Times New Roman', serif" font-weight="700" fill="{INK}" font-size="45">
    <tspan x="44" y="264">Ten years building the</tspan>
    <tspan x="44" y="316">storefront for Ukraine&#8217;s</tspan>
    <tspan x="44" y="368">largest grocer</tspan>
  </text>

  <!-- kicker -->
  <rect x="44" y="430" width="150" height="30" fill="{RED}"/>
  <text x="119" y="451" font-family="Arial Black, Arial, sans-serif" font-weight="900"
        font-size="15" fill="{PAPER}" letter-spacing="1" text-anchor="middle">SPECIAL ISSUE</text>
  <text x="210" y="451" font-family="Georgia, serif" font-style="italic" font-size="19" fill="{INK}">Building software for how Ukraine actually shops.</text>

  <line x1="44" y1="586" x2="786" y2="586" stroke="{INK}" stroke-width="3"/>
</svg>'''
pathlib.Path(sys.argv[2]).write_text(svg)
print("wrote", sys.argv[2])
