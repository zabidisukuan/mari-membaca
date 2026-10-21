# Jadikan latar putih aset Codex lutsinar (PNG) supaya sprite tidak berkotak putih di atas latar berwarna.
# Kawasan putih yang BERSAMBUNG dengan tepi gambar sahaja dibuang (flood fill), jadi putih di dalam objek kekal.
# Guna: tools/lutsinar.ps1 [-Src assets\v2-src] [-Dst assets\v2] [-Size 360] [-Kecuali peta_pulau]
param([string]$Src = 'assets\v2-src', [string]$Dst = 'assets\v2', [int]$Size = 360, [string[]]$Kecuali = @('peta_pulau'))
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
public static class Lutsinar {
  // Pulangkan bitmap ARGB dengan latar putih (bersambung ke tepi) dijadikan lutsinar, tepi dilembutkan.
  public static Bitmap Proses(Bitmap src, int ambang) {
    int w = src.Width, h = src.Height;
    var bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);
    using (var g = Graphics.FromImage(bmp)) g.DrawImage(src, 0, 0, w, h);
    var r = new Rectangle(0, 0, w, h);
    var d = bmp.LockBits(r, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
    int n = w * h; var px = new int[n];
    Marshal.Copy(d.Scan0, px, 0, n);
    Func<int, int> cerah = c => Math.Min(Math.Min((c >> 16) & 255, (c >> 8) & 255), c & 255);
    var latar = new bool[n]; var q = new Queue<int>();
    for (int x = 0; x < w; x++) { q.Enqueue(x); q.Enqueue((h - 1) * w + x); }
    for (int y = 0; y < h; y++) { q.Enqueue(y * w); q.Enqueue(y * w + w - 1); }
    while (q.Count > 0) {
      int i = q.Dequeue();
      if (latar[i] || cerah(px[i]) < ambang) continue;
      latar[i] = true;
      int x = i % w, y = i / w;
      if (x > 0) q.Enqueue(i - 1); if (x < w - 1) q.Enqueue(i + 1);
      if (y > 0) q.Enqueue(i - w); if (y < h - 1) q.Enqueue(i + w);
    }
    for (int i = 0; i < n; i++) {
      if (latar[i]) { px[i] = 0; continue; }
      // Piksel tepi bersebelahan latar: alfa ikut kegelapan supaya garis halus tanpa halo putih
      int x = i % w, y = i / w;
      bool tepi = (x > 0 && latar[i - 1]) || (x < w - 1 && latar[i + 1]) || (y > 0 && latar[i - w]) || (y < h - 1 && latar[i + w]);
      if (tepi) {
        int c = cerah(px[i]);
        int a = Math.Max(0, Math.Min(255, (255 - c) * 255 / Math.Max(1, 255 - 180)));
        px[i] = (a << 24) | (px[i] & 0xFFFFFF);
      }
    }
    Marshal.Copy(px, 0, d.Scan0, n);
    bmp.UnlockBits(d);
    // Potong ruang lutsinar di sekeliling objek (dengan sedikit jidar) supaya sprite memenuhi kotaknya
    int x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (int i = 0; i < n; i++) {
      if (((px[i] >> 24) & 255) < 16) continue;
      int x = i % w, y = i / w;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    if (x1 < 0) return bmp;
    int jidar = Math.Max(2, Math.Max(w, h) / 60);
    x0 = Math.Max(0, x0 - jidar); y0 = Math.Max(0, y0 - jidar);
    x1 = Math.Min(w - 1, x1 + jidar); y1 = Math.Min(h - 1, y1 + jidar);
    var potong = bmp.Clone(new Rectangle(x0, y0, x1 - x0 + 1, y1 - y0 + 1), PixelFormat.Format32bppArgb);
    bmp.Dispose();
    return potong;
  }
}
"@
$root = Split-Path $PSScriptRoot -Parent
$src = Join-Path $root $Src; $dst = Join-Path $root $Dst
$n = 0
Get-ChildItem $src -Filter *.png | Where-Object { $Kecuali -notcontains $_.BaseName } | ForEach-Object {
  $img = [System.Drawing.Image]::FromFile($_.FullName)
  $s = $Size / [Math]::Max($img.Width, $img.Height)
  $w = [int]($img.Width * $s); $h = [int]($img.Height * $s)
  $kecil = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($kecil); $g.InterpolationMode = 'HighQualityBicubic'
  $g.Clear([System.Drawing.Color]::White); $g.DrawImage($img, 0, 0, $w, $h); $g.Dispose()
  $hasil = [Lutsinar]::Proses($kecil, 236)
  $hasil.Save((Join-Path $dst ($_.BaseName + '.png')), [System.Drawing.Imaging.ImageFormat]::Png)
  $hasil.Dispose(); $kecil.Dispose(); $img.Dispose(); $n++
}
"$n aset dijadikan PNG lutsinar dalam $dst"
