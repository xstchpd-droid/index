import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Download,
  Mail,
  Menu,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { animate, createScope, createTimeline, stagger } from 'animejs'
import VideoBackground from './VideoBackground.jsx'

const panels = [
  { id: 'home', label: 'Index', zh: '首页' },
  { id: 'profile', label: 'Profile', zh: '关于' },
  { id: 'works', label: 'Works', zh: '作品' },
  { id: 'capability', label: 'Capability', zh: '能力' },
  { id: 'experience', label: 'Experience', zh: '经历' },
  { id: 'contact', label: 'Contact', zh: '联系' },
]

const cases = [
  {
    index: '01',
    title: '电商视觉系统',
    label: 'E-commerce Visual System',
    brief: '主图、副图与详情页的统一表达。',
    image: '案例主视觉 / 横版产品图',
    note: '16:10 / 待替换',
  },
  {
    index: '02',
    title: '产品精修与详情页',
    label: 'Product Retouching & PDP',
    brief: '材质、光影与页面信息层级。',
    image: '产品精修图 / 材质与光影特写',
    note: '4:5 / 待替换',
  },
  {
    index: '03',
    title: 'AI 辅助快速迭代',
    label: 'AI-assisted Iteration',
    brief: '方向探索、筛选与快速迭代。',
    image: '版本对比图 / 方案 A、B、C',
    note: '画面序列 / 短视频',
  },
]

const capabilities = [
  {
    index: '01',
    title: '电商视觉系统',
    label: 'Commerce System',
    description: '统一主图、副图与详情页。',
    tags: ['淘宝视觉', 'Amazon', '详情页结构'],
    image: '产品图 / 完整电商视觉展开',
  },
  {
    index: '02',
    title: '产品精修与详情页',
    label: 'Retouching & PDP',
    description: '重塑材质、光影与细节。',
    tags: ['产品精修', '材质塑造', '信息层级'],
    image: '产品局部图 / 精修前后对比',
  },
  {
    index: '03',
    title: 'AI 辅助快速迭代',
    label: 'AI Workflow',
    description: '用 AI 加速探索与版本迭代。',
    tags: ['方向探索', '场景生成', '快速迭代'],
    image: '流程图 / AI 辅助设计工作流',
  },
]

const experience = [
  {
    date: '2026.01 — 2026.04',
    company: '深圳兔展智能科技有限公司',
    role: 'AI 设计师',
    description: '跨境电商主图、详情页与产品精修。',
  },
  {
    date: '2024.10 — 2025.12',
    company: '长沙黎萤科技有限公司',
    role: '电商视觉设计师',
    description: '淘宝及跨境电商主图、活动页与详情页。',
  },
]

const workflow = [
  ['01', '理解任务'],
  ['02', '方向探索'],
  ['03', '设计判断'],
  ['04', '商业交付'],
]

function VisualPlaceholder({ label, note, className = '' }) {
  return (
    <div className={`visual-placeholder ${className}`} role="img" aria-label={label}>
      <span>Image placeholder</span>
      <strong>{label}</strong>
      {note && <small>{note}</small>}
    </div>
  )
}

