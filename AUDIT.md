# Template Audit Reference — Lydia Market (Website 80)

## STEP 1: ZIP STRUCTURE (read-only reference)

Uploaded archive: `multishop-1.0.0 (1).zip` (preserved untouched alongside extracted `multishop-1.0.0/` read-only folder).

```
multishop-1.0.0/
├── LICENSE.txt
├── READ-ME.txt
├── cart.html
├── checkout.html
├── contact.html
├── detail.html
├── index.html
├── online-shop-website-template.jpg
├── shop.html
├── css/
│   ├── bootstrap-grid.css
│   ├── bootstrap-grid.min.css
│   ├── bootstrap-reboot.css
│   ├── bootstrap-reboot.min.css
│   ├── bootstrap.css
│   ├── bootstrap.min.css
│   ├── style.css
│   └── style.min.css
├── img/
│   ├── carousel-1.jpg
│   ├── carousel-2.jpg
│   ├── carousel-3.jpg
│   ├── cat-1.jpg
│   ├── cat-2.jpg
│   ├── cat-3.jpg
│   ├── cat-4.jpg
│   ├── offer-1.jpg
│   ├── offer-2.jpg
│   ├── payments.png
│   ├── product-1.jpg
│   ├── product-2.jpg
│   ├── product-3.jpg
│   ├── product-4.jpg
│   ├── product-5.jpg
│   ├── product-6.jpg
│   ├── product-7.jpg
│   ├── product-8.jpg
│   ├── product-9.jpg
│   ├── user.jpg
│   ├── vendor-1.jpg
│   ├── vendor-2.jpg
│   ├── vendor-3.jpg
│   ├── vendor-4.jpg
│   ├── vendor-5.jpg
│   ├── vendor-6.jpg
│   ├── vendor-7.jpg
│   └── vendor-8.jpg
├── js/
│   └── main.js
├── lib/
│   ├── animate/
│   │   └── animate.min.css
│   ├── easing/
│   │   ├── easing.js
│   │   └── easing.min.js
│   └── owlcarousel/
│       ├── LICENSE
│       ├── owl.carousel.js
│       ├── owl.carousel.min.js
│       └── assets/
│           ├── ajax-loader.gif
│           ├── owl.carousel.css
│           ├── owl.carousel.min.css
│           ├── owl.theme.default.css
│           ├── owl.theme.default.min.css
│           ├── owl.theme.green.css
│           ├── owl.theme.green.min.css
│           └── owl.video.play.png
├── mail/
│   ├── contact.js
│   ├── contact.php
│   └── jqBootstrapValidation.min.js
└── scss/
    ├── style.scss
    └── bootstrap/
        └── scss/
            ├── _alert.scss
            ├── _badge.scss
            ├── _breadcrumb.scss
            ├── _button-group.scss
            ├── _buttons.scss
            ├── _card.scss
            ├── _carousel.scss
            ├── _close.scss
            ├── _code.scss
            ├── _custom-forms.scss
            ├── _dropdown.scss
            ├── _forms.scss
            ├── _functions.scss
            ├── _grid.scss
            ├── _images.scss
            ├── _input-group.scss
            ├── _jumbotron.scss
            ├── _list-group.scss
            ├── _media.scss
            ├── _mixins.scss
            ├── _modal.scss
            ├── _nav.scss
            ├── _navbar.scss
            ├── _pagination.scss
            ├── _popover.scss
            ├── _print.scss
            ├── _progress.scss
            ├── _reboot.scss
            ├── _root.scss
            ├── _spinners.scss
            ├── _tables.scss
            ├── _toasts.scss
            ├── _tooltip.scss
            ├── _transitions.scss
            ├── _type.scss
            ├── _utilities.scss
            ├── _variables.scss
            ├── bootstrap-grid.scss
            ├── bootstrap-reboot.scss
            ├── bootstrap.scss
            ├── mixins/ (31 partials)
            ├── utilities/ (18 partials)
            └── vendor/_rfs.scss
```

## STEP 2: AUDIT CHECKLIST

1. **CSS Custom Properties (`:root` in `multishop-1.0.0/css/style.css` & `lib/animate/animate.min.css`, reproduced verbatim in `app/globals.css`)**:
   - `--blue: #007bff`
   - `--indigo: #6610f2`
   - `--purple: #6f42c1`
   - `--pink: #e83e8c`
   - `--red: #dc3545`
   - `--orange: #fd7e14`
   - `--yellow: #ffc107`
   - `--green: #28a745`
   - `--teal: #20c997`
   - `--cyan: #17a2b8`
   - `--white: #fff`
   - `--gray: #6c757d`
   - `--gray-dark: #343a40`
   - `--primary: #FFD333`
   - `--secondary: #F5F5F5`
   - `--success: #28a745`
   - `--info: #17a2b8`
   - `--warning: #ffc107`
   - `--danger: #dc3545`
   - `--light: #FFFFFF`
   - `--dark: #3D464D`
   - `--breakpoint-xs: 0`
   - `--breakpoint-sm: 576px`
   - `--breakpoint-md: 768px`
   - `--breakpoint-lg: 992px`
   - `--breakpoint-xl: 1200px`
   - `--font-family-sans-serif: "Roboto", sans-serif`
   - `--font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`
   - `--animate-duration: 1s`
   - `--animate-delay: 1s`
   - `--animate-repeat: 1`

2. **`@font-face` Rules**:
   - No local `@font-face` rule blocks existed in `multishop-1.0.0/css/style.css`; the template loaded `Roboto` (`400`, `500`, `700`) via `<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">` in HTML `<head>`.
   - Self-hosted verbatim in `app/globals.css` with WOFF2 files in `/public/fonts/`:
     - `'Roboto'`, `/fonts/roboto-latin-400-normal.woff2`, weight `400`, style `normal`
     - `'Roboto'`, `/fonts/roboto-latin-500-normal.woff2`, weight `500`, style `normal`
     - `'Roboto'`, `/fonts/roboto-latin-700-normal.woff2`, weight `700`, style `normal`

3. **Loading Screen Component**: Absent in zip -> Built fresh at `components/LoadingScreen.tsx`
4. **Cookie Consent Banner**: Absent in zip -> Built fresh at `components/CookieConsent.tsx`
5. **CAPTCHA Integration**: Absent in zip -> Built fresh at `components/RecaptchaWidget.tsx` & `lib/recaptcha.ts`
6. **`/legal/privacy-policy` Page**: Absent in zip -> Built fresh at `app/legal/privacy-policy/page.tsx`
7. **`/legal/terms` Page**: Absent in zip -> Built fresh at `app/legal/terms/page.tsx`
8. **`/legal/cookie-policy` Page**: Absent in zip -> Built fresh at `app/legal/cookie-policy/page.tsx`
9. **`404` Page**: Absent in zip -> Built fresh at `app/not-found.tsx` and `app/404/page.tsx`
10. **`500` Page**: Absent in zip -> Built fresh at `app/error.tsx`, `app/global-error.tsx`, and `app/500/page.tsx`
11. **Existing API Route Files**: Legacy PHP mailer at `multishop-1.0.0/mail/contact.php`; Next.js App Router endpoints built fresh under `app/api/`
12. **Existing `.env` Variables**: Absent in zip -> Created in `.env.example` with all 18 required keys
