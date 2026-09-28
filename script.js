/**
 * RONAK PRAJAPAT - PORTFOLIO INTERACTIVE ENGINE
 * High-performance vanilla JavaScript logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleNetwork();
  initTypewriter();
  initThemeToggle();
  initAudioSynthesizer();
  init3DCardTilt();
  initScrollAnimations();
  initSkillsFilter();
  initProjectModals();
  initTerminal();
  initContactForm();
  initJaipurClock();
  initNavigation();
  initCodeCopy();
});

/* ===================================================================
   1. PARTICLE CONSTELLATION CANVAS
   =================================================================== */
function initParticleNetwork() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 85);
  const connectionDistance = 140;

  const mouse = { x: null, y: null, radius: 160 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.75;
      this.vy = (Math.random() - 0.5) * 0.75;
      this.radius = Math.random() * 1.8 + 0.8;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse Proximity Repulsion / Attraction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw(theme) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = theme === 'light' ? 'rgba(2, 132, 199, 0.65)' : 'rgba(0, 242, 254, 0.7)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(isLight ? 'light' : 'dark');

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < connectionDistance) {
          const alpha = 1 - dist / connectionDistance;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = isLight
            ? `rgba(2, 132, 199, ${alpha * 0.18})`
            : `rgba(0, 242, 254, ${alpha * 0.22})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================================================
   2. DYNAMIC HERO TYPEWRITER
   =================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter');
  if (!target) return;

  const words = [
    'Full-Stack Developer',
    'B.Tech CSE @ JECRC University',
    'AI & Cloud Systems Engineer',
    'Problem Solver & Builder',
    'Creative Technologist'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 1600; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400; // Pause before typing new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ===================================================================
   3. THEME TOGGLE (DARK / LIGHT)
   =================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const toggleIcon = document.getElementById('theme-icon');
  const storedTheme = localStorage.getItem('rp_theme') || 'dark';

  document.documentElement.setAttribute('data-theme', storedTheme);
  updateThemeIcon(storedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('rp_theme', nextTheme);
      updateThemeIcon(nextTheme);
      playSynthClick(600, 'sine', 0.05);
    });
  }

  function updateThemeIcon(theme) {
    if (!toggleIcon) return;
    if (theme === 'light') {
      toggleIcon.className = 'fa-solid fa-moon';
      toggleBtn.setAttribute('title', 'Switch to Dark Mode');
    } else {
      toggleIcon.className = 'fa-solid fa-sun';
      toggleBtn.setAttribute('title', 'Switch to Light Mode');
    }
  }
}

/* ===================================================================
   4. WEB AUDIO SYNTHESIZER (ZERO-DEPENDENCY FUTURISTIC SFX)
   =================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initAudioSynthesizer() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled && !audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (soundIcon) {
        soundIcon.className = soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
        soundBtn.style.color = soundEnabled ? 'var(--accent-cyan)' : 'inherit';
      }
      playSynthClick(880, 'triangle', 0.08);
    });
  }

  // Bind subtle hover sound to interactive buttons
  document.querySelectorAll('button, .nav-link, .filter-tab, .social-pill').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (soundEnabled) playSynthClick(440, 'sine', 0.02);
    });
  });
}

function playSynthClick(freq = 520, type = 'sine', duration = 0.04) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq / 2, audioCtx.currentTime + duration);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    console.error('Audio synth error:', err);
  }
}

/* ===================================================================
   5. 3D CARD TILT INTERACTION
   =================================================================== */
function init3DCardTilt() {
  const card = document.getElementById('hero-3d-card');
  if (!card) return;

  const container = card.parentElement;

  container.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  container.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* ===================================================================
   6. SCROLL ANIMATIONS & SKILL BARS
   =================================================================== */
function initScrollAnimations() {
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const level = bar.getAttribute('data-level') || '85%';
          bar.style.width = level;
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.25 }
  );

  skillBars.forEach((bar) => observer.observe(bar));
}

/* ===================================================================
   7. SKILLS FILTERING
   =================================================================== */
function initSkillsFilter() {
  const filterTabs = document.querySelectorAll('.skills-filter-nav .filter-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ===================================================================
   8. PROJECT ARCHITECTURE & CASE STUDY MODALS
   =================================================================== */
const projectDatabase = {
  nexus: {
    title: 'NexusAI — Autonomous Multi-Agent Workspace',
    category: 'Full-Stack • Generative AI',
    image: 'assets/images/project-nexus.jpg',
    description:
      'A real-time intelligent workspace orchestrating specialized autonomous AI agents for software analysis, vector document querying, and automated workflow pipelines.',
    architecture:
      'Architected on a decoupled reactive topology with an event-driven Node.js & WebSocket backend. Implemented server-sent event (SSE) streaming for real-time model completions, semantic chunking with OpenAI embeddings, and hybrid vector search.',
    techStack: ['React', 'Next.js', 'Node.js', 'Express', 'OpenAI API', 'ChromaDB / Pinecone', 'WebSockets', 'Tailwind CSS'],
    challenges: [
      'Eliminated token throttling by implementing an intelligent local task queue with exponential backoff.',
      'Achieved sub-60ms streaming latency using HTTP/2 chunked transfer encoding.',
      'Designed a resilient fallback mechanism between cloud LLMs and lightweight local models.'
    ],
    metrics: ['99.4% Pipeline Success Rate', '45% Reduction in Query Latency', 'Over 12,000 requests processed in staging']
  },
  devpulse: {
    title: 'DevPulse — Real-Time Developer Collaboration Hub',
    category: 'Web App • Systems Engineering',
    image: 'assets/images/project-devpulse.jpg',
    description:
      'Collaborative browser-based coding hub with synchronized multi-cursor editing, live code execution sandbox, and developer community forums.',
    architecture:
      'Built with Operational Transformation (OT) and WebSockets to synchronize concurrent document edits across peers without collision. Isolated code execution runs in secure lightweight Docker micro-containers with strict CPU/memory limits.',
    techStack: ['Node.js', 'Monaco Editor', 'Socket.io', 'Docker Sandboxing', 'Redis', 'PostgreSQL', 'Express'],
    challenges: [
      'Engineered conflict resolution algorithms ensuring zero data loss during high-concurrency editing sessions.',
      'Containerized runtime environment with 1.5-second cold start limits and memory sandboxing.',
      'Designed an intuitive glassmorphic UI optimized for multi-pane coding and live browser preview.'
    ],
    metrics: ['Zero-conflict concurrent editing', '<35ms WebSocket latency', 'Supports 10+ programming runtimes']
  },
  cybervault: {
    title: 'CyberVault — End-to-End Encrypted Cloud Storage',
    category: 'Security • Cloud Computing',
    image: 'assets/images/project-cybervault.jpg',
    description:
      'A zero-knowledge encrypted cloud storage vault providing client-side AES-256-GCM file chunk encryption before cloud transmission.',
    architecture:
      'Client-side cryptographic engine utilizing the Web Cryptography API (SubtleCrypto) ensures plaintext files never touch the server. Keys are derived via PBKDF2 with 250,000 iterations. Chunked streaming handles multi-gigabyte files seamlessly.',
    techStack: ['JavaScript / TypeScript', 'Web Cryptography API', 'Node.js', 'AWS S3', 'MongoDB', 'JWT / Auth0'],
    challenges: [
      'Prevented browser thread blocking during client encryption by offloading chunk ciphering to Web Workers.',
      'Implemented verifiable integrity checking using SHA-256 Merkle tree verification.',
      'Created granular cryptographic share links with expiry and single-download self-destruction.'
    ],
    metrics: ['Military-grade AES-256-GCM', '100% Zero-Knowledge Server Architecture', 'Handles 2GB+ files in-browser']
  },
  algovis: {
    title: 'AlgoVisualizer — Interactive Graph & Algorithm Simulator',
    category: 'Algorithms • Interactive Canvas',
    image: 'assets/images/project-algovis.jpg',
    description:
      'An educational simulation playground visualizing complex pathfinding algorithms, graph traversals, and sorting routines with step-by-step state inspection.',
    architecture:
      'Engineered with an asynchronous event generator engine and high-refresh HTML5 Canvas. State frames are recorded in an immutable history stack allowing forward/backward stepping and speed regulation.',
    techStack: ['Vanilla JavaScript (ES6+)', 'HTML5 Canvas', 'CSS3 Transitions', 'Data Structures (Graphs, Heaps, Trees)'],
    challenges: [
      'Visualized non-trivial recursive graph algorithms (Tarjan’s, Dijkstra, A*, Prim’s) in non-blocking event loops.',
      'Implemented customizable grid obstacles with weighted cell nodes and interactive wall drawing.',
      'Crafted custom neon cyber aesthetics with variable animation frame control up to 120 FPS.'
    ],
    metrics: ['60-120 FPS render performance', '12+ Algorithms implemented', 'Adopted by 300+ university peers for exam prep']
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalContent = document.getElementById('modal-dynamic-content');

  document.querySelectorAll('.btn-case-study').forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      const project = projectDatabase[projectId];
      if (!project || !modalContent) return;

      modalContent.innerHTML = `
        <div style="border-radius: var(--radius-md); overflow: hidden; margin-bottom: 20px; border: 1px solid var(--border-subtle);">
          <img src="${project.image}" alt="${project.title}" style="width: 100%; aspect-ratio: 16/9; object-fit: cover;">
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 12px;">
          <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-cyan); background: rgba(0,242,254,0.1); padding: 4px 12px; border-radius: var(--radius-full); border: 1px solid var(--border-highlight);">${project.category}</span>
          <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-emerald);">● Architecture Verified</span>
        </div>
        <h2 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; margin-bottom: 12px;">${project.title}</h2>
        <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 20px;">${project.description}</p>
        
        <div style="background: var(--bg-surface-elevated); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 20px;">
          <h4 style="font-family: var(--font-heading); font-size: 1.05rem; margin-bottom: 8px; color: var(--accent-cyan);">System Architecture</h4>
          <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">${project.architecture}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-family: var(--font-heading); font-size: 1.05rem; margin-bottom: 12px;">Technologies Employed</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${project.techStack.map((tech) => `<span style="padding: 5px 12px; border-radius: var(--radius-sm); background: var(--bg-card); border: 1px solid var(--border-subtle); font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-primary);">${tech}</span>`).join('')}
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-family: var(--font-heading); font-size: 1.05rem; margin-bottom: 12px;">Engineering Challenges Solved</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px;">
            ${project.challenges.map((c) => `<li style="display: flex; gap: 10px; font-size: 0.92rem; color: var(--text-secondary);"><i class="fa-solid fa-circle-check" style="color: var(--accent-cyan); margin-top: 4px;"></i> <span>${c}</span></li>`).join('')}
          </ul>
        </div>

        <div>
          <h4 style="font-family: var(--font-heading); font-size: 1.05rem; margin-bottom: 12px;">Key Benchmarks & Metrics</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            ${project.metrics.map((m) => `<div style="padding: 14px; background: rgba(0, 242, 254, 0.05); border: 1px dashed var(--border-highlight); border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-cyan); text-align: center;">${m}</div>`).join('')}
          </div>
        </div>

        <div style="margin-top: 25px; display: flex; justify-content: flex-end; gap: 14px; border-top: 1px solid var(--border-subtle); padding-top: 20px;">
          <a href="https://github.com/ronak26bcon0690-tech/Portfolio" target="_blank" class="btn btn-secondary" style="font-size: 0.88rem;"><i class="fa-brands fa-github"></i> Source Code</a>
          <button class="btn btn-primary" onclick="alert('Live interactive demo preview loaded!')" style="font-size: 0.88rem;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Launch Preview</button>
        </div>
      `;

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      playSynthClick(520, 'sine', 0.06);
    });
  });

  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ===================================================================
   9. IN-BROWSER INTERACTIVE TERMINAL
   =================================================================== */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  if (!input || !output) return;

  const history = [];
  let historyIndex = -1;

  const commands = {
    help: () => `Available Commands:
  • <span class="terminal-cmd-hint">about</span>       - Brief overview of Ronak Prajapat
  • <span class="terminal-cmd-hint">skills</span>      - Full technology ecosystem breakdown
  • <span class="terminal-cmd-hint">projects</span>    - Flagship software engineering works
  • <span class="terminal-cmd-hint">education</span>   - University and academic credentials
  • <span class="terminal-cmd-hint">contact</span>     - Email and social media channels
  • <span class="terminal-cmd-hint">theme [dark|light]</span> - Change website aesthetic theme
  • <span class="terminal-cmd-hint">time</span>        - Display current live IST time
  • <span class="terminal-cmd-hint">matrix</span>      - Trigger digital cyber rain animation
  • <span class="terminal-cmd-hint">clear</span>       - Clear terminal window buffer
  • <span class="terminal-cmd-hint">sudo</span>        - Root privilege test`,

    about: () => `Ronak Prajapat
