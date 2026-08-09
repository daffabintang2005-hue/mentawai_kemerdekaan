# Mobile Refinement + Video Fix Plan Tasks

## Mobile Layout
- [x] Add base top padding for subpage headers (.page-hero, #biodata) to clear fixed nav
- [x] Expand @media (max-width:640px): compact nav, back-btn icon-only, hero buttons full width, carousel arrows align right, tighter container/spacing
- [x] Add @media (max-width:480px): compact brand/counter/hero for small phones
- [x] Edit destinasi.html, budaya.html, sejarah.html, biodata.html: wrap "Beranda" in <span class="back-label">
- [x] Fix biodata.html typos: "3i Juli" -> "31 Juli" and TikTok https:// protocol

## Video ("Tonton Cerita") Fix
- [x] Hero button now opens the real YouTube video (watch URL) in a new tab
- [x] Video frame uses proper embed-compatible handling (toEmbedUrl converts youtu.be / watch?v= to embed)
- [x] Removed forced autoplay (browsers block autoplay-with-sound, causing "stuck" look)
- [x] Added "Buka di YouTube" fallback link below the player for maximum reliability
- [x] Added .video-fallback styling + relative positioning on .video-box
- [x] Verified video ID MPN2Yd6fO0k is valid & embeddable via YouTube oEmbed API

## Cleanup
- [x] Removed temporary diagnostic files (check_video.ps1, video_result.txt)
