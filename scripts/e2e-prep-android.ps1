#Requires -Version 5.1
<#
.SYNOPSIS
  Prepares the Android emulator for local Maestro E2E (adb reverse + device check).
#>
$ErrorActionPreference = "Stop"

$adb = Get-Command adb -ErrorAction SilentlyContinue
if (-not $adb) {
  Write-Error "adb not found. Install Android SDK platform-tools and add them to PATH."
}

Write-Host "Restarting adb…"
& adb kill-server | Out-Null
Start-Sleep -Seconds 1
& adb start-server | Out-Null

$devices = & adb devices | Select-String "`tdevice$"
if (-not $devices) {
  Write-Error "No Android device/emulator online. Start an emulator, then retry."
}

Write-Host "Devices:"
& adb devices -l

$port = if ($env:METRO_PORT) { $env:METRO_PORT } else { "8082" }
# Also reverse common Expo ports (Docker often steals 8081 on this machine).
foreach ($p in @($port, "8081", "8082")) {
  Write-Host "adb reverse tcp:$p tcp:$p"
  & adb reverse "tcp:$p" "tcp:$p" | Out-Null
}

Write-Host "Ready. Start Metro with: npm run start:dev"
Write-Host "Then run:           npm run test:e2e:smoke"
Write-Host "If Expo printed a different port than $port, update .maestro/smoke.yaml openLink URL."
