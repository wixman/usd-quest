import pathlib
src = pathlib.Path('src')
css = (src/'style.css').read_text()
js = '\n'.join((src/f).read_text() for f in ['content.js','widgets.js','engine.js'])
html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="USDquest">
<meta name="theme-color" content="#0d1020">
<title>USDquest</title>
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" href="icon-192.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
<style>
{css}
</style>
</head>
<body>
<div id="app"></div>
<script>
{js}
</script>
<script>if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{{}});</script>
</body>
</html>'''
pathlib.Path('index.html').write_text(html)
print(len(html))
