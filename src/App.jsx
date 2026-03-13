import { useState, useEffect, useRef, useCallback } from "react";

/* ─── FONTS & GLOBAL STYLES ─────────────────────────────────────────── */
const injectStyles = () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(link);

  const style = document.createElement("style");
  style.textContent = `
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --white:#fff;--off:#F7F8FA;--g50:#F0F2F5;--g100:#E2E5EA;--g200:#CBD0D9;--g400:#8C95A6;--g600:#5C6475;
      --navy:#0A1628;--navy2:#112240;--navy3:#1A3461;
      --blue:#1D6FE8;--blue2:#4A8FF0;--pale:#EEF4FE;
      --gold:#C49A2A;--gold2:#F0C84A;--goldp:#FDF5DC;
      --teal:#0E8C7A;--teale:#D0F0EB;
      --red:#E84545;
      --fd:'Playfair Display',Georgia,serif;
      --fb:'DM Sans',system-ui,sans-serif;
      --s1:0 1px 4px rgba(0,0,0,.06);
      --s2:0 4px 16px rgba(0,0,0,.09);
      --s3:0 12px 40px rgba(0,0,0,.13);
      --s4:0 24px 64px rgba(0,0,0,.18);
      --r:12px;--rs:6px;--rl:20px;
      --ease:cubic-bezier(.4,0,.2,1);
    }
    html{scroll-behavior:smooth;font-size:16px}
    body{font-family:var(--fb);background:var(--white);color:var(--navy);overflow-x:hidden}

    /* SCROLLBAR */
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:var(--g50)}
    ::-webkit-scrollbar-thumb{background:var(--navy3);border-radius:99px}

    /* SCROLL PROGRESS */
    .scroll-progress{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,var(--blue),var(--gold));z-index:9999;transition:width .1s linear;border-radius:0 2px 2px 0}

    /* NAVBAR */
    .nb{position:fixed;top:0;left:0;right:0;z-index:1000;transition:all .4s var(--ease)}
    .nb-glass{background:rgba(10,22,40,.0);backdrop-filter:blur(0px);border-bottom:1px solid transparent;transition:all .4s var(--ease)}
    .nb.solid .nb-glass{background:rgba(255,255,255,.97);backdrop-filter:blur(24px);border-bottom-color:var(--g100);box-shadow:var(--s2)}
    .nb-inner{max-width:1440px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:76px}
    .nb-logo{display:flex;align-items:center;gap:13px;text-decoration:none;cursor:pointer}
    .nb-logo-mark{width:44px;height:44px;background:var(--navy);border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:20px;transition:transform .3s var(--ease)}
    .nb-logo:hover .nb-logo-mark{transform:rotate(-5deg) scale(1.05)}
    .nb-logo-name{font-family:var(--fd);font-size:21px;font-weight:600;color:var(--navy);line-height:1}
    .nb.solid .nb-logo-name{color:var(--navy)}
    .nb:not(.solid) .nb-logo-name{color:#fff}
    .nb-logo-tag{font-size:10px;color:var(--g400);letter-spacing:.18em;text-transform:uppercase;font-weight:400}
    .nb:not(.solid) .nb-logo-tag{color:rgba(255,255,255,.5)}
    .nb-links{display:flex;align-items:center;gap:4px}
    .nb-link{font-size:14px;font-weight:500;padding:8px 15px;border-radius:var(--rs);border:none;background:none;cursor:pointer;font-family:var(--fb);transition:all .25s var(--ease);color:var(--g600)}
    .nb.solid .nb-link{color:var(--g600)}
    .nb:not(.solid) .nb-link{color:rgba(255,255,255,.8)}
    .nb-link:hover,.nb-link.act{background:var(--g50);color:var(--navy)}
    .nb:not(.solid) .nb-link:hover,.nb:not(.solid) .nb-link.act{background:rgba(255,255,255,.12);color:#fff}
    .nb-cta{background:var(--blue);color:#fff;padding:10px 22px;border-radius:var(--rs);font-size:13px;font-weight:600;border:none;cursor:pointer;font-family:var(--fb);letter-spacing:.02em;transition:all .3s var(--ease);white-space:nowrap}
    .nb-cta:hover{background:var(--blue2);transform:translateY(-1px);box-shadow:0 6px 20px rgba(29,111,232,.35)}
    .hbg{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:8px;border:none;background:none}
    .hbg span{width:24px;height:2px;border-radius:2px;display:block;transition:all .3s var(--ease)}
    .nb.solid .hbg span{background:var(--navy)}
    .nb:not(.solid) .hbg span{background:#fff}

    /* MOBILE DRAWER */
    .mob-overlay{position:fixed;inset:0;background:rgba(10,22,40,.5);backdrop-filter:blur(4px);z-index:998;opacity:0;pointer-events:none;transition:opacity .35s var(--ease)}
    .mob-overlay.open{opacity:1;pointer-events:all}
    .mob-drawer{position:fixed;top:0;right:0;bottom:0;width:min(340px,90vw);background:#fff;z-index:999;transform:translateX(100%);transition:transform .4s var(--ease);display:flex;flex-direction:column;padding:28px;gap:4px;overflow-y:auto;box-shadow:var(--s4)}
    .mob-drawer.open{transform:translateX(0)}
    .mob-close{align-self:flex-end;width:36px;height:36px;border-radius:50%;background:var(--g50);border:none;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;margin-bottom:16px}
    .mob-link{font-size:16px;font-weight:500;color:var(--navy);padding:14px 16px;border-radius:var(--r);border:none;background:none;cursor:pointer;font-family:var(--fb);text-align:left;transition:background .2s var(--ease)}
    .mob-link:hover{background:var(--g50)}

    /* FLOATING ACTIONS */
    .float-wa{position:fixed;bottom:28px;right:28px;z-index:900;background:#25D366;color:#fff;width:58px;height:58px;border-radius:50%;border:none;cursor:pointer;font-size:26px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 28px rgba(37,211,102,.45);transition:all .3s var(--ease);animation:pulse-wa 3s infinite}
    .float-wa:hover{transform:scale(1.12);box-shadow:0 12px 36px rgba(37,211,102,.6)}
    @keyframes pulse-wa{0%,100%{box-shadow:0 8px 28px rgba(37,211,102,.45)}50%{box-shadow:0 8px 28px rgba(37,211,102,.45),0 0 0 10px rgba(37,211,102,.1)}}
    .float-scroll{position:fixed;bottom:28px;right:100px;z-index:900;background:var(--navy);color:#fff;width:44px;height:44px;border-radius:50%;border:none;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;box-shadow:var(--s3);transition:all .3s var(--ease);opacity:0;transform:translateY(10px)}
    .float-scroll.vis{opacity:1;transform:translateY(0)}
    .float-scroll:hover{background:var(--blue);transform:translateY(-3px)}

    /* TOAST */
    .toast-wrap{position:fixed;top:96px;right:24px;z-index:9000;display:flex;flex-direction:column;gap:10px;pointer-events:none}
    .toast{background:#fff;border-radius:var(--r);padding:14px 18px;box-shadow:var(--s4);display:flex;align-items:center;gap:12px;min-width:280px;border-left:4px solid var(--blue);pointer-events:all;animation:toast-in .4s var(--ease) forwards}
    .toast.success{border-left-color:var(--teal)}
    .toast.error{border-left-color:var(--red)}
    @keyframes toast-in{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
    .toast-icon{font-size:20px}
    .toast-msg{font-size:14px;font-weight:500;color:var(--navy)}
    .toast-sub{font-size:12px;color:var(--g400)}

    /* HERO */
    .hero{min-height:100vh;position:relative;overflow:hidden;display:flex;flex-direction:column}
    .hero-bg{position:absolute;inset:0;background:linear-gradient(135deg,#06101f 0%,#0A1628 40%,#112240 70%,#1A3461 100%)}
    .hero-mesh{position:absolute;inset:0;opacity:.06;background-image:
      radial-gradient(circle at 20% 50%,rgba(29,111,232,.8) 0%,transparent 50%),
      radial-gradient(circle at 80% 20%,rgba(196,154,42,.6) 0%,transparent 50%),
      radial-gradient(circle at 60% 80%,rgba(14,140,122,.4) 0%,transparent 40%)}
    .hero-grid{position:absolute;inset:0;opacity:.04;background-image:repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(255,255,255,.4) 60px,rgba(255,255,255,.4) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(255,255,255,.4) 60px,rgba(255,255,255,.4) 61px)}
    .hero-content{position:relative;z-index:2;flex:1;max-width:1440px;margin:0 auto;width:100%;display:grid;grid-template-columns:1.1fr .9fr;align-items:center;gap:60px;padding:100px 48px 80px}
    .hero-pill{display:inline-flex;align-items:center;gap:8px;background:rgba(196,154,42,.18);border:1px solid rgba(196,154,42,.35);color:#F0D080;padding:7px 16px;border-radius:100px;font-size:12px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;margin-bottom:28px;animation:fadeUp .7s var(--ease) both}
    .hero-pill-dot{width:7px;height:7px;background:#F0D080;border-radius:50%;animation:blink 2s infinite}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
    .hero-h1{font-family:var(--fd);font-size:clamp(3rem,5.5vw,5rem);font-weight:700;color:#fff;line-height:1.08;margin-bottom:28px;animation:fadeUp .7s .1s var(--ease) both}
    .hero-h1 em{font-style:italic;background:linear-gradient(135deg,#F0C84A,#E8A520);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .hero-desc{font-size:17px;color:rgba(255,255,255,.65);line-height:1.8;margin-bottom:44px;max-width:500px;animation:fadeUp .7s .2s var(--ease) both}
    .hero-btns{display:flex;gap:16px;flex-wrap:wrap;animation:fadeUp .7s .3s var(--ease) both}
    .btn-p{background:var(--blue);color:#fff;padding:14px 30px;border-radius:var(--rs);font-size:15px;font-weight:600;border:none;cursor:pointer;font-family:var(--fb);transition:all .3s var(--ease);display:inline-flex;align-items:center;gap:9px}
    .btn-p:hover{background:var(--blue2);transform:translateY(-2px);box-shadow:0 10px 28px rgba(29,111,232,.4)}
    .btn-o{background:transparent;color:#fff;padding:14px 30px;border-radius:var(--rs);font-size:15px;font-weight:500;border:1.5px solid rgba(255,255,255,.3);cursor:pointer;font-family:var(--fb);transition:all .3s var(--ease);display:inline-flex;align-items:center;gap:9px}
    .btn-o:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.6)}
    .hero-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,.08);border-radius:var(--r);overflow:hidden;margin-top:56px;animation:fadeUp .7s .4s var(--ease) both}
    .hero-stat{padding:20px 16px;background:rgba(255,255,255,.04);text-align:center;transition:background .3s var(--ease)}
    .hero-stat:hover{background:rgba(255,255,255,.09)}
    .hero-stat-n{font-family:var(--fd);font-size:2rem;font-weight:700;color:#fff;display:block}
    .hero-stat-l{font-size:11px;color:rgba(255,255,255,.45);text-transform:uppercase;letter-spacing:.1em;margin-top:3px}

    .hero-right{animation:fadeIn .9s .3s var(--ease) both;display:flex;flex-direction:column;gap:16px}
    .hero-cards{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .hero-card{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:var(--r);overflow:hidden;transition:all .4s var(--ease);cursor:pointer}
    .hero-card:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.25);transform:translateY(-4px);box-shadow:0 20px 40px rgba(0,0,0,.3)}
    .hero-card:first-child{grid-column:span 2;position:relative;height:220px}
    .hero-card-img{width:100%;height:100%;object-fit:cover;opacity:.75;transition:opacity .4s,transform .6s var(--ease);display:block}
    .hero-card:hover .hero-card-img{opacity:.9;transform:scale(1.05)}
    .hero-card-small{height:150px;position:relative}
    .hero-card-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,22,40,.8) 0%,transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:16px}
    .hero-card-label{font-family:var(--fd);font-size:14px;color:#fff;font-weight:500}
    .hero-card-sub{font-size:11px;color:rgba(255,255,255,.55)}
    .hero-badge-row{display:flex;gap:10px}
    .hero-badge-item{flex:1;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:var(--r);padding:14px;display:flex;align-items:center;gap:10px}
    .hero-badge-icon{font-size:22px}
    .hero-badge-txt{font-size:12px;color:rgba(255,255,255,.7);font-weight:500}

    /* TRUST BAR */
    .trust{background:var(--navy2);padding:14px 48px;border-bottom:1px solid rgba(255,255,255,.07)}
    .trust-inner{max-width:1440px;margin:0 auto;display:flex;align-items:center;justify-content:space-around;gap:16px;flex-wrap:wrap}
    .trust-item{display:flex;align-items:center;gap:8px;color:rgba(255,255,255,.6);font-size:13px;white-space:nowrap}
    .trust-dot{width:4px;height:4px;background:rgba(255,255,255,.2);border-radius:50%}

    /* SECTION COMMONS */
    .sec{padding:96px 48px}
    .sec-alt{background:var(--off)}
    .sec-dk{background:var(--navy)}
    .ctr{max-width:1440px;margin:0 auto}
    .sec-eye{font-size:11px;font-weight:600;color:var(--blue);letter-spacing:.22em;text-transform:uppercase;display:block;margin-bottom:10px}
    .sec-dk .sec-eye{color:var(--gold2)}
    .sec-h{font-family:var(--fd);font-size:clamp(2rem,3.8vw,3rem);font-weight:700;color:var(--navy);line-height:1.12;margin-bottom:14px}
    .sec-dk .sec-h{color:#fff}
    .sec-h em{font-style:italic;color:var(--blue)}
    .sec-dk .sec-h em{color:var(--gold2)}
    .sec-p{font-size:16px;color:var(--g600);line-height:1.75;max-width:580px;margin-bottom:52px}
    .sec-dk .sec-p{color:rgba(255,255,255,.55)}
    .sec-head-row{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:52px}
    .lnk-btn{background:none;border:1.5px solid var(--g200);color:var(--g600);padding:10px 20px;border-radius:var(--rs);font-size:13px;font-weight:600;cursor:pointer;font-family:var(--fb);transition:all .25s var(--ease);white-space:nowrap}
    .lnk-btn:hover{border-color:var(--navy);color:var(--navy)}

    /* REVEAL ANIMATIONS */
    .reveal{opacity:0;transform:translateY(36px);transition:opacity .7s var(--ease),transform .7s var(--ease)}
    .reveal.in{opacity:1;transform:translateY(0)}
    .reveal-l{opacity:0;transform:translateX(-36px);transition:opacity .7s var(--ease),transform .7s var(--ease)}
    .reveal-l.in{opacity:1;transform:translateX(0)}
    .reveal-r{opacity:0;transform:translateX(36px);transition:opacity .7s var(--ease),transform .7s var(--ease)}
    .reveal-r.in{opacity:1;transform:translateX(0)}
    @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}

    /* CATEGORIES */
    .cat-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:18px}
    .cat-card{border-radius:var(--r);overflow:hidden;position:relative;cursor:pointer;aspect-ratio:4/5;border:1.5px solid var(--g100);transition:all .4s var(--ease)}
    .cat-card:hover{border-color:transparent;box-shadow:var(--s4);transform:translateY(-6px)}
    .cat-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s var(--ease)}
    .cat-card:hover .cat-img{transform:scale(1.1)}
    .cat-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,22,40,.85) 0%,rgba(10,22,40,.2) 55%,transparent 100%);display:flex;flex-direction:column;justify-content:flex-end;padding:20px}
    .cat-name{font-family:var(--fd);font-size:16px;color:#fff;font-weight:600;margin-bottom:4px}
    .cat-count{font-size:12px;color:rgba(255,255,255,.6)}
    .cat-arrow{position:absolute;top:14px;right:14px;width:34px;height:34px;background:rgba(255,255,255,.15);backdrop-filter:blur(8px);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;opacity:0;transform:scale(.8);transition:all .3s var(--ease)}
    .cat-card:hover .cat-arrow{opacity:1;transform:scale(1)}
    .cat-active{border-color:var(--blue)!important}

    /* PRODUCT GRID */
    .prod-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}
    .prod-card{background:#fff;border-radius:var(--r);overflow:hidden;border:1.5px solid var(--g100);transition:all .4s var(--ease);position:relative;cursor:pointer}
    .prod-card:hover{box-shadow:var(--s4);transform:translateY(-4px);border-color:transparent}
    .prod-badge{position:absolute;top:12px;left:12px;z-index:3;padding:4px 11px;border-radius:100px;font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase}
    .pb-best{background:var(--navy);color:#fff}
    .pb-new{background:var(--blue);color:#fff}
    .pb-exp{background:var(--gold);color:#fff}
    .prod-fav{position:absolute;top:12px;right:12px;z-index:3;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.9);border:none;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .3s var(--ease);opacity:0;transform:scale(.8)}
    .prod-card:hover .prod-fav{opacity:1;transform:scale(1)}
    .prod-fav.faved{opacity:1;transform:scale(1);background:#fff}
    .prod-img-wrap{overflow:hidden;position:relative;aspect-ratio:1}
    .prod-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s var(--ease)}
    .prod-card:hover .prod-img{transform:scale(1.07)}
    .prod-overlay{position:absolute;inset:0;background:rgba(10,22,40,0);display:flex;align-items:center;justify-content:center;transition:background .3s var(--ease)}
    .prod-card:hover .prod-overlay{background:rgba(10,22,40,.18)}
    .prod-quick{background:#fff;color:var(--navy);padding:9px 20px;border-radius:var(--rs);font-size:13px;font-weight:700;border:none;cursor:pointer;font-family:var(--fb);opacity:0;transform:translateY(12px);transition:all .3s var(--ease);box-shadow:var(--s3)}
    .prod-card:hover .prod-quick{opacity:1;transform:translateY(0)}
    .prod-body{padding:16px}
    .prod-cat{font-size:11px;color:var(--blue);font-weight:600;text-transform:uppercase;letter-spacing:.1em;margin-bottom:5px}
    .prod-name{font-family:var(--fd);font-size:17px;font-weight:700;color:var(--navy);margin-bottom:4px;line-height:1.25}
    .prod-mat{font-size:13px;color:var(--g600);margin-bottom:10px}
    .prod-tags{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px}
    .prod-tag{font-size:11px;padding:3px 9px;border-radius:100px;background:var(--g50);color:var(--g600);font-weight:500}
    .prod-footer{display:flex;gap:8px}
    .btn-inq{flex:1;background:var(--navy);color:#fff;padding:10px;border-radius:var(--rs);font-size:13px;font-weight:600;border:none;cursor:pointer;font-family:var(--fb);transition:all .3s var(--ease)}
    .btn-inq:hover{background:var(--blue)}
    .btn-det{background:var(--g50);color:var(--navy);padding:10px 14px;border-radius:var(--rs);font-size:13px;font-weight:500;border:1.5px solid var(--g100);cursor:pointer;font-family:var(--fb);transition:all .25s var(--ease);white-space:nowrap}
    .btn-det:hover{background:var(--g100)}

    /* SEARCH BAR */
    .search-wrap{position:relative;margin-bottom:28px}
    .search-icon{position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:18px;pointer-events:none}
    .search-inp{width:100%;padding:14px 16px 14px 48px;border:1.5px solid var(--g100);border-radius:var(--r);font-size:15px;font-family:var(--fb);background:#fff;transition:all .3s var(--ease);outline:none;color:var(--navy)}
    .search-inp:focus{border-color:var(--blue);box-shadow:0 0 0 4px rgba(29,111,232,.1)}
    .search-clear{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:var(--g100);border:none;border-radius:50%;width:26px;height:26px;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;transition:all .2s var(--ease)}
    .search-clear:hover{background:var(--g200)}

    /* FILTERS */
    .filter-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:36px;align-items:center}
    .flt-btn{padding:8px 18px;border-radius:100px;font-size:13px;font-weight:500;cursor:pointer;border:1.5px solid var(--g100);background:#fff;color:var(--g600);transition:all .25s var(--ease);font-family:var(--fb)}
    .flt-btn:hover,.flt-btn.on{background:var(--navy);color:#fff;border-color:var(--navy)}
    .flt-count{font-size:12px;color:var(--g400);margin-left:auto;font-weight:400}

    /* MODAL / LIGHTBOX */
    .modal-back{position:fixed;inset:0;background:rgba(10,22,40,.7);backdrop-filter:blur(6px);z-index:2000;display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;transition:opacity .35s var(--ease)}
    .modal-back.open{opacity:1}
    .modal-box{background:#fff;border-radius:var(--rl);max-width:900px;width:100%;max-height:90vh;overflow-y:auto;transform:scale(.92) translateY(20px);transition:transform .4s var(--ease);position:relative}
    .modal-back.open .modal-box{transform:scale(1) translateY(0)}
    .modal-close{position:sticky;top:0;right:0;float:right;margin:16px 16px 0 0;width:38px;height:38px;border-radius:50%;background:var(--g50);border:none;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .25s var(--ease);z-index:5}
    .modal-close:hover{background:var(--g100);transform:rotate(90deg)}
    .modal-grid{display:grid;grid-template-columns:1fr 1fr;gap:0}
    .modal-img-side{position:relative;border-radius:var(--rl) 0 0 var(--rl);overflow:hidden;min-height:420px}
    .modal-img{width:100%;height:100%;object-fit:cover;display:block}
    .modal-content{padding:40px 36px}
    .modal-cat{font-size:11px;color:var(--blue);font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px}
    .modal-title{font-family:var(--fd);font-size:1.8rem;font-weight:700;color:var(--navy);margin-bottom:8px;line-height:1.2}
    .modal-mat{font-size:14px;color:var(--g600);margin-bottom:20px}
    .modal-specs{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px}
    .modal-spec{background:var(--g50);border-radius:var(--rs);padding:12px}
    .modal-spec-l{font-size:11px;color:var(--g400);text-transform:uppercase;letter-spacing:.08em;margin-bottom:2px}
    .modal-spec-v{font-size:14px;font-weight:600;color:var(--navy)}
    .modal-desc{font-size:14px;color:var(--g600);line-height:1.75;margin-bottom:24px}
    .modal-btns{display:flex;gap:10px}

    /* GALLERY GRID */
    .gal-grid{display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,180px);gap:14px}
    .gal-item{border-radius:var(--r);overflow:hidden;cursor:pointer;position:relative}
    .gal-item:nth-child(1){grid-column:span 2;grid-row:span 2}
    .gal-item:nth-child(4){grid-column:span 2}
    .gal-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s var(--ease)}
    .gal-item:hover .gal-img{transform:scale(1.1)}
    .gal-overlay{position:absolute;inset:0;background:rgba(10,22,40,0);display:flex;align-items:center;justify-content:center;transition:background .3s var(--ease)}
    .gal-item:hover .gal-overlay{background:rgba(10,22,40,.35)}
    .gal-zoom{color:#fff;font-size:28px;opacity:0;transform:scale(.6);transition:all .3s var(--ease)}
    .gal-item:hover .gal-zoom{opacity:1;transform:scale(1)}
    .gal-label{position:absolute;bottom:0;left:0;right:0;padding:14px;background:linear-gradient(to top,rgba(10,22,40,.8),transparent);color:#fff;font-family:var(--fd);font-size:14px;font-weight:500;opacity:0;transition:opacity .3s var(--ease)}
    .gal-item:hover .gal-label{opacity:1}

    /* LIGHTBOX */
    .lb{position:fixed;inset:0;background:rgba(5,10,20,.95);z-index:3000;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s var(--ease)}
    .lb.open{opacity:1}
    .lb-img{max-width:90vw;max-height:85vh;object-fit:contain;border-radius:var(--r);box-shadow:var(--s4)}
    .lb-close{position:absolute;top:24px;right:24px;color:#fff;font-size:28px;background:rgba(255,255,255,.1);border:none;cursor:pointer;border-radius:50%;width:48px;height:48px;display:flex;align-items:center;justify-content:center;transition:all .3s var(--ease)}
    .lb-close:hover{background:rgba(255,255,255,.2);transform:rotate(90deg)}
    .lb-prev,.lb-next{position:absolute;top:50%;transform:translateY(-50%);color:#fff;font-size:24px;background:rgba(255,255,255,.1);border:none;cursor:pointer;border-radius:50%;width:52px;height:52px;display:flex;align-items:center;justify-content:center;transition:all .3s var(--ease)}
    .lb-prev{left:24px}.lb-next{right:24px}
    .lb-prev:hover,.lb-next:hover{background:rgba(255,255,255,.25)}
    .lb-counter{position:absolute;bottom:24px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,.6);font-size:13px;background:rgba(0,0,0,.4);padding:6px 16px;border-radius:100px}

    /* ABOUT */
    .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
    .about-img-col{position:relative}
    .about-main-img{width:100%;border-radius:var(--rl);object-fit:cover;aspect-ratio:4/5;display:block;box-shadow:var(--s4)}
    .about-acc-img{position:absolute;bottom:-24px;right:-28px;width:45%;border-radius:var(--r);object-fit:cover;aspect-ratio:3/2;box-shadow:var(--s4);border:4px solid #fff;display:block}
    .about-exp{position:absolute;top:28px;left:-24px;background:var(--navy);border-radius:var(--r);padding:20px 24px;box-shadow:var(--s4)}
    .about-exp-n{font-family:var(--fd);font-size:2.4rem;font-weight:700;color:var(--gold2);display:block}
    .about-exp-l{font-size:11px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.1em}
    .about-feats{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:32px}
    .about-feat{background:var(--g50);border-radius:var(--rs);padding:16px;border-left:3px solid var(--blue);transition:all .3s var(--ease)}
    .about-feat:hover{background:var(--pale);border-left-color:var(--blue2)}
    .about-feat-t{font-size:14px;font-weight:600;color:var(--navy);margin-bottom:3px}
    .about-feat-d{font-size:12px;color:var(--g600)}

    /* STATS */
    .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--g100);border-radius:var(--r);overflow:hidden}
    .stat-item{background:#fff;padding:36px 24px;text-align:center;transition:background .3s var(--ease)}
    .stat-item:hover{background:var(--pale)}
    .stat-n{font-family:var(--fd);font-size:2.6rem;font-weight:700;color:var(--navy);display:block;margin-bottom:4px}
    .stat-l{font-size:13px;color:var(--g600)}

    /* WHY */
    .why-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px}
    .why-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:var(--r);padding:32px 28px;transition:all .4s var(--ease);cursor:default}
    .why-card:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.2);transform:translateY(-4px)}
    .why-ico{font-size:36px;margin-bottom:20px;display:block}
    .why-t{font-family:var(--fd);font-size:20px;font-weight:600;color:#fff;margin-bottom:10px}
    .why-d{font-size:14px;color:rgba(255,255,255,.55);line-height:1.7}

    /* INDUSTRIES */
    .ind-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
    .ind-card{border-radius:var(--r);overflow:hidden;position:relative;aspect-ratio:3/4;cursor:pointer}
    .ind-card:hover .ind-img{transform:scale(1.08)}
    .ind-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s var(--ease)}
    .ind-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,22,40,.88) 0%,rgba(10,22,40,.2) 65%,transparent 100%);display:flex;flex-direction:column;justify-content:flex-end;padding:24px;transition:all .3s var(--ease)}
    .ind-card:hover .ind-overlay{background:linear-gradient(to top,rgba(10,22,40,.95) 0%,rgba(10,22,40,.35) 65%,transparent 100%)}
    .ind-ico{font-size:28px;margin-bottom:8px}
    .ind-n{font-family:var(--fd);font-size:19px;font-weight:600;color:#fff;margin-bottom:4px}
    .ind-d{font-size:13px;color:rgba(255,255,255,.65)}
    .ind-btn{margin-top:14px;background:rgba(255,255,255,.15);color:#fff;border:none;padding:8px 16px;border-radius:var(--rs);font-size:12px;font-weight:600;cursor:pointer;font-family:var(--fb);opacity:0;transform:translateY(8px);transition:all .3s var(--ease)}
    .ind-card:hover .ind-btn{opacity:1;transform:translateY(0)}
    .ind-btn:hover{background:var(--blue)}

    /* PROCESS */
    .proc-wrap{display:grid;grid-template-columns:repeat(6,1fr);gap:0;position:relative}
    .proc-step{padding:32px 20px;text-align:center;position:relative;border:1.5px solid var(--g100);border-radius:0;background:#fff;cursor:pointer;transition:all .35s var(--ease)}
    .proc-step:first-child{border-radius:var(--r) 0 0 var(--r)}
    .proc-step:last-child{border-radius:0 var(--r) var(--r) 0}
    .proc-step:not(:first-child){border-left:none}
    .proc-step.active,.proc-step:hover{background:var(--pale);border-color:var(--blue);z-index:2}
    .proc-n{width:44px;height:44px;background:var(--g50);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-family:var(--fd);font-size:16px;font-weight:600;color:var(--g400);transition:all .3s var(--ease)}
    .proc-step.active .proc-n,.proc-step:hover .proc-n{background:var(--blue);color:#fff}
    .proc-ico{font-size:28px;margin-bottom:10px;display:block}
    .proc-t{font-family:var(--fd);font-size:15px;font-weight:600;color:var(--navy);margin-bottom:6px}
    .proc-d{font-size:12px;color:var(--g600);line-height:1.6;display:none}
    .proc-step.active .proc-d{display:block}
    .proc-detail{background:var(--pale);border:1.5px solid rgba(29,111,232,.2);border-radius:var(--r);padding:28px 32px;margin-top:16px;transition:all .4s var(--ease)}
    .proc-detail-t{font-family:var(--fd);font-size:1.2rem;font-weight:600;color:var(--navy);margin-bottom:8px}
    .proc-detail-d{font-size:15px;color:var(--g600);line-height:1.75}

    /* TESTIMONIALS */
    .testi-wrap{position:relative;overflow:hidden}
    .testi-track{display:flex;gap:24px;transition:transform .5s var(--ease)}
    .testi-card{background:#fff;border-radius:var(--r);padding:32px;border:1.5px solid var(--g100);transition:all .4s var(--ease);flex:0 0 calc(33.33% - 16px);position:relative;overflow:hidden}
    .testi-card::before{content:'"';position:absolute;top:-10px;left:16px;font-family:var(--fd);font-size:110px;color:var(--g50);line-height:1;pointer-events:none}
    .testi-card:hover{box-shadow:var(--s3);border-color:var(--g200)}
    .testi-stars{color:#F59E0B;font-size:14px;letter-spacing:2px;margin-bottom:14px}
    .testi-text{font-size:15px;color:var(--g600);line-height:1.75;margin-bottom:24px;position:relative}
    .testi-author{display:flex;align-items:center;gap:14px}
    .testi-av{width:46px;height:46px;border-radius:50%;background:var(--navy);display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-size:18px;font-weight:600;color:#fff;flex-shrink:0}
    .testi-name{font-size:15px;font-weight:600;color:var(--navy)}
    .testi-role{font-size:12px;color:var(--g400)}
    .testi-nav{display:flex;gap:10px;margin-top:36px}
    .testi-btn{width:44px;height:44px;border-radius:50%;border:1.5px solid var(--g200);background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;transition:all .3s var(--ease)}
    .testi-btn:hover{background:var(--navy);color:#fff;border-color:var(--navy)}
    .testi-dots{display:flex;gap:8px;align-items:center;margin-left:16px}
    .testi-dot{width:8px;height:8px;border-radius:50%;background:var(--g200);transition:all .3s var(--ease);cursor:pointer}
    .testi-dot.on{background:var(--navy);width:24px;border-radius:4px}

    /* CONTACT */
    .contact-grid{display:grid;grid-template-columns:1fr 1.3fr;gap:72px;align-items:start}
    .ci-list{display:flex;flex-direction:column;gap:18px;margin-bottom:32px}
    .ci-item{display:flex;gap:16px;align-items:flex-start}
    .ci-ico{width:46px;height:46px;background:var(--pale);border-radius:var(--rs);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;border:1.5px solid rgba(29,111,232,.15)}
    .ci-lbl{font-size:11px;color:var(--g400);text-transform:uppercase;letter-spacing:.1em;margin-bottom:2px}
    .ci-val{font-size:15px;font-weight:500;color:var(--navy)}
    .wa-btn{display:inline-flex;align-items:center;gap:10px;background:#25D366;color:#fff;padding:13px 24px;border-radius:var(--rs);font-size:15px;font-weight:600;text-decoration:none;transition:all .3s var(--ease);border:none;cursor:pointer;font-family:var(--fb)}
    .wa-btn:hover{background:#1ebe5d;transform:translateY(-2px);box-shadow:0 8px 24px rgba(37,211,102,.3)}
    .cf{display:flex;flex-direction:column;gap:14px}
    .f-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .f-grp{display:flex;flex-direction:column;gap:5px}
    .f-lbl{font-size:13px;font-weight:600;color:var(--navy)}
    .f-inp,.f-sel,.f-ta{background:var(--g50);border:1.5px solid var(--g100);border-radius:var(--rs);padding:12px 16px;font-size:14px;color:var(--navy);font-family:var(--fb);transition:all .3s var(--ease);outline:none;width:100%}
    .f-inp:focus,.f-sel:focus,.f-ta:focus{border-color:var(--blue);background:#fff;box-shadow:0 0 0 4px rgba(29,111,232,.1)}
    .f-ta{resize:vertical;min-height:120px}
    .f-sub{background:var(--navy);color:#fff;padding:14px;border-radius:var(--rs);font-size:15px;font-weight:700;border:none;cursor:pointer;font-family:var(--fb);transition:all .3s var(--ease);display:flex;align-items:center;justify-content:center;gap:10px}
    .f-sub:hover{background:var(--blue);transform:translateY(-1px)}
    .f-sub:disabled{opacity:.6;cursor:not-allowed;transform:none}
    .map-ph{background:var(--g50);border-radius:var(--r);height:200px;display:flex;align-items:center;justify-content:center;border:1.5px solid var(--g100);flex-direction:column;gap:8px;margin-top:24px}

    /* FOOTER */
    .footer{background:var(--navy);color:#fff;padding:72px 48px 32px}
    .footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:56px;max-width:1440px;margin:0 auto 56px}
    .footer-desc{font-size:14px;color:rgba(255,255,255,.45);line-height:1.75;margin-top:16px;max-width:280px}
    .footer-col-t{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:rgba(255,255,255,.35);margin-bottom:20px}
    .footer-links{display:flex;flex-direction:column;gap:9px}
    .footer-lnk{font-size:14px;color:rgba(255,255,255,.6);text-decoration:none;background:none;border:none;cursor:pointer;font-family:var(--fb);text-align:left;transition:color .2s var(--ease);padding:0}
    .footer-lnk:hover{color:#fff}
    .footer-bot{max-width:1440px;margin:0 auto;padding-top:28px;border-top:1px solid rgba(255,255,255,.09);display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}
    .footer-copy{font-size:13px;color:rgba(255,255,255,.3)}
    .social-row{display:flex;gap:10px;margin-top:20px}
    .social-btn{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:15px;transition:all .3s var(--ease)}
    .social-btn:hover{background:var(--blue);border-color:var(--blue)}

    /* PAGE HEADER */
    .page-hdr{padding:130px 48px 72px;background:var(--navy);position:relative;overflow:hidden}
    .page-hdr-grid{position:absolute;inset:0;opacity:.03;background-image:repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%);background-size:28px 28px}
    .page-hdr-glow{position:absolute;top:-100px;right:-100px;width:500px;height:500px;background:radial-gradient(circle,rgba(29,111,232,.2) 0%,transparent 70%);pointer-events:none}
    .page-hdr-inner{position:relative;z-index:1;max-width:1440px;margin:0 auto}
    .breadcrumb{display:flex;align-items:center;gap:8px;margin-bottom:16px}
    .bc-item{font-size:13px;color:rgba(255,255,255,.35);background:none;border:none;cursor:pointer;font-family:var(--fb);padding:0;transition:color .2s}
    .bc-item:hover{color:rgba(255,255,255,.7)}
    .bc-sep{color:rgba(255,255,255,.2)}
    .bc-cur{font-size:13px;color:rgba(255,255,255,.65)}
    .page-title{font-family:var(--fd);font-size:clamp(2.5rem,5vw,3.8rem);font-weight:700;color:#fff;margin-bottom:10px}
    .page-sub{font-size:17px;color:rgba(255,255,255,.55);max-width:480px;line-height:1.6}

    /* RESPONSIVE */
    @media(max-width:1200px){
      .cat-grid{grid-template-columns:repeat(3,1fr)}
      .prod-grid{grid-template-columns:repeat(3,1fr)}
      .why-grid{grid-template-columns:repeat(2,1fr)}
      .footer-grid{grid-template-columns:1fr 1fr;gap:36px}
      .proc-wrap{grid-template-columns:repeat(3,1fr)}
      .proc-step:nth-child(3){border-radius:0 var(--r) var(--r) 0}
      .proc-step:nth-child(4){border-left:1.5px solid var(--g100);border-radius:var(--r) 0 0 var(--r)}
      .proc-step:last-child{border-radius:0 var(--r) var(--r) 0;border-right-width:1.5px}
      .ind-grid{grid-template-columns:repeat(2,1fr)}
    }
    @media(max-width:900px){
      .nb-links{display:none}
      .hbg{display:flex}
      .hero-content{grid-template-columns:1fr;padding:80px 24px 60px;gap:40px}
      .hero-right{display:none}
      .hero-btns{justify-content:center}
      .hero-stats{grid-template-columns:repeat(2,1fr)}
      .about-grid,.contact-grid,.modal-grid{grid-template-columns:1fr}
      .modal-img-side{min-height:280px;border-radius:var(--rl) var(--rl) 0 0}
      .proc-wrap{grid-template-columns:repeat(2,1fr)}
      .proc-step:nth-child(2){border-radius:0 var(--r) var(--r) 0}
      .proc-step:nth-child(3){border-radius:var(--r) 0 0 var(--r);border-left:1.5px solid var(--g100)}
      .testi-card{flex:0 0 calc(100% - 0px)}
      .sec{padding:72px 24px}
      .gal-grid{grid-template-columns:repeat(2,1fr);grid-template-rows:auto}
      .gal-item:nth-child(1){grid-column:span 2}
      .nb-inner{padding:0 24px}
    }
    @media(max-width:600px){
      .cat-grid,.prod-grid,.ind-grid{grid-template-columns:repeat(2,1fr)}
      .why-grid{grid-template-columns:1fr}
      .stats-row{grid-template-columns:repeat(2,1fr)}
      .footer-grid{grid-template-columns:1fr}
      .about-acc-img{display:none}
      .f-row{grid-template-columns:1fr}
      .proc-wrap{grid-template-columns:1fr}
      .proc-step{border-radius:0!important;border-left:1.5px solid var(--g100)!important}
      .proc-step:first-child{border-radius:var(--r) var(--r) 0 0!important}
      .proc-step:last-child{border-radius:0 0 var(--r) var(--r)!important}
    }
  `;
  document.head.appendChild(style);
};

