# Kecilkan gambar Codex (assets/img-src/*.png, ~1.2MB) kepada assets/img/<id>.jpg (480px) untuk game.
# Latar gambar putih, jadi JPEG sesuai dan jauh lebih kecil.
param([int]$Size = 480, [int]$Quality = 85, [string]$Src = 'assets\img-src', [string]$Dst = 'assets\img')
Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$src = Join-Path $root $Src
$dst = Join-Path $root $Dst
New-Item -ItemType Directory -Force $dst | Out-Null
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), ([long]$Quality)
$n = 0
Get-ChildItem $src -Filter *.png | ForEach-Object {
  $out = Join-Path $dst ($_.BaseName + '.jpg')
  if ((Test-Path $out) -and (Get-Item $out).LastWriteTime -ge $_.LastWriteTime) { return }
  $img = [System.Drawing.Image]::FromFile($_.FullName)
  $scale = $Size / [Math]::Max($img.Width, $img.Height)
  $w = [int]($img.Width * $scale); $h = [int]($img.Height * $scale)
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.Clear([System.Drawing.Color]::White)  # PNG lutsinar → latar putih
  $g.DrawImage($img, 0, 0, $w, $h)
  $bmp.Save($out, $codec, $params)
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
  $n++
}
"$n gambar dikecilkan ke $dst"
