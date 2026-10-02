/* Hyperion Rockets — site script */

/* ===== Links: edit these two lines =====
   formulari: Google Form URL for "Vull participar". Empty = goes to the contact page.
   dossier:   PDF file, e.g. "dossier.pdf". Empty = button shows "Disponible aviat". */
var ENLLACOS = {
  formulari: "",
  dossier: ""
};


(function(){
  var EN = (document.documentElement.lang || "").indexOf("en") === 0;
  var base = EN ? "../" : "";   // English pages live one folder down
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mouse = matchMedia("(hover: hover) and (pointer: fine)").matches;


  // ---------- form + dossier links ----------
  if (ENLLACOS.formulari){
    document.querySelectorAll('[data-link="form"]').forEach(function(a){
      a.href = ENLLACOS.formulari;
      a.target = "_blank";
      a.rel = "noopener";
    });
  }
  if (ENLLACOS.dossier){
    document.querySelectorAll('[data-link="dossier"]').forEach(function(a){
      a.href = /^https?:/.test(ENLLACOS.dossier) ? ENLLACOS.dossier : base + ENLLACOS.dossier;
      a.target = "_blank";
      a.rel = "noopener";
      a.classList.remove("is-pending");
      a.removeAttribute("aria-disabled");
      a.removeAttribute("role");
    });
  }


  // ---------- starfield ----------
  // Canvas at 30 fps. Each star is a small pre-drawn image, so a frame is just ~100 copies.
  var sky = document.querySelector(".sky");
  if (sky && sky.getContext){
    var ctx = sky.getContext("2d");
    var FPS = 30, STEP = 1000 / FPS;
    var stars = [], W = 0, H = 0, last = 0, acc = 0, shoot = null, nextShoot = 4000;

    // one glowing dot, drawn once per colour
    var sprite = function(color){
      var c = document.createElement("canvas"), s = 16;
      c.width = c.height = s;
      var g = c.getContext("2d");
      var grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      grad.addColorStop(0, color);
      grad.addColorStop(.45, color);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, s, s);
      return c;
    };
    var white = sprite("#F1F3F6"), warm = sprite("#FFE3C4");

    var resize = function(){
      var dpr = 1;   // stars are soft dots, full resolution is not needed
      W = sky.clientWidth; H = sky.clientHeight;
      sky.width = Math.round(W * dpr); sky.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(130, W * H / 11000));   // fewer stars on small screens
      stars = [];
      for (var i = 0; i < n; i++){
        var r = Math.random() * 1.3 + .4;
        stars.push({
          x: Math.random() * W, y: Math.random() * H, r: r,
          img: r > 1.45 ? warm : white,
          a: Math.random() * .5 + .5,       // brightness
          tw: Math.random() * 2 + .6,       // twinkle speed
          ph: Math.random() * 6.3,
          v: Math.random() * .01 + .004     // drift, px per ms
        });
      }
    };

    var render = function(t, dt){
      ctx.clearRect(0, 0, W, H);
      var sy = window.scrollY * .04;   // slight parallax on scroll

      for (var i = 0; i < stars.length; i++){
        var s = stars[i];
        s.y -= s.v * dt;
        if (s.y < -4){ s.y = H + 4; s.x = Math.random() * W; }
        var y = ((s.y - sy * s.r) % H + H) % H;
        ctx.globalAlpha = reduce ? s.a : s.a * (.6 + .4 * Math.sin(t / 1000 * s.tw + s.ph));
        var d = s.r * 3;   // sprite has a soft edge, so draw it a bit bigger than the star
        ctx.drawImage(s.img, s.x - d / 2, y - d / 2, d, d);
      }

      // shooting star every 6–13 s
      if (!reduce){
        nextShoot -= dt;
        if (!shoot && nextShoot <= 0){
          shoot = {x: Math.random() * W * .6 + W * .3, y: Math.random() * H * .35, l: 0};
          nextShoot = 6000 + Math.random() * 7000;
        }
        if (shoot){
          shoot.l += dt * .9;
          var len = Math.min(140, shoot.l), hx = shoot.x - shoot.l, hy = shoot.y + shoot.l * .45;
          var g = ctx.createLinearGradient(hx, hy, hx + len, hy - len * .45);
          g.addColorStop(0, "rgba(255,227,196,.9)");
          g.addColorStop(1, "rgba(255,227,196,0)");
          ctx.globalAlpha = Math.max(0, 1 - shoot.l / 700);
          ctx.strokeStyle = g; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + len, hy - len * .45); ctx.stroke();
          if (shoot.l > 700) shoot = null;
        }
      }
      ctx.globalAlpha = 1;
    };

    var loop = function(t){
      var dt = Math.min(100, t - (last || t)); last = t;
      acc += dt;
      if (acc >= STEP){ render(t, acc); acc %= STEP; }   // draw at most 30 times per second
      requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", function(){ resize(); if (reduce) render(0, 0); });
    if (reduce) render(0, 0); else requestAnimationFrame(loop);
  }


  // ---------- header + progress bar ----------
  var top = document.querySelector(".top");
  var bar = document.querySelector(".progress");
  var lastY = window.scrollY;

  var onScroll = function(){
    var y = window.scrollY;
    if (top){
      top.classList.toggle("scrolled", y > 12);
      if (y > 240 && y > lastY + 2) top.classList.add("hide");   // hide going down
      if (y < lastY - 2) top.classList.remove("hide");           // show going up
    }
    if (bar){
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    }
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, {passive: true});
  onScroll();


  // ---------- scroll reveal ----------
  // Only elements below the fold get hidden, so nothing stays invisible without JS.
  if (!reduce && "IntersectionObserver" in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, {threshold: .12, rootMargin: "0px 0px -6% 0px"});

    // stagger children of [data-stagger]
    document.querySelectorAll("[data-stagger]").forEach(function(group){
      group.querySelectorAll("[data-reveal]").forEach(function(el, i){
        el.style.setProperty("--d", (i * 110) + "ms");
      });
    });

    document.querySelectorAll("[data-reveal]").forEach(function(el){
      if (el.getBoundingClientRect().top > window.innerHeight * .9){
        el.classList.add("will-reveal");
        io.observe(el);
      }
    });
  }


  // ---------- card tilt ----------
  if (!reduce && mouse){
    document.querySelectorAll(".tilt").forEach(function(el){
      el.addEventListener("pointermove", function(ev){
        var r = el.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width, py = (ev.clientY - r.top) / r.height;
        el.style.setProperty("--mx", (px * 100) + "%");
        el.style.setProperty("--my", (py * 100) + "%");
        el.style.transform = "perspective(900px) rotateX(" + ((.5 - py) * 7) + "deg) rotateY(" + ((px - .5) * 9) + "deg) translateY(-4px)";
      });
      el.addEventListener("pointerleave", function(){ el.style.transform = ""; });
    });
  }


  // ---------- home logo follows the mouse ----------
  var patch = document.querySelector(".patch");
  if (patch && !reduce && mouse){
    window.addEventListener("pointermove", function(ev){
      var x = ev.clientX / window.innerWidth - .5, y = ev.clientY / window.innerHeight - .5;
      patch.style.transform = "translate(" + (x * 18) + "px," + (y * 14) + "px) rotate(" + (x * 4) + "deg)";
    });
  }


  // ---------- rocket drawings: trace when visible, again on click ----------
  document.querySelectorAll(".drawing").forEach(function(svg){
    var play = function(){
      svg.classList.remove("run");
      void svg.getBoundingClientRect();   // restart the animation
      svg.classList.add("run");
    };
    if ("IntersectionObserver" in window){
      var played = false;
      new IntersectionObserver(function(entries){
        var on = entries[0].isIntersecting;
        svg.classList.toggle("off", !on);   // pause the flame when not visible
        if (on && !played && entries[0].intersectionRatio >= .5){ play(); played = true; }
      }, {threshold: [0, .5]}).observe(svg);
    } else {
      play();
    }
    svg.addEventListener("click", play);
  });


  // ---------- copy e-mail ----------
  var btn = document.getElementById("copy-mail");
  var mail = document.getElementById("mail");
  if (btn && mail){
    var label = btn.querySelector(".t");
    var txt = EN ? {copy: "Copy", done: "Copied", sel: "Selected"} : {copy: "Copia", done: "Copiat", sel: "Seleccionat"};

    var selectText = function(){
      var r = document.createRange(); r.selectNodeContents(mail);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      label.textContent = txt.sel;
    };

    btn.addEventListener("click", function(){
      try {
        navigator.clipboard.writeText(mail.textContent.trim()).then(function(){
          label.textContent = txt.done;
          btn.classList.add("ok");
          setTimeout(function(){ label.textContent = txt.copy; btn.classList.remove("ok"); }, 2000);
        }, selectText);
      } catch (e){
        selectText();
      }
    });
  }
})();
