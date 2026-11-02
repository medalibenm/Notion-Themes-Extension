# Packages the extension for store upload. Run from anywhere:
#   powershell -ExecutionPolicy Bypass -File scripts\release.ps1
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$version = (Get-Content (Join-Path $root "manifest.json") -Raw | ConvertFrom-Json).version
$dist = Join-Path $root "dist"
$zip = Join-Path $dist "tint-for-notion-$version.zip"

New-Item -ItemType Directory -Force $dist | Out-Null
if (Test-Path $zip) { Remove-Item $zip }

# tar writes forward-slash paths, which the stores require; Compress-Archive may not.
& "$env:SystemRoot\System32\tar.exe" -a -c -f $zip -C $root manifest.json icons src
if ($LASTEXITCODE -ne 0) { throw "tar failed with exit code $LASTEXITCODE" }

Write-Output "Created $zip"