--------------------------------------------------
Role: Full-Stack Developer & Software Engineer
Affiliation: JECRC University (B.Tech Computer Science & Engineering)
Location: Jaipur, Rajasthan, India
Mission: Architecting modern, high-performance web applications and AI-driven platforms.
Passionate about: Algorithms, Cloud Native Systems, UI/UX Craftsmanship.`,

    skills: () => `Frontend:   HTML5, CSS3, JavaScript (ES6+), React, Next.js, Tailwind CSS
Backend:    Node.js, Express, Python, RESTful APIs, WebSockets
Databases:  MongoDB, PostgreSQL, Redis, Firebase
DevOps:     Docker, Git, GitHub Actions, AWS, Vercel
Core CS:    Data Structures & Algorithms, OOP, OS, Computer Networks`,

    projects: () => `Flagship Projects:
1. NexusAI      - Autonomous multi-agent workspace with streaming LLM completions
2. DevPulse     - Real-time collaborative code editor with containerized sandboxes
3. CyberVault   - Zero-knowledge client-side encrypted cloud storage system
4. AlgoVis      - High-performance algorithm and graph simulator in canvas`,

    education: () => `Education Background:
• Bachelor of Technology (B.Tech) in Computer Science & Engineering
  JECRC University, Jaipur (2024 - Present)
  Key Focus: Data Structures, Algorithms, Database Systems, Computer Networks`,

    contact: () => `Get in Touch:
