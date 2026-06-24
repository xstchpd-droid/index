import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronRight,
  Copy,
  Layers3,
  Mail,
  Palette,
  Phone,
  ScanLine,
  WandSparkles,
} from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const asset = (path) => `${import.meta.env.BASE_URL}${path}`

const navItems = [
  { id: 'projects', label: 'Projects', zh: '项目' },
  { id: 'experience', label: 'Experience', zh: '经历' },
  { id: 'skills', label: 'Skills', zh: '能力' },
  { id: 'contact', label: 'Contact', zh: '联系' },
]

const projects = [
  {
    title: '空气净化器视觉系统',
    label: 'Air Care Visual System',
    category: '家居净化',
    year: '2024',
    accent: '#8bd3dd',
    summary: '围绕纯净、静音、安心建立页面秩序，用场景主图、卖点分镜和对比信息强化购买判断。',
    role: '主图策略 / 场景构图 / 卖点转译',
    tags: ['跨境电商', '详情页', '视觉叙事'],
  },
  {
    title: '便携咖啡机内容页面',
    label: 'Portable Coffee Story',
    category: '户外咖啡',
    year: '2024',
    accent: '#ffbd7a',
    summary: '把小体积、专业出品和便携场景放在同一叙事里，让功能信息更快被理解和记住。',
    role: '功能分层 / 场景叙事 / 信任信息',
    tags: ['产品页面', '场景表达', '转化信息'],
  },
  {
    title: '宠物饮水机商业视觉',
    label: 'Pet Wellness Detail Page',
    category: '宠物健康',
    year: '2025',
    accent: '#9ee6b4',
    summary: '以健康饮水为主线，可视化过滤、循环和静音体验，形成清晰的详情页信息节奏。',
    role: '结构可视化 / 柔和光影 / 页面排版',
    tags: ['宠物用品', '信息层级', '精修质感'],
  },
  {
    title: '轻量自行车主图系统',
    label: 'Lightweight Bike Campaign',
    category: '运动出行',
    year: '2025',
    accent: '#b9c7ff',
    summary: '提炼轻量化、骑行人群和使用场景，建立更直接的产品识别和跨境电商视觉表达。',
    role: '产品精修 / 人群定位 / 动势画面',
    tags: ['主图系统', '运动品类', '速度感'],
  },
  {
    title: '服装店铺活动视觉',
    label: 'Fashion Store Campaign',
    category: '女装零售',
    year: '2026',
    accent: '#ff9db5',
    summary: '把中式气质转化为现代店铺语言，完成首页、活动页、主图和详情页的统一设计。',
    role: '店铺首页 / 活动海报 / 风格统一',
    tags: ['淘宝店铺', '活动视觉', '品牌氛围'],
  },
  {
    title: '美妆品牌页面表达',
    label: 'Beauty Brand Page',
    category: '甜美妆容',
    year: '2026',
    accent: '#f6d56f',
    summary: '围绕甜美调性搭建首屏、横幅和产品信息排版，让优惠信息与品牌情绪同时成立。',
    role: '色彩系统 / 横幅设计 / 信息整合',
    tags: ['美妆视觉', '品牌页面', '促销转化'],
  },
]

const experience = [
  {
    date: '2026.01 - 2026.04',
    company: '深圳兔展智能科技有限公司',
    title: 'AI设计师',
    description: '负责跨境电商产品视觉内容，包含主图、副图、详情页设计、产品图片精修与页面信息整理。',
  },
  {
    date: '2024.10 - 2025.12',
    company: '长沙黎萤科技有限公司',
    title: '电商视觉设计师',
    description: '覆盖淘宝与跨境电商平台的主图、直通车图、详情页、店铺活动海报和商业页面创意输出。',
  },
]

const skills = [
  {
    icon: Layers3,
    title: '电商视觉系统',
    label: 'Commerce Systems',
    detail: '把主图、副图、详情页和活动页组织成统一的转化链路，让用户能快速识别重点。',
    tags: ['主图策略', '详情页', '平台规范'],
  },
  {
    icon: ScanLine,
    title: '产品精修质感',
    label: 'Product Retouching',
    detail: '结合产品修图、材质表达与光影控制，强化页面的可信度和商业完成度。',
    tags: ['产品精修', '材质', '光影'],
  },
  {
    icon: Palette,
    title: '品牌页面表达',
    label: 'Brand Pages',
    detail: '根据品类、价格带和目标客群建立差异化风格，让情绪和信息层级同时成立。',
    tags: ['色彩', '版式', '调性'],
  },
  {
    icon: WandSparkles,
    title: '智能设计流程',
    label: 'AI Workflow',
    detail: '使用大模型与图像生成工具辅助调研、构图、风格探索和快速迭代，提高方案推进效率。',
    tags: ['AI 辅助', '迭代', '创意探索'],
  },
]

