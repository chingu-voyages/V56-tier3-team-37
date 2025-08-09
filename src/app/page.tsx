'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Typewriter from 'typewriter-effect';
import BrandButton from '@/components/BrandButton';

export default function Home() {
  const heroRef = useRef(null);
  const benefitsRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const isBenefitsInView = useInView(benefitsRef, { once: true, margin: "-100px" });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="hero"
        variants={containerVariants}
        initial="hidden"
        animate={isHeroInView ? "visible" : "hidden"}
      >
        <div className="hero__background"></div>

        <div className="hero__content">
          <motion.div
            className="hero__badge"
            variants={itemVariants}
          >
            <span>🏥 Healthcare Innovation</span>
          </motion.div>

          <motion.h1
            className="hero__title"
            variants={titleVariants}
          >
            Care Flow
          </motion.h1>

          <motion.div
            className="hero__subtitle"
            variants={itemVariants}
          >
            <Typewriter
              options={{
                strings: [
                  'Reducing Stress Through Real-Time Surgery Updates',
                  'Transforming the Waiting Room Experience',
                  'Real-Time Updates for Peace of Mind'
                ],
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 30,
                cursor: '|',
                cursorClassName: 'hero__typewriter-cursor'
              }}
            />
          </motion.div>

          <motion.div
            className="hero__description-container"
            variants={itemVariants}
          >
            <p className="hero__description">
              At some point, you or a loved one may face surgery. While waiting, the uncertainty can be stressful.
              Care Flow brings peace of mind by showing real-time updates on each step of the surgical process—so you're never left wondering.
            </p>
          </motion.div>

          <motion.div
            className="hero__actions"
            variants={containerVariants}
          >
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <BrandButton
                component={Link}
                href="/status"
                sx={{
                  fontSize: '1.125rem',
                  px: 6,
                  py: 1.5,
                  minHeight: 48
                }}
              >
                Guest
              </BrandButton>
            </motion.div>

            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <BrandButton
                component={Link}
                href="/auth"
                sx={{
                  fontSize: '1.125rem',
                  px: 6,
                  py: 1.5,
                  minHeight: 48
                }}
              >
                Login
              </BrandButton>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        ref={benefitsRef}
        className="benefits"
        variants={containerVariants}
        initial="hidden"
        animate={isBenefitsInView ? "visible" : "hidden"}
      >
        <div className="container">
          <div className="benefits__content">
            <motion.div
              className="benefits__header"
              variants={itemVariants}
            >
              <h2 className="benefits__title">How Care Flow Helps</h2>
              <p className="benefits__subtitle">
                Transforming the waiting room experience with real-time updates and transparency
              </p>
            </motion.div>

            <motion.div
              className="benefits__grid"
              variants={containerVariants}
            >
              <motion.div
                className="benefit-card"
                variants={cardVariants}
                whileHover="hover"
              >
                <motion.div
                  className="benefit-card__icon"
                  whileHover={{
                    scale: 1.2,
                    rotate: 5,
                    transition: { duration: 0.3 }
                  }}
                >
                  🏥
                </motion.div>
                <h3 className="benefit-card__title">Real-Time Updates</h3>
                <p className="benefit-card__description">
                  Get instant notifications about surgery progress and status changes, keeping you informed every step of the way.
                </p>
              </motion.div>

              <motion.div
                className="benefit-card"
                variants={cardVariants}
                whileHover="hover"
              >
                <motion.div
                  className="benefit-card__icon"
                  whileHover={{
                    scale: 1.2,
                    rotate: -5,
                    transition: { duration: 0.3 }
                  }}
                >
                  😌
                </motion.div>
                <h3 className="benefit-card__title">Reduce Anxiety</h3>
                <p className="benefit-card__description">
                  Knowing what's happening during surgery helps reduce stress and anxiety for family members in the waiting room.
                </p>
              </motion.div>

              <motion.div
                className="benefit-card"
                variants={cardVariants}
                whileHover="hover"
              >
                <motion.div
                  className="benefit-card__icon"
                  whileHover={{
                    scale: 1.2,
                    rotate: 5,
                    transition: { duration: 0.3 }
                  }}
                >
                  📱
                </motion.div>
                <h3 className="benefit-card__title">Easy Access</h3>
                <p className="benefit-card__description">
                  Simple, intuitive interface that works on any device - from your phone to hospital tablets.
                </p>
              </motion.div>

              <motion.div
                className="benefit-card"
                variants={cardVariants}
                whileHover="hover"
              >
                <motion.div
                  className="benefit-card__icon"
                  whileHover={{
                    scale: 1.2,
                    rotate: -5,
                    transition: { duration: 0.3 }
                  }}
                >
                  ⚡
                </motion.div>
                <h3 className="benefit-card__title">Workflow Transparency</h3>
                <p className="benefit-card__description">
                  Understand the medical procedure workflow and what each phase means for your loved one's surgery.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
