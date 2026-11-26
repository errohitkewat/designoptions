(function () {
  "use strict";
  var $ = function (s, r) {
    return (r || document).querySelector(s);
  };
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  };
  var body = document.body,
    reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  var wa = body.dataset.wa,
    ig = body.dataset.ig,
    hasWa = !/X/.test(wa);

  /* contact links: WhatsApp when a real number is set in <body data-wa>, otherwise Instagram DM */
  $$("[data-ig-link]").forEach(function (a) {
    a.href = "https://www.instagram.com/" + ig;
    a.target = "_blank";
    a.rel = "noopener";
  });
  var contact = hasWa
    ? "https://wa.me/" +
      wa +
      "?text=" +
      encodeURIComponent(
        "Hi Design Opttions, I would like to discuss an interior design project.",
      )
    : "https://ig.me/m/" + ig;
  $$("[data-cta-wa]").forEach(function (a) {
    a.href = contact;
    a.target = "_blank";
    a.rel = "noopener";
  });
  $$("[data-wa-link]").forEach(function (a) {
    if (hasWa) {
      a.href = "tel:+" + wa;
      a.textContent = "+" + wa.replace(/^(\d{2})(\d{5})(\d{5})$/, "$1 $2 $3");
    } else {
      a.href = contact;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "@" + ig;
    }
  });

  /* enquiry form: sends to a form endpoint if set, else WhatsApp, else email, else copies the text and opens an Instagram DM */
  var form = $("#enq"),
    st = $("#fst");
  if (form)
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = new FormData(form),
        name = (f.get("name") || "").trim(),
        ph = (f.get("phone") || "").trim(),
        type = f.get("type"),
        msg = (f.get("msg") || "").trim();
      if (!name || !ph || !msg) {
        st.textContent =
          "Please fill in your name, contact detail and message.";
        return;
      }
      var text =
        "Hi Design Opttions, I am " +
        name +
        ".\nI am looking for: " +
        type +
        "\nContact: " +
        ph +
        "\n\n" +
        msg;
      var ep = body.dataset.endpoint,
        mail = body.dataset.email;
      if (ep) {
        fetch(ep, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: name,
            contact: ph,
            service: type,
            message: msg,
          }),
        })
          .then(function (r) {
            if (!r.ok) throw 0;
            st.textContent = "Thank you. Your enquiry has been sent.";
            form.reset();
          })
          .catch(function () {
            st.textContent =
              "Something went wrong. Please try again or message us on Instagram.";
          });
      } else if (hasWa) {
        window.open(
          "https://wa.me/" + wa + "?text=" + encodeURIComponent(text),
          "_blank",
        );
        st.textContent = "Opening WhatsApp with your message.";
      } else if (mail) {
        location.href =
          "mailto:" +
          mail +
          "?subject=" +
          encodeURIComponent("Project enquiry from " + name) +
          "&body=" +
          encodeURIComponent(text);
      } else {
        var done = function () {
          st.textContent =
            "Your message is copied. Paste it in the Instagram chat that opens.";
          window.open("https://ig.me/m/" + ig, "_blank");
        };
        if (navigator.clipboard)
          navigator.clipboard.writeText(text).then(done, done);
        else done();
      }
    });

  /* hero title split into letters for the rise-in */
  var n = 0;
  $$("#h1 .ln").forEach(function (l) {
    l.innerHTML = l.textContent
      .split("")
      .map(function (c) {
        return (
          '<span class="ch" aria-hidden="true"><i style="--d:' +
          n++ +
          '">' +
          c +
          "</i></span>"
        );
      })
      .join("");
  });

  /* floating glass nav: slides away while scrolling down, comes back as soon as you scroll up (or reach the top) */
  var nav = $(".nav"),
    lastY = scrollY;
  addEventListener(
    "scroll",
    function () {
      var y = scrollY,
        d = y - lastY;
      if (Math.abs(d) < 6) return;
      if (y < 80 || d < 0) nav.classList.remove("hide");
      else if (!body.classList.contains("menu")) nav.classList.add("hide");
      lastY = y;
    },
    { passive: true },
  );

  /* mobile menu */
  var burger = $("#burger");
  burger.addEventListener("click", function () {
    var o = body.classList.toggle("menu");
    burger.setAttribute("aria-expanded", o);
  });
  $$("#menu a").forEach(function (a) {
    a.addEventListener("click", function () {
      body.classList.remove("menu");
      burger.setAttribute("aria-expanded", false);
    });
  });

  /* reveals, counters (both play once and stay) */
  function startReveals() {
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          /* play once: add the class and stop watching, so nothing animates back out on scroll up */
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    $$(".rv,.rv-img").forEach(function (el) {
      io.observe(el);
    });
    var co = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          var el = e.target;
          if (!e.isIntersecting) return;
          co.unobserve(el); /* count up once only */
          var to = +el.dataset.n,
            t0 = performance.now();
          (function f(t) {
            var p = Math.min(1, (t - t0) / 1600);
            el.textContent = Math.round(
              to * (1 - Math.pow(1 - p, 3)),
            ).toLocaleString("en-US");
            if (p < 1) el._r = requestAnimationFrame(f);
          })(t0);
        });
      },
      { threshold: 0.6 },
    );
    $$("[data-n]").forEach(function (el) {
      co.observe(el);
    });
  }

  /* preloader: gold line + rolling 000-100 counter, then the curved curtain lifts */
  var pre = $("#pre"),
    cnt = $("#cnt"),
    bar = $(".bar i"),
    cols = [];
  for (var i = 0; i < 3; i++) {
    var sp = document.createElement("span"),
      b = document.createElement("b");
    b.innerHTML = "0123456789"
      .split("")
      .map(function (d) {
        return "<s>" + d + "</s>";
      })
      .join("");
    sp.appendChild(b);
    cnt.appendChild(sp);
    cols.push(b);
  }
  function show(p) {
    var s = ("00" + Math.round(p)).slice(-3);
    if (p >= 100) s = "100";
    cols.forEach(function (c, k) {
      c.style.transform = "translateY(" + -s[k] + "em)";
    });
    bar.style.transform = "scaleX(" + p / 100 + ")";
  }
  function done() {
    pre.classList.add("out");
    setTimeout(function () {
      body.classList.remove("loading");
      body.classList.add("ready");
      startReveals();
    }, 650);
    setTimeout(function () {
      pre.remove();
    }, 1600);
  }
  if (reduce) {
    pre.remove();
    body.classList.remove("loading");
    body.classList.add("ready");
    startReveals();
  } else {
    var loaded = new Promise(function (r) {
      if (document.readyState === "complete") r();
      else addEventListener("load", r);
    });
    var t0 = performance.now(),
      ran = new Promise(function (r) {
        (function f(t) {
          var p = Math.min(1, (t - t0) / 2300),
            e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
          show(e * 100);
          if (p < 1) requestAnimationFrame(f);
          else r();
        })(t0);
      });
    Promise.all([loaded, ran]).then(function () {
      setTimeout(done, 250);
    });
  }

  /* scroll motion: headings drift in opposite directions, images float inside their frames, hero text slides away */
  var items = $$("[data-sx],[data-py]").map(function (e) {
    return {
      e: e,
      sx: +e.dataset.sx || 0,
      py: +e.dataset.py || 0,
      x: 0,
      y: 0,
      p: e.parentElement,
    };
  });
  var h1 = $("#h1"),
    tri = $("#tri");
  function tick() {
    var vh = innerHeight,
      y = scrollY;
    items.forEach(function (o) {
      var r = o.p.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var c = r.top + r.height / 2 - vh / 2;
      o.x += (-c * o.sx - o.x) * 0.09;
      o.y += (-c * o.py - o.y) * 0.09;
      o.e.style.transform =
        "translate3d(" + o.x.toFixed(1) + "px," + o.y.toFixed(1) + "px,0)";
    });
    if (y < vh * 1.3) {
      h1.style.transform = "translate3d(" + (-y * 0.22).toFixed(1) + "px,0,0)";
      tri.style.transform = "translate3d(0," + (y * 0.14).toFixed(1) + "px,0)";
    }
    requestAnimationFrame(tick);
  }
  if (!reduce) tick();
})();
