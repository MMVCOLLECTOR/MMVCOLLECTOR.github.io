
  <script>
    // === CUSTOM CURSOR ===
    const cursor = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });
    function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();
    document.querySelectorAll('a, button, .service-card, .exp-item, .contact-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2)';
        cursorRing.style.transform = 'translate(-50%,-50%) scale(1.5)';
        cursorRing.style.borderColor = 'rgba(240,192,64,0.8)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
        cursorRing.style.borderColor = 'rgba(240,192,64,0.5)';
      });
    });

    // === STARFIELD ===
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    let stars = [];
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function initStars() {
      stars = [];
      const count = Math.floor((canvas.width * canvas.height) / 4000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.2,
          alpha: Math.random(),
          speed: Math.random() * 0.003 + 0.001,
          twinkleOffset: Math.random() * Math.PI * 2,
          color: Math.random() > 0.9 ? '#f0c040' : Math.random() > 0.85 ? '#a855f7' : '#ffffff'
        });
      }
    }
    initStars();

    let t = 0;
    function drawStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.016;
      stars.forEach(s => {
        const alpha = 0.3 + 0.7 * (Math.sin(t * s.speed * 60 + s.twinkleOffset) * 0.5 + 0.5);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha * s.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(drawStars);
    }
    drawStars();

    // === PIANO KEYS in header ===
    const keysContainer = document.querySelector('.piano-keys-top');
    const pattern = [true,false,true,false,true,true,false,true,false,true,false,true]; // white=true
    for (let i = 0; i < 28; i++) {
      const isWhite = pattern[i % 12];
      const key = document.createElement('div');
      key.className = 'pk ' + (isWhite ? 'pk-white' : 'pk-black');
      keysContainer.appendChild(key);
    }

    // === FLOATING MUSICAL NOTES ===
    const notesSymbols = ['♩','♪','♫','♬','𝅘𝅥𝅮','🎵','🎶'];
    const notesContainer = document.getElementById('notes-container');
    function spawnNote() {
      const note = document.createElement('div');
      note.className = 'musical-note';
      note.textContent = notesSymbols[Math.floor(Math.random() * notesSymbols.length)];
      note.style.left = Math.random() * 100 + 'vw';
      const dur = 12 + Math.random() * 15;
      note.style.animationDuration = dur + 's';
      note.style.animationDelay = '0s';
      note.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
      note.style.color = Math.random() > 0.5
        ? `rgba(240,192,64,${0.1 + Math.random() * 0.2})`
        : `rgba(168,85,247,${0.1 + Math.random() * 0.15})`;
      notesContainer.appendChild(note);
      setTimeout(() => note.remove(), (dur + 1) * 1000);
    }
    setInterval(spawnNote, 1800);
    for (let i = 0; i < 5; i++) setTimeout(spawnNote, i * 600);

    // === SCROLL REVEAL ===
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-card, .exp-item, .contact-card').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s ${i * 0.07}s ease, transform 0.6s ${i * 0.07}s ease`;
      observer.observe(el);
    });

    // === CLICK RIPPLE ===
    document.addEventListener('click', e => {
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 6px; height: 6px;
        background: rgba(240,192,64,0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9997;
        transform: translate(-50%,-50%) scale(0);
        animation: rippleOut 0.6s ease-out forwards;
      `;
      document.body.appendChild(ripple);
      const style = document.createElement('style');
      style.textContent = '@keyframes rippleOut { to { transform: translate(-50%,-50%) scale(20); opacity: 0; } }';
      document.head.appendChild(style);
      setTimeout(() => { ripple.remove(); style.remove(); }, 700);
    });
  </script>
