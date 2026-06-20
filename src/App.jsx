import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDot,
  Layers3,
  Mail,
  MousePointer2,
  Phone,
  ScanLine,
  Sparkles,
  WandSparkles,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

const numberNames = ['零一', '零二', '零三', '零四', '零五', '零六']

const projects = [
  {
    title: '空气净化器视觉系统',
    type: '跨境电商主图与详情页',
    category: '家居净化',
    year: '二〇二四',
    accent: '#d8ff45',
    visual: '纯净家居场景',
    copy:
      '围绕纯净、静音、安心建立画面秩序，用场景主图、卖点分镜和对比信息强化购买判断。',
    tags: ['主图策略', '场景构图', '卖点转译'],
  },
  {
    title: '便携咖啡机内容页面',
    type: '跨境电商产品页面',
    category: '户外咖啡',
    year: '二〇二四',
    accent: '#ffb15f',
    visual: '移动冲煮体验',
    copy:
      '把小体积、专业出品和便携场景放在同一叙事里，让功能信息更快被理解和记住。',
    tags: ['功能分层', '场景叙事', '信任信息'],
  },
  {
    title: '宠物饮水机商业视觉',
    type: '跨境电商产品视觉',
    category: '宠物健康',
    year: '二〇二五',
    accent: '#6df2ba',
    visual: '活水结构表达',
    copy:
      '以健康饮水为主线，可视化过滤、循环和静音体验，形成清晰的详情页信息节奏。',
    tags: ['结构可视化', '柔和光影', '详情排版'],
  },
  {
    title: '轻量自行车主图系统',
    type: '跨境电商主图系统',
    category: '运动出行',
    year: '二〇二五',
    accent: '#8fa6ff',
    visual: '速度与轻量感',
    copy:
      '提炼轻量化、骑行人群和使用场景，建立更直接的产品识别和跨境电商视觉表达。',
    tags: ['产品精修', '人群定位', '动势画面'],
  },
  {
    title: '服装店铺活动视觉',
    type: '淘宝店铺与活动页面',
    category: '女装零售',
    year: '二〇二六',
    accent: '#ff7a9f',
    visual: '现代中式美学',
    copy:
      '把中式气质转化为现代店铺语言，完成首页、活动页、主图和详情页的统一设计。',
    tags: ['店铺首页', '活动海报', '风格统一'],
  },
  {
    title: '美妆品牌页面表达',
    type: '淘宝美妆视觉系统',
    category: '甜美妆容',
    year: '二〇二六',
    accent: '#d6a8ff',
    visual: '柔甜色彩系统',
    copy:
      '围绕甜美调性搭建首屏、横幅和产品信息排版，让优惠信息与品牌情绪同时成立。',
    tags: ['色彩系统', '横幅设计', '信息整合'],
  },
]

const strengths = [
  {
    icon: Layers3,
    title: '电商视觉系统',
    text: '熟悉跨境与国内电商平台规范，能把主图、副图、详情页和活动页面组织成统一的转化链路。',
  },
  {
    icon: Sparkles,
    title: '智能设计流程',
    text: '能使用大模型与图像生成工具辅助调研、构图、风格探索和快速迭代，提高方案推进效率。',
  },
  {
    icon: ScanLine,
    title: '产品精修质感',
    text: '具备产品拍摄与精修经验，也能配合三维渲染思路强化材质、光影和商业完成度。',
  },
  {
    icon: WandSparkles,
    title: '品牌页面表达',
    text: '根据品类、价格带和目标客群建立差异化风格，让信息层级、画面情绪与卖点同时成立。',
  },
]

const stats = [
  ['多品类', '商业项目经验'],
  ['两类平台', '跨境与国内电商'],
  ['一年以上', '商业设计经验'],
  ['全链路', '从主图到详情页'],
]

