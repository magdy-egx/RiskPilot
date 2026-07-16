export default {
  async fetch(request, env, ctx) {
    return new Response(`<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>حاسبة إدارة المخاطر</title>
<style>
body{font-family:Arial,sans-serif;background:#0b0f19;color:#fff;text-align:center;padding:50px}
h1{color:#0ea5e9}
</style>
</head>
<body>
<h1>📊 حاسبة إدارة المخاطر</h1>
<p>الموقع شغال!</p>
</body>
</html>`, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      }
    });
  }
};
