# Sync display copy (01.txt, 02.txt, …) into JS the browser can load (works without a web server).
# Ignores talk-01.txt and other non-slide files — those are author scripts, not website copy.
# Run after editing 01.txt, 02.txt, etc.:
#   powershell -ExecutionPolicy Bypass -File website\tools\sync-slide-text.ps1

$ErrorActionPreference = "Stop"
$websiteRoot = Split-Path -Parent $PSScriptRoot

function Parse-CarouselTxt([string]$Raw) {
    $result = @{
        af = @{ title = ""; body = "" }
        en = @{ title = ""; body = "" }
    }

    $parts = [regex]::Split($Raw, '\[(af|en)\]', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    for ($i = 1; $i -lt $parts.Length; $i += 2) {
        $lang = $parts[$i].ToLower()
        $block = ($parts[$i + 1] -as [string]).Trim()
        if (-not $block) { continue }

        if ($block -match '(?m)^title\s*=\s*(.+)$') {
            $result[$lang].title = $Matches[1].Trim()
            $result[$lang].body = ([regex]::Replace($block, '(?m)^title\s*=\s*.+$', '')).Trim()
        } else {
            $result[$lang].body = $block
        }
    }

    return $result
}

function Build-SlidesJs([string]$Folder, [string]$Key) {
    $slides = @{}
    if (Test-Path $Folder) {
        Get-ChildItem -Path $Folder -Filter "*.txt" | Sort-Object Name | ForEach-Object {
            if ($_.Name -like 'talk*') { return }
            if ($_.BaseName -notmatch '^\d{2}$') { return }
            $num = $_.BaseName
            $parsed = Parse-CarouselTxt (Get-Content -Path $_.FullName -Raw -Encoding UTF8)
            $slides[$num] = $parsed
        }
    }

    $json = $slides | ConvertTo-Json -Depth 5 -Compress
    return "window.CAROUSEL_TEXT = window.CAROUSEL_TEXT || {}; window.CAROUSEL_TEXT['$Key'] = $json;"
}

$outDir = Join-Path $websiteRoot "js\generated"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$leidraadFolder = Join-Path $websiteRoot "assets\leidraad\screenshots"
$antwoordFolder = Join-Path $websiteRoot "assets\antwoord\screenshots"

$groepeFolder = Join-Path $websiteRoot "assets\groepe\screenshots"
$lengtesFolder = Join-Path $websiteRoot "assets\lengtes\screenshots"
$anagramFolder = Join-Path $websiteRoot "assets\anagram\screenshots"
$pangramFolder = Join-Path $websiteRoot "assets\pangram\screenshots"

$leidraadJs = Build-SlidesJs $leidraadFolder "leidraad"
$antwoordJs = Build-SlidesJs $antwoordFolder "antwoord"
$groepeJs = Build-SlidesJs $groepeFolder "groepe"
$lengtesJs = Build-SlidesJs $lengtesFolder "lengtes"
$anagramJs = Build-SlidesJs $anagramFolder "anagram"
$pangramJs = Build-SlidesJs $pangramFolder "pangram"

Set-Content -Path (Join-Path $outDir "leidraad-slides.js") -Value $leidraadJs -Encoding UTF8
Set-Content -Path (Join-Path $outDir "antwoord-slides.js") -Value $antwoordJs -Encoding UTF8
Set-Content -Path (Join-Path $outDir "groepe-slides.js") -Value $groepeJs -Encoding UTF8
Set-Content -Path (Join-Path $outDir "lengtes-slides.js") -Value $lengtesJs -Encoding UTF8
Set-Content -Path (Join-Path $outDir "anagram-slides.js") -Value $anagramJs -Encoding UTF8
Set-Content -Path (Join-Path $outDir "pangram-slides.js") -Value $pangramJs -Encoding UTF8

Write-Host "Synced slide text:"
Write-Host "  js/generated/leidraad-slides.js"
Write-Host "  js/generated/antwoord-slides.js"
Write-Host "  js/generated/groepe-slides.js"
Write-Host "  js/generated/lengtes-slides.js"
Write-Host "  js/generated/anagram-slides.js"
Write-Host "  js/generated/pangram-slides.js"
Write-Host "Refresh your browser to see changes."
