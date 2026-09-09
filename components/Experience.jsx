'use client'

import SectionHeader from './ui/section-header'
import CornerPlus from './ui/corner-plus'

const experience = [
  {
    id: 1,
    role: 'Backend & Data Science Training',
    company: 'Self-Directed & Academic',
    period: '2023 — Present',
    points: [
      'Building backend applications using Django and FastAPI with database-driven architectures.',
      'Developing data science projects — customer churn prediction, credit card dashboards, and ML pipelines.',
      'Gained experience with REST APIs, authentication systems, and deploying web applications.',
      'Strong foundation in DSA, OOP, DBMS, and computer networks through LPU coursework.',
    ],
    tags: ['Python', 'Django', 'FastAPI', 'Machine Learning', 'PostgreSQL', 'React'],
  },
]

const labelStyle = {
  fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(var(--ink), 0.4)',
  textTransform: 'uppercase', letterSpacing: '0.16em', display: 'block',
}

export default function Experience() {
  return (
    <section id="experience" className="section container grid-box">
      <CornerPlus />
      <SectionHeader
        eyebrow="experience"
        title="Training"
        description="Not just theory — applying learned concepts to real-world development and system design."
        align="left"
        marginBottom={32}
      />

      <div className="edi-sheet">
        {experience.map((exp) => (
          <div key={exp.id} className="edi-row edi-row-exp training-record">

            {/* Meta */}
            <div className="edi-cell training-summary">
              <span style={{ ...labelStyle, marginBottom: '16px' }}>Training</span>
              <div className="training-period">{exp.period}</div>
              <h3 className="training-role">{exp.role}</h3>
              <p className="training-company">@ {exp.company}</p>

              <div className="training-tags" aria-label="Skills covered">
                {exp.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="edi-cell training-details">
              <span style={{ ...labelStyle, marginBottom: '20px' }}>What it covered</span>
              <ul className="training-list">
                {exp.points.map((pt, i) => (
                  <li key={i}>
                    <span className="training-list-number">0{i + 1}</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
