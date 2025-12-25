# Create Desktop Shortcut for Bible Visualizer
# Run this script to create a shortcut on your desktop

$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$Home\Desktop\Bible Visualizer GUI.lnk")
$Shortcut.TargetPath = "$PSScriptRoot\START_BIBLE_VISUALIZER.bat"
$Shortcut.WorkingDirectory = "$PSScriptRoot"
$Shortcut.IconLocation = "C:\Windows\System32\shell32.dll,43"  # Bible/book icon
$Shortcut.Description = "Bible Cross-Reference Visualizer - Desktop GUI"
$Shortcut.Save()

Write-Host "[OK] Desktop shortcut created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now launch Bible Visualizer from your desktop" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
