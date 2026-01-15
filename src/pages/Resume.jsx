import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AmbientVoidBackground from '../components/AmbientVoidBackground';
import CursorRipples from '../components/CursorRipples';
import SectionAccent from '../components/SectionAccent';

// Animation variants for reusability
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Resume = () => {
  const [isVisible, setIsVisible] = useState(false);
  // Trigger entry animations on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative bg-[#040a16] text-white font-univers cursor-crosshair">
      <AmbientVoidBackground />
      <CursorRipples />

      <div className="relative z-10 pt-20 pb-16">
      {/* Header Section */}
      <header className="container mx-auto px-4 mb-12 text-center">
        <div className="flex justify-center mb-6">
          <motion.div
            className="relative z-20 rounded-full border-4 border-blue-900 shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <picture>
              <source srcSet="/pic.webp" type="image/webp" />
              <img
                src="/pic.jpg"
                alt="Andres Avelar"
                className="w-48 h-48 rounded-full object-cover"
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
          <h1 className="text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-blue-400">
            Andres Avelar
          </h1>
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 mb-4">
            <p className="text-xl text-gray-300">Statistics & Data Science + Economics</p>
            <span className="hidden md:inline text-gray-500">•</span>
            <p className="text-xl text-gray-300">UCSB '26</p>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            I design and build data products and ML systems with a focus on
            explainability, performance, and measurable outcomes.
          </p>
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
            <h3 className="text-lg font-semibold mb-2">Contact</h3>
            <div className="space-y-2 text-gray-300">
              <a href="mailto:andresavelar@ucsb.edu" className="text-blue-400 hover:text-blue-300 block">
                andresavelar@ucsb.edu
              </a>
              <p className="text-gray-300">Santa Barbara, CA</p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/andres844"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  GitHub
                </a>
                <span className="text-gray-600">•</span>
                <a
                  href="https://linkedin.com/in/andres-avelar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="glass-card hover-change p-6 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Skills</h3>
            <div className="space-y-4">
              {[
                {
                  header: 'Frameworks/Tools',
                  content:
                    'Docker, FastAPI, Git, Google Vertex AI, Google Colab, HuggingFace, MongoDB, N8N (AI Agents), Node.js, PyTorch, Qdrant (Vector DB), RStudio, React, Scrapy, SciKit-learn, Siren (Graph DB), .NET, VS, NumPy, Pandas, XGBoost, LightGBM, CatBoost, SHAP, TensorFlow, Keras, MLflow, Spark, Snowflake, BigQuery, SciPy, SymPy, Postman, Ollama'
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
                  <h4 className="font-medium text-gray-200">{s.header}</h4>
                  <p className="text-gray-300 text-sm">{s.content}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </aside>

        {/* Main column */}
        <section className="lg:col-span-2">
          {/* Education Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="mb-12"
          >
          <h2 className="text-2xl font-semibold mb-4">Education</h2>
          <SectionAccent className="mb-6" />
          <div className="pl-2 space-y-8">
            {/* UCSB Section */}
            <div>
              <h3 className="text-xl ">University of California, Santa Barbara</h3>
              <div className="flex justify-between">
                <p className="text-gray-300">Bachelor of Science, Statistics & Data Science</p>
                <p className="text-gray-400">Expected March 2026</p>
              </div>
              <p className="text-gray-300">Bachelor of Arts, Economics</p>
              <ul className="list-disc list-inside text-gray-300 mt-2">
                <li className="pl-5 -indent-5">
                  <span className="font-semibold text-gray-100">Relevant Coursework:</span>{''}
                  <span className="inline-block align-top -indent-1 ">
                   Regression Analysis, Time Series Analysis (Grad level), Stochastic Processes I & II, Statistical
                   Machine Learning I & II, Bayesian Statistics, Data Structures & Algorithms, Game Theory,
                   Econometrics I & II, Advanced Macro/Micro Economics
                  </span>
                </li>
                <li>NeuroTech club Researcher & Treasurer, Data Science Club member, California Nano Systems Institute Fellowship recipient</li>
                <li>Major GPA: 3.6, Deans Honors List F2023, W2023</li>
              </ul>
            </div>

            {/* UC San Diego Summer Extension Section */}
            <div>
              <h3 className="text-xl font-univers">University of California, San Diego: Summer Extension</h3>
              <div className="flex justify-between">
                <p className="text-gray-300">Computational Biology</p>
                <p className="text-gray-400">June 2022</p>
              </div>
              <ul className="list-disc list-inside text-gray-300 mt-2">
                <li>Awarded full scholarship to take Computational Biology with Python over summer quarter</li>
                <li>Experimented with Genome sequencing, wildlife ecology simulations, and epidemiology simulations</li>
              </ul>
            </div>
          </div>
        </motion.section>


        {/* Experience Section */}
        <section className="mb-16 lg:mb-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] lg:gap-16">
            <div className="lg:sticky lg:top-24 self-start space-y-4">
              <h2 className="text-2xl font-bold">Experience</h2>
              <SectionAccent className="w-full max-w-xs my-2" />
              <p className="text-gray-400 max-w-xs">
                A timeline of roles and impact across AI, systems, and research.
              </p>
            </div>
            <div className="space-y-8">
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
                  dates: 'June 2024 - Current',
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
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="glass-card hover-change p-6 rounded-2xl"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-100">{job.title}</h3>
                    <p className="text-sm md:text-base text-gray-400">{job.dates}</p>
                  </div>
                  <p className="text-gray-400 mt-1">{job.location}</p>
                  <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
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
              <h2 className="text-2xl font-bold">Projects</h2>
              <SectionAccent className="w-full max-w-xs my-2" />
              <p className="text-gray-400 max-w-xs">
                Selected builds across forecasting, quant research, and applied ML systems.
              </p>
            </div>
            <div className="space-y-6">
              {[
                {
                  title: 'Time Series Forecasting',
                  description: 'Extensively analyzed and forecasted weather time-series data using ARIMA and SARIMA models, leveraging R (including the forecast package for automatic ARIMA and state-space exponential smoothing) for model selection and diagnostics (ACF/PACF, stationarity tests), and presented insights through custom visualizations',
                  tags: ['R Studio', 'ggplot2', 'auto.arima'],
                },
                {
                  title: 'Quantitative Backtesting Framework',
                  description: 'Implemented Monte Carlo simulation-driven backtesting with 10,000 step walk-forward optimization, leveraging Python, statistical resampling (e.g., bootstrapping/permutation testing), dynamic risk-adjusted performance metrics, and visualizations to evaluate strategy robustness across multiple market regimes.',
                  tags: ['Scikit Learn', 'Random Forest', 'Donchian Breakout Strategy'],
                },
                {
                  title: 'Volatility Surface Visualization',
                  description:
                    'Derived formula to visualize volatility smile/skew of options contracts using Black–Scholes modeling, implied volatility extraction, and 3D surface plotting (Python/Matplotlib/NumPy) to assess bias of given stock',
                  tags: ['Polygon.io API', 'Matplotlib', 'SeaBorn'],
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
                  tags: [],
                },
              ].map((project, index) => (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="glass-card hover-change p-6 rounded-2xl transition-colors"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <h3 className="text-xl font-bold text-gray-100">{project.title}</h3>
                  </div>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="bg-yellow-300/90 text-black px-2 py-1 rounded text-sm">
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
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 right-8 bg-yellow-300 text-black p-3 rounded-full shadow-lg"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </motion.button>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500">
        <p>© {new Date().getFullYear()} Andres Avelar</p>
      </footer>
      </div>
    </div>
  );
};

export default Resume;
