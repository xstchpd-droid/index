import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  BrainCircuit,
  Camera,
  ChevronRight,
  Layers3,
  Mail,
  MousePointer2,
  Phone,
  WandSparkles,
} from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'

const projects = [
  {
    title: 'Levoit 空气净化器',
    type: 'Amazon A+ / 主图系统',
    meta: 'Pure home scenario',
    year: '2024',
    accent: '#7ce6d8',
    copy:
      '围绕“纯净家居”建立视觉锤，用场景化主图、动态图表与对比模块强化净化效能。',
  },
  {
    title: 'CESHU 便携咖啡机',
    type: 'Amazon Listing / A+ Page',
    meta: 'Portable coffee maker',
    year: '2024',
    accent: '#f0b56f',
    copy:
      '通过小体积与专业出品的冲突对比，搭配场景图和信任信息提升购买判断效率。',
  },
  {
    title: 'LABEKA 猫咪饮水机',
    type: 'Amazon Product Visual',
    meta: 'Pet water fountain',
    year: '2025',
    accent: '#94d96f',
    copy:
      '以“健康饮水”作为主线，可视化活水概念，并用结构化 A+ 内容展示功能体验。',
  },
  {
    title: 'GLERC 自行车',
    type: 'Amazon Main Image / A+',
    meta: 'Lightweight bicycle',
    year: '2025',
    accent: '#8ea8ff',
    copy:
      '提炼轻量化、骑行场景与目标人群卖点，形成更直接的跨境电商视觉表达。',
  },
  {
    title: 'PINKSAVIOR 服装店铺',
    type: 'Taobao Store / Campaign',
    meta: 'Modern Chinese aesthetic',
    year: '2026',
    accent: '#ff7c9a',
    copy:
      '以中式美学现代化为策略，完成店铺首页、大促活动页、主图与详情页视觉设计。',
  },
  {
    title: 'dasique 代曦可美妆',
    type: 'Taobao Beauty Visual',
    meta: 'Sweet beauty style',
    year: '2026',
    accent: '#d5a7ff',
    copy:
      '围绕品牌甜美调性搭建 Banner、首页与产品视觉语言，并整合优惠信息排版。',
  },
]

const strengths = [
  {
    icon: Layers3,
    title: '电商视觉系统',
    text: '熟悉国内外电商平台规范，能把主图、副图、详情页、A+ 页面做成统一的转化链路。',
  },
  {
    icon: BrainCircuit,
    title: 'AI 设计工作流',
    text: '使用 DeepSeek、Nano Banana Pro、Image2 等工具辅助调研、构图、生成与快速迭代。',
  },
  {
    icon: Camera,
    title: '产品精修与质感',
    text: '具备产品拍摄精修经验，能配合 KeyShot 建模渲染强化材质、光影与商业完成度。',
  },
  {
    icon: WandSparkles,
    title: '品牌化页面表达',
    text: '能根据品类与目标客群建立差异化风格，让信息层级、画面情绪和卖点同时成立。',
  },
]

const stats = [
  ['6+', '完整项目案例'],
  ['2', '跨境与国内平台'],
  ['1Y+', '设计从业经验'],
  ['AI', '设计流程增强'],
]

const contacts = [
  {
    icon: Phone,
    label: '15575313247',
    sub: '微信同号',
    href: 'tel:15575313247',
  },
  {
    icon: Mail,
    label: '15575313247@163.com',
    sub: '邮箱联系',
    href: 'mailto:15575313247@163.com',
  },
]