const timeline = [
  {
    date: '二〇二六年一月至四月',
    company: '深圳兔展智能科技有限公司',
    text: '负责跨境电商产品视觉内容，包含主图、副图、详情页设计、产品图片精修与页面信息整理。',
  },
  {
    date: '二〇二四年十月至二〇二五年十二月',
    company: '长沙黎萤科技有限公司',
    text: '负责淘宝电商平台整体视觉设计，覆盖主图、直通车图、详情页与活动海报创意输出。负责跨境电商产品视觉内容，包含主图、副图、详情页设计、产品图片精修与页面信息整理。',
  },
]

const contacts = [
  {
    icon: Phone,
    label: '电话沟通',
    sub: '微信同号：15575313247',
    href: 'tel:15575313247',
  },
  {
    icon: Mail,
    label: '发送邮件',
    sub: '15575313247@163.com',
    href: 'mailto:15575313247@163.com',
  },
]

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`

const toChineseYear = (value) =>
  String(value)
    .replaceAll('0', '〇')
    .replaceAll('1', '一')
    .replaceAll('2', '二')
    .replaceAll('3', '三')
    .replaceAll('4', '四')
    .replaceAll('5', '五')
    .replaceAll('6', '六')
    .replaceAll('7', '七')
    .replaceAll('8', '八')
    .replaceAll('9', '九')

const getScrollMetrics = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const pageProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0
  const scrollRange = maxScroll || 1

  return { maxScroll, pageProgress, scrollRange }
}

function App() {
  const heroRef = useRef(null)
  const [activeProject, setActiveProject] = useState(0)
  const currentYear = useMemo(() => toChineseYear(new Date().getFullYear()), [])
  const selectedProject = projects[activeProject]

  useEffect(() => {
    const handleMove = (event) => {
      document.documentElement.style.setProperty('--global-cursor-x', `${event.clientX}px`)
      document.documentElement.style.setProperty('--global-cursor-y', `${event.clientY}px`)

      const hero = heroRef.current
      if (!hero) return

      const rect = hero.getBoundingClientRect()
      const x = Math.min(Math.max(((event.clientX - rect.left) / rect.width) * 100, 0), 100)
      const y = Math.min(Math.max(((event.clientY - rect.top) / rect.height) * 100, 0), 100)

      hero.style.setProperty('--cursor-x', `${x}%`)
      hero.style.setProperty('--cursor-y', `${y}%`)
      hero.style.setProperty('--tilt-x', `${(y - 50) / 22}deg`)
      hero.style.setProperty('--tilt-y', `${(50 - x) / 28}deg`)
    }

    window.addEventListener('pointermove', handleMove)
    return () => window.removeEventListener('pointermove', handleMove)
  }, [])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

    const timer = window.setInterval(() => {
      setActiveProject((current) => (current + 1) % projects.length)
    }, 5200)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const revealItems = document.querySelectorAll('.reveal')

    if (reduceMotion) {
      revealItems.forEach((item) => item.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          } else {
            entry.target.classList.remove('is-visible')
          }
        })
      },
      {
        rootMargin: '-8% 0px -8% 0px',
        threshold: 0.14,
      },
    )

    revealItems.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

    const scenes = Array.from(document.querySelectorAll('.scroll-scene'))
    let ticking = false
    let lastScrollY = window.scrollY

    const clamp = (value) => Math.min(Math.max(value, 0), 1)
    const clampSigned = (value) => Math.min(Math.max(value, -1), 1)

    const updateScrollState = () => {
      const currentScrollY = window.scrollY
      const direction = currentScrollY >= lastScrollY ? 'down' : 'up'
      const { pageProgress } = getScrollMetrics()
      const depth = pageProgress * 100
      const track = pageProgress * -72
      const spin = pageProgress * 216
      const wall = pageProgress * 46
      const camera = 1 + pageProgress * 0.08

      document.documentElement.style.setProperty('--page-progress', pageProgress.toFixed(4))
      document.documentElement.style.setProperty('--global-depth', `${depth.toFixed(2)}rem`)
      document.documentElement.style.setProperty('--global-depth-z', `${(-depth).toFixed(2)}rem`)
      document.documentElement.style.setProperty('--global-track-x', `${track.toFixed(2)}rem`)
      document.documentElement.style.setProperty('--global-spin', `${spin.toFixed(2)}deg`)
      document.documentElement.style.setProperty('--global-track-rotate', `${(-spin * 0.08).toFixed(2)}deg`)
      document.documentElement.style.setProperty('--global-wall-y', `${wall.toFixed(2)}rem`)
      document.documentElement.style.setProperty('--global-wall-far-y', `${(-wall * 0.55).toFixed(2)}rem`)
      document.documentElement.style.setProperty('--global-wall-left-y', `${(-wall * 0.8).toFixed(2)}rem`)
      document.documentElement.style.setProperty('--global-wall-right-y', `${(wall * 0.8).toFixed(2)}rem`)
      document.documentElement.style.setProperty('--global-prism-y', `${(-wall * 0.1).toFixed(2)}rem`)
      document.documentElement.style.setProperty('--global-camera-scale', camera.toFixed(4))
      document.documentElement.dataset.scrollDirection = direction

      scenes.forEach((scene) => {
        const rect = scene.getBoundingClientRect()
        const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height))
        const centerDistance = clampSigned(
          (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight,
        )
        const visiblePixels = clamp(
          (Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)) /
            Math.min(rect.height, window.innerHeight),
        )
        const centerFocus = 1 - Math.min(Math.abs(centerDistance), 1)
        const visibility = clamp(Math.max(visiblePixels, centerFocus * 0.9))
        const opacity = 0.34 + visibility * 0.66
        const scale = 0.955 + visibility * 0.045
        const sceneY = centerDistance * 4.2
        const rotateX = centerDistance * -2.2
        const gridY = centerDistance * 8
        const sweepX = (0.5 - centerDistance) * 300
        const theaterY = (0.5 - progress) * 28
        const workSweep = (progress - 0.5) * 42

        scene.style.setProperty('--scene-progress', progress.toFixed(4))
        scene.style.setProperty('--scene-distance', centerDistance.toFixed(4))
        scene.style.setProperty('--scene-visibility', visibility.toFixed(4))
        scene.style.setProperty('--scene-opacity', opacity.toFixed(4))
        scene.style.setProperty('--scene-scale', scale.toFixed(4))
        scene.style.setProperty('--scene-y', `${sceneY.toFixed(2)}rem`)
        scene.style.setProperty('--scene-rotate-x', `${rotateX.toFixed(2)}deg`)
        scene.style.setProperty('--scene-grid-y', `${gridY.toFixed(2)}rem`)
        scene.style.setProperty('--scene-sweep-x', `${sweepX.toFixed(2)}%`)
        scene.style.setProperty('--theater-y', `${theaterY.toFixed(2)}px`)
        scene.style.setProperty('--work-sweep-x', `${workSweep.toFixed(2)}%`)
        scene.classList.toggle('is-scene-active', visibility > 0.72)
      })

      lastScrollY = currentScrollY
      ticking = false
    }

    const requestUpdate = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(updateScrollState)
    }

    updateScrollState()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

    let targetScroll = window.scrollY
    let currentScroll = window.scrollY
    let frameId = 0
    let isAnimating = false

    const canUseSmoothWheel = () => window.innerWidth > 900
    const getMaxScroll = () => document.documentElement.scrollHeight - window.innerHeight
    const clampScroll = (value) => Math.min(Math.max(value, 0), getMaxScroll())

    const animateScroll = () => {
      currentScroll += (targetScroll - currentScroll) * 0.12

      if (Math.abs(targetScroll - currentScroll) < 0.45) {
        currentScroll = targetScroll
        window.scrollTo({ top: currentScroll, left: 0, behavior: 'auto' })
        isAnimating = false
        frameId = 0
        return
      }

      window.scrollTo({ top: currentScroll, left: 0, behavior: 'auto' })
      frameId = window.requestAnimationFrame(animateScroll)
    }

    const startAnimation = () => {
      if (frameId) return
      isAnimating = true
      frameId = window.requestAnimationFrame(animateScroll)
    }

    const handleWheel = (event) => {
      if (!canUseSmoothWheel() || event.ctrlKey) return

      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1
      const delta = event.deltaY * unit

      if (Math.abs(delta) < 0.5) return

      event.preventDefault()
      targetScroll = clampScroll(targetScroll + delta * 0.92)
      startAnimation()
    }

    const syncScroll = () => {
      if (isAnimating) return
      targetScroll = window.scrollY
      currentScroll = window.scrollY
    }

    const handleResize = () => {
      targetScroll = clampScroll(targetScroll)
      currentScroll = clampScroll(currentScroll)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('scroll', syncScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('scroll', syncScroll)
      window.removeEventListener('resize', handleResize)
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <main className="site-shell">
      <div className="motion-tunnel" aria-hidden="true">
        <div className="tunnel-wall tunnel-wall-left" />
        <div className="tunnel-wall tunnel-wall-right" />
        <div className="tunnel-track">
          {projects.map((project, index) => (
            <div
              className="tunnel-panel"
              key={project.title}
              style={{
                '--panel-accent': project.accent,
                '--panel-x': `${(index - 2.5) * 28}rem`,
                '--panel-z': `${(2.5 - index) * 5}rem`,
                '--panel-rotate-y': `${(index - 2.5) * -16}deg`,
              }}
            >
              <span>{numberNames[index]}</span>
              <strong>{project.title}</strong>
            </div>
          ))}
        </div>
        <div className="tunnel-prism">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="scroll-progress" aria-hidden="true" />

      <section className="hero scroll-scene" id="top" ref={heroRef}>
        <div className="hero-grid-field" />
        <div className="hero-light" />
        <div className="intro-gate" aria-hidden="true">
          <span>彭</span>
          <strong>彭栋视觉作品集</strong>
        </div>

        <nav className="nav shell" aria-label="主导航">
          <a className="brand" href="#top" aria-label="回到首页">
            <span>彭栋</span>
            <small>作品集</small>
          </a>
          <div className="nav-links">
            <a href="#profile">经历</a>
            <a href="#projects">项目</a>
            <a href="#strengths">能力</a>
            <a href="#contact">联系</a>
          </div>
          <a className="nav-contact" href="#contact">
            <Mail size={17} />
            合作沟通
          </a>
        </nav>

        <div className="hero-content shell">
          <div className="hero-topline">
            <span className="pulse-dot" />
            正在接收商业视觉信号
          </div>

          <div className="hero-stage">
            <div className="hero-copy">
              <p className="eyebrow">个人视觉档案</p>
              <h1>
                彭栋作品集
                <span>把电商卖点炼成清晰、可感知的视觉体验</span>
              </h1>
            </div>

            <div className="prism-wrap" aria-hidden="true">
              <div className="prism-core">
                <span />
                <span />
                <span />
              </div>
              <div className="prism-ring" />
              <div className="prism-caption">视觉系统</div>
            </div>

            <aside className="hero-console" aria-label="个人信息摘要">
              <div className="console-line">
                <span>身份</span>
                <strong>视觉设计师</strong>
              </div>
              <div className="console-line">
                <span>方向</span>
                <strong>不限</strong>
              </div>
              <div className="console-line">
                <span>方法</span>
                <strong>智能生成辅助</strong>
              </div>
            </aside>
          </div>

          <div className="hero-footer">
            <p>
              专注跨境电商主图、详情页、淘宝店铺首页、活动视觉与产品精修，把复杂卖点整理成有节奏的商业画面。
            </p>
            <div className="hero-actions">
              <a className="primary-btn" href="#projects">
                查看项目
                <ArrowDownRight size={19} />
              </a>
              <a className="secondary-btn" href="#profile">
                了解经历
                <MousePointer2 size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-section section scroll-scene" id="profile">
        <div className="shell profile-layout">
          <div className="portrait-frame reveal">
            <img src={assetUrl('images/profile.png')} alt="彭栋个人形象" />
            <div className="portrait-caption">
              <span>视觉设计师</span>
              <strong>湖南</strong>
            </div>
          </div>

          <div className="profile-copy reveal">
            <p className="section-kicker">关于经历</p>
            <h2>把设计从好看推进到可被理解、可被点击、可被记住。</h2>
            <p>
              我具备一年以上商业设计经验，熟悉国内外电商作图规范和常见视觉风格，能完成主图、副图、详情页、活动海报等全链路设计。工作中会结合智能工具提升调研、构图、生成与迭代效率，也注重产品质感、页面信息层级和最终转化表达。
            </p>

            <div className="timeline">
              {timeline.map((item) => (
                <article key={item.company}>
                  <span>{item.date}</span>
                  <strong>{item.company}</strong>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="stats-grid reveal" aria-label="项目数据">
            {stats.map(([value, label]) => (
              <div className="stat-card" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="projects-section section scroll-scene" id="projects">
        <div className="shell">
          <div className="section-heading reveal">
            <div>
              <p className="section-kicker">项目舞台</p>
              <h2>部分代表项目</h2>
              <p className="section-note">
                这里仅展示部分项目方向，更多主图、详情页、店铺页面与活动视觉收录在完整作品集中。
              </p>
            </div>
            <a className="ghost-link" href="https://docs.qq.com/doc/DR2hHVndCdWNzakNZ" target="_blank" rel="noreferrer">
              查看更多作品
              <ArrowUpRight size={18} />
            </a>
          </div>

          <div className="project-theater reveal" style={{ '--accent': selectedProject.accent }}>
            <div className="featured-work" aria-live="polite">
              <div className="work-media">
                <div className="media-lattice" />
                <div className="media-label">
                  <span>{numberNames[activeProject]}</span>
                  <strong>{selectedProject.visual}</strong>
                </div>
              </div>

              <div className="work-copy">
                <div className="work-meta">
                  <span>{selectedProject.year}</span>
                  <span>{selectedProject.category}</span>
                </div>
                <h3>{selectedProject.title}</h3>
                <p className="project-type">{selectedProject.type}</p>
                <p>{selectedProject.copy}</p>
                <div className="tag-row">
                  {selectedProject.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="project-list" aria-label="项目列表">
              {projects.map((project, index) => (
                <button
                  className={index === activeProject ? 'project-row is-active' : 'project-row'}
                  key={project.title}
                  type="button"
                  onClick={() => setActiveProject(index)}
                  onMouseEnter={() => setActiveProject(index)}
                  style={{ '--row-accent': project.accent }}
                >
                  <span>{numberNames[index]}</span>
                  <strong>{project.title}</strong>
                  <small>{project.category}</small>
                  <CircleDot size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="strengths-section section scroll-scene" id="strengths">
        <div className="shell">
          <div className="section-heading compact reveal">
            <div>
              <p className="section-kicker">能力矩阵</p>
              <h2>围绕商业结果组织画面。</h2>
            </div>
            <p>
              从商品卖点、页面信息层级到智能生成效率，目标是让每个视觉动作都服务于识别、理解和转化。
            </p>
          </div>

          <div className="strength-grid">
            {strengths.map(({ icon: Icon, title, text }) => (
              <article className="strength-card reveal" key={title}>
                <div className="strength-icon">
                  <Icon size={24} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-section scroll-scene" id="contact">
        <div className="contact-grid" />
        <div className="shell contact-layout reveal">
          <div>
            <p className="section-kicker">联系合作</p>
            <h2>让下一个项目拥有更明确的视觉判断。</h2>
          </div>
          <div className="contact-actions">
            {contacts.map(({ icon: Icon, label, sub, href }) => (
              <a className="contact-pill" href={href} key={label}>
                <Icon size={22} />
                <span>
                  <strong>{label}</strong>
                  <small>{sub}</small>
                </span>
              </a>
            ))}
          </div>
          <footer>
            <span>彭栋个人作品集</span>
            <span>{currentYear}</span>
          </footer>
        </div>
      </section>
    </main>
  )
}

export default App
