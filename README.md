# Wav2Lip 6s UI

Cloudflare Pages front-end for the 6-second French talking-face video generated with Wav2Lip on Kaggle GPU T4.

- `/api/health` — checks whether the R2 video exists
- `/api/video` — streams the MP4 from R2
- `/api/upload` — Kaggle pushes the generated MP4 here
