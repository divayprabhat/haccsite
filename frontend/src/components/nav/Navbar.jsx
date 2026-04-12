import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const _INJECTED_CSS = `:root {
    --linear-ease: linear(0,
            0.068,
            0.19 2.7%,
            0.804 8.1%,
            1.037,
            1.199 13.2%,
            1.245,
            1.27 15.8%,
            1.274,
            1.272 17.4%,
            1.249 19.1%,
            0.996 28%,
            0.949,
            0.928 33.3%,
            0.926,
            0.933 36.8%,
            1.001 45.6%,
            1.013,
            1.019 50.8%,
            1.018 54.4%,
            1 63.1%,
            0.995 68%,
            1.001 85%,
            1);
}

.gooey-nav-container {
    position: relative;
}

.gooey-nav-container nav {
    display: flex;
    position: relative;
    transform: translate3d(0, 0, 0.01px);
    z-index: 2;
}

.gooey-nav-container nav ul {
    display: flex;
    gap: 0.25rem;
    list-style: none;
    padding: 0;
    margin: 0;
    position: relative;
    z-index: 3;
    color: var(--ink-muted, #64748b);
}

.gooey-nav-container nav ul li {
    border-radius: 0.75rem; 
    position: relative;
    cursor: pointer;
    transition:
        background-color 0.3s ease,
        color 0.3s ease,
        box-shadow 0.3s ease;
    box-shadow: 0 0 0.5px 1.5px transparent;
    color: var(--ink-muted, #64748b);
}

.gooey-nav-container nav ul li a, .gooey-nav-container nav ul li button {
    display: inline-block;
    padding: 0.375rem 0.5rem;
    text-decoration: none;
    color: inherit;
    background: transparent;
    border: none;
    font-family: inherit;
    font-size: inherit;
    font-weight: 500;
}

@media (min-width: 640px) {
    .gooey-nav-container nav ul li a, .gooey-nav-container nav ul li button {
        padding: 0.375rem 1rem;
    }
}

.gooey-nav-container nav ul li:focus-within:has(:focus-visible) {
    box-shadow: 0 0 0 2px var(--ink-primary, #0f172a);
    outline: none;
}

.gooey-nav-container nav ul li::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 0.75rem; 
    background: linear-gradient(135deg, #0369a1 0%, #0f172a 100%);
    box-shadow: 0 4px 12px rgba(2, 132, 199, 0.4); 
    opacity: 0;
    transform: scale(0);
    transition: all 0.3s ease;
    z-index: -1;
}

.gooey-nav-container nav ul li.active {
    color: white;
}

.gooey-nav-container nav ul li.active::after {
    opacity: 1;
    transform: scale(1);
}

.gooey-nav-container .effect {
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 0;
    opacity: 1;
    pointer-events: none;
    display: grid;
    place-items: center;
    z-index: 1;
}

.gooey-nav-container .effect.text {
    color: transparent; 
    transition: color 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
}

.gooey-nav-container .effect.text.active {
    color: white;
}

.gooey-nav-container .effect.filter {
}

.gooey-nav-container .effect.filter::before {
    display: none;
}

.gooey-nav-container .effect.filter::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #0369a1 0%, #0f172a 100%); 
    transform: scale(0);
    opacity: 0;
    z-index: 1; 
    border-radius: 0.75rem; 
    box-shadow: 0 4px 12px rgba(2, 132, 199, 0.4);
}

.gooey-nav-container .effect.active::after {
    animation: pill 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes pill {
    to {
        transform: scale(1);
        opacity: 0; 
    }
}

.particle,
.point {
    display: block;
    opacity: 0;
    width: 20px;
    height: 20px;
    border-radius: 100%;
    transform-origin: center;
}

.particle {
    --time: 5s;
    position: absolute;
    top: calc(50% - 8px);
    left: calc(50% - 8px);
    animation: particle calc(var(--time)) ease 1 -350ms;
}

.point {
    background: var(--color);
    opacity: 1;
    animation: point calc(var(--time)) ease 1 -350ms;
}

@keyframes particle {
    0% {
        transform: rotate(0deg) translate(calc(var(--start-x)), calc(var(--start-y)));
        opacity: 1;
        animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
    }

    70% {
        transform: rotate(calc(var(--rotate) * 0.5)) translate(calc(var(--end-x) * 1.2), calc(var(--end-y) * 1.2));
        opacity: 1;
        animation-timing-function: ease;
    }

    85% {
        transform: rotate(calc(var(--rotate) * 0.66)) translate(calc(var(--end-x)), calc(var(--end-y)));
        opacity: 1;
    }

    100% {
        transform: rotate(calc(var(--rotate) * 1.2)) translate(calc(var(--end-x) * 0.5), calc(var(--end-y) * 0.5));
        opacity: 1;
    }
}

@keyframes point {
    0% {
        transform: scale(0);
        opacity: 0;
        animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
    }

    25% {
        transform: scale(calc(var(--scale) * 0.25));
    }

    38% {
        opacity: 1;
    }

    65% {
        transform: scale(var(--scale));
        opacity: 1;
        animation-timing-function: ease;
    }

    85% {
        transform: scale(var(--scale));
        opacity: 1;
    }

    100% {
        transform: scale(0);
        opacity: 0;
    }
}

:root {
  --color-1: #0ea5e9;
  --color-2: #38bdf8;
  --color-3: #818cf8;
  --color-4: #c084fc;
}
`;
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = _INJECTED_CSS;
  document.head.appendChild(style);
}