/* ─── DATA ─────────────────────────────────────────────────────────────────── */
const CATS = [
  { name: "Jacquard Mattress Fabrics", count: "42 designs", img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80" },
  { name: "Knitted Mattress Fabrics",  count: "31 designs", img: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400&q=80" },
  { name: "Damask Mattress Fabrics",   count: "28 designs", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" },
  { name: "Quilted Mattress Covers",   count: "19 designs", img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80" },
  { name: "Mattress Ticking Fabrics",  count: "36 designs", img: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&q=80" },
];

const PRODS = [
  { id:1, name:"Royal Blossom Jacquard",    cat:"Jacquard", mat:"65% Polyester, 35% Cotton", tags:["280 GSM","Export Quality","Soft Touch"], badge:"best", img:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=85", gsm:"280",width:"54\"", moq:"500m", finish:"Calendered", desc:"Signature floral jacquard pattern inspired by heritage textile motifs. Exceptionally smooth surface with precise weave structure ensures superior comfort against skin." },
  { id:2, name:"AeroKnit Comfort Plus",      cat:"Knitted",  mat:"100% Polyester Knit",      tags:["Breathable","Stretchable","Anti-Pill"], badge:"new",  img:"https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&q=85", gsm:"220",width:"60\"", moq:"1000m",finish:"Anti-Pilling", desc:"Advanced circular knit construction provides 4-way stretch and excellent breathability. Ideal for modern memory foam and latex mattress encasements." },
  { id:3, name:"Venetian Damask Premium",    cat:"Damask",   mat:"80% Polyester, 20% Viscose",tags:["340 GSM","Lustrous Finish","Bulk"],   badge:"exp",  img:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=85", gsm:"340",width:"54\"", moq:"500m", finish:"Mercerized", desc:"Rich Venetian damask weave with a high-luster finish. The elevated GSM ensures durability for long-life premium mattress applications." },
  { id:4, name:"CloudQuilted Topper Shell",  cat:"Quilted",  mat:"Micro-fiber Quilted Shell",  tags:["Anti-Bacterial","Hypo-Allergenic"],  badge:"",     img:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=85", gsm:"300",width:"60\"", moq:"500m", finish:"Quilted", desc:"Premium 3-layer quilted shell with hypoallergenic fibre fill. Certified anti-bacterial treatment for hygiene-conscious bedding brands." },
  { id:5, name:"Heritage Stripe Ticking",    cat:"Ticking",  mat:"100% Cotton Drill",          tags:["Natural Fiber","Durable","OEM"],      badge:"best", img:"https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=85", gsm:"260",width:"54\"", moq:"1000m",finish:"Sanforized", desc:"Classic butcher-stripe ticking crafted from 100% natural cotton drill. Timeless design meets modern durability — a perennial bestseller for spring mattresses." },
  { id:6, name:"Sapphire Jacquard Weave",    cat:"Jacquard", mat:"75% Polyester, 25% Cotton",  tags:["High Thread Count","Export"],         badge:"new",  img:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=85", gsm:"290",width:"54\"", moq:"500m", finish:"Calendered", desc:"Geometric sapphire-tone jacquard with ultra-high thread count. Engineered for European export market luxury mattress brands." },
  { id:7, name:"Silktouch Knit Border",      cat:"Knitted",  mat:"Nylon Blend Knit",           tags:["Edge Border","Custom Width"],         badge:"",     img:"https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&q=85", gsm:"210",width:"Custom",moq:"2000m",finish:"Brushed", desc:"Specialized border knit for side tape and edge panel applications. Available in custom widths from 4\" to 18\" for mattress edge work." },
  { id:8, name:"Imperial Gold Damask",       cat:"Damask",   mat:"100% Polyester Damask",      tags:["Gold Luster","360 GSM","Premium"],    badge:"exp",  img:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=85", gsm:"360",width:"54\"", moq:"500m", finish:"Luster Finish", desc:"Highest-grade damask in our collection. Gold-thread accents woven into the base fabric create an opulent appearance for ultra-premium mattress lines." },
];

const GAL = [
  { label:"Royal Blossom Jacquard",   img:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=85" },
  { label:"AeroKnit Texture",          img:"https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&q=85" },
  { label:"Venetian Damask Weave",     img:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=85" },
  { label:"CloudQuilted Surface",      img:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=85" },
  { label:"Heritage Stripe Ticking",   img:"https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=85" },
];

const PROC = [
  { ico:"🧵", t:"Yarn Selection",   d:"Premium certified yarns — Egyptian cotton, polyester, viscose and nylon blends from approved suppliers.", full:"We source exclusively from ISO-certified yarn suppliers. Each batch undergoes tensile strength, colour fastness, and shrinkage testing before entering production." },
  { ico:"⚙️", t:"Warping & Sizing", d:"Precision warping for uniform thread density and tension throughout the fabric width.",                   full:"Our warp beams are prepared on computer-controlled sectional warping machines ensuring zero thread-count variation across the full loom width." },
  { ico:"🌀", t:"Jacquard Weaving", d:"Computer-controlled looms create intricate patterns with pixel-perfect accuracy at industrial scale.",    full:"200+ CNC jacquard looms with 32-color dobby capability. Each design is pre-programmed in our in-house CAD studio and validated via sample runs before bulk." },
  { ico:"🔍", t:"Fabric Inspection",d:"100% visual and GSM quality checks. AQL inspection standard with zero-defect policy.",                   full:"Every roll passes through an automated fabric inspection machine followed by manual hand-checking by our QC team. GSM, width, and defect maps are logged for traceability." },
  { ico:"✂️", t:"Finishing",        d:"Calendering, quilting, and edge finishing to meet OEM mattress brand specifications.",                   full:"Post-weave finishing includes heat-setting, calendering, anti-bacterial treatment, and fire-retardant coating (on request) before final winding into rolls." },
  { ico:"📦", t:"Packing & Dispatch",d:"Roll or cut-piece packing. Export-ready documentation for global logistics partners.",                  full:"Fabric is wound on polypropylene cores, poly-bagged, and carton-packed with full identification labels. EXW, FOB, and CIF shipping terms available." },
];

const TESTIS = [
  { name:"Rajesh Mehta",  role:"MD, SleepWell Mattress Co.",    stars:5, text:"We've been sourcing jacquard ticking fabric from WeaveCraft for 3 years. The GSM consistency is remarkable, patterns are beautiful, and bulk pricing is very competitive for our volumes." },
  { name:"Thomas L.",     role:"Procurement, EuroRest GmbH",    stars:5, text:"Outstanding export quality. Their knitted fabrics passed all EU compliance tests. Custom design service helped differentiate our mattress line significantly in the German market." },
  { name:"Priya Sharma",  role:"Director, DreamHome Furniture",  stars:5, text:"Reliable partner for our entire bedding brand. Fast turnaround on custom orders and the damask collection is simply beautiful — retail customers love the finish and feel." },
  { name:"Ahmed Al-Farsi",role:"CEO, Luxe Sleep Group, Dubai",   stars:5, text:"WeaveCraft delivers on every commitment — quality, timeline, and pricing. Their OEKO-TEX certification is critical for our UAE hotel supply contracts." },
  { name:"Sunita Kapoor", role:"Founder, NestComfort India",     stars:5, text:"The knitted fabric breathability is exceptional for our summer mattress range. Their R&D team helped us co-develop a new open-cell knit that's become our signature product." },
];

const WHY = [
  { ico:"🔬", t:"Premium Raw Materials",      d:"Certified yarns only — Egyptian cotton blends, virgin polyester, and natural fibres tested for consistency." },
  { ico:"⚙️", t:"Advanced Jacquard Looms",    d:"200+ CNC looms with 32-color capability producing 2,000+ design variants with millimeter accuracy." },
  { ico:"🎨", t:"Custom Design Studio",        d:"Full in-house CAD design team creates exclusive OEM patterns. Your brand, your signature fabric." },
  { ico:"🌍", t:"Export Quality Standards",    d:"ISO 9001 certified. OEKO-TEX compliant. Fully documented for EU, US, and Middle East markets." },
];

const INDS = [
  { n:"Mattress Manufacturers", d:"OEM supply for all grades",     ico:"🛏️", img:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80" },
  { n:"Bedding & Linen Brands", d:"Private label collections",     ico:"🏷️", img:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80" },
  { n:"Furniture Companies",    d:"Sofa & upholstery applications", ico:"🛋️", img:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" },
  { n:"Export Buyers",          d:"FOB / CIF global shipping",      ico:"🌐", img:"https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&q=80" },
];

/* ─── HOOKS ─────────────────────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal,.reveal-l,.reveal-r").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

function useCounter(target, trigger) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0; const dur = 1800; const step = Math.ceil(target / (dur / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); } else setVal(start);
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, target]);
  return val;
}

/* ─── ANIMATED COUNTER ──────────────────────────────────────────────────────── */
function Counter({ target, suffix = "" }) {
  const [triggered, setTriggered] = useState(false);
  const ref = useRef(null);
  const val = useCounter(target, triggered);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTriggered(true); obs.disconnect(); } }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return <span ref={ref} className="stat-n">{val.toLocaleString()}{suffix}</span>;
}

/* ─── TOAST SYSTEM ───────────────────────────────────────────────────────────── */
function ToastContainer({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span className="toast-icon">{t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"}</span>
          <div><div className="toast-msg">{t.msg}</div>{t.sub && <div className="toast-sub">{t.sub}</div>}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── PRODUCT MODAL ──────────────────────────────────────────────────────────── */
function ProductModal({ prod, onClose, onInquire }) {
  useEffect(() => {
    document.body.style.overflow = prod ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [prod]);
  if (!prod) return null;
  return (
    <div className={`modal-back open`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-grid">
          <div className="modal-img-side">
            <img className="modal-img" src={prod.img} alt={prod.name} />
          </div>
          <div className="modal-content">
            <div className="modal-cat">{prod.cat}</div>
            <h2 className="modal-title">{prod.name}</h2>
            <div className="modal-mat">{prod.mat}</div>
            <div className="modal-specs">
              {[["GSM", prod.gsm], ["Width", prod.width], ["MOQ", prod.moq], ["Finish", prod.finish]].map(([l, v]) => (
                <div key={l} className="modal-spec">
                  <div className="modal-spec-l">{l}</div>
                  <div className="modal-spec-v">{v}</div>
                </div>
              ))}
            </div>
            <p className="modal-desc">{prod.desc}</p>
            <div className="prod-tags" style={{ marginBottom: 24 }}>
              {prod.tags.map(t => <span key={t} className="prod-tag">{t}</span>)}
            </div>
            <div className="modal-btns">
              <button className="btn-inq" style={{ padding: "12px 24px", borderRadius: 8, fontSize: 14 }} onClick={() => { onClose(); onInquire(); }}>Send Bulk Inquiry ↗</button>
              <button className="btn-det" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── LIGHTBOX ───────────────────────────────────────────────────────────────── */
function Lightbox({ images, index, onClose, onNav }) {
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") onNav(1); if (e.key === "ArrowLeft") onNav(-1); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onNav]);
  if (index === null) return null;
  return (
    <div className="lb open" onClick={e => e.target === e.currentTarget && onClose()}>
      <button className="lb-close" onClick={onClose}>✕</button>
      <button className="lb-prev" onClick={() => onNav(-1)}>‹</button>
      <img className="lb-img" src={images[index].img} alt={images[index].label} />
      <button className="lb-next" onClick={() => onNav(1)}>›</button>
      <div className="lb-counter">{images[index].label} · {index + 1} / {images.length}</div>
    </div>
  );
}

/* ─── NAVBAR ─────────────────────────────────────────────────────────────────── */
function Navbar({ page, setPage, scrolled, mob, setMob }) {
  const pages = ["Home", "Products", "Fabric Designs", "Manufacturing", "About", "Contact"];
  return (
    <>
      <nav className={`nb${scrolled ? " solid" : ""}`}>
        <div className="nb-inner">
          <div className="nb-logo" onClick={() => setPage("Home")}>
            <div className="nb-logo-mark">🧵</div>
            <div>
              <div className="nb-logo-name">WeaveCraft</div>
              <div className="nb-logo-tag">Premium Textile Mfg.</div>
            </div>
          </div>
          <div className="nb-links">
            {pages.map(p => <button key={p} className={`nb-link${page === p ? " act" : ""}`} onClick={() => setPage(p)}>{p}</button>)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="nb-cta" onClick={() => setPage("Contact")}>Get Bulk Quote</button>
            <button className="hbg" onClick={() => setMob(o => !o)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>
      <div className={`mob-overlay${mob ? " open" : ""}`} onClick={() => setMob(false)} />
      <div className={`mob-drawer${mob ? " open" : ""}`}>
        <button className="mob-close" onClick={() => setMob(false)}>✕</button>
        {pages.map(p => (
          <button key={p} className="mob-link" onClick={() => { setPage(p); setMob(false); }}>{p}</button>
        ))}
        <button className="btn-p" style={{ marginTop: 20 }} onClick={() => { setPage("Contact"); setMob(false); }}>Get Bulk Quote ↗</button>
      </div>
    </>
  );
}

/* ─── HERO ───────────────────────────────────────────────────────────────────── */
function Hero({ setPage }) {
  const [typed, setTyped] = useState("");
  const [wi, setWi] = useState(0);
  const words = ["Jacquard", "Knitted", "Damask", "Quilted", "Ticking"];

  useEffect(() => {
    let i = 0;
    let deleting = false;

    const currentWord = words[wi];

    const type = () => {
      if (!deleting) {
        setTyped(currentWord.slice(0, i + 1));
        i++;

        if (i === currentWord.length) {
          deleting = true;
          setTimeout(type, 1200);
          return;
        }
      } else {
        setTyped(currentWord.slice(0, i - 1));
        i--;

        if (i === 0) {
          deleting = false;
          setWi((prev) => (prev + 1) % words.length);
          return;
        }
      }

      setTimeout(type, deleting ? 60 : 90);
    };

    type();
  }, [wi]);

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-mesh" />
      <div className="hero-grid" />

      <div className="hero-content">
        <div>
          <div className="hero-pill">
            <span className="hero-pill-dot" />🏆 India's Premier Mattress Fabric Manufacturer
          </div>

          <h1 className="hero-h1">
            Premium <em>{typed}<span style={{opacity:.7, animation:"blink 1s infinite"}}>|</span></em>
            <br />
            Mattress Fabrics
            <br />
            <span style={{ fontStyle: "normal", color: "rgba(255,255,255,.7)" }}>
              for Modern Comfort
            </span>
          </h1>

          <p className="hero-desc">
            Crafting world-class mattress fabrics since 2004. OEM supply to
            500+ global brands across 18 countries. Minimum order from 500 meters.
          </p>

          <div className="hero-btns">
            <button className="btn-p" onClick={() => setPage("Products")}>
              Explore Collections ↗
            </button>

            <button className="btn-o" onClick={() => setPage("Contact")}>
              Request Samples
            </button>
          </div>

          <div className="hero-stats">
            {[["500+","B2B Clients"],["18","Countries"],["5000+","Designs"],["20+","Yrs Exp"]].map(([n,l]) => (
              <div key={l} className="hero-stat">
                <span className="hero-stat-n">{n}</span>
                <span className="hero-stat-l">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
/* ─── CATEGORIES ─────────────────────────────────────────────────────────────── */
function Categories({ setPage, activeCat, setActiveCat }) {
  useReveal();
  return (
    <section className="sec sec-alt">
      <div className="ctr">
        <div className="sec-head-row reveal">
          <div>
            <span className="sec-eye">Browse Categories</span>
            <h2 className="sec-h">Our Fabric <em>Collections</em></h2>
          </div>
          <button className="lnk-btn" onClick={() => setPage("Products")}>View All Products →</button>
        </div>
        <div className="cat-grid">
          {CATS.map((c, i) => (
            <div key={c.name} className={`cat-card reveal${activeCat === c.name ? " cat-active" : ""}`}
              style={{ transitionDelay: `${i * 0.07}s` }}
              onClick={() => { setActiveCat(activeCat === c.name ? null : c.name); setPage("Products"); }}>
              <img className="cat-img" src={c.img} alt={c.name} />
              <div className="cat-arrow">↗</div>
              <div className="cat-overlay">
                <div className="cat-name">{c.name}</div>
                <div className="cat-count">{c.count}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURED PRODUCTS ──────────────────────────────────────────────────────── */
function FeaturedProducts({ setPage, addToast }) {
  useReveal();
  const [modal, setModal] = useState(null);
  const [favs, setFavs] = useState([]);
  const toggleFav = (id, e) => {
    e.stopPropagation();
    setFavs(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
    addToast(favs.includes(id) ? { msg: "Removed from wishlist", type: "info" } : { msg: "Added to wishlist ❤️", type: "success" });
  };
  return (
    <section className="sec">
      <div className="ctr">
        <div className="sec-head-row reveal">
          <div>
            <span className="sec-eye">Most Ordered</span>
            <h2 className="sec-h">Featured <em>Products</em></h2>
          </div>
          <button className="lnk-btn" onClick={() => setPage("Products")}>See All Products →</button>
        </div>
        <div className="prod-grid">
          {PRODS.map((p, i) => (
            <div key={p.id} className="prod-card reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
              {p.badge && <div className={`prod-badge pb-${p.badge}`}>{p.badge === "best" ? "Bestseller" : p.badge === "new" ? "New" : "Export Grade"}</div>}
              <button className={`prod-fav${favs.includes(p.id) ? " faved" : ""}`} onClick={e => toggleFav(p.id, e)}>
                {favs.includes(p.id) ? "❤️" : "🤍"}
              </button>
              <div className="prod-img-wrap">
                <img className="prod-img" src={p.img} alt={p.name} />
                <div className="prod-overlay">
                  <button className="prod-quick" onClick={() => setModal(p)}>Quick View</button>
                </div>
              </div>
              <div className="prod-body">
                <div className="prod-cat">{p.cat}</div>
                <div className="prod-name">{p.name}</div>
                <div className="prod-mat">{p.mat}</div>
                <div className="prod-tags">{p.tags.map(t => <span key={t} className="prod-tag">{t}</span>)}</div>
                <div className="prod-footer">
                  <button className="btn-inq" onClick={() => { setPage("Contact"); addToast({ msg: "Inquiry page opened", sub: "Fill the form to get pricing", type: "info" }); }}>Send Inquiry</button>
                  <button className="btn-det" onClick={() => setModal(p)}>Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ProductModal prod={modal} onClose={() => setModal(null)} onInquire={() => setPage("Contact")} />
    </section>
  );
}

/* ─── GALLERY ─────────────────────────────────────────────────────────────────── */
function GallerySection({ setPage }) {
  useReveal();
  const [lbIdx, setLbIdx] = useState(null);
  const nav = useCallback(dir => setLbIdx(i => (i + dir + GAL.length) % GAL.length), []);
  return (
    <section className="sec sec-alt">
      <div className="ctr">
        <div className="sec-head-row reveal">
          <div>
            <span className="sec-eye">Fabric Design Gallery</span>
            <h2 className="sec-h">Textile Patterns <em>& Textures</em></h2>
          </div>
          <button className="lnk-btn" onClick={() => setPage("Fabric Designs")}>Full Gallery →</button>
        </div>
        <div className="gal-grid reveal">
          {GAL.map((g, i) => (
            <div key={i} className="gal-item" onClick={() => setLbIdx(i)}>
              <img className="gal-img" src={g.img} alt={g.label} />
              <div className="gal-overlay"><span className="gal-zoom">🔍</span></div>
              <div className="gal-label">{g.label}</div>
            </div>
          ))}
        </div>
      </div>
      <Lightbox images={GAL} index={lbIdx} onClose={() => setLbIdx(null)} onNav={nav} />
    </section>
  );
}

/* ─── ABOUT ───────────────────────────────────────────────────────────────────── */
function About() {
  useReveal();
  return (
    <section className="sec">
      <div className="ctr">
        <div className="about-grid">
          <div className="about-img-col reveal-l">
            <img className="about-main-img" src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80" alt="Factory" />
            <img className="about-acc-img" src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&q=80" alt="Detail" />
            <div className="about-exp">
              <span className="about-exp-n">20+</span>
              <span className="about-exp-l">Years of Expertise</span>
            </div>
          </div>
          <div className="reveal-r">
            <span className="sec-eye">About WeaveCraft</span>
            <h2 className="sec-h">Handloom Craftsmanship Meets <em>Industrial Precision</em></h2>
            <p style={{ fontSize: 16, color: "var(--g600)", lineHeight: 1.8, marginBottom: 20 }}>
              Founded in 2004 in Panipat — India's textile capital — WeaveCraft has grown from a traditional handloom unit into one of India's leading mattress fabric exporters.
            </p>
            <p style={{ fontSize: 16, color: "var(--g600)", lineHeight: 1.8 }}>
              Our 120,000 sq.ft. facility houses 200+ computerized jacquard looms, producing over 2 million meters of premium fabrics monthly for brands across USA, Europe, Middle East & Southeast Asia.
            </p>
            <div className="about-feats">
              {[["Advanced Jacquard Looms","200+ CNC looms, 32-color"],["Premium Yarn Materials","Certified suppliers only"],["Bulk Production Ready","2M+ meters/month"],["Custom OEM Designs","In-house CAD studio"]].map(([t, d]) => (
                <div key={t} className="about-feat">
                  <div className="about-feat-t">{t}</div>
                  <div className="about-feat-d">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── STATS ───────────────────────────────────────────────────────────────────── */
function Stats() {
  return (
    <section style={{ padding: "0 48px 80px" }}>
      <div className="ctr">
        <div className="stats-row">
          {[["2000000","m", "Meters/Month Capacity"],["5000","","Fabric Designs"],["500","","B2B Clients"],["18","","Countries Exported"]].map(([n, s, l]) => (
            <div key={l} className="stat-item">
              <Counter target={parseInt(n)} suffix={s} />
              <span className="stat-l">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── WHY CHOOSE US ──────────────────────────────────────────────────────────── */
function Why() {
  useReveal();
  return (
    <section className="sec sec-dk">
      <div className="ctr">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <div className="reveal-l">
            <span className="sec-eye">Why WeaveCraft</span>
            <h2 className="sec-h">Built for Serious <em>Buyers</em></h2>
            <p className="sec-p">We engineer every fabric for performance, durability, and brand differentiation — at the volumes global brands demand.</p>
            <div className="why-grid">
              {WHY.map(w => (
                <div key={w.t} className="why-card">
                  <span className="why-ico">{w.ico}</span>
                  <div className="why-t">{w.t}</div>
                  <div className="why-d">{w.d}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal-r" style={{ position: "relative" }}>
            <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=85" alt="Fabric" style={{ width: "100%", borderRadius: "var(--rl)", objectFit: "cover", aspectRatio: "3/4", opacity: .85, display: "block" }} />
            <div style={{ position: "absolute", bottom: 24, left: 24, right: 24, background: "rgba(255,255,255,.08)", backdropFilter: "blur(16px)", borderRadius: "var(--r)", border: "1px solid rgba(255,255,255,.15)", padding: "20px 24px" }}>
              <div style={{ fontFamily: "var(--fd)", fontSize: "1.1rem", color: "#fff", marginBottom: 8 }}>ISO 9001 · OEKO-TEX® · GST Registered</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)" }}>All certifications verified and audited annually</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── INDUSTRIES ─────────────────────────────────────────────────────────────── */
function Industries({ setPage }) {
  useReveal();
  return (
    <section className="sec sec-alt">
      <div className="ctr">
        <div className="reveal" style={{ marginBottom: 52 }}>
          <span className="sec-eye">Industries We Serve</span>
          <h2 className="sec-h">Trusted by <em>Global Brands</em></h2>
        </div>
        <div className="ind-grid">
          {INDS.map((ind, i) => (
            <div key={ind.n} className="ind-card reveal" style={{ transitionDelay: `${i * 0.1}s` }} onClick={() => setPage("Contact")}>
              <img className="ind-img" src={ind.img} alt={ind.n} />
              <div className="ind-overlay">
                <span className="ind-ico">{ind.ico}</span>
                <div className="ind-n">{ind.n}</div>
                <div className="ind-d">{ind.d}</div>
                <button className="ind-btn">Inquire Now →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PROCESS ─────────────────────────────────────────────────────────────────── */
function Process() {
  useReveal();
  const [active, setActive] = useState(0);
  return (
    <section className="sec">
      <div className="ctr">
        <div className="reveal" style={{ textAlign: "center", marginBottom: 52 }}>
          <span className="sec-eye">How We Work</span>
          <h2 className="sec-h">Our Manufacturing <em>Process</em></h2>
          <p className="sec-p" style={{ margin: "0 auto 0" }}>Click each step to explore our quality-controlled production workflow.</p>
        </div>
        <div className="proc-wrap reveal">
          {PROC.map((s, i) => (
            <div key={s.t} className={`proc-step${active === i ? " active" : ""}`} onClick={() => setActive(i)}>
              <div className="proc-n">{String(i + 1).padStart(2, "0")}</div>
              <span className="proc-ico">{s.ico}</span>
              <div className="proc-t">{s.t}</div>
              <div className="proc-d">{s.d}</div>
            </div>
          ))}
        </div>
        <div className="proc-detail reveal">
          <div className="proc-detail-t">{PROC[active].ico} {PROC[active].t} — Detailed Overview</div>
          <div className="proc-detail-d">{PROC[active].full}</div>
        </div>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ───────────────────────────────────────────────────────────── */
function Testimonials() {
  useReveal();
  const [idx, setIdx] = useState(0);
  const visible = 3;
  const max = TESTIS.length - visible;
  const go = dir => setIdx(i => Math.max(0, Math.min(max, i + dir)));
  return (
    <section className="sec sec-alt">
      <div className="ctr">
        <div className="sec-head-row reveal">
          <div>
            <span className="sec-eye">Client Reviews</span>
            <h2 className="sec-h">What Our <em>Clients Say</em></h2>
          </div>
        </div>
        <div className="testi-wrap reveal">
          <div className="testi-track" style={{ transform: `translateX(calc(-${idx * (100 / visible)}% - ${idx * 24 / visible}px))` }}>
            {TESTIS.map(t => (
              <div key={t.name} className="testi-card">
                <div className="testi-stars">{"★".repeat(t.stars)}</div>
                <p className="testi-text">{t.text}</p>
                <div className="testi-author">
                  <div className="testi-av">{t.name[0]}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="testi-nav reveal">
          <button className="testi-btn" onClick={() => go(-1)} disabled={idx === 0} style={{ opacity: idx === 0 ? .4 : 1 }}>‹</button>
          <button className="testi-btn" onClick={() => go(1)} disabled={idx >= max} style={{ opacity: idx >= max ? .4 : 1 }}>›</button>
          <div className="testi-dots">
            {Array.from({ length: max + 1 }).map((_, i) => (
              <div key={i} className={`testi-dot${idx === i ? " on" : ""}`} onClick={() => setIdx(i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ─────────────────────────────────────────────────────────────────── */
function Contact({ addToast }) {
  useReveal();
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", cat: "", qty: "", msg: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = () => {
    if (!form.name || !form.email) { addToast({ msg: "Please fill required fields", type: "error" }); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); addToast({ msg: "Inquiry sent successfully! 🎉", sub: "Our team will respond within 24 hours", type: "success" }); }, 1800);
  };
  return (
    <section className="sec" id="contact">
      <div className="ctr">
        <div className="reveal" style={{ marginBottom: 52 }}>
          <span className="sec-eye">Get In Touch</span>
          <h2 className="sec-h">Request a Quote or <em>Sample</em></h2>
        </div>
        <div className="contact-grid">
          <div className="reveal-l">
            <p style={{ fontSize: 16, color: "var(--g600)", lineHeight: 1.8, marginBottom: 32 }}>Whether you need 500 meters or 500,000 — our team creates a custom quote within 24 hours. Fabric samples dispatched within 7 business days.</p>
            <div className="ci-list">
              {[["📞","Phone / WhatsApp","+91 98765 43210"],["📧","Email","exports@weavecraft.in"],["📍","Factory","Panipat Textile Zone, Haryana - 132103"],["⏰","Hours","Mon–Sat: 9:00 AM – 6:30 PM IST"]].map(([ico, lbl, val]) => (
                <div key={lbl} className="ci-item">
                  <div className="ci-ico">{ico}</div>
                  <div><div className="ci-lbl">{lbl}</div><div className="ci-val">{val}</div></div>
                </div>
              ))}
            </div>
            <a className="wa-btn" href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">💬 Chat on WhatsApp</a>
            <div className="map-ph">
              <span style={{ fontSize: 32 }}>📍</span>
              <span style={{ fontSize: 14, color: "var(--g600)", fontWeight: 500 }}>Panipat Textile Zone, Haryana</span>
              <span style={{ fontSize: 12, color: "var(--g400)" }}>Embed Google Maps iframe here</span>
            </div>
          </div>
          <div className="reveal-r">
            {done ? (
              <div style={{ background: "var(--pale)", border: "1.5px solid rgba(29,111,232,.2)", borderRadius: "var(--rl)", padding: 56, textAlign: "center" }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
                <h3 style={{ fontFamily: "var(--fd)", fontSize: "1.8rem", color: "var(--navy)", marginBottom: 12 }}>Inquiry Received!</h3>
                <p style={{ color: "var(--g600)", fontSize: 15, marginBottom: 24 }}>Our export team will contact you within 24 hours with pricing and fabric availability.</p>
                <button className="btn-p" onClick={() => setDone(false)}>Send Another Inquiry</button>
              </div>
            ) : (
              <div className="cf">
                <div className="f-row">
                  <div className="f-grp"><label className="f-lbl">Full Name *</label><input className="f-inp" name="name" placeholder="Your name" value={form.name} onChange={change} /></div>
                  <div className="f-grp"><label className="f-lbl">Company</label><input className="f-inp" name="company" placeholder="Company name" value={form.company} onChange={change} /></div>
                </div>
                <div className="f-row">
                  <div className="f-grp"><label className="f-lbl">Email *</label><input className="f-inp" name="email" type="email" placeholder="email@company.com" value={form.email} onChange={change} /></div>
                  <div className="f-grp"><label className="f-lbl">Phone / WhatsApp</label><input className="f-inp" name="phone" placeholder="+1 234 567 8900" value={form.phone} onChange={change} /></div>
                </div>
                <div className="f-row">
                  <div className="f-grp">
                    <label className="f-lbl">Fabric Category</label>
                    <select className="f-sel" name="cat" value={form.cat} onChange={change}>
                      <option value="">Select category</option>
                      {CATS.map(c => <option key={c.name}>{c.name}</option>)}
                      <option>Custom / Multiple</option>
                    </select>
                  </div>
                  <div className="f-grp">
                    <label className="f-lbl">Quantity Needed</label>
                    <select className="f-sel" name="qty" value={form.qty} onChange={change}>
                      <option value="">Select quantity</option>
                      <option>500–1,000 meters</option>
                      <option>1,000–5,000 meters</option>
                      <option>5,000–25,000 meters</option>
                      <option>25,000+ meters</option>
                    </select>
                  </div>
                </div>
                <div className="f-grp">
                  <label className="f-lbl">Requirements / Message</label>
                  <textarea className="f-ta" name="msg" rows={4} placeholder="Describe your requirements: design, GSM, width, colour, end use..." value={form.msg} onChange={change} />
                </div>
                <button className="f-sub" onClick={submit} disabled={loading}>
                  {loading ? <><span style={{ animation: "spin .7s linear infinite", display: "inline-block" }}>⟳</span> Sending...</> : <>Send Bulk Inquiry ↗</>}
                </button>
                <p style={{ fontSize: 12, color: "var(--g400)", textAlign: "center" }}>🔒 Confidential. We respond within 24 business hours.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ──────────────────────────────────────────────────────────────────── */
function Footer({ setPage }) {
  const pages = ["Home","Products","Fabric Designs","Manufacturing","About","Contact"];
  const prods = ["Jacquard Fabrics","Knitted Fabrics","Damask Fabrics","Quilted Covers","Ticking Fabrics"];
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="nb-logo-mark" style={{ background: "rgba(255,255,255,.1)" }}>🧵</div>
            <div>
              <div style={{ fontFamily: "var(--fd)", fontSize: 21, fontWeight: 600, color: "#fff" }}>WeaveCraft</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", letterSpacing: ".18em", textTransform: "uppercase" }}>Premium Textile Mfg.</div>
            </div>
          </div>
          <p className="footer-desc">India's leading mattress fabric manufacturer. Premium jacquard, knitted & damask fabrics for global mattress brands since 2004.</p>
          <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
            {["ISO 9001","OEKO-TEX","GST Reg.","MSME Certified"].map(c => <span key={c} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 100, border: "1px solid rgba(255,255,255,.15)", color: "rgba(255,255,255,.45)" }}>{c}</span>)}
          </div>
          <div className="social-row">
            {["💼","📘","📸","🐦"].map((s, i) => <button key={i} className="social-btn">{s}</button>)}
          </div>
        </div>
        <div>
          <div className="footer-col-t">Navigation</div>
          <div className="footer-links">{pages.map(p => <button key={p} className="footer-lnk" onClick={() => setPage(p)}>{p}</button>)}</div>
        </div>
        <div>
          <div className="footer-col-t">Products</div>
          <div className="footer-links">{prods.map(p => <button key={p} className="footer-lnk" onClick={() => setPage("Products")}>{p}</button>)}</div>
        </div>
        <div>
          <div className="footer-col-t">Contact</div>
          <div className="footer-links">
            {[["📞","+91 98765 43210"],["📧","exports@weavecraft.in"],["📍","Panipat, Haryana, India"],["⏰","Mon–Sat, 9AM–6:30PM"]].map(([ico, val]) => (
              <span key={val} className="footer-lnk" style={{ cursor: "default" }}>{ico} {val}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-bot">
        <span className="footer-copy">© 2024 WeaveCraft Textiles Pvt. Ltd. All Rights Reserved.</span>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy Policy","Terms of Use","Sitemap"].map(l => <span key={l} style={{ fontSize: 13, color: "rgba(255,255,255,.3)", cursor: "pointer" }}>{l}</span>)}
        </div>
      </div>
    </footer>
  );
}

/* ─── PAGE VIEWS ──────────────────────────────────────────────────────────────── */
function ProductsPage({ setPage, addToast }) {
  useReveal();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [favs, setFavs] = useState([]);
  const filters = ["All", "Jacquard", "Knitted", "Damask", "Quilted", "Ticking"];
  const filtered = PRODS.filter(p => {
    const matchF = filter === "All" || p.cat === filter;
    const matchS = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.mat.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchF && matchS;
  });
  const toggleFav = (id, e) => {
    e.stopPropagation();
    setFavs(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
    addToast(favs.includes(id) ? { msg: "Removed from wishlist", type: "info" } : { msg: "Added to wishlist ❤️", type: "success" });
  };
  return (
    <>
      <div className="page-hdr">
        <div className="page-hdr-grid" />
        <div className="page-hdr-glow" />
        <div className="page-hdr-inner">
          <div className="breadcrumb"><button className="bc-item" onClick={() => setPage("Home")}>Home</button><span className="bc-sep">›</span><span className="bc-cur">Products</span></div>
          <h1 className="page-title">Fabric Collections</h1>
          <p className="page-sub">Browse {PRODS.length} premium mattress fabric SKUs. Filter, search, or request custom designs.</p>
        </div>
      </div>
      <section className="sec">
        <div className="ctr">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-inp" placeholder="Search fabrics, materials, features..." value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button className="search-clear" onClick={() => setSearch("")}>✕</button>}
          </div>
          <div className="filter-row">
            {filters.map(f => <button key={f} className={`flt-btn${filter === f ? " on" : ""}`} onClick={() => setFilter(f)}>{f}</button>)}
            <span className="flt-count">{filtered.length} fabric{filtered.length !== 1 ? "s" : ""} found</span>
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontFamily: "var(--fd)", fontSize: "1.4rem", color: "var(--navy)", marginBottom: 8 }}>No fabrics found</h3>
              <p style={{ color: "var(--g600)", marginBottom: 24 }}>Try a different search term or category filter.</p>
              <button className="btn-p" onClick={() => { setSearch(""); setFilter("All"); }}>Clear Filters</button>
            </div>
          ) : (
            <div className="prod-grid">
              {filtered.map((p, i) => (
                <div key={p.id} className="prod-card reveal" style={{ transitionDelay: `${i * 0.05}s` }}>
                  {p.badge && <div className={`prod-badge pb-${p.badge}`}>{p.badge === "best" ? "Bestseller" : p.badge === "new" ? "New" : "Export Grade"}</div>}
                  <button className={`prod-fav${favs.includes(p.id) ? " faved" : ""}`} onClick={e => toggleFav(p.id, e)}>{favs.includes(p.id) ? "❤️" : "🤍"}</button>
                  <div className="prod-img-wrap">
                    <img className="prod-img" src={p.img} alt={p.name} />
                    <div className="prod-overlay"><button className="prod-quick" onClick={() => setModal(p)}>Quick View</button></div>
                  </div>
                  <div className="prod-body">
                    <div className="prod-cat">{p.cat}</div>
                    <div className="prod-name">{p.name}</div>
                    <div className="prod-mat">{p.mat}</div>
                    <div className="prod-tags">{p.tags.map(t => <span key={t} className="prod-tag">{t}</span>)}</div>
                    <div className="prod-footer">
                      <button className="btn-inq" onClick={() => { setPage("Contact"); addToast({ msg: "Opening inquiry form", sub: p.name, type: "info" }); }}>Send Inquiry</button>
                      <button className="btn-det" onClick={() => setModal(p)}>Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <ProductModal prod={modal} onClose={() => setModal(null)} onInquire={() => setPage("Contact")} />
    </>
  );
}

function FabricDesignsPage({ setPage }) {
  const [lbIdx, setLbIdx] = useState(null);
  const nav = useCallback(dir => setLbIdx(i => (i + dir + GAL.length) % GAL.length), []);
  const allImgs = [...GAL, ...GAL, ...GAL].slice(0, 12).map((g, i) => ({ ...g, label: `${g.label} ${i > 4 ? `#${i + 1}` : ""}` }));
  return (
    <>
      <div className="page-hdr">
        <div className="page-hdr-grid" />
        <div className="page-hdr-glow" />
        <div className="page-hdr-inner">
          <div className="breadcrumb"><button className="bc-item" onClick={() => setPage("Home")}>Home</button><span className="bc-sep">›</span><span className="bc-cur">Fabric Designs</span></div>
          <h1 className="page-title">Design Gallery</h1>
          <p className="page-sub">5,000+ exclusive fabric patterns. Request any design in custom colorways.</p>
        </div>
      </div>
      <section className="sec">
        <div className="ctr">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {allImgs.map((g, i) => (
              <div key={i} className="gal-item" style={{ aspectRatio: "1", borderRadius: "var(--r)" }} onClick={() => setLbIdx(i % GAL.length)}>
                <img className="gal-img" src={g.img} alt={g.label} />
                <div className="gal-overlay"><span className="gal-zoom">🔍</span></div>
                <div className="gal-label">{g.label}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 56 }}>
            <p style={{ fontSize: 16, color: "var(--g600)", marginBottom: 24 }}>Can't find your design? We create exclusive patterns for your brand.</p>
            <button className="btn-p" onClick={() => setPage("Contact")}>Request Custom Design →</button>
          </div>
        </div>
      </section>
      <Lightbox images={GAL} index={lbIdx} onClose={() => setLbIdx(null)} onNav={nav} />
    </>
  );
}

function ManufacturingPage({ setPage }) {
  useReveal();
  return (
    <>
      <div className="page-hdr">
        <div className="page-hdr-grid" />
        <div className="page-hdr-glow" />
        <div className="page-hdr-inner">
          <div className="breadcrumb"><button className="bc-item" onClick={() => setPage("Home")}>Home</button><span className="bc-sep">›</span><span className="bc-cur">Manufacturing</span></div>
          <h1 className="page-title">Manufacturing Process</h1>
          <p className="page-sub">ISO-certified, fully traceable production from raw yarn to finished fabric roll.</p>
        </div>
      </div>
      <section className="sec"><div className="ctr"><Process /></div></section>
      <section className="sec sec-alt">
        <div className="ctr">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
            <div className="reveal-l">
              <span className="sec-eye">Our Facility</span>
              <h2 className="sec-h">120,000 sq.ft. of <em>Production Power</em></h2>
              <p style={{ fontSize: 15, color: "var(--g600)", lineHeight: 1.8, marginBottom: 28 }}>Located in Panipat — India's textile capital — our facility runs 24/7 with climate-controlled weaving halls and in-house laboratory testing.</p>
              {[["200+","Computerized Jacquard Looms"],["2M+","Meters/Month Capacity"],["100%","Quality Inspection Coverage"],["24/7","Production Operations"]].map(([n, l]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid var(--g100)" }}>
                  <span style={{ fontFamily: "var(--fd)", fontSize: "1.5rem", fontWeight: 700, color: "var(--navy)" }}>{n}</span>
                  <span style={{ fontSize: 14, color: "var(--g600)" }}>{l}</span>
                </div>
              ))}
            </div>
            <div className="reveal-r">
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80" alt="Factory" style={{ width: "100%", borderRadius: "var(--rl)", objectFit: "cover", aspectRatio: "4/3", display: "block", boxShadow: "var(--s4)" }} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function AboutPage({ setPage, addToast }) {
  return (
    <>
      <div className="page-hdr">
        <div className="page-hdr-grid" />
        <div className="page-hdr-glow" />
        <div className="page-hdr-inner">
          <div className="breadcrumb"><button className="bc-item" onClick={() => setPage("Home")}>Home</button><span className="bc-sep">›</span><span className="bc-cur">About Us</span></div>
          <h1 className="page-title">About WeaveCraft</h1>
          <p className="page-sub">20 years of handloom heritage, backed by industrial-scale precision.</p>
        </div>
      </div>
      <About />
      <Stats />
      <Why />
      <Testimonials />
    </>
  );
}

function ContactPage({ setPage, addToast }) {
  return (
    <>
      <div className="page-hdr">
        <div className="page-hdr-grid" />
        <div className="page-hdr-glow" />
        <div className="page-hdr-inner">
          <div className="breadcrumb"><button className="bc-item" onClick={() => setPage("Home")}>Home</button><span className="bc-sep">›</span><span className="bc-cur">Contact</span></div>
          <h1 className="page-title">Get In Touch</h1>
          <p className="page-sub">Request samples, get bulk pricing, or start your OEM conversation.</p>
        </div>
      </div>
      <Contact addToast={addToast} />
    </>
  );
}

/* ─── ROOT APP ────────────────────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [activeCat, setActiveCat] = useState(null);

  useEffect(() => { injectStyles(); }, []);
  useEffect(() => {
    const onScroll = () => {
      const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setScrolled(window.scrollY > 40);
      setScrollPct(pct);
      setShowTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); setMob(false); }, [page]);

  const addToast = useCallback(({ msg, sub, type = "info" }) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, sub, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const navigateTo = useCallback(p => setPage(p), []);

  const renderPage = () => {
    switch (page) {
      case "Home": return (
        <>
          <Hero setPage={navigateTo} />
          <div className="trust">
            <div className="trust-inner">
              {[["🏭","20+ Years Manufacturing"],["🌍","Export to 18 Countries"],["🔬","ISO 9001 Certified"],["📦","500+ Active B2B Clients"],["⚡","15-Day Sample Delivery"],["✅","OEKO-TEX Compliant"]].map(([ico, t], i) => (
                <span key={t} className="trust-item"><span>{ico}</span>{t}{i < 5 && <span className="trust-dot" />}</span>
              ))}
            </div>
          </div>
          <Categories setPage={navigateTo} activeCat={activeCat} setActiveCat={setActiveCat} />
          <FeaturedProducts setPage={navigateTo} addToast={addToast} />
          <GallerySection setPage={navigateTo} />
          <About />
          <Stats />
          <Why />
          <Industries setPage={navigateTo} />
          <Process />
          <Testimonials />
          <Contact addToast={addToast} />
        </>
      );
      case "Products": return <ProductsPage setPage={navigateTo} addToast={addToast} />;
      case "Fabric Designs": return <FabricDesignsPage setPage={navigateTo} />;
      case "Manufacturing": return <ManufacturingPage setPage={navigateTo} />;
      case "About": return <AboutPage setPage={navigateTo} addToast={addToast} />;
      case "Contact": return <ContactPage setPage={navigateTo} addToast={addToast} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />
      <Navbar page={page} setPage={navigateTo} scrolled={scrolled} mob={mob} setMob={setMob} />
      <main>{renderPage()}</main>
      <Footer setPage={navigateTo} />
      <button className="float-wa" title="WhatsApp" onClick={() => window.open("https://wa.me/919876543210","_blank")}>💬</button>
      <button className={`float-scroll${showTop ? " vis" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>
      <ToastContainer toasts={toasts} />
    </div>
  );
}
