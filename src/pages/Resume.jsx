import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AmbientVoidBackground from '../components/AmbientVoidBackground';
import CursorRipples from '../components/CursorRipples';
import SectionAccent from '../components/SectionAccent';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Resume = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative bg-[#030712] text-white font-sans cursor-crosshair">
      <AmbientVoidBackground />
      <CursorRipples />

      <div className="relative z-10 pt-20 pb-16">
        {/* Header Section */}
        <header className="container mx-auto px-4 mb-12 text-center">
          <div className="flex justify-center mb-6">
            <motion.div
              className="relative z-20 p-1 rounded-full bg-gradient-to-tr from-amber-400/40 via-sky-400/30 to-blue-500/40 shadow-[0_0_35px_rgba(245,158,11,0.22)]"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <picture>
                <source srcSet="/pic.webp" type="image/webp" />
                <img
                  src="/pic.jpg"
                  alt="Andres Avelar"
                  className="w-48 h-48 rounded-full object-cover border-2 border-slate-900"
                  width={192}
                  height={192}
                  loading="eager"
                  decoding="sync"
                  fetchpriority="high"
                />
              </picture>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            variants={fadeInUp}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-300 inline-block">
              Andres Avelar
            </h1>
            <div className="flex flex-col md:flex-row justify-center items-center gap-3 mb-4 font-semibold text-xl">
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-300 to-yellow-200">
                Statistics & Data Science + Economics
              </p>
              <span className="hidden md:inline text-amber-400/80">•</span>
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                UCSB '26
              </p>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Currently exploring full-time roles in applied machine learning, quantitative finance, and data science. This page serves as an interactive resume and portfolio of my work.
            </p>

            {/* Clean Contact Links */}
            <div className="flex flex-wrap justify-center items-center gap-6 mt-6 text-sm">
              <a
                href="mailto:andresavelar@ucsb.edu"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>andresavelar@ucsb.edu</span>
              </a>

              <span className="flex items-center gap-2 text-gray-400">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Santa Barbara, CA</span>
              </span>

              <a
                href="https://github.com/andres844"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </a>

              <a
                href="https://linkedin.com/in/andres-avelar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </motion.div>
        </header>

        {/* Main Content: 2-column layout */}
        <main className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 self-start">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="glass-card hover-change p-6 rounded-lg"
            >
              <h3 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-300 inline-block">Skills</h3>
              <div className="space-y-4">
                {[
                  {
                    header: 'Frameworks/Tools',
                    content:
                      'Docker, FastAPI, Git, Google Vertex AI, Google Colab, HuggingFace, MongoDB, N8N (AI Agents), Node.js, PyTorch, Qdrant (Vector DB), RStudio, React, Scrapy, SciKit-learn, Siren (Graph DB), .NET, VS, NumPy, Pandas, XGBoost, LightGBM, CatBoost, SHAP, TensorFlow, Keras, MLflow, Spark, Snowflake, BigQuery, SciPy, SymPy, Postman, Ollama',
                  },
                  {
                    header: 'Finance',
                    content:
                      'Futures/Options trading (Level II market data), TradoVate, TradingView, Capital IQ, Artemis, Etherscan, Kucoin',
                  },
                  {
                    header: 'Languages',
                    content:
                      'Spanish (native), Python, SQL, R, C#, Java, JS, SAS, STATA, Solidity, Swift, HTML, CSS',
                  },
                ].map((s, i) => (
                  <div key={i}>
                    <h4 className="font-medium text-gray-200 text-sm">{s.header}</h4>
                    <p className="text-gray-300 text-sm mt-1 leading-relaxed">{s.content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </aside>

          {/* Main Column */}
          <section className="lg:col-span-2 space-y-14">
            {/* Education Section */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              variants={fadeInUp}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-300 inline-block">Education</h2>
              <SectionAccent className="mb-6 max-w-xs" />
              <div className="pl-2 space-y-8">
                {/* UCSB Section */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-100">University of California, Santa Barbara</h3>
                  <div className="flex justify-between items-baseline mt-1">
                    <p className="text-gray-300">Bachelor of Science, Statistics & Data Science</p>
                    <p className="text-gray-400 text-sm">March 2026</p>
                  </div>
                  <p className="text-gray-300">Bachelor of Arts, Economics</p>
                  <div className="mt-3 text-gray-300 text-sm">
                    <p className="font-semibold text-gray-100">Relevant Coursework:</p>
                    <p className="pl-4 mt-1 text-gray-300 leading-relaxed">
                      Regression Analysis, Time Series Analysis (Grad level), Stochastic Processes I & II (Grad level), Statistical
                      Machine Learning I & II, Bayesian Statistics, Data Wrangling, Data Structures & Algorithms, Game Theory,
                      Econometrics I & II, Advanced Macro/Micro Economics, Behavioral Economics
                    </p>
                  </div>
                  <ul className="list-disc list-outside text-gray-300 mt-3 pl-5 space-y-1 text-sm">
                    <li>NeuroTech club Researcher & Treasurer, Data Science Club member, California Nano Systems Institute Fellowship recipient</li>
                    <li>Major GPA: 3.6, Deans Honors List F2023, W2023</li>
                  </ul>
                </div>

                {/* UC San Diego Summer Extension Section */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-100">University of California, San Diego: Summer Extension</h3>
                  <div className="flex justify-between items-baseline mt-1">
                    <p className="text-gray-300">Computational Biology</p>
                    <p className="text-gray-400 text-sm">June 2022</p>
                  </div>
                  <ul className="list-disc list-outside text-gray-300 mt-2 pl-5 space-y-1 text-sm">
                    <li>Awarded full scholarship to take Computational Biology with Python over summer quarter</li>
                    <li>Experimented with Genome sequencing, wildlife ecology simulations, and epidemiology simulations</li>
                    <li>Modeled biological population dynamics with discrete-time Markov chains, birth-death processes, transition probability matrices, absorbing states, and steady-state behavior</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Experience Section */}
            <section className="mb-16">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] lg:gap-16">
                <div className="lg:sticky lg:top-24 self-start space-y-4">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-300 inline-block">Experience</h2>
                  <SectionAccent className="w-full max-w-xs my-2" />
                  <p className="text-gray-400 max-w-xs text-sm">
                    A timeline of roles and impact across AI, systems, and research.
                  </p>
                </div>
                <div className="space-y-6">
                  {[
                    {
                      title: 'AI Engineer - BNY Mellon',
                      dates: 'June 2026 - August 2026',
                      location: 'Pittsburgh, PA',
                      points: [
                        'Multi Agent LLM-as-a-Judge pipeline for Quantitative Cyber Risk Team: Automated risk assessment of complete CRIv2.1 and MITRE ATT&CK Frameworks with respect to Global BNY business units.',
                        'Saved 270+ hours of manual labor by leveraging fine-tuned locally hosted LLMs',
                        'Utilized Parallel Processing and Advanced Prompt Engineering to optimize agent workflows and reduce latency by 85%',
                      ],
                    },
                    {
                      title: 'President - BlockchainUCSB',
                      dates: 'June 2024 - September 2025',
                      location: 'Santa Barbara, CA',
                      points: [
                        'Led Blockchain Summit (100+ attendees, $10K+ sponsorship) boosting community and funding.',
                        'Organized weekly blockchain lectures for 200+ STEM students. (Intro to Chainlink, Solidity, & DeFi)',
                        'Built industry and inter-club ties via domestic/international conferences; secured 4 sponsors.',
                        'Analyzed DEX vs. CEX risks using Artemis data & DeFi principles under Prof. Malkhi.',
                        'Assisted in joint research with Computer Science and Economics Departments; optimized ordering algorithims for Automated Market Makers.',
                      ],
                    },
                    {
                      title: 'Machine Learning Engineer - 2430 Group',
                      dates: 'June 2024 - December 2024',
                      location: 'Santa Barbara, CA',
                      points: [
                        'Developed a pipeline using RegEx & open-source LLMs (FuseChat-7b, e5-Mistral) to parse 9M+ data points; optimized vector embeddings.',
                        'Led a 5-member team to build a custom machine learning (Random Forest, XGBoost) and RAG pipeline to derive proprietary risk of IP theft formula.',
                        'Engineered the Glean AI app (Google Drive API, Postman) to streamline research and cut processing time by 20%.',
                        'Fine-tuned YOLOv8 via Roboflow, reaching 94% test accuracy.',
                      ],
                    },
                    {
                      title: 'Systems Operator - UCSB Information Technology',
                      dates: 'September 2023 - April 2025',
                      location: 'Santa Barbara, CA',
                      points: [
                        'Deployed/imaged ~2,500 computers for 35K users; configured BIOS and mitigated tech risks.',
                        'Automated class software installs/updates (Deep Freeze, PDQ) to boost efficiency by 30%.',
                        'Scripted Python tools for Airtable inventory updates.',
                      ],
                    },
                    {
                      title: 'Software Engineer - APTCO',
                      dates: 'July 2023 - September 2023',
                      location: 'McFarland, CA',
                      points: [
                        'Built a full-stack ASP.NET app with senior engineers, reducing data entry by 45%.',
                        'Trained Spanish-speaking users and enhanced accessibility, driving 87K+ entries by EOY.',
                        'Developed an industrial connectivity solution using .NET MAUI with an MSSQL backend.',
                        'Integrated a PLC with Aveva Edge, displaying 1K+ daily data points to boost QC efficiency by ~30%.',
                      ],
                    },
                  ].map((job, index) => (
                    <motion.article
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      viewport={{ once: true, amount: 0.3 }}
                      className="glass-card hover-change p-6 rounded-lg"
                    >
                      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-100">{job.title}</h3>
                        <p className="text-sm text-gray-400">{job.dates}</p>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{job.location}</p>
                      <ul className="list-disc list-outside text-gray-300 mt-4 pl-5 space-y-2 text-sm leading-relaxed">
                        {job.points.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </motion.article>
                  ))}
                </div>
              </div>
            </section>

            {/* Projects Section */}
            <section className="mb-12">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] lg:gap-16">
                <div className="lg:sticky lg:top-24 self-start space-y-4">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-300 inline-block">Projects</h2>
                  <SectionAccent className="w-full max-w-xs my-2" />
                  <p className="text-gray-400 max-w-xs text-sm">
                    Selected builds across forecasting, quant research, and applied ML systems.
                  </p>
                </div>
                <div className="space-y-6">
                  {[
                    {
                      title: 'Quantitative Backtesting Framework',
                      description:
                        'Built a modular SPY strategy research framework across daily, weekly, and monthly bars (2000-2024), testing Donchian breakout, Bollinger mean-reversion, Decision Tree/Random Forest baselines, and PyTorch TCN/LSTM sequence models. Evaluated Profit Factor net of turnover costs with walk-forward validation, stationary block bootstraps, bar-permutation nulls, calendar shuffles, sign-flip tests, empirical p-values, volatility-normalized signals, and capped Kelly sizing via MC-Dropout and dual-head return estimates.',
                      tags: ['PyTorch', 'Scikit Learn', 'Pandas', 'Bootstrapping', 'TCN/LSTM'],
                    },
                    {
                      title: 'Time Series Forecasting',
                      description:
                        'Extensively analyzed and forecasted weather time-series data using ARIMA and SARIMA models, leveraging R (including the forecast package for automatic ARIMA and state-space exponential smoothing) for model selection and diagnostics (ACF/PACF, stationarity tests), and presented insights through custom visualizations',
                      tags: ['R Studio', 'ggplot2', 'auto.arima'],
                    },
                    {
                      title: 'Volatility Surface Visualization',
                      description:
                        'Derived formula to visualize volatility smile/skew of options contracts using Black–Scholes modeling, implied volatility extraction, and 3D surface plotting (Python/Matplotlib/NumPy) to assess bias of given stock',
                      tags: ['Polygon.io API', 'Matplotlib', 'SeaBorn'],
                    },
                    {
                      title: 'E-Commerce site: Testadura.online',
                      description:
                        'Engineered a modern, high-performance apparel e-commerce web application featuring dynamic product catalog browsing, persistent cart state management, and a server-side pre-drop password gate for exclusive releases. Built the responsive frontend using React 18, Vite, Tailwind CSS, and Framer Motion for micro-interactions, paired with a serverless Cloudflare Workers backend integrated with the Stripe Checkout API for secure international payment processing and automated order lifecycle handling.',
                      tags: ['React 18', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Cloudflare Workers', 'Stripe API'],
                      link: 'https://testadura.online',
                    },
                    {
                      title: 'AI Research Assistant',
                      description: 'Built a RAG-powered research assistant using LangChain and OpenAI API',
                      tags: ['Python', 'LangChain', 'OpenAI API'],
                    },
                    {
                      title: 'Neural Network from scratch',
                      description:
                        'Coded feedforward neural network in base Python to identify MNIST dataset, strengthening my theoretical knowledge',
                      tags: ['Python', 'NumPy'],
                    },
                  ].map((project, index) => (
                    <motion.article
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      viewport={{ once: true, amount: 0.3 }}
                      className="glass-card hover-change p-6 rounded-lg transition-colors"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <h3 className="text-xl font-bold text-gray-100">
                          {project.link ? (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-amber-300 transition-colors inline-flex items-center gap-1.5"
                            >
                              <span>{project.title}</span>
                              <svg
                                className="w-4 h-4 opacity-75 inline-block"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                          ) : (
                            project.title
                          )}
                        </h3>
                      </div>
                      <p className="text-gray-300 my-3 text-sm leading-relaxed">{project.description}</p>
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="bg-amber-400/15 text-amber-200 border border-amber-400/20 px-2 py-0.5 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.article>
                  ))}
                </div>
              </div>
            </section>
          </section>
        </main>

        {/* Back to Top Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-8 right-8 z-40 glass-card hover-change text-amber-300 p-3 rounded-full shadow-lg flex items-center justify-center"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          ↑
        </motion.button>

        {/* Footer */}
        <footer className="py-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Andres Avelar</p>
        </footer>
      </div>
    </div>
  );
};

export default Resume;