function App() {
  const rootRef = useRef(null)
  const sectionRefs = useRef({})
  const [activeSection, setActiveSection] = useState('top')
  const [activeProject, setActiveProject] = useState(0)
  const [activeSkill, setActiveSkill] = useState(0)
  const [copied, setCopied] = useState(false)
  const selectedProject = projects[activeProject]
  const selectedSkill = skills[activeSkill]

  const currentYear = useMemo(() => new Date().getFullYear(), [])

  const scrollTo = useCallback((id) => {
    const target = id === 'top' ? sectionRefs.current.top : sectionRefs.current[id]
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const setSectionRef = useCallback((id) => (node) => {
    if (node) sectionRefs.current[id] = node
  }, [])

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText('15575313247@163.com')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = 'mailto:15575313247@163.com'
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    let frameId = 0

    const updateProgress = () => {
      frameId = 0
      const range = Math.max(root.scrollHeight - window.innerHeight, 1)
      root.style.setProperty('--scroll-progress', Math.min(window.scrollY / range, 1).toFixed(4))
    }

    const requestProgress = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateProgress)
    }

    requestProgress()
    window.addEventListener('scroll', requestProgress, { passive: true })
    window.addEventListener('resize', requestProgress)
    return () => {
      window.removeEventListener('scroll', requestProgress)
      window.removeEventListener('resize', requestProgress)
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [])

  useEffect(() => {
    const entries = ['top', ...navItems.map((item) => item.id)]
      .map((id) => sectionRefs.current[id])
      .filter(Boolean)

    const observer = new IntersectionObserver((items) => {
      const visible = items
        .filter((item) => item.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible?.target?.id) setActiveSection(visible.target.id)
    }, { rootMargin: '-28% 0px -52% 0px', threshold: [0.08, 0.2, 0.45, 0.7] })

    entries.forEach((entry) => observer.observe(entry))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const projectSection = sectionRefs.current.projects
    if (!projectSection) return undefined

    let timerId = 0
    let visible = false
    const syncTimer = () => {
      if (timerId) window.clearInterval(timerId)
      timerId = 0
      if (visible && !document.hidden) {
        timerId = window.setInterval(() => {
          setActiveProject((current) => (current + 1) % projects.length)
        }, 5200)
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      syncTimer()
    }, { threshold: 0.24 })
    const handleVisibility = () => syncTimer()

    observer.observe(projectSection)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      if (timerId) window.clearInterval(timerId)
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

    const ctx = gsap.context((self) => {
      const q = self.selector

      gsap.set(q('.hero-eyebrow, .hero-lead, .hero-actions, .hero-proof, .scroll-hint'), { autoAlpha: 0, y: 28 })
      gsap.set(q('.hero-title-line'), { yPercent: 112, rotateX: -18, transformOrigin: '50% 100%' })
      gsap.set(q('.hero-portrait'), { autoAlpha: 0, y: 42, scale: 0.98 })
      gsap.set(q('.topbar'), { autoAlpha: 0, y: -18 })

      gsap.timeline({ defaults: { ease: 'power4.out' } })
        .to(q('.topbar'), { autoAlpha: 1, y: 0, duration: 0.75 }, 0.05)
        .to(q('.hero-eyebrow'), { autoAlpha: 1, y: 0, duration: 0.7 }, 0.16)
        .to(q('.hero-title-line'), { yPercent: 0, rotateX: 0, duration: 1.1, stagger: 0.11, ease: 'expo.out' }, 0.22)
        .to(q('.hero-lead'), { autoAlpha: 1, y: 0, duration: 0.8 }, 0.72)
        .to(q('.hero-actions'), { autoAlpha: 1, y: 0, duration: 0.75 }, 0.86)
        .to(q('.hero-proof'), { autoAlpha: 1, y: 0, duration: 0.75 }, 1.02)
        .to(q('.hero-portrait'), { autoAlpha: 1, y: 0, scale: 1, duration: 0.95 }, 0.58)
        .to(q('.scroll-hint'), { autoAlpha: 1, y: 0, duration: 0.7 }, 1.2)

      q('[data-reveal]').forEach((element) => {
        gsap.fromTo(element, {
          autoAlpha: 0,
          y: 44,
        }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 82%',
            once: true,
          },
        })
      })

      q('[data-stagger]').forEach((group) => {
        const children = group.querySelectorAll('[data-stagger-item]')
        gsap.fromTo(children, {
          autoAlpha: 0,
          y: 36,
        }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          ease: 'power3.out',
          stagger: 0.075,
          scrollTrigger: {
            trigger: group,
            start: 'top 78%',
            once: true,
          },
        })
      })

      q('[data-parallax]').forEach((element) => {
        gsap.fromTo(element, { yPercent: -5 }, {
          yPercent: 5,
          ease: 'none',
          scrollTrigger: {
            trigger: element.closest('section') || element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        })
      })

      window.requestAnimationFrame(() => ScrollTrigger.refresh())
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <main className="portfolio" ref={rootRef}>
      <div className="progress-bar" aria-hidden="true"><span /></div>

      <header className="topbar">
        <button className="brand-mark" type="button" onClick={() => scrollTo('top')} aria-label="回到首屏">
          <span>PD</span>
          <small>Peng Dong</small>
        </button>

        <nav className="desktop-nav" aria-label="页面导航">
          {navItems.map((item) => (
            <button
              className={activeSection === item.id ? 'is-active' : ''}
              type="button"
              key={item.id}
              onClick={() => scrollTo(item.id)}
            >
              <span>{item.label}</span>
              <small>{item.zh}</small>
            </button>
          ))}
        </nav>

        <button className="nav-action" type="button" onClick={() => scrollTo('contact')}>
          <Mail size={17} />
          <span>Talk</span>
        </button>
      </header>

      <section className="hero section-shell" id="top" ref={setSectionRef('top')}>
        <video className="hero-video" autoPlay muted loop playsInline poster={asset('images/profile.png')} aria-hidden="true">
          <source src={asset('media/hero-bg.mp4')} type="video/mp4" />
        </video>
        <div className="hero-wash" aria-hidden="true" />

        <div className="hero-content">
          <p className="hero-eyebrow">Visual Designer / E-commerce / AI-assisted workflow</p>
          <h1>
            <span className="title-mask"><span className="hero-title-line">Peng Dong</span></span>
            <span className="title-mask"><span className="hero-title-line">把商品卖点设计成清晰体验</span></span>
          </h1>
          <p className="hero-lead">
            专注电商视觉、产品精修与品牌页面表达。用克制的版式、真实的产品质感和流畅的页面节奏，
            让复杂信息更快被理解、点击与记住。
          </p>

          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => scrollTo('projects')}>
              <span>查看项目</span>
              <ArrowDown size={18} />
            </button>
            <button className="ghost-button" type="button" onClick={() => scrollTo('contact')}>
              <Mail size={18} />
              <span>联系我</span>
            </button>
          </div>

          <div className="hero-proof" aria-label="能力概览">
            <span><strong>6</strong> selected cases</span>
            <span><strong>2</strong> commerce platforms</span>
            <span><strong>2026</strong> portfolio refresh</span>
          </div>
        </div>

        <aside className="hero-portrait" data-parallax>
          <img src={asset('images/profile.png')} alt="彭栋肖像" />
          <div>
            <strong>彭栋</strong>
            <span>视觉设计师 / 深圳</span>
          </div>
        </aside>

        <button className="scroll-hint" type="button" onClick={() => scrollTo('projects')}>
          <span>Selected work starts here</span>
          <ChevronRight size={18} />
        </button>
      </section>

      <section className="projects section-shell" id="projects" ref={setSectionRef('projects')}>
        <div className="section-heading" data-reveal>
          <p>01 / Projects</p>
          <h2>保留作品浓度，减少视觉噪音。</h2>
          <span>
            项目不再像展示柜一样堆满元素，而是用清晰的案例节奏呈现品类、任务、方法和结果判断。
          </span>
        </div>

        <div className="project-layout">
          <div className="project-list" data-stagger>
            {projects.map((project, index) => (
              <button
                className={index === activeProject ? 'is-active' : ''}
                type="button"
                key={project.title}
                onClick={() => setActiveProject(index)}
                onFocus={() => setActiveProject(index)}
                onMouseEnter={() => setActiveProject(index)}
                data-stagger-item
              >
                <i style={{ backgroundColor: project.accent }} />
                <span>{project.year}</span>
                <strong>{project.title}</strong>
                <small>{project.category}</small>
              </button>
            ))}
          </div>

          <article className="project-feature" style={{ '--accent': selectedProject.accent }} data-reveal>
            <div className="project-feature-top">
              <span>{selectedProject.year}</span>
              <span>{selectedProject.category}</span>
            </div>
            <p className="project-label">{selectedProject.label}</p>
            <h3>{selectedProject.title}</h3>
            <p>{selectedProject.summary}</p>
            <div className="project-role">
              <small>Design role</small>
              <strong>{selectedProject.role}</strong>
            </div>
            <div className="tag-row">
              {selectedProject.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <div className="project-color-note">
              <i />
              <span>Active color system</span>
            </div>
          </article>
        </div>

        <a className="work-link" href="https://docs.qq.com/doc/DR2hHVndCdWNzakNZ" target="_blank" rel="noreferrer" data-reveal>
          <span>查看完整作品集</span>
          <ArrowUpRight size={18} />
        </a>
      </section>

      <section className="experience section-shell" id="experience" ref={setSectionRef('experience')}>
        <div className="section-heading compact" data-reveal>
          <p>02 / Experience</p>
          <h2>从单张图到完整页面，目标都是让购买判断更轻。</h2>
        </div>

        <div className="experience-layout">
          <figure className="profile-card" data-reveal>
            <img src={asset('images/profile.png')} alt="彭栋个人肖像" />
            <figcaption>
              <strong>Commerce-focused visual designer</strong>
              <span>把商业信息整理成更有秩序的画面。</span>
            </figcaption>
          </figure>

          <div className="timeline" data-stagger>
            {experience.map((item) => (
              <article key={item.company} data-stagger-item>
                <time>{item.date}</time>
                <h3>{item.company}</h3>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="skills section-shell" id="skills" ref={setSectionRef('skills')}>
        <div className="section-heading" data-reveal>
          <p>03 / Skills</p>
          <h2>能力模块更像工具箱，随项目目标组合使用。</h2>
          <span>点击不同能力，查看它如何服务页面识别、信息理解和视觉转化。</span>
        </div>

        <div className="skills-layout">
          <div className="skill-buttons" data-stagger>
            {skills.map(({ icon: Icon, title, label }, index) => (
              <button
                className={index === activeSkill ? 'is-active' : ''}
                type="button"
                key={title}
                onClick={() => setActiveSkill(index)}
                data-stagger-item
              >
                <Icon size={22} />
                <span>{label}</span>
                <strong>{title}</strong>
              </button>
            ))}
          </div>

          <article className="skill-detail" data-reveal>
            <div>
              <selectedSkill.icon size={30} />
              <span>{selectedSkill.label}</span>
            </div>
            <h3>{selectedSkill.title}</h3>
            <p>{selectedSkill.detail}</p>
            <div className="tag-row">
              {selectedSkill.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </article>
        </div>
      </section>

      <section className="contact section-shell" id="contact" ref={setSectionRef('contact')}>
        <div className="contact-panel" data-reveal>
          <p>04 / Contact</p>
          <h2>让下一个项目拥有更清晰的视觉判断。</h2>
          <span>欢迎沟通跨境电商、淘宝视觉、产品精修与品牌页面设计。</span>

          <div className="contact-actions">
            <a href="tel:15575313247">
              <Phone size={21} />
              <span><small>Phone / WeChat</small><strong>15575313247</strong></span>
            </a>
            <a href="mailto:15575313247@163.com">
              <Mail size={21} />
              <span><small>Email</small><strong>15575313247@163.com</strong></span>
            </a>
            <button type="button" onClick={copyEmail}>
              {copied ? <Check size={21} /> : <Copy size={21} />}
              <span>{copied ? '已复制邮箱' : 'Copy email'}</span>
            </button>
          </div>
        </div>

        <footer>
          <span>Peng Dong Portfolio</span>
          <span>{currentYear}</span>
        </footer>
      </section>
    </main>
  )
}

export default App
