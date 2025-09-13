/* ========= wait DOM ========= */
document.addEventListener('DOMContentLoaded', () => {
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  loader.style.opacity = '0';
  loader.style.transition = 'opacity 0.5s ease';
  setTimeout(() => loader.style.display = 'none', 500);
});

  /* ======= typing animation ======= */
  const words = ["Graphic Designer", "Video Editor", "Photo Editor", "Front-End Developer"];
  let wIndex = 0, cIndex = 0, deleting = false;
  const elTyping = document.getElementById('typing');

  function runType(){
    const word = words[wIndex];
    if(!deleting){
      elTyping.textContent = word.slice(0, cIndex++);
      if(cIndex > word.length){ deleting = true; setTimeout(runType, 900); return; }
    } else {
      elTyping.textContent = word.slice(0, cIndex--);
      if(cIndex < 0){ deleting = false; wIndex = (wIndex + 1) % words.length; }
    }
    setTimeout(runType, deleting ? 80 : 140);
  }
  runType();

  /* ======= sections reveal & nav highlight ======= */
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleScrollReveal(){
    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      if(rect.top < window.innerHeight - 120 && rect.bottom > 120){
        if(!sec.classList.contains('active')) sec.classList.add('active');
        // highlight nav
        navLinks.forEach(n => n.classList.remove('active'));
        const id = sec.id;
        const link = document.querySelector('.nav-link[href="#' + id + '"]');
        if(link) link.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });
  }
  handleScrollReveal();
  window.addEventListener('scroll', handleScrollReveal, {passive:true});
  window.addEventListener('resize', handleScrollReveal);

  /* ======= Tilt hover for gallery items ======= */
  document.querySelectorAll('.gallery .item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const r = item.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width/2) / (r.width/2);
      const y = (e.clientY - r.top - r.height/2) / (r.height/2);
      const rotateY = x * 8; // deg
      const rotateX = -y * 8;
      item.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
  });

  /* ======= Lightbox (image & video) ======= */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbVideo = document.getElementById('lightbox-video');
  const lbClose = document.querySelector('.lightbox-close');
  

  function openLightboxImage(src){
    lbVideo.pause(); lbVideo.style.display='none';
    lbImg.src = src; lbImg.style.display='block';
    lightbox.classList.add('show'); lightbox.setAttribute('aria-hidden','false');
  }
  function openLightboxVideo(src){
    lbImg.style.display='none';
    lbVideo.src = src; lbVideo.style.display='block';
    lbVideo.currentTime = 0; lbVideo.play();
    lightbox.classList.add('show'); lightbox.setAttribute('aria-hidden','false');
  }
  function closeLightbox(){
    lightbox.classList.remove('show'); lightbox.setAttribute('aria-hidden','true');
    lbVideo.pause(); lbVideo.src = '';
    lbImg.src = '';
  }

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if(e.target === lightbox) closeLightbox();
  });

  // Click handlers on gallery items
  document.querySelectorAll('.gallery .item').forEach(item => {
    const img = item.querySelector('img');
    const vid = item.querySelector('video');
    item.addEventListener('click', (e) => {
      e.preventDefault();
      if(img && img.src) openLightboxImage(img.src);
      else if(vid && vid.src) openLightboxVideo(vid.src);
    });
    // For video elements, add click to play/pause inline (optional)
if(vid){
  vid.addEventListener('play', () => {
    // Pause all other videos
    document.querySelectorAll('.gallery .item video').forEach(otherVid => {
      if(otherVid !== vid) otherVid.pause();
    });
  });

  // Optional: click to toggle play/pause
  vid.addEventListener('click', (ev) => {
    ev.stopPropagation();
    if(vid.paused) vid.play(); else vid.pause();
  });
}

  });

  /* ======= Particles background (canvas) ======= */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  let mouse = { x: null, y: null };

  window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });

  canvas.addEventListener('mousemove', (e) => { const rect = canvas.getBoundingClientRect(); mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top; });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  const particles = [];
  const PCOUNT = Math.max(60, Math.floor(W * H / 90000)); // scale with screen
  for(let i=0;i<PCOUNT;i++){
    particles.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: Math.random()*2+0.6,
      vx: (Math.random()-0.5)*0.4,
      vy: (Math.random()-0.5)*0.4
    });
  }

  function drawParticles(){
    ctx.clearRect(0,0,W,H);
    for(let p of particles){
      // move
      p.x += p.vx;
      p.y += p.vy;

      // wrap
      if(p.x < 0) p.x = W;
      if(p.x > W) p.x = 0;
      if(p.y < 0) p.y = H;
      if(p.y > H) p.y = 0;

      // size interacts with mouse
      let size = p.r;
      if(mouse.x !== null){
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 120) size = p.r + (120 - dist)/28;
      }

      ctx.beginPath();
      ctx.fillStyle = 'rgba(160,32,240,0.65)';
      ctx.arc(p.x, p.y, size, 0, Math.PI*2);
      ctx.fill();
    }
    // optional connecting lines (subtle)
    for(let a=0;a<particles.length;a++){
      for(let b=a+1;b<a+6 && b<particles.length;b++){
        const p1 = particles[a], p2 = particles[b];
        const dx = p1.x-p2.x, dy = p1.y-p2.y;
        const d = Math.sqrt(dx*dx+dy*dy);
        if(d < 110){
          ctx.strokeStyle = 'rgba(160,32,240,'+ (0.12 - d/900) + ')';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y); ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  /* ======= Small UX helpers ======= */
  // Ensure first section visible on load
  setTimeout(() => { document.querySelectorAll('.section')[0]?.classList.add('active'); }, 80);

  // Smooth anchor nav clicks
  document.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const s = document.getElementById(id);
      if(s) s.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

}); // DOMContentLoaded end

