import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  Check,
  ChevronRight,
  Flame,
  Headphones,
  RotateCcw,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import styles from './index.module.css'

export const Route = createFileRoute('/')({ component: CzechLearningApp })

type Quiz = {
  prompt: string
  context: string
  options: string[]
  answer: string
  note: string
}

const quizzes: Quiz[] = [
  {
    prompt: '「ありがとう」はどれ？',
    context: 'カフェで店員さんに伝えよう',
    options: ['Dobrý den', 'Děkuji', 'Prosím', 'Ahoj'],
    answer: 'Děkuji',
    note: '「ヂェクイ」と発音します。丁寧で、どんな場面でも使えます。',
  },
  {
    prompt: '「こんにちは」を選ぼう',
    context: 'ホテルの受付で最初のひとこと',
    options: ['Na shledanou', 'Promiňte', 'Dobrý den', 'Dobrou noc'],
    answer: 'Dobrý den',
    note: '「ドブリー・デン」。昼間の丁寧なあいさつです。',
  },
  {
    prompt: '「お願いします」はどれ？',
    context: 'パンを指さして注文してみよう',
    options: ['Prosím', 'Ano', 'Ne', 'Děkuji'],
    answer: 'Prosím',
    note: '「プロスィーム」。please のほか「どうぞ」の意味でも使います。',
  },
  {
    prompt: '「はい」を選ぼう',
    context: '質問に肯定で答える場面',
    options: ['Ne', 'Ano', 'Ahoj', 'Pardon'],
    answer: 'Ano',
    note: '「アノ」。短く、はっきり発音します。',
  },
  {
    prompt: '別れのあいさつはどれ？',
    context: 'お店を出るときの丁寧な表現',
    options: ['Dobrou chuť', 'Na shledanou', 'Dobrý den', 'Prosím'],
    answer: 'Na shledanou',
    note: '「ナ・スフレダノウ」。丁寧な「さようなら」です。',
  },
]

const phraseCards = [
  { czech: 'Dobrý den', japanese: 'こんにちは', reading: 'ドブリー・デン' },
  { czech: 'Děkuji', japanese: 'ありがとう', reading: 'ヂェクイ' },
  { czech: 'Prosím', japanese: 'お願いします', reading: 'プロスィーム' },
]

const letters = [
  { letter: 'č', sound: 'チュ', word: 'čaj', meaning: 'お茶' },
  { letter: 'ř', sound: '巻き舌のジュ', word: 'tři', meaning: '3' },
  { letter: 'š', sound: 'シュ', word: 'škola', meaning: '学校' },
  { letter: 'ž', sound: 'ジュ', word: 'žena', meaning: '女性' },
  { letter: 'ě', sound: 'イェ', word: 'děkuji', meaning: 'ありがとう' },
  { letter: 'ů', sound: 'ウー', word: 'dům', meaning: '家' },
  { letter: 'á', sound: 'アー', word: 'ráno', meaning: '朝' },
  { letter: 'ý', sound: 'イー', word: 'dobrý', meaning: '良い' },
]

function speak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'cs-CZ'
  utterance.rate = 0.78
  const voice = window.speechSynthesis
    .getVoices()
    .find((item) => item.lang.toLowerCase().startsWith('cs'))
  if (voice) utterance.voice = voice
  window.speechSynthesis.speak(utterance)
}

