#Requires -Version 5.1
<#
.SYNOPSIS
  Ensures JAVA_HOME points at Android Studio's bundled JDK (Windows).
  Dot-source from other scripts: . "$PSScriptRoot\java-env.ps1"; Set-AndroidStudioJava
#>
function Set-AndroidStudioJava {
  $candidates = @(
    "C:\Program Files\Android\Android Studio\jbr",
    "$env:LOCALAPPDATA\Programs\Android\Android Studio\jbr",
    "$env:ProgramFiles\Android\Android Studio\jbr"
  )

  $jbr = $null
  foreach ($path in $candidates) {
    if (Test-Path (Join-Path $path "bin\java.exe")) {
      $jbr = $path
      break
    }
  }

  if (-not $jbr) {
    throw @"
Java (JDK) not found. Install Android Studio, or set JAVA_HOME to JDK 17+.

Expected one of:
  $($candidates -join "`n  ")
"@
  }

  if (-not $env:JAVA_HOME -or -not (Test-Path (Join-Path $env:JAVA_HOME "bin\java.exe"))) {
    $env:JAVA_HOME = $jbr
  }

  $javaBin = Join-Path $env:JAVA_HOME "bin"
  if ($env:Path -notlike "*$javaBin*") {
    $env:Path = "$javaBin;$env:Path"
  }

  Write-Host "JAVA_HOME=$env:JAVA_HOME"
}

if ($MyInvocation.InvocationName -ne ".") {
  Set-AndroidStudioJava
}
