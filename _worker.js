const R2_KEY = 'wav2lip/final_lipsync_6s.mp4';
const UPLOAD_TOKEN = 'wf2l-coch205-secure-token-9x4KpLqR';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      const head = await env.BUCKET.head(R2_KEY);
      return Response.json({ ok: true, video_present: head !== null, key: R2_KEY, bucket_bound: !!env.BUCKET });
    }

    if (url.pathname === '/api/video') {
      const obj = await env.BUCKET.get(R2_KEY);
      if (!obj) return new Response('Video not found', { status: 404 });
      const headers = new Headers();
      headers.set('Content-Type', 'video/mp4');
      headers.set('Content-Length', String(obj.size));
      headers.set('Cache-Control', 'public, max-age=86400');
      return new Response(obj.body, { headers });
    }

    if (url.pathname === '/api/upload' && request.method === 'POST') {
      if (url.searchParams.get('token') !== UPLOAD_TOKEN) {
        return new Response('Unauthorized', { status: 401 });
      }
      try {
        const form = await request.formData();
        const file = form.get('file');
        if (!file || typeof file === 'string') return new Response('No file', { status: 400 });
        await env.BUCKET.put(R2_KEY, file.stream(), {
          httpMetadata: { contentType: file.type || 'video/mp4' }
        });
        return Response.json({ ok: true, key: R2_KEY, size: file.size });
      } catch (err) {
        return new Response(`Upload error: ${err}`, { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  }
};