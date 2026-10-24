import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  Bed,
  Bell,
  BookOpen,
  CalendarBlank,
  CaretRight,
  ChartBar,
  ChatCircleDots,
  Check,
  Clock,
  CloudRain,
  Coffee,
  DotsThree,
  FlowerLotus,
  GearSix,
  Heart,
  House,
  Leaf,
  LockSimple,
  MagnifyingGlass,
  Moon,
  MoonStars,
  MusicNotes,
  Pause,
  PenNib,
  PencilSimple,
  Play,
  Plus,
  Question,
  ShareNetwork,
  ShieldCheck,
  SignOut,
  SlidersHorizontal,
  Smiley,
  Sparkle,
  SpeakerHigh,
  Timer,
  TreeEvergreen,
  User,
  Waves,
  Wind,
} from "@phosphor-icons/react";
import {
  BottomSheet,
  Carousel,
  KeyboardInput,
  KeyboardTextarea,
  MobileScroll,
  useKeyboard,
} from "./mobile";

type Route =
  | "splash"
  | "login"
  | "home"
  | "meditation"
  | "meditation-player"
  | "focus"
  | "sleep"
  | "sleep-player"
  | "breathe"
  | "awareness"
  | "emotion-select"
  | "emotion-need"
  | "recommendation"
  | "emotion-space"
  | "journal-editor"
  | "article"
  | "profile"
  | "settings";

type Tab = "home" | "awareness" | "profile";

type Mood = {
  id: string;
  label: string;
  note: string;
  icon: ReactNode;
};

type Practice = {
  id: "meditation" | "focus" | "sleep" | "breathe";
  title: string;
  subtitle: string;
  meta: string;
  icon: ReactNode;
  image?: string;
  tone: "forest" | "sage" | "night" | "clay";
};

const appAsset = (filename: string) => `${import.meta.env.BASE_URL}assets/app/${filename}`;

const validRoutes = new Set<Route>([
  "splash",
  "login",
  "home",
  "meditation",
  "meditation-player",
  "focus",
  "sleep",
  "sleep-player",
  "breathe",
  "awareness",
  "emotion-select",
  "emotion-need",
  "recommendation",
  "emotion-space",
  "journal-editor",
  "article",
  "profile",
  "settings",
]);

const moods: Mood[] = [
  { id: "steady", label: "还不错", note: "此刻很安稳", icon: <Smiley size={22} weight="regular" /> },
  { id: "anxious", label: "有点焦虑", note: "思绪有些拥挤", icon: <CloudRain size={22} weight="regular" /> },
  { id: "tired", label: "有些疲惫", note: "身体想要休息", icon: <MoonStars size={22} weight="regular" /> },
];

const practices: Practice[] = [
  {
    id: "meditation",
    title: "冥想",
    subtitle: "安住当下",
    meta: "10 分钟",
    icon: <FlowerLotus size={22} />,
    image: appAsset("forest-mist.jpg"),
    tone: "forest",
  },
  {
    id: "focus",
    title: "专注",
    subtitle: "留一段安静",
    meta: "25 分钟",
    icon: <Timer size={22} />,
    tone: "sage",
  },
  {
    id: "sleep",
    title: "睡眠",
    subtitle: "慢慢沉下去",
    meta: "今晚",
    icon: <Moon size={22} />,
    image: appAsset("night-mountain.jpg"),
    tone: "night",
  },
  {
    id: "breathe",
    title: "呼吸",
    subtitle: "回到身体",
    meta: "3 分钟",
    icon: <Wind size={22} />,
    tone: "clay",
  },
];

const sleepSessions = [
  {
    title: "湖边的晚风",
    meta: "18 分钟 · 睡前放松",
    image: appAsset("lake-evening.jpg"),
  },
  {
    title: "向山谷说晚安",
    meta: "12 分钟 · 呼吸引导",
    image: appAsset("mountain-air.jpg"),
  },
];

const meditationTopics = [
  {
    title: "新手入门",
    note: "从三分钟开始",
    icon: <Leaf size={20} />,
    tone: "sage",
  },
  {
    title: "睡个好觉",
    note: "把今天放下",
    icon: <Bed size={21} />,
    image: appAsset("night-mountain.jpg"),
    tone: "night",
  },
  {
    title: "减压放松",
    note: "松开身体和思绪",
    icon: <Wind size={20} />,
    image: appAsset("forest-mist.jpg"),
    tone: "forest",
  },
  {
    title: "情绪调节",
    note: "给感受留空间",
    icon: <Heart size={20} />,
    tone: "clay",
  },
] as const;

const emotionOptions = [
  { title: "焦虑不安", note: "心里悬着，难以放松", icon: <Waves size={20} /> },
  { title: "低落难过", note: "提不起精神，想安静一会儿", icon: <CloudRain size={20} /> },
  { title: "疲惫耗竭", note: "身体和思绪都很累", icon: <Bed size={20} /> },
  { title: "烦躁紧张", note: "很容易被周围影响", icon: <Wind size={20} /> },
  { title: "状态还不错", note: "想继续照顾这份平静", icon: <Smiley size={20} /> },
];

const needOptions = ["平静下来", "提振精神", "理清思绪", "好好休息"];

const journalEntries = [
  {
    title: "平凡日子里的小确幸",
    text: "今天的阳光很好，路边的树叶在风里轻轻晃动。买到一杯喜欢的饮料，听着熟悉的音乐，心情也慢慢松下来。",
    tone: "sage",
  },
  {
    title: "为自己的一点进步开心",
    text: "完成了一件之前一直拖延的小事。虽然过程没有想象中顺利，但还是坚持做完了，值得为自己开心。",
    tone: "clay",
  },
  {
    title: "允许自己慢慢来",
    text: "今天没有安排很多任务，而是按照自己的节奏做事。慢一点，也没有关系。",
    tone: "paper",
  },
] as const;

const breathPhases = [
  { label: "吸气", cue: "让空气缓缓进入", seconds: 4 },
  { label: "停留", cue: "轻轻停留在这一刻", seconds: 2 },
  { label: "呼气", cue: "把紧绷慢慢放下", seconds: 6 },
] as const;

const totalPracticeSeconds = 3 * 60;

