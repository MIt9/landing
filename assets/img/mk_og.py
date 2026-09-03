#!/usr/bin/env python3
"""Build the "Hold the position" OG card SVG -> stdout to arg1.
Cold blue-graphite ground, bone grotesque headline, cobalt left rail, acid-yellow underline."""
import sys, pathlib

BG    = "#0E1217"
VIGN  = "#080A0D"
BONE  = "#F2EEE4"
COBALT= "#2B4CF0"
ACID  = "#F5E003"

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="v" cx="50%" cy="42%" r="75%">
      <stop offset="55%" stop-color="{VIGN}" stop-opacity="0"/>
      <stop offset="100%" stop-color="{VIGN}" stop-opacity="0.9"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="{BG}"/>
  <rect width="1200" height="630" fill="url(#v)"/>

  <!-- cobalt left rail -->
  <rect x="0" y="0" width="3" height="630" fill="{COBALT}"/>

  <!-- kicker -->
  <text x="90" y="330" font-family="Arial, Helvetica, sans-serif" font-weight="700"
        font-size="19" letter-spacing="6" fill="{BONE}" fill-opacity="0.55">DMYTRO BILUKHA</text>

  <!-- headline lower-left -->
  <text font-family="'Arial Black', 'Helvetica Neue', Arial, sans-serif" font-weight="900"
        fill="{BONE}" font-size="120" letter-spacing="-3">
    <tspan x="86" y="446">FRONTEND</tspan>
    <tspan x="86" y="554">TECH LEAD</tspan>
  </text>

  <!-- acid-yellow underline -->
  <rect x="90" y="578" width="150" height="2" fill="{ACID}"/>
</svg>'''
pathlib.Path(sys.argv[1]).write_text(svg)
print("wrote", sys.argv[1])
