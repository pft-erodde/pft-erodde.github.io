$files = Get-ChildItem -Filter *.html

foreach ($f in $files) {
    $content = [System.IO.File]::ReadAllText($f.FullName)
    $original = $content

    # Email with newlines
    $content = $content -replace '(?s)<svg[^>]*class="icon-svg"[^>]*>\s*<path\s*d="M20 4H4c-1\.1 0-1\.99\.9-1\.99 2L2 18c0 1\.1\.9 2 2 2h16c1\.1 0 2-\.9 2-2V6c0-1\.1-\.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"\s*/>\s*</svg>', '<svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" fill="currentColor" opacity="0.1"/><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 6l10 7 10-7"/></svg>'

    if ($content -cne $original) {
        [System.IO.File]::WriteAllText($f.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated $($f.Name)"
    }
}