function getInitialRoute(): Route {
  if (typeof window === "undefined") return "home";
  const screen = new URLSearchParams(window.location.search).get("screen");
  if (screen && validRoutes.has(screen as Route)) return screen as Route;
  return window.sessionStorage.getItem("moment-authenticated") === "1" ? "home" : "splash";
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

export default function Prototype() {
  const [route, setRoute] = useState<Route>(getInitialRoute);
  const [notice, setNotice] = useState("");
  const [selectedMood, setSelectedMood] = useState("steady");
  const [breathReturn, setBreathReturn] = useState<Route>("home");
  const [recommendationReturn, setRecommendationReturn] = useState<Route>("home");

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 2200);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  useEffect(() => {
    if (route !== "splash") return;
    const timeout = window.setTimeout(() => setRoute("login"), 1300);
    return () => window.clearTimeout(timeout);
  }, [route]);

  const navigate = (next: Route) => {
    setNotice("");
    setRoute(next);
  };

  const handleTab = (tab: Tab) => {
    navigate(tab);
  };

  const openPractice = (id: Practice["id"]) => {
    const destinations: Record<Practice["id"], Route> = {
      meditation: "meditation",
      focus: "focus",
      sleep: "sleep",
      breathe: "breathe",
    };
    if (id === "breathe") setBreathReturn("home");
    navigate(destinations[id]);
  };

  const openRecommendation = (from: Route) => {
    setRecommendationReturn(from);
    navigate("recommendation");
  };

  const openBreathing = (from: Route) => {
    setBreathReturn(from);
    navigate("breathe");
  };

  const completeLogin = () => {
    window.sessionStorage.setItem("moment-authenticated", "1");
    navigate("home");
  };

  const logout = () => {
    window.sessionStorage.removeItem("moment-authenticated");
    navigate("login");
  };

  const screen = (() => {
    switch (route) {
      case "splash":
        return <SplashScreen onEnter={completeLogin} />;
      case "login":
        return <LoginScreen onLogin={completeLogin} onNotify={setNotice} />;
      case "home":
        return (
          <HomeScreen
            selectedMood={selectedMood}
            onSelectMood={setSelectedMood}
            onPractice={openPractice}
            onRecommendation={() => openRecommendation("home")}
            onMeditation={() => navigate("meditation")}
            onSleepPlayer={() => navigate("sleep-player")}
            onNotify={setNotice}
          />
        );
      case "meditation":
        return (
          <MeditationScreen
            onBack={() => navigate("home")}
            onStart={() => navigate("meditation-player")}
            onNotify={setNotice}
          />
        );
      case "meditation-player":
        return (
          <ImmersivePlayer
            title="10 分钟轻冥想"
            subtitle="把注意力带回呼吸"
            image={appAsset("forest-mist.jpg")}
            duration={10 * 60}
            onBack={() => navigate("meditation")}
            onFinish={() => setNotice("今天的冥想练习已完成")}
          />
        );
      case "focus":
        return <FocusScreen onBack={() => navigate("home")} />;
      case "sleep":
        return (
          <SleepScreen
            onBack={() => navigate("home")}
            onStart={() => navigate("sleep-player")}
            onNotify={setNotice}
          />
        );
      case "sleep-player":
        return (
          <ImmersivePlayer
            title="睡前放松"
            subtitle="舒缓疲劳，放松四肢"
            image={appAsset("lake-evening.jpg")}
            duration={18 * 60}
            onBack={() => navigate("sleep")}
            onFinish={() => setNotice("今晚的睡前练习已完成")}
            favorite
          />
        );
      case "breathe":
        return <BreathingScreen onBack={() => navigate(breathReturn)} />;
      case "awareness":
        return (
          <AwarenessScreen
            onRecord={() => navigate("emotion-select")}
            onSpace={() => navigate("emotion-space")}
            onArticle={() => navigate("article")}
            onNotify={setNotice}
          />
        );
      case "emotion-select":
        return (
          <EmotionSelectScreen
            onBack={() => navigate("awareness")}
            onContinue={() => navigate("emotion-need")}
          />
        );
      case "emotion-need":
        return (
          <EmotionNeedScreen
            onBack={() => navigate("emotion-select")}
            onContinue={() => openRecommendation("emotion-need")}
          />
        );
      case "recommendation":
        return (
          <RecommendationScreen
            onBack={() => navigate(recommendationReturn)}
            onStart={() => openBreathing("recommendation")}
            onAlternative={() => openBreathing("recommendation")}
          />
        );
      case "emotion-space":
        return (
          <EmotionSpaceScreen
            onBack={() => navigate("awareness")}
            onEdit={() => navigate("journal-editor")}
            onNotify={setNotice}
          />
        );
      case "journal-editor":
        return (
          <JournalEditorScreen
            onBack={() => navigate("emotion-space")}
            onSave={() => {
              setNotice("今天的感受已保存");
              navigate("emotion-space");
            }}
          />
        );
      case "article":
        return (
          <ArticleScreen
            onBack={() => navigate("awareness")}
            onNotify={setNotice}
          />
        );
      case "profile":
        return (
          <ProfileScreen
            onSettings={() => navigate("settings")}
            onNotify={setNotice}
          />
        );
      case "settings":
        return (
          <SettingsScreen
            onBack={() => navigate("profile")}
            onNotify={setNotice}
            onLogout={logout}
          />
        );
    }
  })();

  const activeTab: Tab =
    route === "awareness" || route === "emotion-space"
      ? "awareness"
      : route === "profile" || route === "settings"
        ? "profile"
        : "home";
  const showBottomNav = route === "home" || route === "awareness" || route === "profile";

  return (
    <div className="app-shell">
      <div className="route-stage" key={route}>
        {screen}
      </div>
      {showBottomNav ? <BottomNav active={activeTab} onSelect={handleTab} /> : null}
      {notice ? (
        <div className="app-notice" role="status" aria-live="polite">
          <Leaf size={17} weight="fill" />
          <span>{notice}</span>
        </div>
      ) : null}
    </div>
  );
}

function SplashScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <MobileScroll className="app-screen splash-screen">
      <main className="splash-content">
        <button className="splash-mark" type="button" onClick={onEnter} aria-label="进入此刻">
          <FlowerLotus size={44} weight="thin" />
        </button>
        <div className="splash-brand">
          <p>MOMENT OF STILLNESS</p>
          <h1>此刻</h1>
          <span>给自己一个呼吸的间隙</span>
        </div>
        <div className="splash-footer">
          <span>慢下来，才能听见自己</span>
          <ArrowRight size={18} />
        </div>
      </main>
    </MobileScroll>
  );
}