document.addEventListener('DOMContentLoaded', () => {

  // Create popup
  function createPopup(type, items) {
    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.innerHTML = `
      <div class="popup-box">
        <button class="popup-close">×</button>
        <h2 class="popup-title">${type}</h2>
        <div class="popup-gallery">
          ${items.map(src => {
            if(type === "Videos") {
              return `<div class="popup-item"><video src="${src}" muted></video></div>`;
            } else {
              return `<div class="popup-item"><img src="${src}" alt=""></div>`;
            }
          }).join("")}
        </div>
      </div>
    `;
    document.body.appendChild(popup);

    // Close popup
    popup.querySelector('.popup-close').addEventListener('click', () => popup.remove());

    // Lightbox preview
    popup.querySelectorAll('.popup-item img, .popup-item video').forEach(el => {
      el.addEventListener('click', () => openLightbox(el));
    });
  }

  // Lightbox system
  // Lightbox system with navigation
  function openLightbox(el) {
    // Collect all items in current popup
    const items = Array.from(document.querySelectorAll('.popup-item img, .popup-item video'));
    let currentIndex = items.indexOf(el);

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
      <div class="lightbox-box">
        <button class="lightbox-close">×</button>
        <button class="lightbox-prev">‹</button>
        <button class="lightbox-next">›</button>
        <div class="lightbox-content"></div>
      </div>
    `;
    document.body.appendChild(lightbox);

    const content = lightbox.querySelector('.lightbox-content');

    function showItem(i) {
      content.innerHTML = '';
      const el = items[i];
      if (el.tagName === "IMG") {
        const img = document.createElement("img");
        img.src = el.src;
        content.appendChild(img);
      } else if (el.tagName === "VIDEO") {
  const vid = document.createElement("video");
  vid.src = el.src;
  vid.controls = true;
  vid.autoplay = true;

  // Pause all other videos in document
  document.querySelectorAll('video').forEach(otherVid => {
    if(otherVid !== vid) otherVid.pause();
  });

  content.appendChild(vid);
}
    }

    showItem(currentIndex);

    // Navigation
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.remove());
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      showItem(currentIndex);
    });
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % items.length;
      showItem(currentIndex);
    });

    // ESC + arrow keys
    document.addEventListener('keydown', (e) => {
      if (e.key === "Escape") lightbox.remove();
      if (e.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        showItem(currentIndex);
      }
      if (e.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % items.length;
        showItem(currentIndex);
      }
    });
  }

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});
// Initialize EmailJS
(function(){
  emailjs.init("eHjwpQzc0rvWuRmO3"); // paste your Public Key here
})();

// Handle form submission
document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault();

  emailjs.sendForm("service_u5omd1e", "template_msm97nm", this)
    .then(() => {
      alert("✅ Message sent successfully!");
      this.reset();
    }, (error) => {
      alert("❌ Failed to send message. Try again.");
      console.log(error);
    });
});

  

  // Posters
  document.querySelector('a[href="more-photos.html"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    const posters = [
      "birthday3.png",
      "pic10.png",
      "pspk.png",
      "blood2.png",
      "agu151.png",
      "cbn1.png",
      "cli100.png",
      "eye3.png",
      "flex1.png",
      "kl.png",
      "lokesh gari birthday.jpg",
      "v4.png",
      "vanga3.png",
      "vinayaka1.png",
      "cbd.png",
      "bbday2.png",
      "abbba saaam.JPG",	  	  
      "p1.png",
      "p2.jpg",
      "pic 4.png",
      "pic 9.png",
      "pic2.png",
      "pic3.png",
      "pic5.png",
      "pic6.png",
      "pic7.png",
      "pic8.png",
      "pic11.png",
      "pic12.png",
      "pic13.png",
      "pic14.png",
      "logo.png",
      "job.png",
      "post.png",
      "3.png",
      "10clip.png",
      "ab.jpg",
      "boss3.png",
      "chandrababu.png",
      "hanuman1.png",
      "p112.png",
      "sriram.png",
      "vb.png"	  
	  

	    
    ];
    createPopup("Posters", posters);
  });

  // Thumbnails
  document.querySelectorAll('a[href="more-photos.html"]')[1]?.addEventListener('click', (e) => {
    e.preventDefault();
    const thumbs = [
      "1000248564.jpg",
      "1000252212.png",
      "1000250551.png",
      "1000248579.jpg",
      "1000251341.png",
      "1000251909.png",
      "1000255147.png",
      "1000255277.png",
      "1000257353.png",
      "1000261885.png",
      "cli7.png",
      "1000256457.png",
      "cli1.png",
      "cli5.png",
      "cli8.png",
      "cli9.png",
	  "v1.jpg",
      "v2.jpg",
      "cli11.png"
	
	  
	  
    ];
    createPopup("Youtube Thumbnails", thumbs);
  });

  // Videos
  document.querySelector('a[href="more-videos.html"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    const vids = [
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/pr1.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/lv_0_20250326171541.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/lv_0_20250817232356.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/vd1.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/vd2.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/vd3.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/vd4.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/vd5.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/vd6.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/vd7.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/vd8.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/vd9.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/vd10.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/vd11.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/vd12.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/vd13.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/vd14.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/vd15.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/vd16.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/i1.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/i2.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/i3.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/i4.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/i5.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/i6.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/i7.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/i8.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/i9.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/i10.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/i11.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/i12.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/i13.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/i14.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/i15.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/i16.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/i17.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/i18.mp4",
      "C:/Users/jsaik/OneDrive/Desktop/new portfolio/i19.mp4"
	  

    ];
    createPopup("Videos", vids);
  });

});




