#Requires -Version 5.1
<#
.SYNOPSIS
  Builds and installs the Android development client with JAVA_HOME configured.
.EXAMPLE
  npm run android:device
#>
$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

. "$PSScriptRoot\java-env.ps1"
Set-AndroidStudioJava

$expoArgs = @("run:android", "--port", "8082") + @($args | Where-Object { $_ -ne "--" })

Write-Host "npx expo $($expoArgs -join ' ')"
& npx expo @expoArgs
exit $LASTEXITCODE
