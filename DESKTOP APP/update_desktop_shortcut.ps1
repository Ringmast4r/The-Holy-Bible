# Update Desktop Shortcut for Bible Visualizer GUI
# Points to START_BIBLE_VISUALIZER.bat launcher

$WshShell = New-Object -comObject WScript.Shell
$ShortcutPath = "$Home\Desktop\Bible Visualizer GUI.lnk"

# Remove old shortcut if exists
if (Test-Path $ShortcutPath) {
    Remove-Item $ShortcutPath -Force
    Write-Host "Removed old shortcut" -ForegroundColor Yellow
}

# Create new shortcut
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "$PSScriptRoot\START_BIBLE_VISUALIZER.bat"
$Shortcut.WorkingDirectory = "$PSScriptRoot"
$Shortcut.IconLocation = "C:\Windows\System32\shell32.dll,43"
$Shortcut.Description = "Bible Cross-Reference Visualizer - Desktop GUI"
$Shortcut.Save()

Write-Host ""
Write-Host "Desktop shortcut updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Shortcut location: $ShortcutPath" -ForegroundColor Cyan
Write-Host "Points to: $PSScriptRoot\START_BIBLE_VISUALIZER.bat" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now double-click the shortcut to launch the Bible Visualizer!" -ForegroundColor Green
