# Generates instagram-mockup-square.png and instagram-mockup-story.png
# into website/assets/social/

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error "Node.js is required. Install from https://nodejs.org/ then run this script again."
}

node .\export-mockup-png.mjs

Write-Host ""
Write-Host "Done. PNGs are in website/assets/social/"