const GooeyNav = ({
    items,
    animationTime = 600,
    particleCount = 15,
    particleDistances = [90, 10],
    particleR = 100,
    timeVariance = 300,
    colors = [1, 2, 3, 1, 2, 3, 1, 4],
    initialActiveIndex = -1,
    activeIndex: externalActiveIndex,
    onItemClick
}) => {
    const containerRef = useRef(null);
    const navRef = useRef(null);
    const filterRef = useRef(null);
    const textRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

    const noise = (n = 1) => n / 2 - Math.random() * n;

    const getXY = (distance, pointIndex, totalPoints) => {
        const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
        return [distance * Math.cos(angle), distance * Math.sin(angle)];
    };

    const createParticle = (i, t, d, r) => {
        let rotate = noise(r / 10);
        return {
            start: getXY(d[0], particleCount - i, particleCount),
            end: getXY(d[1] + noise(7), particleCount - i, particleCount),
            time: t,
            scale: 1 + noise(0.2),
            color: colors[Math.floor(Math.random() * colors.length)],
            rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
        };
    };

    const makeParticles = element => {
        const d = particleDistances;
        const r = particleR;
        const bubbleTime = animationTime * 2 + timeVariance;
        element.style.setProperty('--time', `${bubbleTime}ms`);

        for (let i = 0; i < particleCount; i++) {
            const t = animationTime * 2 + noise(timeVariance * 2);
            const p = createParticle(i, t, d, r);
            element.classList.remove('active');

            setTimeout(() => {
                const particle = document.createElement('span');
                const point = document.createElement('span');
                particle.classList.add('particle');
                particle.style.setProperty('--start-x', `${p.start[0]}px`);
                particle.style.setProperty('--start-y', `${p.start[1]}px`);
                particle.style.setProperty('--end-x', `${p.end[0]}px`);
                particle.style.setProperty('--end-y', `${p.end[1]}px`);
                particle.style.setProperty('--time', `${p.time}ms`);
                particle.style.setProperty('--scale', `${p.scale}`);
                particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
                particle.style.setProperty('--rotate', `${p.rotate}deg`);

                point.classList.add('point');
                particle.appendChild(point);
                element.appendChild(particle);
                requestAnimationFrame(() => {
                    element.classList.add('active');
                });
                setTimeout(() => {
                    try {
                        element.removeChild(particle);
                    } catch {
                        // Do nothing
                    }
                }, t);
            }, 30);
        }
    };

    const updateEffectPosition = element => {
        if (!containerRef.current || !filterRef.current || !textRef.current || !element) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const pos = element.getBoundingClientRect();

        const styles = {
            left: `${pos.x - containerRect.x}px`,
            top: `${pos.y - containerRect.y}px`,
            width: `${pos.width}px`,
            height: `${pos.height}px`
        };
        Object.assign(filterRef.current.style, styles);
        Object.assign(textRef.current.style, styles);
        textRef.current.innerText = element.innerText;
    };

    const triggerUpdate = (index, triggerAnimation = true) => {
        if (!navRef.current) return;
        
        setActiveIndex(index);

        const liEl = navRef.current.querySelectorAll('li[data-nav-item]')[index] || navRef.current.children[index];
        if (!liEl || index < 0) {
            if (filterRef.current) filterRef.current.style.opacity = '0';
            if (textRef.current) textRef.current.style.opacity = '0';
            return;
        }
        
        updateEffectPosition(liEl);
        if (filterRef.current) filterRef.current.style.opacity = '1';
        if (textRef.current) textRef.current.style.opacity = '1';

        if (triggerAnimation && filterRef.current && textRef.current) {
            const particles = filterRef.current.querySelectorAll('.particle');
            particles.forEach(p => filterRef.current.removeChild(p));
            textRef.current.classList.remove('active');
            void textRef.current.offsetWidth;
            textRef.current.classList.add('active');
            makeParticles(filterRef.current);
        } else if (!triggerAnimation && textRef.current) {
            textRef.current.classList.add('active');
        }
    };

    useEffect(() => {
        if (externalActiveIndex !== undefined && externalActiveIndex !== activeIndex) {
            // Check if navRef is ready before triggering
            if (navRef.current) {
                triggerUpdate(externalActiveIndex, false); 
            } else {
               // Schedule it for after next paint if not ready
               requestAnimationFrame(() => {
                   triggerUpdate(externalActiveIndex, false); 
               });
            }
        }
    }, [externalActiveIndex, activeIndex]);

    const handleClick = (e, index) => {
        if (onItemClick) onItemClick(e, index, items[index]);
        if (activeIndex === index) return;
        triggerUpdate(index, true);
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const liEl = e.currentTarget.parentElement;
            if (liEl) {
                handleClick({ currentTarget: liEl }, index);
            }
        }
    };

    useEffect(() => {
        if (!navRef.current || !containerRef.current) return;
        if (activeIndex >= 0) {
            const activeLi = navRef.current.children[activeIndex];
            if (activeLi) {
                updateEffectPosition(activeLi);
                textRef.current?.classList.add('active');
            }
        } else {
             if (filterRef.current) filterRef.current.style.opacity = '0';
             if (textRef.current) textRef.current.style.opacity = '0';
        }

        const resizeObserver = new ResizeObserver(() => {
            if (activeIndex >= 0) {
                const currentActiveLi = navRef.current?.children[activeIndex];
                if (currentActiveLi) {
                    updateEffectPosition(currentActiveLi);
                }
            }
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, [activeIndex]);

    return (
        <div className="gooey-nav-container text-xs sm:text-sm" ref={containerRef}>
            <nav>
                <ul ref={navRef}>
                    {items.map((item, index) => {
                        if (item.type === 'divider') {
                            return (
                                <li key={index} style={{display: 'flex', alignItems: 'center', padding: '0 0.5rem', pointerEvents: 'none'}}>
                                    <div className="h-4 w-px bg-border-strong" />
                                </li>
                            );
                        }
                        return (
                            <li key={index} data-nav-item className={activeIndex === index ? 'active' : ''}>
                                {item.href ? (
                                    <Link to={item.href} onClick={e => handleClick(e, index)} onKeyDown={e => handleKeyDown(e, index)}>
                                        {item.label}
                                    </Link>
                                ) : (
                                    <button type="button" onClick={e => handleClick(e, index)} onKeyDown={e => handleKeyDown(e, index)}>
                                        {item.label}
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <span className="effect filter" ref={filterRef} />
            <span className="effect text" ref={textRef} />
        </div>
    );
};



const NAV_LINKS = [
  { path: '/chat', label: 'Chat' },
  { path: '/models', label: 'Models' },
  { path: '/train', label: 'Train' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 sm:pt-7 px-2 sm:px-4"
    >
      <div
        className={`glass-strong relative overflow-hidden flex items-center gap-1 px-2 sm:px-3 py-2 sm:py-2.5 rounded-2xl transition-all duration-500 max-w-[95vw] sm:max-w-none ${
          scrolled ? 'shadow-[0_10px_32px_rgba(15,23,42,0.18)]' : 'shadow-[0_4px_18px_rgba(15,23,42,0.08)]'
        }`}
      >
        <motion.div
          aria-hidden
          className="absolute -left-8 -top-8 w-16 h-16 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(14,165,233,0.35) 0%, rgba(14,165,233,0) 70%)',
            filter: 'blur(12px)',
          }}
          animate={{ x: [0, 14, 0], y: [0, 8, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="absolute -right-8 -bottom-8 w-20 h-20 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(99,102,241,0) 70%)',
            filter: 'blur(14px)',
          }}
          animate={{ x: [0, -16, 0], y: [0, -10, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

          <Link
            to="/"
            className="relative z-10 flex items-center gap-2 px-2 sm:px-3 py-1.5 mr-1 sm:mr-2"
          >
            <div className="w-5 h-5 rounded-md bg-signal flex items-center justify-center">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M5.5 1L9 5.5L5.5 10L2 5.5L5.5 1Z" fill="#082f49" stroke="none" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight text-ink-primary">Vela</span>
          </Link>

          <div className="relative z-10 h-4 w-px bg-border-strong mx-1" />

        <div className="relative z-10 flex items-center">
          <GooeyNav 
             items={[
               ...NAV_LINKS.map(link => ({ href: link.path, label: link.label })),
               { type: 'divider' },
               { href: '/auth', label: 'Sign in' }
             ]}
             activeIndex={
               location.pathname === '/auth' 
                 ? NAV_LINKS.length + 1 
                 : NAV_LINKS.findIndex(l => l.path === location.pathname)
             }
          />
        </div>
      </div>
    </motion.nav>
  )
}