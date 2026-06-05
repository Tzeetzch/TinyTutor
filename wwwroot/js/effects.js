// Canvas particle engine for the Star Shop reward shows.
// Real physics (velocity, gravity, drag, life) drawn as glowing light — not emoji.
(function () {
    let canvas, ctx, raf = 0, running = false;
    let particles = [], emitters = [];
    let w = 0, h = 0, dpr = 1;
    let startTs = 0, prevTs = 0, endAt = 0, trailFade = 0;

    function ensure() {
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'fx-canvas';
            canvas.style.cssText =
                'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:10000';
            document.body.appendChild(canvas);
            window.addEventListener('resize', resize);
        }
        ctx = canvas.getContext('2d');
        resize();
    }

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const rnd = (a, b) => a + Math.random() * (b - a);
    const pick = arr => arr[(Math.random() * arr.length) | 0];
    const rgba = (c, a) => 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';

    function hsl(hue, s, l) {
        hue /= 360;
        if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        const f = t => {
            if (t < 0) t += 1; if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        return [Math.round(f(hue + 1 / 3) * 255), Math.round(f(hue) * 255), Math.round(f(hue - 1 / 3) * 255)];
    }

    const P = o => particles.push(o);

    function explode(x, y, color, count, power) {
        for (let i = 0; i < count; i++) {
            const a = Math.random() * Math.PI * 2;
            const sp = rnd(power * 0.25, power) * Math.sqrt(Math.random());
            P({
                kind: 'spark', x, y, px: x, py: y,
                vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                g: 200, drag: 0.9, life: rnd(0.9, 1.9), maxLife: 1.9,
                size: rnd(1.6, 3), color, twinkle: Math.random() < 0.45
            });
        }
    }

    const PARTY = [[255, 80, 80], [255, 210, 74], [80, 210, 255], [155, 92, 255], [92, 255, 143], [255, 122, 208], [255, 255, 255]];

    const EFFECTS = {
        fireworks() {
            endAt = 5200; trailFade = 0.2;
            let last = -999;
            emitters.push((el) => {
                if (el < 3700 && el - last > rnd(330, 620)) {
                    last = el;
                    const tx = rnd(w * 0.15, w * 0.85), ty = rnd(h * 0.12, h * 0.42);
                    const col = pick(PARTY), life = 0.9, g = 600;
                    const vy = -((h - ty) / life + 0.5 * g * life);
                    P({
                        kind: 'spark', x: tx, y: h + 8, px: tx, py: h + 8,
                        vx: rnd(-15, 15), vy, g, drag: 1, life, maxLife: life,
                        size: 2.6, color: [255, 250, 210],
                        onDeath() { explode(this.x, this.y, col, 130, rnd(240, 360)); }
                    });
                }
                return el > 3800;
            });
        },

        confetti() {
            endAt = 4800; trailFade = 0;
            emitters.push((el) => {
                if (el < 2600) {
                    for (let i = 0; i < 7; i++) {
                        const x = rnd(0, w);
                        P({
                            kind: 'confetti', x, y: -20, px: x, py: -20,
                            vx: rnd(-40, 40), vy: rnd(90, 190), g: 130, drag: 1,
                            life: rnd(3, 4.4), maxLife: 4.4,
                            cw: rnd(7, 12), ch: rnd(10, 16), rot: rnd(0, 6.28), vrot: rnd(-7, 7),
                            color: pick(PARTY),
                            update(p, d, e) { p.vx += Math.sin(e / 250 + p.y / 45) * 34 * d; p.rot += p.vrot * d; }
                        });
                    }
                }
                return el > 2600;
            });
        },

        meteor() {
            endAt = 4600; trailFade = 0.18;
            const tint = [[180, 220, 255], [255, 255, 255], [200, 200, 255], [255, 230, 180]];
            let last = -999;
            emitters.push((el) => {
                if (el < 3400 && el - last > rnd(150, 340)) {
                    last = el;
                    const sx = rnd(-0.1 * w, 0.7 * w), sy = rnd(-0.12 * h, 0.12 * h);
                    const ang = rnd(0.55, 0.85), sp = rnd(750, 1150);
                    P({
                        kind: 'streak', x: sx, y: sy, px: sx, py: sy,
                        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
                        g: 0, drag: 1, life: rnd(0.9, 1.4), maxLife: 1.4, size: rnd(2.2, 3.6), color: pick(tint)
                    });
                }
                if (Math.random() < 0.6) {
                    const x = rnd(0, w), y = rnd(0, h * 0.7);
                    P({ kind: 'spark', x, y, px: x, py: y, vx: 0, vy: 0, g: 0, life: rnd(0.4, 0.9), maxLife: 0.9, size: rnd(1, 2), color: [255, 255, 255], twinkle: true });
                }
                return el > 3500;
            });
        },

        fire() {
            endAt = 4200; trailFade = 0.16;
            const cx = w / 2;
            emitters.push((el) => {
                if (el < 3200) {
                    for (let i = 0; i < 12; i++) {
                        const ang = el / 110 + rnd(0, 6.28);
                        const grow = 0.4 + Math.min(1, el / 1500);
                        const rad = rnd(8, 70) * grow;
                        const x = cx + Math.cos(ang) * rad, y = h * 0.86;
                        P({
                            kind: 'spark', x, y, px: x, py: y,
                            vx: Math.cos(ang + 1.5) * rnd(30, 80), vy: -rnd(200, 360),
                            g: -40, drag: 0.96, life: rnd(0.7, 1.4), maxLife: 1.4, size: rnd(3, 6),
                            color: hsl(rnd(0, 42), 1, 0.55)
                        });
                    }
                }
                return el > 3200;
            });
        },

        rainbow() {
            endAt = 4400; trailFade = 0.15;
            const cx = w / 2;
            emitters.push((el) => {
                if (el < 2800) {
                    for (let i = 0; i < 9; i++) {
                        const hue = (el / 10 + i * 40) % 360;
                        const ang = -Math.PI / 2 + rnd(-0.55, 0.55), sp = rnd(420, 680);
                        const x = cx + rnd(-25, 25), y = h * 0.92;
                        P({
                            kind: 'spark', x, y, px: x, py: y,
                            vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
                            g: 540, drag: 1, life: rnd(1.4, 2.3), maxLife: 2.3, size: rnd(2.6, 4.2),
                            color: hsl(hue, 0.95, 0.58)
                        });
                    }
                }
                return el > 2800;
            });
        },

        galaxy() {
            endAt = 5000; trailFade = 0.12;
            const cx = w / 2, cy = h * 0.5;
            let n = 0;
            emitters.push((el) => {
                if (el < 3000) {
                    for (let i = 0; i < 16; i++) {
                        n++;
                        const arm = n % 3;
                        const r = rnd(10, Math.min(w, h) * 0.42);
                        const ang = el / 650 + arm * (6.283 / 3) + r * 0.012;
                        const x = cx + Math.cos(ang) * r, y = cy + Math.sin(ang) * r;
                        P({
                            kind: 'spark', x, y, px: x, py: y,
                            vx: Math.cos(ang + 1.57) * rnd(10, 45), vy: Math.sin(ang + 1.57) * rnd(10, 45),
                            g: 0, drag: 1, life: rnd(1.2, 2.4), maxLife: 2.4, size: rnd(1.5, 3),
                            color: hsl((r * 1.2 + el / 20) % 360, 0.8, 0.62), twinkle: Math.random() < 0.4
                        });
                    }
                }
                return el > 3000;
            });
        }
    };

    function render(p) {
        const a = Math.max(0, Math.min(1, p.life / p.maxLife));
        if (p.kind === 'confetti') {
            ctx.globalCompositeOperation = 'source-over';
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = rgba(p.color, a);
            ctx.fillRect(-p.cw / 2, -p.ch / 2, p.cw, p.ch);
            ctx.restore();
            return;
        }
        ctx.globalCompositeOperation = 'lighter';
        if (p.kind === 'streak') {
            const tx = p.x - p.vx * 0.05, ty = p.y - p.vy * 0.05;
            const grad = ctx.createLinearGradient(tx, ty, p.x, p.y);
            grad.addColorStop(0, rgba(p.color, 0));
            grad.addColorStop(1, rgba(p.color, a));
            ctx.strokeStyle = grad;
            ctx.lineWidth = p.size; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(p.x, p.y); ctx.stroke();
            ctx.fillStyle = rgba([255, 255, 255], a);
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.8, 0, 6.283); ctx.fill();
            return;
        }
        // spark
        let al = a;
        if (p.twinkle) al = a * (0.35 + 0.65 * Math.abs(Math.sin(p.life * 28)));
        ctx.strokeStyle = rgba(p.color, al);
        ctx.lineWidth = p.size; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
        ctx.fillStyle = rgba([255, 255, 255], al * 0.6);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.55, 0, 6.283); ctx.fill();
    }

    function step(ts) {
        let dt = (ts - prevTs) / 1000; prevTs = ts;
        if (dt > 0.05) dt = 0.05;
        const el = ts - startTs;

        if (trailFade > 0) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = 'rgba(6,2,10,' + trailFade + ')';
            ctx.fillRect(0, 0, w, h);
        } else {
            ctx.clearRect(0, 0, w, h);
        }

        for (let i = emitters.length - 1; i >= 0; i--) {
            if (emitters[i](el, dt)) emitters.splice(i, 1);
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.px = p.x; p.py = p.y;
            if (p.g) p.vy += p.g * dt;
            if (p.drag && p.drag !== 1) {
                const f = Math.pow(p.drag, dt * 60);
                p.vx *= f; p.vy *= f;
            }
            p.x += p.vx * dt; p.y += p.vy * dt;
            if (p.update) p.update(p, dt, el);
            p.life -= dt;
            if (p.life <= 0) {
                if (p.onDeath) p.onDeath.call(p);
                particles.splice(i, 1);
                continue;
            }
            render(p);
        }

        if (el < endAt || particles.length) {
            raf = requestAnimationFrame(step);
        } else {
            running = false;
            ctx.clearRect(0, 0, w, h);
        }
    }

    window.ttEffects = {
        play(name) {
            ensure();
            const fn = EFFECTS[name];
            if (!fn) return;
            particles = []; emitters = []; endAt = 0; trailFade = 0;
            fn();
            startTs = performance.now();
            prevTs = startTs;
            if (!running) { running = true; raf = requestAnimationFrame(step); }
        }
    };
})();