function App() {
  const rootRef = useRef(null)
  const panelRef = useRef(null)
  const [activePanel, setActivePanel] = useState('home')
  const [activeCase, setActiveCase] = useState(0)
  const [activeCapability, setActiveCapability] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [notice, setNotice] = useState('')
  const year = useMemo(() => new Date().getFullYear(), [])
  const currentIndex = panels.findIndex((panel) => panel.id === activePanel)
  const selectedCase = cases[activeCase]
  const selectedCapability = capabilities[activeCapability]

  const showNotice = useCallback((message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2000)
  }, [])

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText('15575313247@163.com')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      window.location.href = 'mailto:15575313247@163.com'
    }
  }, [])

  const goTo = useCallback((id) => {
    if (id === activePanel || transitioning) {
      setMenuOpen(false)
      return
    }

    setMenuOpen(false)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !panelRef.current) {
      setActivePanel(id)
      return
    }

    setTransitioning(true)
    animate(panelRef.current, {
      opacity: [1, 0],
      y: [0, -16],
      duration: 300,
      ease: 'inCubic',
      onComplete: () => {
        setActivePanel(id)
        window.requestAnimationFrame(() => {
          if (!panelRef.current) {
            setTransitioning(false)
            return
          }
          animate(panelRef.current, {
            opacity: [0, 1],
            y: [18, 0],
            duration: 560,
            ease: 'outCubic',
            onComplete: () => setTransitioning(false),
          })
        })
      },
    })
  }, [activePanel, transitioning])

  const goRelative = useCallback((direction) => {
    const nextIndex = (currentIndex + direction + panels.length) % panels.length
    goTo(panels[nextIndex].id)
  }, [currentIndex, goTo])

  useEffect(() => {
    const htmlOverflow = document.documentElement.style.overflow
    const bodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = htmlOverflow
      document.body.style.overflow = bodyOverflow
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
      if (menuOpen || transitioning) return
      if (event.key === 'ArrowRight') goRelative(1)
      if (event.key === 'ArrowLeft') goRelative(-1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goRelative, menuOpen, transitioning])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const scope = createScope({ root }).add(() => {
      const timeline = createTimeline({ defaults: { ease: 'outCubic' } })
      timeline
        .add('.site-header', { opacity: [0, 1], y: [-12, 0], duration: 640 }, 80)
        .add('.edge-meta', { opacity: [0, 1], duration: 540 }, 260)
        .add('.active-panel', { opacity: [0, 1], y: [16, 0], duration: 720 }, 260)
        .add('.panel-controls', { opacity: [0, 1], y: [8, 0], duration: 520 }, 560)
    })
    return () => scope.revert()
  }, [])

  const panelContent = {
    home: (
      <section className="active-panel home-panel" aria-labelledby="home-title">
        <div className="home-copy">
          <p>Peng Dong / Visual portfolio</p>
          <h1 id="home-title">视觉，先于解释。</h1>
          <span>电商视觉 / 产品精修 / AI 迭代</span>
        </div>
        <div className="home-note">
          <small>Navigate</small>
          <span>点击栏目切换</span>
        </div>
      </section>
    ),
    profile: (
      <section className="active-panel profile-panel" aria-labelledby="profile-title">
        <div className="panel-heading">
          <p>Profile / About</p>
          <h2 id="profile-title">彭栋 / AI 视觉设计师</h2>
        </div>
        <div className="profile-layout">
          <div className="profile-copy">
            <button type="button" onClick={() => goTo('experience')}>查看工作经历 <ArrowRight size={15} /></button>
          </div>
          <VisualPlaceholder label="个人能力氛围图" note="作品局部 / 不使用头像" />
          <div className="profile-facts">
            <div><small>BASE</small><strong>深圳 Shenzhen</strong></div>
            <div><small>EXPERIENCE</small><strong>1.5 Years</strong></div>
            <div><small>PLATFORMS</small><strong>Taobao / Amazon</strong></div>
            <div><small>ROLE</small><strong>AI 视觉设计师</strong></div>
          </div>
        </div>
      </section>
    ),
    works: (
      <section className="active-panel works-panel" aria-labelledby="works-title">
        <div className="compact-heading">
          <div><p>Selected works</p><h2 id="works-title">作品</h2></div>
        </div>
        <div className="works-layout">
          <div className="case-tabs" role="tablist" aria-label="案例类型">
            {cases.map((item, index) => (
              <button
                className={activeCase === index ? 'is-active' : ''}
                type="button"
                role="tab"
                aria-selected={activeCase === index}
                key={item.index}
                onClick={() => setActiveCase(index)}
              >
                <span>{item.index}</span>
                <strong>{item.title}</strong>
                <small>{item.label}</small>
              </button>
            ))}
          </div>
          <article className="case-preview" key={selectedCase.index}>
            <VisualPlaceholder label={selectedCase.image} note={selectedCase.note} />
            <div>
              <p>{selectedCase.label}</p>
              <h3>{selectedCase.title}</h3>
              <span>{selectedCase.brief}</span>
              <button type="button" onClick={() => showNotice('案例页模板已预留，等待真实作品后开放。')}>案例结构 <ArrowRight size={15} /></button>
            </div>
          </article>
        </div>
      </section>
    ),
    capability: (
      <section className="active-panel capability-panel" aria-labelledby="capability-title">
        <div className="compact-heading">
          <div><p>Core capability</p><h2 id="capability-title">能力</h2></div>
        </div>
        <div className="capability-layout">
          <div className="capability-tabs" role="tablist" aria-label="核心能力">
            {capabilities.map((item, index) => (
              <button
                className={activeCapability === index ? 'is-active' : ''}
                type="button"
                role="tab"
                aria-selected={activeCapability === index}
                key={item.index}
                onClick={() => setActiveCapability(index)}
              >
                <span>{item.index}</span><strong>{item.title}</strong><small>{item.label}</small>
              </button>
            ))}
          </div>
          <article className="capability-preview" key={selectedCapability.index}>
            <VisualPlaceholder label={selectedCapability.image} note="待真实项目替换" />
            <div className="capability-copy">
              <p>{selectedCapability.label}</p>
              <h3>{selectedCapability.title}</h3>
              <span>{selectedCapability.description}</span>
              <ul>{selectedCapability.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            </div>
            <ol className="workflow-strip">
              {workflow.map(([index, title]) => (
                <li key={index}><span>{index}</span><strong>{title}</strong></li>
              ))}
            </ol>
          </article>
        </div>
      </section>
    ),
    experience: (
      <section className="active-panel experience-panel" aria-labelledby="experience-title">
        <div className="compact-heading">
          <div><p>Work experience</p><h2 id="experience-title">经历</h2></div>
        </div>
        <div className="experience-layout">
          <div className="experience-list">
            {experience.map((item) => (
              <article key={item.company}>
                <time>{item.date}</time>
                <div><h3>{item.company}</h3><strong>{item.role}</strong></div>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
          <div className="experience-aside">
            <VisualPlaceholder label="交付效果图" note="主图 / 详情页 / 平台页面" />
            <button type="button" onClick={() => goTo('contact')}>联系彭栋 <ArrowRight size={15} /></button>
          </div>
        </div>
      </section>
    ),
    contact: (
      <section className="active-panel contact-panel" aria-labelledby="contact-title">
        <div className="contact-intro">
          <p>Contact / Shenzhen</p>
          <h2 id="contact-title">联系</h2>
        </div>
        <div className="contact-grid">
          <div className="contact-method">
            <small>WECHAT</small>
            <strong>15575313247</strong>
            <VisualPlaceholder label="微信二维码" note="待替换" />
          </div>
          <div className="contact-method">
            <small>EMAIL</small>
            <strong>15575313247@163.com</strong>
            <button type="button" onClick={copyEmail}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? '已复制邮箱' : '复制邮箱'}</button>
          </div>
          <button className="resume-button" type="button" onClick={() => showNotice('简历 PDF 文件待接入。')}>下载简历（待接入） <Download size={15} /></button>
          <a className="email-button" href="mailto:15575313247@163.com">发送邮件 <Mail size={15} /></a>
        </div>
        <div className="contact-footer"><span>Peng Dong Portfolio</span><span>Shenzhen · {year}</span></div>
      </section>
    ),
  }

  return (
    <main className="portfolio-shell" ref={rootRef}>
      <VideoBackground />

      <header className="site-header">
        <button className="wordmark" type="button" onClick={() => goTo('home')}>
          <strong>彭栋</strong><span>AI VISUAL DESIGNER</span>
        </button>
        <nav className="main-nav" aria-label="主导航">
          {panels.map((panel) => (
            <button className={activePanel === panel.id ? 'is-active' : ''} type="button" key={panel.id} onClick={() => goTo(panel.id)}>{panel.label}</button>
          ))}
        </nav>
        <button className="mobile-menu-trigger" type="button" onClick={() => setMenuOpen(true)} aria-label="打开菜单"><Menu size={19} /></button>
      </header>

      <aside className="edge-meta" aria-hidden="true">
        <span>{String(currentIndex + 1).padStart(2, '0')}</span>
        <i />
        <small>{panels[currentIndex].label}</small>
      </aside>

      <div className="panel-viewport">
        <div className="panel-mount" ref={panelRef} key={activePanel}>{panelContent[activePanel]}</div>
      </div>

      <div className="panel-controls">
        <span>{String(currentIndex + 1).padStart(2, '0')} / {String(panels.length).padStart(2, '0')}</span>
        <div>
          <button type="button" onClick={() => goRelative(-1)} aria-label="上一个栏目"><ArrowLeft size={17} /></button>
          <button type="button" onClick={() => goRelative(1)} aria-label="下一个栏目"><ArrowRight size={17} /></button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="移动端导航">
          <button className="menu-close" type="button" onClick={() => setMenuOpen(false)} aria-label="关闭菜单"><X size={19} /></button>
          <div>
            {panels.map((panel, index) => (
              <button className={activePanel === panel.id ? 'is-active' : ''} type="button" key={panel.id} onClick={() => goTo(panel.id)}>
                <span>{String(index + 1).padStart(2, '0')}</span><strong>{panel.label}</strong><small>{panel.zh}</small>
              </button>
            ))}
          </div>
        </div>
      )}

      {notice && <div className="notice" role="status">{notice}</div>}
    </main>
  )
}

export default App
