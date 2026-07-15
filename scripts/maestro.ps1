#Requires -Version 5.1
<#
.SYNOPSIS
  Runs Maestro against the Filipi Boats development build (not Expo Go).

.DESCRIPTION
  - Sets JAVA_HOME to Android Studio's JBR when needed
  - Loads .env.maestro (or .env.maestro.example defaults)
  - Builds DEV_CLIENT_URL for expo-dev-client → Metro
  - Forwards remaining args to the Maestro CLI

.EXAMPLE
  npm run maestro -- test .maestro/smoke.yaml
  .\scripts\maestro.ps1 test .maestro/auth-flow.yaml
#>

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

# --- Java (Maestro + Gradle) ------------------------------------------------
. "$PSScriptRoot\java-env.ps1"
Set-AndroidStudioJava

# --- Load .env.maestro ------------------------------------------------------
function Import-DotEnv([string]$Path) {
  if (-not (Test-Path $Path)) { return }
  Get-Content $Path | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith("#")) { return }
    $eq = $line.IndexOf("=")
    if ($eq -lt 1) { return }
    $key = $line.Substring(0, $eq).Trim()
    $value = $line.Substring($eq + 1).Trim()
    if ($value.StartsWith('"') -and $value.EndsWith('"')) {
      $value = $value.Substring(1, $value.Length - 2)
    }
    # Do not override values already set in the process / CLI
    $existing = [System.Environment]::GetEnvironmentVariable($key, "Process")
    if ([string]::IsNullOrEmpty($existing)) {
      Set-Item -Path "Env:$key" -Value $value
    }
  }
}

Import-DotEnv (Join-Path $RepoRoot ".env.maestro")
if (-not $env:APP_ID) {
  Import-DotEnv (Join-Path $RepoRoot ".env.maestro.example")
}

# --- Defaults for Android emulator -----------------------------------------
if (-not $env:APP_ID) { $env:APP_ID = "com.filipiboats.app" }
if (-not $env:METRO_HOST) { $env:METRO_HOST = "10.0.2.2" }
if (-not $env:METRO_PORT) { $env:METRO_PORT = "8082" }
if (-not $env:APP_SCHEME) { $env:APP_SCHEME = "filipiboats" }

if (-not $env:DEV_CLIENT_URL) {
  $metroUrl = "http://$($env:METRO_HOST):$($env:METRO_PORT)?disableOnboarding=1"
  $encoded = [uri]::EscapeDataString($metroUrl)
  $env:DEV_CLIENT_URL = "$($env:APP_SCHEME)://expo-development-client/?url=$encoded"
}

# Maestro Studio / CLI also pick up MAESTRO_* process env automatically.
$env:MAESTRO_DEV_CLIENT_URL = $env:DEV_CLIENT_URL
$env:MAESTRO_APP_ID = $env:APP_ID

# --- Maestro binary ---------------------------------------------------------
$maestro = Get-Command maestro -ErrorAction SilentlyContinue
if ($maestro) {
  $maestroPath = $maestro.Source
} elseif (Test-Path "C:\maestro\bin\maestro.bat") {
  $maestroPath = "C:\maestro\bin\maestro.bat"
} else {
  Write-Error "maestro not found on PATH. Install Maestro, then retry."
}

# Strip a leading "--" from npm
$MaestroArgs = @($args | Where-Object { $_ -ne "--" })
if ($MaestroArgs.Count -eq 0) {
  $MaestroArgs = @("--help")
}

# Maestro resolves ${DEV_CLIENT_URL} from -e flags, not process env.
if ($MaestroArgs -contains "test") {
  $testIndex = [array]::IndexOf([string[]]$MaestroArgs, "test")
  $before = if ($testIndex -gt 0) { $MaestroArgs[0..($testIndex - 1)] } else { @() }
  $after = if ($testIndex -lt ($MaestroArgs.Count - 1)) { $MaestroArgs[($testIndex + 1)..($MaestroArgs.Count - 1)] } else { @() }

  $hasDevUrl = $false
  for ($i = 0; $i -lt $MaestroArgs.Count; $i++) {
    if ($MaestroArgs[$i] -eq "-e" -and ($i + 1) -lt $MaestroArgs.Count -and $MaestroArgs[$i + 1] -like "DEV_CLIENT_URL=*") {
      $hasDevUrl = $true
      break
    }
    if ($MaestroArgs[$i] -like "-e=DEV_CLIENT_URL=*") {
      $hasDevUrl = $true
      break
    }
  }

  $injected = @("test")
  if (-not $hasDevUrl) {
    $injected += @("-e", "DEV_CLIENT_URL=$($env:DEV_CLIENT_URL)")
  }
  $MaestroArgs = @($before) + @($injected) + @($after)
}

Write-Host "JAVA_HOME=$env:JAVA_HOME"
Write-Host "APP_ID=$env:APP_ID"
Write-Host "DEV_CLIENT_URL=$env:DEV_CLIENT_URL"
Write-Host "maestro $($MaestroArgs -join ' ')"

& $maestroPath @MaestroArgs
exit $LASTEXITCODE