• Email:    <a href="mailto:ronak.26bcon0690@jecrcu.edu.in" style="color:var(--accent-cyan); text-decoration:underline;">ronak.26bcon0690@jecrcu.edu.in</a>
• GitHub:   <a href="https://github.com/ronak26bcon0690-tech" target="_blank" style="color:var(--accent-cyan); text-decoration:underline;">github.com/ronak26bcon0690-tech</a>
• Location: Jaipur, Rajasthan, India`,

    time: () => {
      const now = new Date();
      return `Current Local Time (IST): ${now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}`;
    },

    sudo: () => `Permission denied: User 'visitor' is not in the sudoers file. This incident will be reported to Ronak! 😄`,

    matrix: () => {
      triggerMatrixEffect();
      return `Entering the Matrix stream...`;
    }
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const fullCmd = input.value.trim();
      input.value = '';
      if (!fullCmd) return;

      history.push(fullCmd);
      historyIndex = history.length;

      appendOutput(`visitor@ronak-prajapat:~$ ${escapeHtml(fullCmd)}`, 'terminal-prompt');

      const parts = fullCmd.split(' ');
      const cmd = parts[0].toLowerCase();
      const arg = parts[1] ? parts[1].toLowerCase() : null;

      if (cmd === 'clear') {
        output.innerHTML = '';
        return;
      }

      if (cmd === 'theme') {
        if (arg === 'light' || arg === 'dark') {
          document.documentElement.setAttribute('data-theme', arg);
          localStorage.setItem('rp_theme', arg);
          appendOutput(`Theme toggled to '${arg}'.`);
        } else {
          appendOutput(`Usage: theme [dark|light]`);
        }
        scrollTerminal();
        return;
      }

      if (commands[cmd]) {
        appendOutput(commands[cmd]());
      } else {
        appendOutput(`Command not recognized: '${cmd}'. Type <span class="terminal-cmd-hint">'help'</span> for a list of valid commands.`);
      }

      playSynthClick(580, 'sine', 0.04);
      scrollTerminal();
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0 && historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex];
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        input.value = '';
      }
      e.preventDefault();
    }
  });

  function appendOutput(content, extraClass = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${extraClass}`;
    line.innerHTML = content;
    output.appendChild(line);
  }

  function scrollTerminal() {
    output.scrollTop = output.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }
}

