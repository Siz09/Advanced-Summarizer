import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Globe, 
  Shield, 
  Users, 
  Award, 
  Lightbulb,
  Target,
  Heart,
  Star,
  CheckCircle
} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Intelligence',
      description: 'Advanced GPT-4 technology ensures accurate, contextual summaries that capture the essence of your documents.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Globe,
      title: 'Global Language Support',
      description: 'Translate summaries into 100+ languages with professional-grade accuracy using cutting-edge translation APIs.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your documents are processed securely with end-to-end encryption. We never store your sensitive content.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Users,
      title: 'Built for Teams',
      description: 'Collaborate seamlessly with shared summaries, team workspaces, and enterprise-grade access controls.',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Documents Processed', icon: Award },
    { number: '10,000+', label: 'Happy Users', icon: Users },
    { number: '100+', label: 'Languages Supported', icon: Globe },
    { number: '99.9%', label: 'Uptime Guarantee', icon: Shield }
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-founder',
      bio: 'Former Google AI researcher with 10+ years in machine learning and natural language processing.',
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO & Co-founder',
      bio: 'Ex-Microsoft engineer specializing in scalable AI systems and enterprise software architecture.',
      image: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Head of AI Research',
      bio: 'PhD in Computational Linguistics from Stanford, leading our AI model development and optimization.',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const testimonials = [
    {
      name: 'David Kim',
      role: 'Research Director',
      company: 'TechCorp',
      content: 'SwiftSummary Pro has revolutionized how our team processes research papers. We save 10+ hours per week.',
      rating: 5
    },
    {
      name: 'Lisa Thompson',
      role: 'Content Manager',
      company: 'MediaFlow',
      content: 'The translation feature is incredible. We can now create multilingual content summaries in minutes.',
      rating: 5
    },
    {
      name: 'Ahmed Hassan',
      role: 'Legal Analyst',
      company: 'LawFirm Pro',
      content: 'Perfect for legal document analysis. The accuracy and speed are unmatched in the industry.',
      rating: 5
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          About 
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            {' '}SwiftSummary Pro
          </span>
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
          We're on a mission to make information more accessible through AI-powered 
          summarization and translation, helping professionals save time and break down language barriers.
        </p>
      </motion.div>

      {/* Mission & Vision */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-2 gap-8"
      >
        <div className="glass rounded-2xl p-8 border border-white/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          </div>
          <p className="text-white/80 leading-relaxed">
            To democratize access to information by providing intelligent summarization 
            tools that help people quickly understand and act on complex documents, 
            regardless of language or technical expertise.
          </p>
        </div>

        <div className="glass rounded-2xl p-8 border border-white/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Our Vision</h2>
          </div>
          <p className="text-white/80 leading-relaxed">
            A world where language barriers don't limit knowledge sharing, and where 
            anyone can quickly extract insights from any document, enabling faster 
            decision-making and global collaboration.
          </p>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Why Choose SwiftSummary Pro?
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="glass rounded-xl p-6 border border-white/20 hover:bg-white/10 transition-all duration-200"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-white/80 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-8 border border-white/20"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Trusted by Professionals Worldwide
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-white/70">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Team */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Meet Our Team
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="glass rounded-xl p-6 border border-white/20 text-center hover:bg-white/10 transition-all duration-200"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
              <p className="text-blue-300 mb-3">{member.role}</p>
              <p className="text-white/80 text-sm leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          What Our Users Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="glass rounded-xl p-6 border border-white/20 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-white/90 mb-4 leading-relaxed">"{testimonial.content}"</p>
              <div>
                <p className="text-white font-semibold">{testimonial.name}</p>
                <p className="text-white/70 text-sm">{testimonial.role} at {testimonial.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-2xl p-12 border border-white/20 text-center"
      >
        <Heart className="h-16 w-16 text-red-400 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Transform Your Workflow?
        </h2>
        <p className="text-white/80 mb-8 max-w-2xl mx-auto">
          Join thousands of professionals who save hours every day with AI-powered 
          document summarization and translation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="btn-primary">
            Start Free Trial
          </button>
          <button className="btn-secondary">
            Schedule Demo
          </button>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/70">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;