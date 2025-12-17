"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/site/mode-toggle";
import Image from "next/image";
import { IconArrowRight, IconBooks, IconBuilding, IconCheck, IconChevronRight, IconCloud, IconCode, IconDatabase, IconGlobe, IconHeart, IconKey, IconLock, IconLockBitcoin, IconMail, IconScan, IconServer, IconShield, IconTrendingUp, IconUserCheck, IconUsers, IconWallet } from "@tabler/icons-react";
import Favicon from "./favicon.png"

function ThemeToggle() {
  return (
    <ModeToggle />
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-card shadow-lg" : "bg-transparent backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image 
            src={Favicon} 
            alt="HAVEN Logo" 
            className="w-10 h-10 object-contain dark:invert"
            width={40}
            height={40}
          />
          <span className="text-xl font-bold tracking-tight">HAVEN</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#security" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Security</a>
          <a href="#use-cases" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Use Cases</a>
          <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button className="hidden sm:flex" size="lg">
            Get Started
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-background">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-muted rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <IconLock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Privacy-First Digital Inheritance</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            <span className="text-primary">HAVEN</span>
            <br />
            <span className="text-foreground">Protect Your Digital Life.</span>
            <br />
            <span className="text-muted-foreground">Preserve Your Legacy.</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10">
            A secure, encrypted vault that helps you safeguard your digital accounts, 
            assets, and instructions for the people you trust.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" className="text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
              Get Started
              <IconArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          <div className="relative w-80 h-80 lg:w-96 lg:h-96">
            <div className="absolute inset-0 bg-primary/20 rounded-3xl rotate-6" />
            <div className="absolute inset-0 glass-card rounded-3xl flex items-center justify-center">
              <div className="text-center">
                <img 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Gemini_Generated_Image_x6j2tix6j2tix6j2-removebg-preview-1765875341255.png?width=8000&height=8000&resize=contain" 
                  alt="HAVEN Logo" 
                  className="w-32 h-32 mx-auto mb-6 object-contain animate-float dark:invert"
                />
                <h3 className="text-2xl font-bold mb-2">HAVEN</h3>
                <p className="text-sm text-muted-foreground">Your Digital Safety Net</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-16 h-16 glass-card rounded-2xl flex items-center justify-center animate-float" style={{ animationDelay: "0.5s" }}>
              <IconLock className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 glass-card rounded-2xl flex items-center justify-center animate-float" style={{ animationDelay: "1s" }}>
              <IconKey className="w-8 h-8 text-primary" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems = [
    { icon: IconCloud, label: "Cloud Hosting Accounts" },
    { icon: IconCode, label: "Developer Tools" },
    { icon: IconWallet, label: "Crypto Wallets" },
    { icon: IconTrendingUp, label: "Trading Platforms" },
    { icon: IconMail, label: "Email & Subscriptions" },
    { icon: IconGlobe, label: "Social Logins (Google/Apple)" },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Your Digital Life Is Everywhere.
            <br />
            <span className="text-muted-foreground">But Your Family Can&apos;t Access It.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No unified system exists to prepare encrypted recovery data across all your platforms.
          </p>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
            >
              <item.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold">{item.label}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionSection() {
  const features = [
    {
      icon: IconScan,
      title: "Automatic Account Detection",
      description: "Connect your email to automatically discover and catalog your digital accounts across platforms.",
    },
    {
      icon: IconDatabase,
      title: "Encrypted Digital Vault",
      description: "Store recovery instructions and sensitive information in a zero-knowledge encrypted vault.",
    },
    {
      icon: IconUserCheck,
      title: "Trusted Contact Release System",
      description: "Define conditions and trusted contacts who can receive your secured information when needed.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-secondary relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <IconShield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">The HAVEN Solution</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            One Unified Vault
            <br />
            <span className="text-primary">For Everything That Matters</span>
          </h2>
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-card rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { step: "01", title: "Sign Up Securely", description: "Create your encrypted HAVEN account with industry-standard security." },
    { step: "02", title: "Connect Email", description: "Link your email for automated account discovery across platforms." },
    { step: "03", title: "Add Trusted Contacts", description: "Designate the people you trust to receive your information." },
    { step: "04", title: "Set Release Conditions", description: "HAVEN releases secure instructions only when your chosen conditions are met." },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple steps to secure your digital legacy
          </p>
        </motion.div>
        
        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-primary/20 rounded-full -translate-y-1/2" />
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-card rounded-3xl p-8 text-center shadow-lg relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SecuritySection() {
  const features = [
    "End-to-end encrypted vault",
    "AES + RSA hybrid encryption",
    "Zero server visibility",
    "Multi-contact approval",
    "No bypassing 2FA or platform security",
    "Only user-approved instructions are shared",
  ];

  return (
    <section id="security" className="py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <IconLock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Bank-Grade Security</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Zero-Knowledge Encryption.
              <br />
              <span className="text-primary">Maximum Control.</span>
            </h2>
    
            <p className="text-lg text-muted-foreground mb-8">
              Your data is encrypted before it leaves your device. We can&apos;t see it, 
              and neither can anyone else—unless you authorize them.
            </p>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <IconCheck className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-2xl" />
              <div className="relative glass-card rounded-3xl p-8 h-full flex flex-col items-center justify-center">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[IconShield, IconLock, IconKey, IconServer].map((Icon, i) => (
                    <div key={i} className="w-20 h-20 glass-card rounded-2xl flex items-center justify-center animate-float" style={{ animationDelay: `${i * 0.3}s` }}>
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Protected by HAVEN</h3>
                  <p className="text-sm text-muted-foreground">Military-grade encryption</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function UseCasesSection() {
  const useCases = [
    { icon: IconCode, title: "Developers", description: "GitHub, SSH keys, cloud backups, API credentials" },
    { icon: IconTrendingUp, title: "Investors", description: "Trading accounts, brokerage access, nominee details" },
    { icon: IconLockBitcoin, title: "Crypto Users", description: "Seed phrase guidance, wallet recovery instructions" },
    { icon: IconBuilding, title: "Businesses", description: "Hosting continuity, admin access, service credentials" },
    { icon: IconHeart, title: "Families", description: "Photos, documents, shared subscriptions" },
    { icon: IconBooks, title: "Students", description: "Email accounts, subscription management" },
  ];

  return (
    <section id="use-cases" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Built For <span className="text-primary">Everyone</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            HAVEN adapts to your digital life, whatever it looks like
          </p>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-secondary">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Start Securing Your
            <br />
            <span className="text-primary">Digital World Today</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Join thousands who trust HAVEN to protect their digital legacy
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
              Create Your Haven
              <IconArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Gemini_Generated_Image_x6j2tix6j2tix6j2-removebg-preview-1765875341255.png?width=8000&height=8000&resize=contain" 
                alt="HAVEN Logo" 
                className="w-10 h-10 object-contain dark:invert"
              />
              <span className="text-xl font-bold tracking-tight">HAVEN</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Privacy-first digital inheritance for the modern world.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#security" className="hover:text-foreground transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" id="faq" className="hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HAVEN. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <IconUsers className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <IconGlobe className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <IconMail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <SecuritySection />
      <UseCasesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
