import {
  useLayoutEffect,
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react'
import { Trans, useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PlaceholderSvg } from './components/PlaceholderSvg'
import { LanguageSelect } from './components/LanguageSelect'
import { scrollToSectionById } from './lib/smoothScroll'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
      <circle cx="10" cy="10" r="9" fill="rgba(100,50,145,0.12)" />
      <path
        d="M6 10.2 8.4 12.6 14 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type IngredientBlock = {
  tag: string
  title: string
  optional: boolean
  items: string[]
}

const PRODUCT_BULLET_KEYS = [
  'bullet0',
  'bullet1',
  'bullet2',
  'bullet3',
] as const

export default function App() {
  const { t, i18n } = useTranslation()
  const rootRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const marqueeWrapRef = useRef<HTMLDivElement>(null)
  const marqueeTweenRef = useRef<gsap.core.Tween | null>(null)
  const footerRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null)
  const scrollProgressRef = useRef<HTMLDivElement>(null)
  const mobileDrawerRef = useRef<HTMLDivElement>(null)
  const [headerSolid, setHeaderSolid] = useState(false)
  const [navOpen, setNavOpen] = useState(false)

  const navItems = useMemo(
    () =>
      [
        { href: '#produto', label: t('nav.product') },
        { href: '#formula', label: t('nav.formula') },
        { href: '#beneficios', label: t('nav.benefits') },
        { href: '#experiencia', label: t('nav.experience') },
        { href: '#ciencia', label: t('nav.science') },
      ] as const,
    [t],
  )

  const ingredients = t('ingredients', {
    returnObjects: true,
  }) as IngredientBlock[]

  const formulaRows = t('formula.rows', { returnObjects: true }) as {
    name: string
    amount: string
  }[]

  const marqueeText = t('marquee')

  const duringItems = t('experience.duringItems', {
    returnObjects: true,
  }) as string[]
  const afterItems = t('experience.afterItems', {
    returnObjects: true,
  }) as string[]
  const frequentItems = t('experience.frequentItems', {
    returnObjects: true,
  }) as string[]
  const notItems = t('experience.notItems', { returnObjects: true }) as string[]
  const isItems = t('experience.isItems', { returnObjects: true }) as string[]

  useEffect(() => {
    const map: Record<string, string> = { pt: 'pt-BR', en: 'en', es: 'es' }
    const base = (i18n.language.split('-')[0] ?? 'pt') as keyof typeof map
    document.documentElement.lang = map[base] ?? 'pt-BR'
  }, [i18n.language])

  const goToSection = useCallback((hash: string, closeMenu = true) => {
    const id = hash.replace(/^#/, '')
    const h = headerRef.current?.offsetHeight ?? 84
    scrollTweenRef.current = scrollToSectionById(
      id,
      h,
      scrollTweenRef.current,
    )
    if (closeMenu) setNavOpen(false)
  }, [])

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [navOpen])

  useEffect(() => {
    if (!navOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navOpen])

  useLayoutEffect(() => {
    if (!navOpen || !mobileDrawerRef.current) return
    const links = mobileDrawerRef.current.querySelectorAll('.nav-drawer-link')
    gsap.fromTo(
      links,
      { opacity: 0, x: 36 },
      {
        opacity: 1,
        x: 0,
        duration: 0.44,
        stagger: 0.055,
        ease: 'power3.out',
        delay: 0.06,
      },
    )
  }, [navOpen])

  useEffect(() => {
    const el = scrollProgressRef.current
    if (!el) return
    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      el.style.transform = `scaleX(${p})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onScroll = () => setHeaderSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-kicker', { opacity: 0, y: 22, duration: 0.55 }, 0)
        .from(
          '.hero-title-line',
          { opacity: 0, y: 48, duration: 0.72, stagger: 0.07 },
          0.08,
        )
        .from('.hero-lead', { opacity: 0, y: 28, duration: 0.65 }, 0.2)
        .from('.hero-cta', { opacity: 0, y: 20, duration: 0.55 }, 0.32)
        .from(
          '.hero-card-float',
          { opacity: 0, scale: 0.92, y: 36, duration: 0.85 },
          0.15,
        )

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('.reveal-scale').forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })
      })

      const hero = root.querySelector('.hero')
      if (hero) {
        gsap.to('.parallax-slow', {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.1,
          },
        })
        gsap.to('.parallax-fast', {
          yPercent: -28,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.65,
          },
        })
        gsap.to('.hero-card-parallax', {
          y: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.9,
          },
        })
      }
    }, root)

    window.scrollTo(0, 0)
    requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })

    return () => {
      ctx.revert()
    }
  }, [])

  useLayoutEffect(() => {
    const track = marqueeRef.current
    if (!track) return

    const measureShift = (segs: NodeListOf<HTMLElement>) => {
      if (segs.length < 2) return 0
      const a = segs[0].getBoundingClientRect()
      const b = segs[1].getBoundingClientRect()
      let delta = b.left - a.left
      if (delta <= 0) {
        const gap = parseFloat(window.getComputedStyle(track).gap) || 0
        delta = segs[0].offsetWidth + gap
      }
      return delta
    }

    const run = () => {
      marqueeTweenRef.current?.kill()
      marqueeTweenRef.current = null
      gsap.set(track, { clearProps: 'transform' })
      gsap.set(track, { x: 0 })

      const segs = track.querySelectorAll<HTMLElement>('.marquee-seg')
      const shift = measureShift(segs)
      if (shift <= 0) return

      const pxPerSec = 40
      const duration = Math.max(20, shift / pxPerSec)

      marqueeTweenRef.current = gsap.fromTo(
        track,
        { x: 0 },
        {
          x: -shift,
          duration,
          ease: 'none',
          repeat: -1,
          immediateRender: true,
          force3D: true,
        },
      )
    }

    const runSoon = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(run)
      })
    }

    runSoon()

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      void document.fonts.ready.then(() => runSoon())
    }

    let roTimer: number | undefined
    const ro = new ResizeObserver(() => {
      window.clearTimeout(roTimer)
      roTimer = window.setTimeout(runSoon, 50)
    })
    ro.observe(track)

    return () => {
      window.clearTimeout(roTimer)
      ro.disconnect()
      marqueeTweenRef.current?.kill()
      marqueeTweenRef.current = null
    }
  }, [marqueeText])

  useEffect(() => {
    const wrap = marqueeWrapRef.current
    const footer = footerRef.current
    if (!wrap || !footer) return

    const update = () => {
      const rect = footer.getBoundingClientRect()
      const ih = window.innerHeight
      if (rect.top >= ih) {
        wrap.style.bottom = '0px'
        return
      }
      wrap.style.bottom = `${Math.max(0, ih - rect.top)}px`
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const ro = new ResizeObserver(update)
    ro.observe(footer)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      ro.disconnect()
    }
  }, [])

  return (
    <div className="landing" ref={rootRef}>
      <div className="scroll-progress" aria-hidden>
        <div className="scroll-progress__bar" ref={scrollProgressRef} />
      </div>

      <header
        ref={headerRef}
        className={`site-header ${headerSolid ? 'is-scrolled' : ''}`}
      >
        <div className="landing-inner header-bar">
          <a
            href="#inicio"
            className="header-logo"
            onClick={(e) => {
              e.preventDefault()
              goToSection('#inicio')
            }}
          >
            <PlaceholderSvg variant="logo" width={176} height={48} />
          </a>
          <nav className="nav-links" aria-label={t('a11y.mainNav')}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="nav-link-animated"
                onClick={(e) => {
                  e.preventDefault()
                  goToSection(item.href)
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <LanguageSelect />
            <button
              type="button"
              className={`menu-toggle ${navOpen ? 'is-open' : ''}`}
              aria-expanded={navOpen}
              aria-controls="menu-mobile"
              aria-label={navOpen ? t('a11y.closeMenu') : t('a11y.openMenu')}
              onClick={() => setNavOpen((o) => !o)}
            >
              <span className="menu-toggle__bar" />
              <span className="menu-toggle__bar" />
              <span className="menu-toggle__bar" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`nav-overlay ${navOpen ? 'is-visible' : ''}`}
        aria-hidden
        onClick={() => setNavOpen(false)}
      />

      <div
        id="menu-mobile"
        ref={mobileDrawerRef}
        className={`nav-drawer ${navOpen ? 'is-open' : ''}`}
        aria-hidden={!navOpen}
      >
        <div className="nav-drawer__head">
          <span className="nav-drawer__title">{t('drawer.title')}</span>
          <button
            type="button"
            className="nav-drawer__close"
            aria-label={t('a11y.close')}
            onClick={() => setNavOpen(false)}
          >
            ×
          </button>
        </div>
        <nav className="nav-drawer__links" aria-label={t('a11y.mobileNav')}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-drawer-link"
              onClick={(e) => {
                e.preventDefault()
                goToSection(item.href)
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-bg" aria-hidden>
            <div className="hero-mesh" />
            <div className="hero-orb hero-orb--1 parallax-slow" />
            <div className="hero-orb hero-orb--2 parallax-fast" />
            <div className="hero-orb hero-orb--3 parallax-fast" />
            <div className="hero-shine parallax-slow" />
          </div>

          <div className="landing-inner hero-grid">
            <div>
              <p className="hero-kicker">{t('hero.kicker')}</p>
              <h1>
                <span className="hero-title-line">{t('hero.titleBrand')}</span>
                <br />
                <span className="hero-title-line">{t('hero.titleLine2')}</span>
              </h1>
              <p className="hero-lead">{t('hero.lead')}</p>
              <div className="hero-cta">
                <a
                  className="btn btn--primary btn--magnetic"
                  href="#produto"
                  onClick={(e) => {
                    e.preventDefault()
                    goToSection('#produto')
                  }}
                >
                  {t('hero.ctaPrimary')}
                </a>
                <a
                  className="btn btn--ghost btn--magnetic"
                  href="#beneficios"
                  onClick={(e) => {
                    e.preventDefault()
                    goToSection('#beneficios')
                  }}
                >
                  {t('hero.ctaGhost')}
                </a>
              </div>
            </div>

            <div className="hero-visual hero-card-float">
              <div className="hero-card hero-card-parallax">
                <PlaceholderSvg width={400} height={260} />
                <div className="hero-stat">
                  <span>{t('hero.stat1')}</span>
                  <span>{t('hero.stat2')}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--muted" id="produto">
          <div className="landing-inner">
            <div className="section-head reveal">
              <p className="section-eyebrow">{t('product.eyebrow')}</p>
              <h2>{t('product.title')}</h2>
              <p>{t('product.intro')}</p>
            </div>

            <div className="product-grid">
              <div className="product-visual reveal-scale">
                <PlaceholderSvg width={520} height={360} />
              </div>
              <div className="reveal">
                <ul className="product-list">
                  {PRODUCT_BULLET_KEYS.map((key) => (
                    <li key={key}>
                      <CheckIcon />
                      <span>
                        <Trans
                          i18nKey={`product.${key}`}
                          components={{ strong: <strong /> }}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="formula">
          <div className="landing-inner">
            <div className="section-head reveal">
              <p className="section-eyebrow">{t('formula.eyebrow')}</p>
              <h2>{t('formula.title')}</h2>
              <p>{t('formula.intro')}</p>
            </div>

            <div className="formula-card reveal">
              <table className="formula-table">
                <thead>
                  <tr>
                    <th>{t('formula.colIngredient')}</th>
                    <th>{t('formula.colAmount')}</th>
                  </tr>
                </thead>
                <tbody>
                  {formulaRows.map((row) => (
                    <tr key={row.name}>
                      <td>{row.name}</td>
                      <td>{row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="formula-note">{t('formula.note')}</p>
            </div>
          </div>
        </section>

        <section className="section section--muted" id="beneficios">
          <div className="landing-inner">
            <div className="section-head center reveal">
              <p className="section-eyebrow">{t('benefits.eyebrow')}</p>
              <h2>{t('benefits.title')}</h2>
              <p>
                <Trans
                  i18nKey="benefits.intro"
                  components={{ strong: <strong /> }}
                />
              </p>
            </div>

            <div className="ingredients-grid">
              {ingredients.map((ing) => (
                <article
                  key={ing.title}
                  className={`ingredient-card reveal ${ing.optional ? 'optional' : ''}`}
                >
                  {ing.optional ? (
                    <span className="ingredient-tag">
                      {t('optionalTag', { tag: ing.tag })}
                    </span>
                  ) : (
                    <span className="ingredient-tag">{ing.tag}</span>
                  )}
                  <h3>{ing.title}</h3>
                  <ul>
                    {ing.items.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="experiencia">
          <div className="landing-inner">
            <div className="section-head reveal">
              <p className="section-eyebrow">{t('experience.eyebrow')}</p>
              <h2>{t('experience.title')}</h2>
              <p>{t('experience.intro')}</p>
            </div>

            <div className="experience-cols">
              <div className="exp-card reveal">
                <h3>{t('experience.duringTitle')}</h3>
                <ul>
                  {duringItems.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
              <div className="exp-card reveal">
                <h3>{t('experience.afterTitle')}</h3>
                <ul>
                  {afterItems.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
              <div className="exp-card reveal">
                <h3>{t('experience.frequentTitle')}</h3>
                <ul>
                  {frequentItems.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="positioning reveal" style={{ marginTop: '2.5rem' }}>
              <div className="positioning-block">
                <h3>{t('experience.notTitle')}</h3>
                <ul>
                  {notItems.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
              <div className="positioning-block">
                <h3>{t('experience.isTitle')}</h3>
                <ul>
                  {isItems.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--muted" id="ciencia">
          <div className="landing-inner">
            <div className="section-head reveal">
              <p className="section-eyebrow">{t('science.eyebrow')}</p>
              <h2>{t('science.title')}</h2>
            </div>
            <div className="science-body reveal">
              <p>{t('science.p1')}</p>
              <p>{t('science.p2')}</p>
              <p>{t('science.p3')}</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="landing-inner">
            <div className="cta-band reveal">
              <h2>{t('cta.title')}</h2>
              <p>{t('cta.body')}</p>
              <a className="btn btn--primary" href="mailto:contato@runixsalt.com.br">
                {t('cta.button')}
              </a>
            </div>
          </div>
        </section>
      </main>

      <div
        className="marquee-wrap marquee-wrap--fixed"
        ref={marqueeWrapRef}
        aria-hidden
      >
        <div className="marquee-viewport">
          <div className="marquee marquee--fixed-inner" ref={marqueeRef}>
            <span className="marquee-seg">{marqueeText}</span>
            <span className="marquee-seg">{marqueeText}</span>
            <span className="marquee-seg">{marqueeText}</span>
          </div>
        </div>
      </div>

      <footer className="site-footer" ref={footerRef}>
        <div className="landing-inner footer-grid">
          <div className="footer-brand">
            <PlaceholderSvg variant="logo" width={160} height={44} />
            <p style={{ marginTop: '0.75rem', maxWidth: '320px' }}>
              {t('footer.tagline')}
            </p>
          </div>
          <div className="footer-meta">
            <p className="footer-disclaimer">
              <Trans
                i18nKey="footer.disclaimer"
                components={{ strong: <strong /> }}
              />
            </p>
            <p style={{ marginTop: '1rem', opacity: 0.75 }}>
              {t('footer.rights', { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