function CzechLearningApp() {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [streak, setStreak] = useState(0)
  const [activeLetter, setActiveLetter] = useState(letters[0])
  const [flipped, setFlipped] = useState<number | null>(null)
  const currentQuiz = quizzes[step]
  const isCorrect = selected === currentQuiz.answer

  useEffect(() => {
    const saved = window.localStorage.getItem('cesky-tap-streak')
    if (saved) setStreak(Number(saved))
  }, [])

  const progress = useMemo(() => {
    if (completed) return 100
    return Math.round(((step + (isCorrect ? 1 : 0)) / quizzes.length) * 100)
  }, [completed, isCorrect, step])

  const chooseAnswer = (option: string) => {
    setSelected(option)
    speak(option)
  }

  const nextQuiz = () => {
    if (!isCorrect) return
    if (step === quizzes.length - 1) {
      const nextStreak = streak + 1
      setStreak(nextStreak)
      window.localStorage.setItem('cesky-tap-streak', String(nextStreak))
      setCompleted(true)
      return
    }
    setStep((value) => value + 1)
    setSelected(null)
  }

  const restart = () => {
    setStep(0)
    setSelected(null)
    setCompleted(false)
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <a className={styles.brand} href="#top" aria-label="ČESKY TAP ホーム">
          <span className={styles.flagMark} aria-hidden="true"><i /></span>
          <span>ČESKY <b>TAP</b></span>
        </a>
        <nav className={styles.navLinks} aria-label="ページ内メニュー">
          <a href="#lesson">レッスン</a>
          <a href="#phrases">フレーズ</a>
          <a href="#letters">文字の音</a>
        </nav>
        <div className={styles.streakChip} aria-label={`${streak}日連続`}>
          <Flame size={17} aria-hidden="true" />
          <strong>{streak}</strong><span>日連続</span>
        </div>
      </header>

      <section className={styles.hero} id="top">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>5 MINUTES OF CZECH</p>
          <h1>チェコ語を、<br /><em>耳とタップ</em>で。</h1>
          <p className={styles.heroLead}>キーボード入力はありません。発音を聴いて、意味を見て、答えを選ぶだけ。旅のひとことから気軽に始めましょう。</p>
          <div className={styles.heroPoints} aria-label="特徴">
            <span><Check size={16} /> 入力なし</span>
            <span><Headphones size={16} /> 音声つき</span>
            <span><Sparkles size={16} /> 1回5分</span>
          </div>
        </div>

        <aside className={styles.todayCard} aria-label="今日のひとこと">
          <div className={styles.todayTopline}>
            <span>DNES · TODAY</span><span>01</span>
          </div>
          <p className={styles.todayLabel}>今日のひとこと</p>
          <div className={styles.phraseRow}>
            <div><strong>Dobrý den!</strong><span>こんにちは！</span></div>
            <button className={styles.listenButton} type="button" onClick={() => speak('Dobrý den')} aria-label="Dobrý den の発音を聞く" title="発音を聞く">
              <Volume2 size={23} />
            </button>
          </div>
          <p className={styles.pronunciation}>ドブリー・デン</p>
        </aside>
      </section>

      <section className={styles.lessonShell} id="lesson">
        <div className={styles.lessonHeading}>
          <div><p className={styles.sectionKicker}>LESSON 01</p><h2>まずは、あいさつから</h2></div>
          <div className={styles.progressBlock} aria-label={`レッスン進捗 ${progress}%`}>
            <span>{completed ? '完了！' : `${step + 1} / ${quizzes.length}`}</span>
            <div className={styles.progressTrack}><i style={{ width: `${progress}%` }} /></div>
          </div>
        </div>

        <div className={styles.lessonGrid}>
          <article className={styles.quizCard}>
            {completed ? (
              <div className={styles.completeState}>
                <span className={styles.completeIcon}><Check size={32} /></span>
                <p className={styles.quizNumber}>VÝBORNĚ! · すばらしい！</p>
                <h3>5つのフレーズを<br />マスターしました</h3>
                <p>今日のレッスンは完了です。耳が覚えているうちに、もう一度声を聞いてみましょう。</p>
                <button className={styles.primaryAction} type="button" onClick={restart}>
                  <RotateCcw size={18} /> もう一度チャレンジ
                </button>
              </div>
            ) : (
              <>
                <div className={styles.quizHeader}>
                  <span className={styles.quizNumber}>OTÁZKA {String(step + 1).padStart(2, '0')}</span>
                  <button className={`${styles.iconButton} ${styles.light}`} type="button" onClick={() => speak(currentQuiz.answer)} aria-label="正解の発音を聞く" title="発音を聞く">
                    <Volume2 size={20} />
                  </button>
                </div>
                <p className={styles.quizContext}>{currentQuiz.context}</p>
                <h3>{currentQuiz.prompt}</h3>
                <div className={styles.answerGrid}>
                  {currentQuiz.options.map((option, index) => {
                    const status = selected === option
                      ? option === currentQuiz.answer ? styles.correct : styles.wrong
                      : ''
                    return (
                      <button key={option} type="button" className={`${styles.answerOption} ${status}`} onClick={() => chooseAnswer(option)}>
                        <span>{String.fromCharCode(65 + index)}</span>
                        <strong>{option}</strong>
                        {status === styles.correct && <Check size={19} aria-hidden="true" />}
                        {status === styles.wrong && <X size={19} aria-hidden="true" />}
                      </button>
                    )
                  })}
                </div>
                {selected && (
                  <div className={`${styles.feedback} ${isCorrect ? styles.success : styles.retry}`} role="status" aria-live="polite">
                    <div>
                      <strong>{isCorrect ? 'Správně! 正解です' : 'Ještě jednou! もう一度'}</strong>
                      <p>{isCorrect ? currentQuiz.note : '音をもう一度聞いて、別の答えを選んでみましょう。'}</p>
                    </div>
                    {isCorrect && (
                      <button type="button" onClick={nextQuiz} aria-label="次の問題へ" title="次の問題へ"><ArrowRight size={20} /></button>
                    )}
                  </div>
                )}
              </>
            )}
          </article>

          <aside className={styles.lessonSidebar}>
            <div className={styles.miniProgressCard}>
              <div className={styles.ring} style={{ '--progress': `${progress * 3.6}deg` } as CSSProperties}><span>{progress}%</span></div>
              <div><p>今日のゴール</p><strong>あと{Math.max(quizzes.length - step - (isCorrect ? 1 : 0), 0)}問です</strong></div>
            </div>
            <div className={styles.tipCard}>
              <p className={styles.sectionKicker}>MINI TIP</p>
              <h3>チェコ語のアクセント</h3>
              <p>基本は最初の音節を少し強く。まずはリズムをまねするだけで大丈夫です。</p>
              <button type="button" onClick={() => speak('Dobrý den. Děkuji. Prosím.')}><Volume2 size={17} /> まとめて聴く</button>
            </div>
          </aside>
        </div>
      </section>

      <section className={`${styles.contentSection} ${styles.phrasesSection}`} id="phrases">
        <div className={styles.sectionTitleRow}>
          <div><p className={styles.sectionKicker}>TAP & LISTEN</p><h2>旅で使える3フレーズ</h2></div>
          <p>カードをタップすると、日本語と読み方を確認できます。</p>
        </div>
        <div className={styles.phraseGrid}>
          {phraseCards.map((phrase, index) => (
            <article key={phrase.czech} className={`${styles.phraseCard} ${flipped === index ? styles.isFlipped : ''}`}>
              <button type="button" className={styles.phraseMain} onClick={() => setFlipped(flipped === index ? null : index)} aria-pressed={flipped === index}>
                <span className={styles.cardIndex}>0{index + 1}</span>
                <span className={styles.cardCopy}>
                  <strong>{phrase.czech}</strong>
                  <small>{flipped === index ? `${phrase.japanese} · ${phrase.reading}` : 'タップして意味を見る'}</small>
                </span>
              </button>
              <button className={styles.cardAction} type="button" onClick={() => speak(phrase.czech)} aria-label={`${phrase.czech} の発音を聞く`} title="発音を聞く"><Volume2 size={20} /></button>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.contentSection} ${styles.lettersSection}`} id="letters">
        <div className={styles.lettersCopy}>
          <p className={styles.sectionKicker}>CZECH SOUNDS</p>
          <h2>見慣れない文字も、<br />タップすれば大丈夫。</h2>
          <p>チェコ語の特殊文字を入力する問題は出しません。ここでは文字を選んで、音と単語の例だけ確認できます。</p>
          <div className={styles.letterKeyboard} aria-label="チェコ語の特殊文字">
            {letters.map((item) => (
              <button key={item.letter} type="button" className={activeLetter.letter === item.letter ? styles.active : ''} onClick={() => { setActiveLetter(item); speak(item.word) }} aria-pressed={activeLetter.letter === item.letter}>{item.letter}</button>
            ))}
          </div>
        </div>
        <div className={styles.letterDisplay}>
          <span className={styles.giantLetter}>{activeLetter.letter}</span>
          <div className={styles.letterDetails}>
            <p>だいたいの音</p><strong>{activeLetter.sound}</strong><hr />
            <p>単語の例</p>
            <button type="button" onClick={() => speak(activeLetter.word)}>
              <span>{activeLetter.word}</span><small>{activeLetter.meaning}</small><Volume2 size={20} />
            </button>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <a className={`${styles.brand} ${styles.footerBrand}`} href="#top"><span>ČESKY <b>TAP</b></span></a>
        <p>毎日5分、チェコを少し近くする。</p>
        <a href="#lesson">レッスンへ戻る <ChevronRight size={16} /></a>
      </footer>
    </main>
  )
}
