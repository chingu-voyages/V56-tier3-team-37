'use client';

import Link from 'next/link';

export default function Home() {
  // const { user } = useAuth(); // Removed unused variable

  // Home page should be accessible to everyone, regardless of auth state

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">Care Flow</h1>
          <p className="hero__subtitle">Reducing Stress Through Real-Time Surgery Updates</p>
          <p className="hero__description">
            It's inevitable that at some point in your life you or a loved one will have to undergo some type of surgery - either as an inpatient or an outpatient. In this event you or a companion, depending on who's having the surgery, will be in a hospital waiting room while the surgery is being performed.
          </p>
          <p className="hero__description">
            It can be quite stressful on the person in the waiting room. But, this can be lessened by knowing how the surgery is progressing. Like many other activities there is a workflow associated with any medical procedure and knowing what state or phase the surgery is in will help whoever is waiting to know what's going on.
          </p>

          <div className="hero__actions">
            <Link href="/status" className="hero__cta hero__cta--guest">
              <span className="hero__cta-text">Guest</span>
              <span className="hero__cta-subtext">View patient status</span>
            </Link>
            <Link href="/auth" className="hero__cta hero__cta--auth">
              <span className="hero__cta-text">Auth Login</span>
              <span className="hero__cta-subtext">Administrator access</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="container">
          <div className="benefits__content">
            <h2 className="benefits__title">How Care Flow Helps</h2>
            <div className="benefits__grid">
              <div className="benefit-card">
                <div className="benefit-card__icon">🏥</div>
                <h3 className="benefit-card__title">Real-Time Updates</h3>
                <p className="benefit-card__description">
                  Get instant notifications about surgery progress and status changes, keeping you informed every step of the way.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-card__icon">😌</div>
                <h3 className="benefit-card__title">Reduce Anxiety</h3>
                <p className="benefit-card__description">
                  Knowing what's happening during surgery helps reduce stress and anxiety for family members in the waiting room.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-card__icon">📱</div>
                <h3 className="benefit-card__title">Easy Access</h3>
                <p className="benefit-card__description">
                  Simple, intuitive interface that works on any device - from your phone to hospital tablets.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-card__icon">⚡</div>
                <h3 className="benefit-card__title">Workflow Transparency</h3>
                <p className="benefit-card__description">
                  Understand the medical procedure workflow and what each phase means for your loved one's surgery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