function LoginScreen({
  onLogin,
  onNotify,
}: {
  onLogin: () => void;
  onNotify: (message: string) => void;
}) {
  return (
    <MobileScroll className="app-screen login-screen">
      <main className="login-content">
        <div className="login-visual">
          <img src={appAsset("mountain-air.jpg")} alt="山谷与湖水" />
          <span className="login-brand">此刻</span>
          <div>
            <p className="eyebrow">欢迎回来</p>
            <h1>HI，欢迎来到此刻</h1>
          </div>
        </div>
        <section className="login-panel" aria-labelledby="login-title">
          <p className="eyebrow">从一次深呼吸开始</p>
          <h2 id="login-title">留一点时间给自己</h2>
          <p className="login-copy">记录情绪、练习呼吸，也允许自己在忙碌里停一会儿。</p>
          <button className="primary-button" type="button" onClick={onLogin}>
            登录
          </button>
          <button
            className="secondary-button"
            type="button"
            onClick={() => onNotify("注册流程将在正式版本中开放")}
          >
            注册
          </button>
          <div className="login-divider">
            <span>其他登录方式</span>
          </div>
          <div className="social-login-row">
            <button type="button" onClick={() => onNotify("微信登录将在正式版本中开放")}>
              <ChatCircleDots size={20} />
              <span>微信</span>
            </button>
            <button type="button" onClick={() => onNotify("QQ 登录将在正式版本中开放")}>
              <User size={20} />
              <span>QQ</span>
            </button>
          </div>
        </section>
      </main>
    </MobileScroll>
  );
}

