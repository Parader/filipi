#Requires -Version 5.1
<#
.SYNOPSIS
  Persists JAVA_HOME for Gradle, Maestro, and Android builds (User env).
.EXAMPLE
  npm run setup:java
#>
$ErrorActionPreference = "Stop"

. "$PSScriptRoot\java-env.ps1"
Set-AndroidStudioJava

[System.Environment]::SetEnvironmentVariable("JAVA_HOME", $env:JAVA_HOME, "User")

$javaBin = Join-Path $env:JAVA_HOME "bin"
$userPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$javaBin*") {
  [System.Environment]::SetEnvironmentVariable("Path", "$javaBin;$userPath", "User")
}

Write-Host ""
Write-Host "Saved JAVA_HOME for your user account."
Write-Host "Close and reopen terminals (or restart Cursor) so new shells pick it up."
Write-Host ""
Write-Host "Then run: npm run android:device"