function App() {
  const heroRef = useRef(null)
  const currentYear = useMemo(() => new Date().getFullYear(), [])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const handleMove = (event) => {
      const rect = hero.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100
      hero.style.setProperty('--cursor-x', `${x}%`)
      hero.style.setProperty('--cursor-y', `${y}%`)
      hero.style.setProperty('--tilt-x', `${(y - 50) / 18}deg`)
      hero.style.setProperty('--tilt-y', `${(50 - x) / 24}deg`)
    }

    hero.addEventListener('pointermove', handleMove)
    return () => hero.removeEventListener('pointermove', handleMove)
  }, [])

  return (
    <main className="site-shell">
      <section className="hero" id="top" ref={heroRef}>
        <video
          className="hero-video"
          src="/media/hero-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="hero-veil" />
        <div className="hero-scan" />
        <div className="intro-gate" aria-hidden="true">
          <span>PD</span>
          <span>VISUAL SYSTEM ONLINE</span>
        </div>

        <nav className="nav shell" aria-label="主导航">
          <a className="brand" href="#top" aria-label="回到首页">
            <span>PD</span>
            <small>Portfolio</small>
          </a>
          <div className="nav-links">
            <a href="#profile">经历</a>
            <a href="#projects">项目</a>
            <a href="#strengths">优势</a>
            <a href="#contact">联系</a>
          </div>
          <a className="nav-contact" href="mailto:15575313247@163.com">
            <Mail size={17} />
            联系我
          </a>
        </nav>

        <div className="hero-content shell">
          <div className="hero-kicker">
            <span className="status-dot" />
            Visual / AI / E-commerce Designer
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Peng Dong Portfolio</p>
              <h1>
                彭栋
                <span>以 AI 与商业视觉构建高转化电商体验</span>
              </h1>
              <p className="hero-desc">
                视觉设计师 / AI 设计师 / 电商设计师。专注跨境电商主图、A+
                页面、淘宝店铺首页、活动视觉与产品精修，把卖点转译成更清晰的画面秩序。
              </p>
              <div className="hero-actions">
                <a className="primary-btn" href="#projects">
                  查看项目
                  <ArrowDownRight size={19} />
                </a>
                <a className="secondary-btn" href="#profile">
                  了解经历
                  <ChevronRight size={18} />
                </a>
              </div>
            </div>

            <div className="hero-panel" aria-label="设计身份概览">
              <div className="panel-orbit">
                <span />
                <span />
                <span />
              </div>
              <div className="panel-topline">
                <span>Designer ID</span>
                <BadgeCheck size={18} />
              </div>
              <strong>PD-2026</strong>
              <p>跨平台电商视觉、AI 生成辅助、产品精修与页面信息架构。</p>
              <div className="panel-tags">
                <span>Amazon A+</span>
                <span>Taobao Visual</span>
                <span>AI Workflow</span>
              </div>
            </div>
          </div>

          <div className="hero-bottom">
            <div className="scroll-cue">
              <MousePointer2 size={17} />
              <span>Motion Field</span>
            </div>
            <div className="hero-index">
              <span>01</span>
              <span>Selected visual archive</span>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-section section" id="profile">
        <div className="shell profile-layout">
          <div className="portrait-frame">
            <img src="/images/profile.png" alt="彭栋个人形象" />
            <div className="portrait-caption">
              <span>Visual Designer</span>
              <strong>Based in Hunan</strong>
            </div>
          </div>

          <div className="profile-copy">
            <p className="section-kicker">About / Experience</p>
            <h2>把设计从“好看”推进到“可被理解、可被点击、可被记住”。</h2>
            <p>
              我具备一年设计从业经验，熟知国内外电商作图规范和视觉风格，能完成主图、副图、A+
              页面、详情页、活动海报等全链路设计。工作中会结合 AI
              工具提升调研、构图、生成与迭代效率，也熟悉 KeyShot
              质感建模与渲染、产品拍摄精修。
            </p>

            <div className="timeline">
              <article>
                <span>2026.01 - 2026.04</span>
                <strong>深圳兔展智能科技有限公司</strong>
                <p>淘宝电商平台整体视觉设计，负责主图、直通车图、详情页与活动海报创意输出。</p>
              </article>
              <article>
                <span>2024.10 - 2025.12</span>
                <strong>长沙黎萤科技有限公司</strong>
                <p>亚马逊平台产品视觉内容创作，包括主图、副图、A+ 页面设计与图片精修。</p>
              </article>
            </div>

            <div className="contact-strip">
              {contacts.map(({ icon: Icon, label, sub, href }) => (
                <a href={href} key={label}>
                  <Icon size={20} />
                  <span>
                    <strong>{label}</strong>
                    <small>{sub}</small>
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="stats-grid" aria-label="项目数据">
            {stats.map(([value, label]) => (
              <div className="stat-card" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="projects-section section" id="projects">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Selected Projects</p>
              <h2>精选项目</h2>
            </div>
            <a className="ghost-link" href="https://docs.qq.com/doc/DR2hHVndCdWNzakNZ" target="_blank" rel="noreferrer">
              作品集原文
              <ArrowUpRight size={18} />
            </a>
          </div>

          <div className="project-grid">
            {projects.map((project, index) => (
              <article
                className="project-card"
                key={project.title}
                style={{ '--accent': project.accent }}
              >
                <div className="project-visual">
                  <div className="visual-stage">
                    <span className="product-halo" />
                    <span className="product-block block-main" />
                    <span className="product-block block-side" />
                    <span className="product-line line-one" />
                    <span className="product-line line-two" />
                    <span className="product-chip">{project.meta}</span>
                  </div>
                </div>
                <div className="project-info">
                  <div>
                    <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
                    <span>{project.year}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p className="project-type">{project.type}</p>
                  <p>{project.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="strengths-section section" id="strengths">
        <div className="shell">
          <div className="section-heading compact">
            <div>
              <p className="section-kicker">Capabilities</p>
              <h2>个人优势</h2>
            </div>
            <p>
              从商品卖点、页面信息层级到 AI
              生成效率，围绕商业视觉结果建立完整执行能力。
            </p>
          </div>

          <div className="strength-grid">
            {strengths.map(({ icon: Icon, title, text }) => (
              <article className="strength-card" key={title}>
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

      <section className="contact-section" id="contact">
        <div className="contact-bg" />
        <div className="shell contact-layout">
          <div>
            <p className="section-kicker">Contact</p>
            <h2>让下一个项目拥有更明确的视觉判断。</h2>
          </div>
          <div className="contact-actions">
            <a className="contact-pill" href="tel:15575313247">
              <Phone size={22} />
              <span>
                <strong>15575313247</strong>
                <small>电话 / 微信同号</small>
              </span>
            </a>
            <a className="contact-pill" href="mailto:15575313247@163.com">
              <Mail size={22} />
              <span>
                <strong>15575313247@163.com</strong>
                <small>邮箱</small>
              </span>
            </a>
          </div>
          <footer>
            <span>Peng Dong Portfolio</span>
            <span>{currentYear}</span>
          </footer>
        </div>
      </section>
    </main>
  )
}

export default App