function HomeScreen({
  selectedMood,
  onSelectMood,
  onPractice,
  onRecommendation,
  onMeditation,
  onSleepPlayer,
  onNotify,
}: {
  selectedMood: string;
  onSelectMood: (id: string) => void;
  onPractice: (id: Practice["id"]) => void;
  onRecommendation: () => void;
  onMeditation: () => void;
  onSleepPlayer: () => void;
  onNotify: (message: string) => void;
}) {
  const selectedMoodData = moods.find((mood) => mood.id === selectedMood) ?? moods[0];

  return (
    <MobileScroll className="app-screen home-screen">
      <main className="home-content">
        <header className="home-header">
          <div>
            <p className="eyebrow">十月二十一日 · 星期二</p>
            <h1>下午好，JACK</h1>
          </div>
          <button
            className="round-icon-button"
            type="button"
            aria-label="搜索练习"
            onClick={() => onNotify("搜索功能将在正式版本中开放")}
          >
            <MagnifyingGlass size={21} weight="bold" />
          </button>
        </header>

        <section className="mood-section" aria-labelledby="mood-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">此刻的你</p>
              <h2 id="mood-title">感觉怎么样？</h2>
            </div>
            <span className="micro-copy">无需评判</span>
          </div>
          <p className="mood-intro">先照顾眼前的感觉，再决定要去哪里。</p>
          <div className="mood-row" role="group" aria-label="选择此刻的情绪">
            {moods.map((mood) => {
              const active = mood.id === selectedMood;
              return (
                <button
                  key={mood.id}
                  className="mood-option"
                  type="button"
                  data-active={active}
                  aria-pressed={active}
                  onClick={() => onSelectMood(mood.id)}
                >
                  <span className="mood-icon">{mood.icon}</span>
                  <span className="mood-label">{mood.label}</span>
                </button>
              );
            })}
          </div>
          <div className="mood-response">
            <span>{selectedMoodData.note}，为你留了一段安静时间。</span>
            <button type="button" className="text-action" onClick={onRecommendation}>
              看看推荐 <CaretRight size={14} weight="bold" />
            </button>
          </div>
        </section>

        <section className="practice-section" aria-labelledby="practice-title">
          <SectionHeading
            eyebrow="给自己一点时间"
            title="探索练习"
            action="全部"
            onAction={onMeditation}
          />
          <div className="practice-grid">
            {practices.map((practice) => (
              <button
                className="practice-tile"
                data-tone={practice.tone}
                key={practice.id}
                type="button"
                onClick={() => onPractice(practice.id)}
              >
                {practice.image ? (
                  <img className="practice-image" src={practice.image} alt="" aria-hidden="true" />
                ) : null}
                <span className="practice-topline">
                  <span className="practice-icon">{practice.icon}</span>
                  <span className="practice-meta">{practice.meta}</span>
                </span>
                <span className="practice-copy">
                  <strong>{practice.title}</strong>
                  <span>{practice.subtitle}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="sleep-section" aria-labelledby="sleep-title">
          <SectionHeading
            eyebrow="把今天轻轻放下"
            title="今晚，慢慢睡去"
            action="睡眠"
            onAction={() => onPractice("sleep")}
          />
          <Carousel
            ariaLabel="睡前练习"
            className="sleep-carousel"
            contentClassName="sleep-carousel-track"
          >
            {sleepSessions.map((session) => (
              <button
                className="sleep-card"
                type="button"
                key={session.title}
                onClick={onSleepPlayer}
              >
                <img src={session.image} alt="" aria-hidden="true" />
                <span className="sleep-card-copy">
                  <strong>{session.title}</strong>
                  <span>{session.meta}</span>
                </span>
                <span className="sleep-play">
                  <Play size={17} weight="fill" />
                </span>
              </button>
            ))}
          </Carousel>
        </section>

        <p className="home-footnote">
          你不必立刻变好
          <span aria-hidden="true"> · </span>
          只需要在这里待一会儿
        </p>
      </main>
    </MobileScroll>
  );
}

function MeditationScreen({
  onBack,
  onStart,
  onNotify,
}: {
  onBack: () => void;
  onStart: () => void;
  onNotify: (message: string) => void;
}) {
  return (
    <MobileScroll className="app-screen detail-screen">
      <main className="detail-content">
        <DetailHeader title="冥想" onBack={onBack} />
        <button className="meditation-feature" type="button" onClick={onStart}>
          <img src={appAsset("forest-mist.jpg")} alt="晨雾中的树林" />
          <span className="feature-overlay" />
          <span className="feature-copy">
            <span className="hero-kicker">今日推荐 · 10 分钟</span>
            <strong>把一天慢下来</strong>
            <small>跟随声音，回到呼吸</small>
          </span>
          <span className="feature-play">
            <Play size={20} weight="fill" />
          </span>
        </button>

        <section className="content-section">
          <SectionHeading eyebrow="此刻需要什么" title="为什么而出发" />
          <div className="topic-grid">
            {meditationTopics.map((topic) => (
              <button
                key={topic.title}
                type="button"
                className="topic-card"
                data-tone={topic.tone}
                onClick={() => onNotify(`${topic.title}系列将在完整内容中开放`)}
              >
                {"image" in topic ? (
                  <img src={topic.image} alt="" aria-hidden="true" />
                ) : null}
                <span className="topic-icon">{topic.icon}</span>
                <span>
                  <strong>{topic.title}</strong>
                  <small>{topic.note}</small>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="content-section">
          <SectionHeading eyebrow="让练习更具体" title="练习工具" />
          <div className="tool-grid">
            <button type="button" onClick={() => onNotify("呼吸法已可在首页体验")}>
              <Wind size={22} />
              <span>呼吸法</span>
            </button>
            <button type="button" onClick={() => onNotify("自由练习计时器已准备")}>
              <Timer size={22} />
              <span>自由练习</span>
            </button>
            <button type="button" onClick={() => onNotify("冥想报告将在完成练习后更新")}>
              <ChartBar size={22} />
              <span>冥想报告</span>
            </button>
          </div>
        </section>

        <section className="content-section">
          <SectionHeading eyebrow="适合现在" title="更多练习" />
          <div className="session-list">
            {[
              ["晨间清醒", "5 分钟 · 轻柔唤醒"],
              ["松开肩颈", "8 分钟 · 身体扫描"],
              ["把心放慢", "12 分钟 · 静坐冥想"],
            ].map(([title, meta], index) => (
              <button key={title} type="button" onClick={onStart} className="session-row">
                <span className="session-index">0{index + 1}</span>
                <span>
                  <strong>{title}</strong>
                  <small>{meta}</small>
                </span>
                <Play size={16} weight="fill" />
              </button>
            ))}
          </div>
        </section>
      </main>
    </MobileScroll>
  );
}

function FocusScreen({ onBack }: { onBack: () => void }) {
  const [duration, setDuration] = useState(10 * 60);
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [scene, setScene] = useState("雨林");
  const [mode, setMode] = useState("倒计时");

  useEffect(() => {
    setRemaining(duration);
    setRunning(false);
  }, [duration]);

  useEffect(() => {
    if (!running || remaining === 0) return;
    const interval = window.setInterval(() => {
      setRemaining((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running, remaining]);

  useEffect(() => {
    if (remaining === 0) setRunning(false);
  }, [remaining]);

  const progress = 360 - (remaining / Math.max(duration, 1)) * 360;
  const ringStyle = { "--focus-angle": `${progress}deg` } as CSSProperties;

  return (
    <>
      <MobileScroll className="app-screen focus-screen">
        <main className="focus-content">
          <DetailHeader title="专注" onBack={onBack} />
          <div className="focus-clock">
            <p className="eyebrow">{running ? "保持此刻" : "准备好后开始"}</p>
            <strong>{formatTime(remaining)}</strong>
          </div>
          <div className="focus-ring" style={ringStyle}>
            <div>
              <Timer size={34} weight="light" />
              <span>{running ? "专注进行中" : "留一段安静"}</span>
            </div>
          </div>
          <div className="focus-controls">
            <button
              className="focus-main-button"
              type="button"
              onClick={() => setRunning((current) => !current)}
            >
              {running ? <Pause size={20} weight="fill" /> : <Play size={20} weight="fill" />}
              {running ? "暂停" : "开始专注"}
            </button>
            <button
              className="focus-reset-button"
              type="button"
              aria-label="重置专注计时"
              onClick={() => {
                setRemaining(duration);
                setRunning(false);
              }}
            >
              <ArrowCounterClockwise size={21} />
            </button>
          </div>
          <button
            className="focus-settings-pill"
            type="button"
            onClick={() => setSheetOpen(true)}
          >
            <Clock size={18} />
            <span>{mode}</span>
            <span className="pill-separator" />
            <SpeakerHigh size={18} />
            <span>{scene}</span>
            <SlidersHorizontal size={18} />
          </button>
        </main>
      </MobileScroll>
      <BottomSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="专注"
        description="设置一段不被打扰的时间"
        snap={0.72}
      >
        <div className="sheet-choice-row" role="group" aria-label="专注时长">
          {[10, 25, 45].map((minutes) => (
            <button
              key={minutes}
              type="button"
              data-active={duration === minutes * 60}
              onClick={() => setDuration(minutes * 60)}
            >
              {minutes} 分钟
            </button>
          ))}
        </div>
        <div className="scene-setting" role="group" aria-label="专注场景">
          {[
            ["雨林", <TreeEvergreen size={21} />, "rain"],
            ["海浪", <Waves size={21} />, "waves"],
            ["安静", <Coffee size={21} />, "silent"],
          ].map(([label, icon, key]) => (
            <button
              key={String(key)}
              type="button"
              data-active={scene === label}
              onClick={() => setScene(String(label))}
            >
              {icon}
              <span>{label}</span>
              <small>{label === "雨林" ? "沉浸自然" : label === "海浪" ? "缓慢起伏" : "无背景音"}</small>
            </button>
          ))}
        </div>
        <div className="sheet-mode-row">
          {["倒计时", "正计时"].map((item) => (
            <button key={item} type="button" data-active={mode === item} onClick={() => setMode(item)}>
              {item}
            </button>
          ))}
        </div>
        <button
          className="primary-button sheet-primary"
          type="button"
          onClick={() => {
            setSheetOpen(false);
            setRunning(true);
          }}
        >
          开始专注
        </button>
      </BottomSheet>
    </>
  );
}

function SleepScreen({
  onBack,
  onStart,
  onNotify,
}: {
  onBack: () => void;
  onStart: () => void;
  onNotify: (message: string) => void;
}) {
  const [favorite, setFavorite] = useState(false);

  return (
    <MobileScroll className="app-screen detail-screen">
      <main className="detail-content">
        <DetailHeader
          title="睡眠"
          onBack={onBack}
          right={
            <div className="header-action-group">
              <button type="button" aria-label="收藏睡眠内容" onClick={() => setFavorite((value) => !value)}>
                <Heart size={21} weight={favorite ? "fill" : "regular"} />
              </button>
              <button type="button" aria-label="睡眠报告" onClick={() => onNotify("今晚尚未生成睡眠报告")}>
                <Clock size={21} />
              </button>
            </div>
          }
        />
        <button className="sleep-feature" type="button" onClick={onStart}>
          <img src={appAsset("night-mountain.jpg")} alt="星空下的雪山" />
          <span className="feature-overlay" />
          <span className="sleep-feature-copy">
            <small>今晚的睡前时光</small>
            <strong>睡前放松</strong>
            <span>10 分钟 · 舒缓身体</span>
          </span>
          <span className="sleep-feature-play">
            <Play size={19} weight="fill" />
          </span>
        </button>

        <section className="content-section">
          <SectionHeading eyebrow="让房间安静下来" title="助眠声音" action="更多" onAction={() => onNotify("更多声音将在完整版中开放")} />
          <Carousel ariaLabel="助眠声音" className="sound-carousel" contentClassName="sound-carousel-track">
            {[
              ["海浪", <Waves size={22} />],
              ["雨林", <CloudRain size={22} />],
              ["森林", <TreeEvergreen size={22} />],
              ["晚风", <Wind size={22} />],
            ].map(([label, icon]) => (
              <button key={String(label)} type="button" className="sound-card" onClick={() => onNotify(`${label}声音已准备`)}>
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </Carousel>
        </section>

        <section className="content-section">
          <SectionHeading eyebrow="听一个温柔的故事" title="睡眠故事" />
          <Carousel ariaLabel="睡眠故事" className="story-carousel" contentClassName="story-carousel-track">
            {[
              ["清迈的日与夜", "20 分钟", appAsset("lake-evening.jpg")],
              ["日落的海边", "20 分钟", appAsset("mountain-air.jpg")],
              ["白日的梦想", "20 分钟", appAsset("night-mountain.jpg")],
            ].map(([title, time, image]) => (
              <button key={title} className="story-card" type="button" onClick={onStart}>
                <img src={image} alt="" aria-hidden="true" />
                <span>
                  <strong>{title}</strong>
                  <small>{time}</small>
                </span>
              </button>
            ))}
          </Carousel>
        </section>
      </main>
    </MobileScroll>
  );
}

function ImmersivePlayer({
  title,
  subtitle,
  image,
  duration,
  onBack,
  onFinish,
  favorite = false,
}: {
  title: string;
  subtitle: string;
  image: string;
  duration: number;
  onBack: () => void;
  onFinish: () => void;
  favorite?: boolean;
}) {
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!running || remaining === 0) return;
    const interval = window.setInterval(() => setRemaining((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [running, remaining]);

  useEffect(() => {
    if (remaining === 0) onFinish();
  }, [remaining, onFinish]);

  const progress = ((duration - remaining) / duration) * 100;

  return (
    <MobileScroll className="app-screen player-screen">
      <main className="player-content">
        <img className="player-background" src={image} alt="" aria-hidden="true" />
        <span className="player-shade" />
        <header className="player-header">
          <button type="button" onClick={onBack} aria-label="返回">
            <ArrowLeft size={22} weight="bold" />
          </button>
          <button type="button" aria-label="更多选项">
            <DotsThree size={24} weight="bold" />
          </button>
        </header>
        <div className="player-center">
          <span className="player-kicker">此刻 · 沉浸练习</span>
          <h1>{title}</h1>
          <strong>{formatTime(remaining)}</strong>
          <p>{running ? subtitle : "按自己的节奏，准备好了再继续"}</p>
        </div>
        <div className="player-bottom">
          <div className="player-caption">
            <div>
              <strong>{title}</strong>
              <span>{subtitle}</span>
            </div>
            <button
              type="button"
              aria-label={liked ? "取消收藏" : "收藏练习"}
              data-liked={liked}
              onClick={() => setLiked((value) => !value)}
            >
              <Heart size={22} weight={liked || favorite ? "fill" : "regular"} />
            </button>
          </div>
          <div className="player-progress" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="player-controls">
            <button type="button" onClick={() => setRemaining(duration)} aria-label="重新开始">
              <ArrowCounterClockwise size={21} />
            </button>
            <button className="player-pause" type="button" onClick={() => setRunning((value) => !value)}>
              {running ? <Pause size={22} weight="fill" /> : <Play size={22} weight="fill" />}
            </button>
            <button type="button" onClick={onBack} aria-label="结束练习">
              <Check size={21} weight="bold" />
            </button>
          </div>
        </div>
      </main>
    </MobileScroll>
  );
}

function BreathingScreen({ onBack }: { onBack: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);

  const phasePosition = elapsed % 12;
  const phaseIndex = phasePosition < 4 ? 0 : phasePosition < 6 ? 1 : 2;
  const phase = breathPhases[phaseIndex];
  const remaining = Math.max(0, totalPracticeSeconds - elapsed);
  const sessionProgress = Math.min(100, (elapsed / totalPracticeSeconds) * 100);

  useEffect(() => {
    if (!running || remaining === 0) return;
    const interval = window.setInterval(() => {
      setElapsed((current) => Math.min(totalPracticeSeconds, current + 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running, remaining]);

  useEffect(() => {
    if (remaining === 0) setRunning(false);
  }, [remaining]);

  const orbStyle = useMemo(
    () => ({ "--phase-duration": `${phase.seconds}s` }) as CSSProperties,
    [phase.seconds],
  );

  return (
    <MobileScroll className="app-screen breathing-screen">
      <main className="breathing-content">
        <DetailHeader
          title="回到当下"
          subtitle="3 分钟呼吸练习"
          onBack={onBack}
        />
        <section className="breathing-hero" aria-label="呼吸练习氛围图">
          <img src={appAsset("forest-mist.jpg")} alt="晨雾中的安静树林" />
          <div className="breathing-hero-copy">
            <span className="hero-kicker">4 · 2 · 6 呼吸法</span>
            <p>
              把注意力带回身体，
              <br />
              让呼吸自己慢下来。
            </p>
          </div>
        </section>
        <section className="breathing-stage" aria-labelledby="breathe-title">
          <div className="stage-heading">
            <p className="eyebrow">跟随节奏</p>
            <h2 id="breathe-title">慢慢吸气，慢慢呼气</h2>
          </div>
          <div
            className="breathing-orb"
            data-phase={phaseIndex === 0 ? "inhale" : phaseIndex === 1 ? "hold" : "exhale"}
            data-running={running}
            style={orbStyle}
            aria-live="polite"
          >
            <span className="orb-ring orb-ring-one" aria-hidden="true" />
            <span className="orb-ring orb-ring-two" aria-hidden="true" />
            <span className="orb-core">
              <strong>{remaining === 0 ? "完成" : phase.label}</strong>
              <span>{remaining === 0 ? "谢谢你回到此刻" : phase.cue}</span>
            </span>
          </div>
          <div className="phase-guide" aria-label="呼吸节奏">
            {breathPhases.map((item, index) => (
              <span key={item.label} data-active={index === phaseIndex}>
                <i>{index + 1}</i>
                {item.label}
                <small>{item.seconds}s</small>
              </span>
            ))}
          </div>
          <div className="session-time">
            <span>本次练习</span>
            <strong>{formatTime(remaining)}</strong>
            <span>剩余</span>
          </div>
          <div className="session-progress" aria-hidden="true">
            <span style={{ width: `${sessionProgress}%` }} />
          </div>
          <div className="breathing-controls">
            <button
              className="breathing-primary"
              type="button"
              onClick={() => setRunning((current) => !current)}
              disabled={remaining === 0}
            >
              {running ? <Pause size={19} weight="fill" /> : <Play size={19} weight="fill" />}
              {running ? "暂停一下" : "继续练习"}
            </button>
            <button
              className="breathing-restart"
              type="button"
              onClick={() => {
                setElapsed(0);
                setRunning(true);
              }}
            >
              <ArrowCounterClockwise size={19} weight="bold" />
              重新开始
            </button>
          </div>
        </section>
        <aside className="breathing-note">
          <Leaf size={19} weight="fill" />
          <p>如果中途走神，不需要责怪自己。发现走神，就是一次温柔的回来。</p>
        </aside>
      </main>
    </MobileScroll>
  );
}

function AwarenessScreen({
  onRecord,
  onSpace,
  onArticle,
  onNotify,
}: {
  onRecord: () => void;
  onSpace: () => void;
  onArticle: () => void;
  onNotify: (message: string) => void;
}) {
  return (
    <MobileScroll className="app-screen awareness-screen">
      <main className="main-content awareness-content">
        <header className="main-title-header">
          <div>
            <p className="eyebrow">觉察 · 给情绪一点空间</p>
            <h1>情绪日记</h1>
          </div>
          <button className="soft-pill-button" type="button" onClick={onSpace}>
            情绪空间
          </button>
        </header>

        <section className="emotion-entry-card">
          <div className="emotion-entry-copy">
            <span>2026 年 10 月 21 日</span>
            <h2>今天的你，还好吗？</h2>
            <p>不用急着解决所有问题，先记录此刻真实的感受。</p>
          </div>
          <img src={appAsset("forest-mist.jpg")} alt="" aria-hidden="true" />
          <button type="button" onClick={onRecord}>
            <PencilSimple size={18} />
            记录此刻
          </button>
        </section>

        <section className="content-section awareness-insights">
          <SectionHeading
            eyebrow="最近七天"
            title="近期情绪"
            action="查看分析"
            onAction={() => onNotify("更详细的分析将在持续记录后生成")}
          />
          <div className="insight-layout">
            <div className="week-chart" aria-label="最近七天情绪波动">
              {[42, 61, 51, 55, 48, 72, 66].map((value, index) => (
                <span key={index}>
                  <i style={{ height: `${value}%` }} />
                  <small>{"MTWTFSS"[index]}</small>
                </span>
              ))}
            </div>
            <div className="emotion-scores">
              {[
                ["平静指数", 85],
                ["低落指数", 15],
                ["焦虑指数", 55],
                ["疲惫指数", 25],
              ].map(([label, value]) => (
                <span key={String(label)}>
                  {label}
                  <b>{value}</b>
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="content-section">
          <SectionHeading eyebrow="读一点，停一下" title="暂停一下" />
          <div className="article-list">
            <button type="button" className="article-row" onClick={onArticle}>
              <img src={appAsset("forest-mist.jpg")} alt="" aria-hidden="true" />
              <span>
                <strong>情绪内耗，是因为你的“超我”太强大了</strong>
                <small>弗洛伊德心理学 · 6 分钟阅读</small>
              </span>
              <CaretRight size={17} />
            </button>
            <button type="button" className="article-row" onClick={onArticle}>
              <img src={appAsset("lake-evening.jpg")} alt="" aria-hidden="true" />
              <span>
                <strong>允许自己慢下来，也是一种前进</strong>
                <small>日常觉察 · 4 分钟阅读</small>
              </span>
              <CaretRight size={17} />
            </button>
          </div>
        </section>
      </main>
    </MobileScroll>
  );
}

function EmotionSelectScreen({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  const [selected, setSelected] = useState(0);
  return (
    <MobileScroll className="app-screen guided-screen">
      <main className="guided-content">
        <StepHeader step="1 / 2" title="觉察" onBack={onBack} />
        <div className="guided-intro">
          <p className="eyebrow">没有对错</p>
          <h1>此刻的你，感觉怎么样？</h1>
          <p>选择最接近你现在感受的状态。</p>
        </div>
        <div className="emotion-option-list" role="group" aria-label="选择情绪">
          {emotionOptions.map((option, index) => (
            <button
              key={option.title}
              type="button"
              data-active={selected === index}
              onClick={() => setSelected(index)}
            >
              <span className="option-icon">{option.icon}</span>
              <span>
                <strong>{option.title}</strong>
                <small>{option.note}</small>
              </span>
              <span className="option-check">
                {selected === index ? <Check size={16} weight="bold" /> : null}
              </span>
            </button>
          ))}
        </div>
        <button className="primary-button guided-primary" type="button" onClick={onContinue}>
          下一步
        </button>
      </main>
    </MobileScroll>
  );
}

function EmotionNeedScreen({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  const [need, setNeed] = useState("平静下来");
  const [intensity, setIntensity] = useState(48);
  return (
    <MobileScroll className="app-screen guided-screen">
      <main className="guided-content">
        <StepHeader step="2 / 2" title="照顾自己" onBack={onBack} />
        <div className="guided-intro">
          <p className="eyebrow">再靠近自己一点</p>
          <h1>你现在最需要什么？</h1>
          <p>不用解决所有问题，先照顾眼前的需要。</p>
        </div>
        <div className="need-option-list" role="group" aria-label="选择此刻的需要">
          {needOptions.map((option) => (
            <button
              key={option}
              type="button"
              data-active={need === option}
              onClick={() => setNeed(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <section className="intensity-section">
          <div>
            <h2>这种感受有多强烈？</h2>
            <span>{intensity < 35 ? "有一点" : intensity < 70 ? "比较明显" : "非常强烈"}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={intensity}
            aria-label="感受强度"
            onChange={(event) => setIntensity(Number(event.target.value))}
          />
          <div className="range-labels">
            <span>有一点</span>
            <span>非常强烈</span>
          </div>
        </section>
        <button className="primary-button guided-primary" type="button" onClick={onContinue}>
          查看适合我的练习
        </button>
        <button className="text-skip" type="button" onClick={onContinue}>
          跳过，直接推荐
        </button>
      </main>
    </MobileScroll>
  );
}

function RecommendationScreen({
  onBack,
  onStart,
  onAlternative,
}: {
  onBack: () => void;
  onStart: () => void;
  onAlternative: () => void;
}) {
  return (
    <MobileScroll className="app-screen detail-screen recommendation-screen">
      <main className="detail-content">
        <DetailHeader title="推荐练习" onBack={onBack} />
        <div className="recommendation-note">
          <Sparkle size={18} weight="fill" />
          根据你此刻的感受，为你留了一段温柔的练习
        </div>
        <button className="recommendation-card" type="button" onClick={onStart}>
          <img src={appAsset("forest-mist.jpg")} alt="安静的森林" />
          <span className="feature-overlay" />
          <span className="recommendation-card-copy">
            <small>呼吸引导 · 5 分钟 · 初学者适用</small>
            <strong>温柔的回到当下</strong>
            <span>先把注意力带回身体，再慢慢松开思绪。</span>
          </span>
        </button>
        <button className="primary-button recommendation-primary" type="button" onClick={onStart}>
          <Play size={18} weight="fill" />
          开始练习
        </button>
        <section className="content-section">
          <SectionHeading eyebrow="也可以试试" title="其他推荐" />
          <div className="recommendation-list">
            {[
              ["放松大脑，舒缓身体", "冥想练习 · 8 分钟", <FlowerLotus size={21} />],
              ["听一会儿海浪", "呼吸引导 · 5 分钟", <Waves size={21} />],
            ].map(([title, meta, icon]) => (
              <button key={String(title)} type="button" onClick={onAlternative}>
                <span>{icon}</span>
                <span>
                  <strong>{title}</strong>
                  <small>{meta}</small>
                </span>
                <Play size={16} weight="fill" />
              </button>
            ))}
          </div>
        </section>
      </main>
    </MobileScroll>
  );
}

function EmotionSpaceScreen({
  onBack,
  onEdit,
  onNotify,
}: {
  onBack: () => void;
  onEdit: () => void;
  onNotify: (message: string) => void;
}) {
  return (
    <MobileScroll className="app-screen detail-screen space-screen">
      <main className="detail-content">
        <DetailHeader
          title="情绪空间"
          onBack={onBack}
          right={
            <button type="button" aria-label="新建情绪记录" onClick={onEdit}>
              <Plus size={22} weight="bold" />
            </button>
          }
        />
        <section className="space-hero">
          <span>Hi，这是你的情绪空间</span>
          <p>把感受留在这里，不必急着解释自己。</p>
        </section>
        <div className="space-owner">
          <div>
            <strong>JACK船长</strong>
            <span>记录生活中的小确幸</span>
          </div>
          <span className="avatar-placeholder">
            <User size={30} weight="light" />
          </span>
        </div>
        <div className="journal-list">
          {journalEntries.map((entry) => (
            <button
              type="button"
              key={entry.title}
              className="journal-card"
              data-tone={entry.tone}
              onClick={onEdit}
            >
              <strong>{entry.title}</strong>
              <p>{entry.text}</p>
              <span>10 月 21 日 · 写于下午</span>
            </button>
          ))}
        </div>
        <button className="new-entry-button" type="button" onClick={onEdit}>
          <PenNib size={18} />
          写下今天的感受
        </button>
        <button className="text-skip" type="button" onClick={() => onNotify("更多记录设置将在正式版本中开放")}>
          管理情绪空间
        </button>
      </main>
    </MobileScroll>
  );
}

function JournalEditorScreen({
  onBack,
  onSave,
}: {
  onBack: () => void;
  onSave: () => void;
}) {
  const keyboard = useKeyboard();
  const [title, setTitle] = useState("我的大学生活");
  const [body, setBody] = useState(
    "今天的心情就像多变的天气，早上还有一点紧张，后来在图书馆慢慢找回了节奏。\n\n傍晚和朋友一起吃饭，聊起最近的生活，也发现那些看似普通的小事，其实都在支持着我。\n\n允许自己慢一点，也允许今天只完成一部分。",
  );

  const close = () => {
    keyboard.hide();
    onBack();
  };
  const save = () => {
    keyboard.hide();
    onSave();
  };

  return (
    <MobileScroll className="app-screen editor-screen">
      <main className="editor-content">
        <header className="editor-header">
          <button type="button" onClick={close} aria-label="返回情绪空间">
            <ArrowLeft size={22} weight="bold" />
          </button>
          <span>记录此刻</span>
          <button type="button" onClick={save} aria-label="保存记录">
            <Check size={21} weight="bold" />
          </button>
        </header>
        <section className="editor-paper">
          <KeyboardInput
            className="editor-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-label="日记标题"
          />
          <div className="editor-meta">
            <CalendarBlank size={16} />
            2026 年 10 月 21 日 · 此刻
          </div>
          <KeyboardTextarea
            className="editor-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            aria-label="日记正文"
          />
        </section>
        <div className="editor-toolbar">
          <button type="button" aria-label="撤销">
            <ArrowCounterClockwise size={19} />
          </button>
          <span>{body.length} 字 · 未分类</span>
          <button type="button" aria-label="添加分类">
            <PencilSimple size={19} />
          </button>
        </div>
      </main>
    </MobileScroll>
  );
}

function ArticleScreen({
  onBack,
  onNotify,
}: {
  onBack: () => void;
  onNotify: (message: string) => void;
}) {
  return (
    <MobileScroll className="app-screen article-screen">
      <main className="article-content">
        <DetailHeader
          title="即刻纸条"
          onBack={onBack}
          right={
            <button type="button" aria-label="文章菜单">
              <DotsThree size={23} weight="bold" />
            </button>
          }
        />
        <img className="article-cover" src={appAsset("forest-mist.jpg")} alt="安静的自然风景" />
        <div className="article-heading">
          <span className="article-category">心理文章</span>
          <h1>情绪内耗，是因为你的“超我”太强大了</h1>
          <p>弗洛伊德心理学 · 6 分钟阅读</p>
        </div>
        <article className="article-body">
          <p>
            从弗洛伊德的心理结构来看，人有本我、自我和超我三个部分。它们之间的协调，构成了一个人正常的心理状态。
          </p>
          <p>
            当超我过于严厉，我们可能会不断责备自己，追求完美，压抑真实需求和情感。那些没有说出口的“应该”，会慢慢变成看不见的消耗。
          </p>
          <blockquote>先看见自己的感受，再决定要不要成为更好的自己。</blockquote>
          <p>
            停一会儿，问问自己：这一刻，我真正需要的是什么？也许不是继续用力，而是一次深呼吸，一点诚实的表达，或者允许今天只做到这里。
          </p>
        </article>
        <footer className="article-actions">
          <button type="button" onClick={() => onNotify("已收藏这篇文章")}>
            <Heart size={22} />
            <span>收藏</span>
          </button>
          <button type="button" onClick={() => onNotify("分享链接已准备好")}>
            <ShareNetwork size={22} />
            <span>分享</span>
          </button>
        </footer>
      </main>
    </MobileScroll>
  );
}

function ProfileScreen({
  onSettings,
  onNotify,
}: {
  onSettings: () => void;
  onNotify: (message: string) => void;
}) {
  const [period, setPeriod] = useState("历史");
  return (
    <MobileScroll className="app-screen profile-screen">
      <main className="main-content profile-content">
        <header className="profile-header">
          <div className="profile-identity">
            <span className="profile-avatar">
              <User size={31} weight="light" />
            </span>
            <div>
              <h1>JACK船长</h1>
              <p>陪伴你的第 36 天</p>
            </div>
          </div>
          <div className="header-action-group">
            <button type="button" aria-label="消息" onClick={() => onNotify("暂时没有新消息")}>
              <ChatCircleDots size={21} />
            </button>
            <button type="button" aria-label="更多设置" onClick={onSettings}>
              <GearSix size={21} />
            </button>
          </div>
        </header>

        <section className="profile-stat-panel">
          <div className="profile-stat-heading">
            <div>
              <p className="eyebrow">保持自己的节奏</p>
              <h2>我的练习</h2>
            </div>
            <div className="segmented-control">
              {["历史", "统计"].map((item) => (
                <button key={item} type="button" data-active={period === item} onClick={() => setPeriod(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="profile-chart">
            {[44, 75, 63, 67, 53, 82, 91].map((height, index) => (
              <span key={index}>
                <i style={{ height: `${height}%` }} data-active={index === 6} />
                <small>{["一", "二", "三", "四", "五", "六", "日"][index]}</small>
              </span>
            ))}
          </div>
          <div className="chart-scale">
            <span>0</span>
            <span>3</span>
            <span>6</span>
          </div>
        </section>

        <section className="review-panel">
          <p className="eyebrow">今天的积累</p>
          <h2>今日回顾</h2>
          <div className="review-grid">
            {[
              ["睡眠", "8", "小时", <Bed size={20} />],
              ["专注", "45", "分钟", <Timer size={20} />],
              ["冥想", "30", "分钟", <FlowerLotus size={20} />],
              ["呼吸", "10", "分钟", <Wind size={20} />],
            ].map(([label, value, unit, icon]) => (
              <article key={String(label)}>
                <span>
                  {label} {icon}
                </span>
                <strong>{value}</strong>
                <small>{unit}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="streak-card">
          <span className="streak-icon">
            <Sparkle size={22} weight="fill" />
          </span>
          <div>
            <strong>连续陪伴自己 6 天</strong>
            <p>明天再回来，给自己留十分钟。</p>
          </div>
        </section>
      </main>
    </MobileScroll>
  );
}

function SettingsScreen({
  onBack,
  onNotify,
  onLogout,
}: {
  onBack: () => void;
  onNotify: (message: string) => void;
  onLogout: () => void;
}) {
  const settingsGroups = [
    [
      ["个人资料", <User size={20} />],
      ["账号安全", <LockSimple size={20} />],
    ],
    [
      ["播放设置", <SpeakerHigh size={20} />],
      ["通知", <Bell size={20} />],
      ["隐私设置", <ShieldCheck size={20} />],
      ["更多功能", <Sparkle size={20} />],
    ],
    [
      ["帮助与反馈", <Question size={20} />],
      ["个人信息收集清单", <BookOpen size={20} />],
      ["第三方信息共享清单", <ShareNetwork size={20} />],
      ["关于我们", <Leaf size={20} />],
    ],
  ];
  return (
    <MobileScroll className="app-screen settings-screen">
      <main className="settings-content">
        <DetailHeader title="更多设置" onBack={onBack} />
        {settingsGroups.map((group, groupIndex) => (
          <section className="settings-group" key={groupIndex}>
            {group.map(([label, icon]) => (
              <button
                key={String(label)}
                type="button"
                onClick={() => onNotify(`${label}功能将在正式版本中开放`)}
              >
                <span className="settings-row-icon">{icon}</span>
                <span>{label}</span>
                <CaretRight size={17} />
              </button>
            ))}
          </section>
        ))}
        <button className="logout-button" type="button" onClick={onLogout}>
          <SignOut size={19} />
          退出登录
        </button>
        <p className="settings-version">此刻 1.0 · 给自己一个呼吸的间隙</p>
      </main>
    </MobileScroll>
  );
}

function DetailHeader({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
  right?: ReactNode;
}) {
  return (
    <header className="detail-header">
      <button type="button" className="detail-back" onClick={onBack} aria-label="返回">
        <ArrowLeft size={22} weight="bold" />
      </button>
      <div>
        <span>{title}</span>
        {subtitle ? <small>{subtitle}</small> : null}
      </div>
      <div className="detail-right">
        {right ?? (
          <button type="button" aria-label="更多选项">
            <DotsThree size={24} weight="bold" />
          </button>
        )}
      </div>
    </header>
  );
}

function StepHeader({
  step,
  title,
  onBack,
}: {
  step: string;
  title: string;
  onBack: () => void;
}) {
  return (
    <header className="step-header">
      <button type="button" onClick={onBack} aria-label="返回">
        <ArrowLeft size={22} weight="bold" />
      </button>
      <span>{title}</span>
      <small>{step}</small>
    </header>
  );
}

function SectionHeading({
  eyebrow,
  title,
  action,
  onAction,
}: {
  eyebrow: string;
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="section-heading section-heading-spaced">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {action && onAction ? (
        <button type="button" className="text-action muted-action" onClick={onAction}>
          {action} <CaretRight size={14} weight="bold" />
        </button>
      ) : null}
    </div>
  );
}

function BottomNav({ active, onSelect }: { active: Tab; onSelect: (tab: Tab) => void }) {
  const items: Array<{ id: Tab; label: string; icon: ReactNode }> = [
    { id: "home", label: "首页", icon: <House size={21} weight={active === "home" ? "fill" : "regular"} /> },
    {
      id: "awareness",
      label: "觉察",
      icon: <BookOpen size={21} weight={active === "awareness" ? "fill" : "regular"} />,
    },
    { id: "profile", label: "我的", icon: <User size={21} weight={active === "profile" ? "fill" : "regular"} /> },
  ];

  return (
    <nav className="bottom-nav" aria-label="主导航">
      {items.map((item) => {
        const selected = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            data-active={selected}
            aria-current={selected ? "page" : undefined}
            onClick={() => onSelect(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