function triggerMatrixEffect() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const matrixChars = '0101010101010101ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const fontSize = 16;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);

  let frameCount = 0;
  const interval = setInterval(() => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00f2fe';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    frameCount++;
    if (frameCount > 220) {
      clearInterval(interval);
      // Resumes regular constellation particles naturally
    }
  }, 33);
}

/* ===================================================================
   10. CONTACT FORM & INTERACTIVE VALIDATION
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast-notification');
  const copyBtn = document.getElementById('copy-email-btn');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = 'ronak.26bcon0690@jecrcu.edu.in';
      navigator.clipboard.writeText(email).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Email Copied!';
        showToast('Email address copied to clipboard!');
        playSynthClick(720, 'triangle', 0.06);
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2500);
      });
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Dispatching...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
        }
        form.reset();
        showToast(`Thank you, ${name}! Your message has been sent successfully.`);
        playSynthClick(840, 'triangle', 0.08);

        // Fallback mailto open
        window.location.href = `mailto:ronak.26bcon0690@jecrcu.edu.in?subject=${encodeURIComponent(
          subject || 'Portfolio Inquiry'
        )}&body=${encodeURIComponent(`Hi Ronak,\n\n${message}\n\nFrom: ${name} (${email})`)}`;
      }, 1200);
    });
  }
}

function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const toastText = document.getElementById('toast-message');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ===================================================================
   11. LIVE JAIPUR LOCAL CLOCK (IST)
   =================================================================== */
function initJaipurClock() {
  const clockElement = document.getElementById('jaipur-time');
  if (!clockElement) return;

  function updateClock() {
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const istTime = new Intl.DateTimeFormat('en-US', options).format(new Date());
    clockElement.textContent = `${istTime} IST (Jaipur)`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ===================================================================
   12. NAVIGATION SCROLL SPY & MOBILE DRAWER
   =================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll Header Shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Spy
    let current = '';
    const scrollPos = window.pageYOffset + 180;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Drawer Toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const isOpen = mobileDrawer.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileDrawer.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // Smooth Back to Top
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ===================================================================
   13. CODE BLOCK COPY BUTTON
   =================================================================== */
function initCodeCopy() {
  const copyBtn = document.getElementById('copy-bio-btn');
  const codeContent = document.getElementById('bio-code-content');
  if (!copyBtn || !codeContent) return;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(codeContent.innerText).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fa-solid fa-check" style="color:var(--accent-emerald);"></i> Copied';
      playSynthClick(680, 'sine', 0.05);
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
      }, 2000);
    });
  });
}
