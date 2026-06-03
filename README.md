# Local Date

یک وب‌سایت رمانتیک و تعاملی با React, Vite, Tailwind CSS, Framer Motion, GSAP و React Icons.

## اجرا

```bash
npm install
npm run dev
```

## بیلد

```bash
npm run build
npm run preview
```

## انتشار روی GitHub Pages

این پروژه workflow آماده دارد:

1. پروژه را داخل یک repository در GitHub push کن.
2. در GitHub به `Settings > Pages` برو.
3. بخش `Build and deployment` را روی `GitHub Actions` بگذار.
4. روی branch `main` push کن؛ workflow فایل‌های `dist` را منتشر می‌کند.

برای انتشار دستی با پکیج `gh-pages`:

```bash
npm run deploy
```
