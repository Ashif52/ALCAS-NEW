$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = "D:\ALCAS\ALCAS-for-Bluefin-India"
$watcher.Filter = "coming-soon.html"
$watcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite
$watcher.EnableRaisingEvents = $true

Register-ObjectEvent $watcher "Changed" -Action {
    Start-Sleep -Milliseconds 300
    Copy-Item "D:\ALCAS\ALCAS-for-Bluefin-India\coming-soon.html" "D:\ALCAS\ALCAS-for-Bluefin-India\public\coming-soon.html" -Force
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Synced coming-soon.html to public/"
} | Out-Null

Write-Host "File watcher active - edits auto-sync to public/"
while ($true) { Start-Sleep -Seconds 1 }
