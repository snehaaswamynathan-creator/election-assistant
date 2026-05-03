import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Calendar, 
  CheckSquare, 
  MessageSquare, 
  Search, 
  MapPin, 
  Newspaper, 
  ShieldCheck, 
  Users, 
  HelpCircle, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Mic, 
  Send, 
  ChevronRight, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Award,
  Type
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const App = () => {
  // ─── State Management ──────────────────────────────────────────────────────────
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('EN');
  const [textScale, setTextScale] = useState(1);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Namaste! I am your AI Election Assistant. How can I help you today?", 
      sender: 'bot',
      type: 'gemini'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [epicNumber, setEpicNumber] = useState('');
  const [voterName, setVoterName] = useState('');
  const [voterState, setVoterState] = useState('');
  const [searchMode, setSearchMode] = useState('epic'); // 'epic', 'gps', 'name'
  const [boothResults, setBoothResults] = useState([]);
  const [isSearchingBooth, setIsSearchingBooth] = useState(false);
  const messagesEndRef = useRef(null);

  // ─── Translations ─────────────────────────────────────────────────────────────
  const t = {
    EN: {
      brand: 'CivicGuide',
      subBrand: 'Indian Election Portal 2026',
      mainMenu: 'Main Menu',
      dashboard: 'Dashboard',
      timeline: 'Process Timeline',
      checklist: 'Voter Readiness',
      assistant: 'AI Assistant',
      parties: 'Political Parties',
      booth: 'Find Booth',
      news: 'Verified News',
      settings: 'Settings',
      heroTitle: 'Your Voice, Your Power',
      heroSub: 'Get real-time updates for the 2026 Assembly Elections.',
      totalElectors: 'Total Electors',
      pollingStations: 'Polling Stations',
      seats: 'Assembly Seats',
      turnout: 'Avg Turnout',
      majorityLabel: 'Majority',
      liveUpdates: 'LIVE UPDATES',
      searchBooth: 'Find Your Polling Booth',
      epicPlaceholder: 'Enter EPIC Number...',
      recentSearches: 'Recent Searches',
      streakTitle: 'Civic Streak',
      streakBadge: 'First Voter Badge',
      streakSub: 'Complete your registration checklist to unlock this badge.',
      newsTitle: 'ECI News Feed',
      official: 'Official',
      factCheck: 'Fact Check',
      alert: 'Alert',
      namaste: 'Namaste! I am your AI Election Assistant. How can I help you today?',
      askPlaceholder: 'Ask about voter list, ID, polling...',
      readyTasks: 'tasks completed. You are',
      readyToVote: 'ready to vote!',
      viewAll: 'View All Parties',
      assembly2026: '2026 Assembly Elections'
    },
    HI: {
      brand: 'सिभिकगाइड',
      subBrand: 'भारतीय चुनाव पोर्टल 2026',
      mainMenu: 'मुख्य मेनू',
      dashboard: 'डैशबोर्ड',
      timeline: 'चुनाव प्रक्रिया',
      checklist: 'मतदाता तत्परता',
      assistant: 'AI सहायक',
      parties: 'राजनीतिक दल',
      booth: 'बूथ खोजें',
      news: 'सत्यापित समाचार',
      settings: 'सेटिंग्स',
      heroTitle: 'आपकी आवाज़, आपकी शक्ति',
      heroSub: '2026 विधानसभा चुनावों के लिए रीयल-टाइम अपडेट प्राप्त करें।',
      totalElectors: 'कुल मतदाता',
      pollingStations: 'मतदान केंद्र',
      seats: 'विधानसभा सीटें',
      turnout: 'औसत मतदान',
      majorityLabel: 'बहुमत',
      liveUpdates: 'लाइव अपडेट',
      searchBooth: 'अपना मतदान केंद्र खोजें',
      epicPlaceholder: 'एपिक नंबर दर्ज करें...',
      recentSearches: 'हाल की खोजें',
      streakTitle: 'नागरिक स्ट्रीक',
      streakBadge: 'प्रथम मतदाता बैज',
      streakSub: 'इस बैज को अनलॉक करने के लिए अपनी पंजीकरण चेकलिस्ट पूरी करें।',
      newsTitle: 'ECI समाचार फ़ीड',
      official: 'आधिकारिक',
      factCheck: 'तथ्य जाँच',
      alert: 'चेतावनी',
      namaste: 'नमस्ते! मैं आपका AI चुनाव सहायक हूँ। आज मैं आपकी क्या मदद कर सकता हूँ?',
      askPlaceholder: 'मतदाता सूची, आईडी, मतदान के बारे में पूछें...',
      readyTasks: 'कार्य पूरे हुए। आप',
      readyToVote: 'वोट देने के लिए तैयार हैं!',
      viewAll: 'सभी दल देखें',
      assembly2026: '2026 विधानसभा चुनाव'
    }
  };

  const curr = t[language];

  // ─── Core Data ────────────────────────────────────────────────────────────────
  const parties = [
    { name: 'BJP', full: 'Bharatiya Janata Party', symbol: '🪷', color: '#FF9933', alliance: 'NDA', leader: 'J.P. Nadda', seats: 240, status: 'Steady', manifesto: 'https://www.bjp.org/manifesto' },
    { name: 'INC', full: 'Indian National Congress', symbol: '✋', color: '#19AAED', alliance: 'I.N.D.I.A', leader: 'Mallikarjun Kharge', seats: 99, status: 'Gaining', manifesto: 'https://www.inc.in/manifesto' },
    { name: 'SP', full: 'Samajwadi Party', symbol: '🚲', color: '#FF0000', alliance: 'I.N.D.I.A', leader: 'Akhilesh Yadav', seats: 37, status: 'Strong', manifesto: 'https://www.samajwadiparty.in' },
    { name: 'TMC', full: 'Trinamool Congress', symbol: '🌿', color: '#20C641', alliance: 'I.N.D.I.A', leader: 'Mamata Banerjee', seats: 29, status: 'Steady', manifesto: 'https://aitmc.org' },
    { name: 'DMK', full: 'Dravida Munnetra Kazhagam', symbol: '☀️', color: '#E40000', alliance: 'I.N.D.I.A', leader: 'M.K. Stalin', seats: 22, status: 'Dominant', manifesto: 'https://dmk.in' },
    { name: 'AAP', full: 'Aam Aadmi Party', symbol: '🧹', color: '#0072B0', alliance: 'I.N.D.I.A', leader: 'Arvind Kejriwal', seats: 3, status: 'Rising', manifesto: 'https://aamaadmiparty.org' },
    { name: 'BSP', full: 'Bahujan Samaj Party', symbol: '🐘', color: '#0000FF', alliance: 'None', leader: 'Mayawati', seats: 0, status: 'Testing', manifesto: 'https://bspindia.org' },
    { name: 'CPI(M)', full: 'Communist Party of India (Marxist)', symbol: '🔨', color: '#DE0000', alliance: 'I.N.D.I.A', leader: 'Sitaram Yechury', seats: 4, status: 'Steady', manifesto: 'https://cpim.org' },
  ];

  const newsItems = [
    { 
      id: 1, 
      tag: curr.official, 
      type: 'official', 
      title: 'ECI Announces Phase 6 Security Protocols for Sensitive Booths', 
      source: 'PIB India',
      time: '2h ago',
      link: 'https://pib.gov.in/PressReleasePage.aspx?PRID=ECI2026'
    },
    { 
      id: 2, 
      tag: curr.factCheck, 
      type: 'fake', 
      title: 'Clarification: No Changes to EVM Counting Procedure for 2026', 
      source: 'ECI Fact Check',
      time: '5h ago',
      link: 'https://eci.gov.in/fact-check'
    },
    { 
      id: 3, 
      tag: curr.alert, 
      type: 'alert', 
      title: 'Deadline Alert: Last 24 Hours for Voter List Corrections in Phase 7', 
      source: 'Voter Service Portal',
      time: '8h ago',
      link: 'https://voters.eci.gov.in/notices'
    },
    { 
      id: 4, 
      tag: curr.official, 
      type: 'official', 
      title: 'New "Voter Buddy" AI Assistant Launched for Rural Constituencies', 
      source: 'ECI News',
      time: '12h ago',
      link: 'https://eci.gov.in/news'
    }
  ];

  const timelineSteps = [
    { date: 'Mar 16, 2026', title: 'Announcement', desc: 'Election dates announced, MCC starts.', status: 'done' },
    { date: 'Apr 19, 2026', title: 'Phase 1', desc: 'Voting in 102 constituencies.', status: 'done' },
    { date: 'May 20, 2026', title: 'Phase 5', desc: 'Voting in 49 constituencies.', status: 'done' },
    { date: 'May 25, 2026', title: 'Phase 6', desc: 'Voting in 58 constituencies.', status: 'active' },
    { date: 'Jun 01, 2026', title: 'Phase 7', desc: 'Final phase of polling.', status: 'pending' },
    { date: 'Jun 04, 2026', title: 'Results', desc: 'Counting of votes and declaration.', status: 'pending' },
  ];

  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Check your name in the Voter List', checked: true },
    { id: 2, text: 'Download e-EPIC (Voter ID)', checked: false },
    { id: 3, text: 'Find your Polling Station', checked: false },
    { id: 4, text: 'Know your Candidates', checked: false },
    { id: 5, text: 'Keep ID ready (Aadhaar/EPIC)', checked: true },
  ]);

  // Comprehensive Booth Database with Categories
  const boothDatabase = [
    { id: 1, epic: 'ABC1001', category: 'School', name: "Kendriya Vidyalaya, Sector 4", address: "Dwarka, New Delhi - 110075", room: "Room 12", officer: "Rajesh Kumar", sensitive: true, distance: "0.8 km", lat: 28.5921, lng: 77.0460 },
    { id: 2, epic: 'ABC1002', category: 'School', name: "Government Primary School, East Wing", address: "Block B, Lajpat Nagar, New Delhi - 110024", room: "Hall 1", officer: "Sunita Sharma", sensitive: false, distance: "1.2 km", lat: 28.5677, lng: 77.2433 },
    { id: 3, epic: 'ABC1003', category: 'School', name: "Sanskriti School", address: "Chanakyapuri, New Delhi - 110021", room: "Auditorium", officer: "Anjali Singh", sensitive: false, distance: "0.4 km", lat: 28.5983, lng: 77.1830 },
    { id: 4, epic: 'ABC1004', category: 'School', name: "Delhi Public School", address: "Sector 12, R.K. Puram, New Delhi - 110022", room: "Room 101", officer: "Vikram Mehta", sensitive: false, distance: "1.1 km", lat: 28.5638, lng: 77.1705 },
    { id: 5, epic: 'ABC1005', category: 'School', name: "St. Xavier's High School", address: "Raj Niwas Marg, New Delhi - 110054", room: "Library Hall", officer: "George D'Souza", sensitive: true, distance: "2.3 km", lat: 28.6738, lng: 77.2273 },
    { id: 11, epic: 'ABC1011', category: 'Hospital', name: "AIIMS Polling Center", address: "Ansari Nagar, New Delhi - 110029", room: "OPD Hall 2", officer: "Dr. Sandeep Guleria", sensitive: false, distance: "1.5 km", lat: 28.5672, lng: 77.2100 },
    { id: 12, epic: 'ABC1012', category: 'Hospital', name: "Safdarjung Community Center", address: "Safdarjung Enclave, New Delhi - 110029", room: "Ground Floor", officer: "Meena Rai", sensitive: false, distance: "1.8 km", lat: 28.5633, lng: 77.2000 },
    { id: 13, epic: 'ABC1013', category: 'Community', name: "Sector 15 Community Center", address: "Rohini, New Delhi - 110085", room: "Main Hall", officer: "Amitabh Kant", sensitive: false, distance: "5.4 km", lat: 28.7185, lng: 77.1120 },
    { id: 14, epic: 'ABC1014', category: 'Community', name: "Bhim Rao Ambedkar Stadium", address: "Delhi Gate, New Delhi - 110002", room: "Gate 3 Room", officer: "Suresh Prabhu", sensitive: true, distance: "3.1 km", lat: 28.6360, lng: 77.2394 },
    { id: 15, epic: 'ABC1015', category: 'Police', name: "Delhi Police Training School", address: "Jharoda Kalan, New Delhi - 110072", room: "Admin Block", officer: "CP Amulya Patnaik", sensitive: true, distance: "12.5 km", lat: 28.6256, lng: 76.9450 },
  ];

  const [selectedCategory, setSelectedCategory] = useState('All');

  // Leaflet Map Component
  const LeafletMap = ({ results }) => {
    const mapRef = useRef(null);
    const leafletMapInstance = useRef(null);
    const markersGroup = useRef(null);

    useEffect(() => {
      if (!mapRef.current) return;

      if (!leafletMapInstance.current) {
        leafletMapInstance.current = L.map(mapRef.current).setView([28.6139, 77.2090], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(leafletMapInstance.current);
        markersGroup.current = L.layerGroup().addTo(leafletMapInstance.current);
      }

      if (results && results.length > 0) {
        markersGroup.current.clearLayers();
        const bounds = [];
        results.forEach(booth => {
          if (booth.lat && booth.lng) {
            const marker = L.marker([booth.lat, booth.lng])
              .bindPopup(`<b>${booth.name}</b><br>${booth.address}`)
              .addTo(markersGroup.current);
            bounds.push([booth.lat, booth.lng]);
          }
        });
        
        if (bounds.length > 0) {
          leafletMapInstance.current.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    }, [results]);

    return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 'inherit' }} />;
  };

  const toggleCheck = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const completedCount = checklist.filter(i => i.checked).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  // ─── Effects ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--text-scale', textScale);
  }, [textScale]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Update initial message when language changes
  useEffect(() => {
    setMessages(prev => [
      { id: 1, text: curr.namaste, sender: 'bot', type: 'gemini' },
      ...prev.slice(1)
    ]);
  }, [language]);

  // ─── Handlers ─────────────────────────────────────────────────────────────────
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput })
      });
      const data = await res.json();
      
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: data.text,
        type: data.type,
        actionText: data.actionText,
        actionLink: data.actionLink
      }]);
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        id: Date.now()+1, 
        text: "I'm having trouble connecting to the backend server. Please ensure the server is running on port 3000.", 
        sender: 'bot' 
      }]);
    }
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInputValue("Where is my polling booth?");
      }, 2000);
    }
  };

  const handleBoothSearch = (e) => {
    if (e) e.preventDefault();
    setIsSearchingBooth(true);
    setBoothResults([]);

    // Simulate API call with keyword search
    setTimeout(() => {
      setIsSearchingBooth(false);
      let results = [];
      
      const query = (searchMode === 'epic' ? epicNumber : voterName).toLowerCase().trim();
      
      if (!query && searchMode !== 'gps') {
        setIsSearchingBooth(false);
        return;
      }

      if (searchMode === 'epic') {
        results = boothDatabase.filter(b => b.epic.toLowerCase().includes(query));
      } else if (searchMode === 'gps') {
        results = boothDatabase.slice(0, 5); // Simulate nearby
      } else if (searchMode === 'name') {
        results = boothDatabase.filter(b => 
          (selectedCategory === 'All' || b.category === selectedCategory) &&
          (b.name.toLowerCase().includes(query) || 
           b.address.toLowerCase().includes(query) ||
           b.officer.toLowerCase().includes(query))
        );
      }
      
      // If no results found, provide some similar ones or generic ones
      if (results.length === 0 && query) {
        results = boothDatabase.filter(b => 
          b.name.toLowerCase().includes('school') || 
          b.name.toLowerCase().includes('vidyalaya')
        ).slice(0, 2);
      }

      setBoothResults(results);
    }, 1200);
  };

  const parseInteractiveContent = (text) => {
    const stepsMatch = text.match(/\[STEPS: (.*?)\]/);
    const timelineMatch = text.match(/\[TIMELINE: (.*?)\]/);
    
    let cleanText = text.replace(/\[STEPS: .*?\]/, '').replace(/\[TIMELINE: .*?\]/, '').trim();
    let interactive = null;

    if (stepsMatch) {
      const steps = stepsMatch[1].split(',').map(s => {
        const [title, desc] = s.split('|').map(x => x.trim());
        return { title, desc };
      });
      interactive = { type: 'steps', data: steps };
    } else if (timelineMatch) {
      const events = timelineMatch[1].split(',').map(e => {
        const [date, event] = e.split('|').map(x => x.trim());
        return { date, event };
      });
      interactive = { type: 'timeline', data: events };
    }

    return { cleanText, interactive };
  };

  // ─── Sub-Components ──────────────────────────────────────────────────────────
  const NavButton = ({ id, icon: Icon, label, badge, live }) => (
    <button 
      className={`nav-btn ${currentTab === id ? 'active' : ''}`} 
      onClick={() => setCurrentTab(id)}
    >
      <Icon size={18} />
      <span>{label}</span>
      {badge && <span className="nav-btn-badge">{badge}</span>}
      {live && <span className="live-dot" />}
    </button>
  );

  const StatCard = ({ icon: Icon, value, label, color, change }) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: `${color}15`, color: color }}>
        <Icon size={20} />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {change && <div className="stat-change" style={{ color: change.startsWith('+') ? 'var(--success)' : 'var(--error)' }}>{change}</div>}
      </div>
    </div>
  );

  // ─── Main Render ─────────────────────────────────────────────────────────────
  return (
    <div className="app-shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">
            <div className="brand-icon">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="brand-title tricolor-text">{curr.brand}</div>
              <div className="brand-sub">{curr.subBrand}</div>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">{curr.mainMenu}</div>
          <NavButton id="dashboard" icon={Home} label={curr.dashboard} live />
          <NavButton id="timeline" icon={Calendar} label={curr.timeline} />
          <NavButton id="checklist" icon={CheckSquare} label={curr.checklist} />
          <NavButton id="assistant" icon={MessageSquare} label={curr.assistant} badge="2.0" />
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">{curr.newsTitle}</div>
          <NavButton id="parties" icon={Users} label={curr.parties} />
          <NavButton id="booth" icon={MapPin} label={curr.booth} />
          <NavButton id="news" icon={Newspaper} label={curr.news} badge="NEW" />
        </div>

        <div className="sidebar-section" style={{ marginTop: 'auto', borderTop: '1px solid var(--border)' }}>
          <NavButton id="settings" icon={ShieldCheck} label={curr.settings} />
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="main-area">
        <div className="tricolor-stripe" />
        
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="tricolor-text">
              {curr[currentTab] || currentTab}
            </h1>
            <p>{curr.heroSub}</p>
          </div>
          <div className="topbar-right">
            <button className="btn-icon btn-ghost" onClick={() => setTextScale(prev => prev === 1.2 ? 1 : 1.2)}>
              <Type size={18} />
            </button>
            <button className="btn-icon btn-ghost" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <div className="divider" style={{ width: '1px', height: '24px', margin: '0 8px' }} />
            <button className="btn btn-secondary btn-sm" onClick={() => setLanguage(language === 'EN' ? 'HI' : 'EN')}>
              {language === 'EN' ? 'हिन्दी' : 'English'}
            </button>
          </div>
        </header>

        <div className="page-content">
          <AnimatePresence mode="wait">
            {currentTab === 'dashboard' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="dashboard">
                <div className="hero-banner">
                  <img src="/india_election_hero.png" alt="Election Banner" className="hero-img" />
                  <div className="hero-content">
                    <div className="hero-badge">
                      <TrendingUp size={14} /> LIVE: {curr.assembly2026}
                    </div>
                    <h2 className="hero-title">{curr.heroTitle}</h2>
                    <p className="hero-sub">{curr.heroSub}</p>
                  </div>
                </div>

                <div className="grid grid-4">
                  <StatCard icon={Users} value="98.2Cr" label={curr.totalElectors} color="#1a237e" change="+1.8%" />
                  <StatCard icon={MapPin} value="11.2L" label={curr.pollingStations} color="#2E7D32" />
                  <StatCard icon={ShieldCheck} value="403" label={curr.seats} color="#FF6B00" />
                  <StatCard icon={TrendingUp} value="72.1%" label={curr.turnout} color="#3949ab" change="+4.2%" />
                </div>

                <div className="grid grid-2" style={{ marginTop: '1.5rem' }}>
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title"><TrendingUp size={18} color="var(--primary)" /> {curr.liveUpdates}</h3>
                      <span className="badge badge-live">2026 LIVE</span>
                    </div>
                    <div className="card-body">
                      <div className="majority-line">
                        <div className="majority-marker" style={{ left: '50.1%' }} />
                        <div className="majority-label" style={{ left: '50.1%' }}>202 ({curr.majorityLabel})</div>
                        <div className="tri-seg" style={{ width: '53%', background: 'var(--saffron)' }} />
                        <div className="tri-seg" style={{ width: '40%', background: 'var(--navy)' }} />
                        <div className="tri-seg" style={{ width: '7%', background: 'var(--text-muted)' }} />
                      </div>
                      
                      <div className="grid grid-2" style={{ marginTop: '2rem' }}>
                        {parties.slice(0, 4).map(p => (
                          <div className="party-card" key={p.name}>
                            <div className="party-emblem" style={{ backgroundColor: `${p.color}20`, color: p.color }}>{p.symbol}</div>
                            <div>
                              <div className="party-name">{p.name}</div>
                              <div className="party-alliance-tag" style={{ backgroundColor: `${p.color}15`, color: p.color }}>{p.alliance}</div>
                            </div>
                            <div className="party-seats" style={{ color: p.color }}>{p.seats}</div>
                          </div>
                        ))}
                      </div>
                      <button className="btn btn-ghost" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setCurrentTab('parties')}>
                        {curr.viewAll} <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title"><Newspaper size={18} color="var(--primary)" /> {curr.newsTitle}</h3>
                    </div>
                    <div className="card-body">
                      {newsItems.map(news => (
                        <div className="news-item" key={news.id} onClick={() => window.open(news.link, '_blank')} style={{ cursor: 'pointer' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div className={`news-tag tag-${news.type}`}>
                                {news.type === 'official' && <ShieldCheck size={10} />}
                                {news.type === 'fake' && <X size={10} />}
                                {news.tag}
                              </div>
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', fontWeight: 600 }}>• {news.source}</span>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.5rem', lineHeight: 1.4 }}>{news.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={10} /> {news.time}
                            </div>
                          </div>
                          <div className="news-arrow">
                            <ChevronRight size={16} color="var(--border)" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentTab === 'assistant' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
                <div className="card-header">
                  <h3 className="card-title"><MessageSquare size={18} color="var(--primary)" /> {curr.assistant}</h3>
                  <div className="badge badge-official">VERIFIED BY ECI 2026</div>
                </div>
                
                <div className="chat-wrap">
                  <div className="chat-msgs">
                    {messages.map(msg => {
                      const { cleanText, interactive } = parseInteractiveContent(msg.text);
                      return (
                        <motion.div key={msg.id} className={`msg-row ${msg.sender}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                          <div className={`msg-bubble ${msg.type || ''}`}>
                            {cleanText.split('\n').map((line, i) => (
                              <span key={i}>{line}{i < cleanText.split('\n').length - 1 && <br />}</span>
                            ))}

                            {interactive && interactive.type === 'steps' && (
                              <div className="interactive-steps">
                                {interactive.data.map((step, idx) => (
                                  <div key={idx} className="interactive-step">
                                    <div className="step-num">{idx + 1}</div>
                                    <div className="step-content">
                                      <div className="step-title">{step.title}</div>
                                      <div className="step-desc">{step.desc}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {interactive && interactive.type === 'timeline' && (
                              <div className="interactive-timeline">
                                {interactive.data.map((item, idx) => (
                                  <div key={idx} className="interactive-tl-item">
                                    <div className="tl-line" />
                                    <div className="tl-circle" />
                                    <div className="tl-content">
                                      <div className="tl-date">{item.date}</div>
                                      <div className="tl-event">{item.event}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          {msg.actionText && (
                            <button 
                              className="btn btn-primary btn-sm" 
                              style={{ marginTop: '0.5rem' }} 
                              onClick={() => {
                                if (msg.actionLink === '#booth') setCurrentTab('booth');
                                else window.open(msg.actionLink, '_blank');
                              }}
                            >
                              {msg.actionText}
                            </button>
                          )}
                        </motion.div>
                      );
                    })}
                    {isTyping && (
                      <div className="msg-row bot">
                        <div className="msg-bubble" style={{ display: 'flex', gap: '4px', padding: '1rem' }}>
                          <span className="live-dot" style={{ margin: 0, animationDelay: '0s' }} />
                          <span className="live-dot" style={{ margin: 0, animationDelay: '0.2s' }} />
                          <span className="live-dot" style={{ margin: 0, animationDelay: '0.4s' }} />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="quick-questions">
                    {['How to register?', 'Voter ID Download', 'EVM Security', 'Find my booth'].map(q => (
                      <button key={q} className="quick-chip" onClick={() => { setInputValue(q); handleSendMessage(); }}>{q}</button>
                    ))}
                  </div>

                  <form className="chat-bar" onSubmit={handleSendMessage}>
                    <button type="button" className={`chat-icon-btn mic ${isListening ? 'listening' : ''}`} onClick={toggleVoice}>
                      <Mic size={18} />
                    </button>
                    <input 
                      type="text" 
                      className="chat-input" 
                      placeholder={curr.askPlaceholder} 
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                    />
                    <button type="submit" className="chat-icon-btn" disabled={!inputValue.trim()}>
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {currentTab === 'timeline' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
                <div className="card-header">
                  <h3 className="card-title"><Calendar size={18} color="var(--primary)" /> {curr.assembly2026} {curr.timeline}</h3>
                </div>
                <div className="card-body">
                  <div className="timeline">
                    {timelineSteps.map((step, i) => (
                      <div className={`tl-item ${step.status}`} key={i}>
                        <div className="tl-dot" />
                        <div className="tl-date">{step.date}</div>
                        <div className="tl-title">{step.title}</div>
                        <div className="tl-desc">{step.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentTab === 'parties' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
                <div className="card-header">
                  <h3 className="card-title"><Users size={18} color="var(--primary)" /> Recognized Political Parties (2026)</h3>
                  <div className="badge badge-official">ECI LISTED</div>
                </div>
                <div className="card-body">
                  <div className="grid grid-2">
                    {parties.map(p => (
                      <div className="party-card-expanded" key={p.name} style={{ borderLeft: `4px solid ${p.color}` }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <div className="party-emblem-large" style={{ backgroundColor: `${p.color}15`, color: p.color }}>{p.symbol}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div className="party-name-large">{p.name}</div>
                              <div className="party-seats-large" style={{ color: p.color }}>{p.seats} Seats</div>
                            </div>
                            <div className="party-full-large">{p.full}</div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                              <span className="party-tag" style={{ background: 'var(--surface-hover)' }}>Leader: {p.leader}</span>
                              <span className="party-tag" style={{ background: `${p.color}10`, color: p.color }}>{p.alliance} Alliance</span>
                            </div>
                          </div>
                        </div>
                        <div className="party-footer" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => window.open(p.manifesto, '_blank')}>
                            View Manifesto
                          </button>
                          <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                            Candidate List
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentTab === 'checklist' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-2">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title"><CheckSquare size={18} color="var(--primary)" /> {curr.checklist}</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {checklist.map(item => (
                        <div className={`check-item ${item.checked ? 'checked' : ''}`} key={item.id} onClick={() => toggleCheck(item.id)}>
                          <div style={{ width: 20, height: 20, border: '2px solid var(--primary)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', background: item.checked ? 'var(--primary)' : 'transparent' }}>
                            {item.checked && <CheckSquare size={14} color="white" />}
                          </div>
                          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.text}</span>
                        </div>
                      ))}
                    </div>
                    <div className="info-box" style={{ marginTop: '1.5rem' }}>
                      <AlertCircle size={16} /> {completedCount}/{checklist.length} {curr.readyTasks} {progressPercent}% {curr.readyToVote}
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title"><Award size={18} color="var(--primary)" /> {curr.streakTitle}</h3>
                  </div>
                  <div className="card-body" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ width: 80, height: 80, background: 'rgba(255,107,0,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--saffron)' }}>
                      <Award size={40} />
                    </div>
                    <h4 style={{ fontWeight: 800, fontSize: '1.25rem' }}>{curr.streakBadge}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{curr.streakSub}</p>
                    <button className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', opacity: progressPercent === 100 ? 1 : 0.5 }}>
                      {progressPercent === 100 ? 'Share Badge' : 'Complete Tasks'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentTab === 'booth' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
                <div className="card-header">
                  <h3 className="card-title"><Search size={18} color="var(--primary)" /> {curr.searchBooth}</h3>
                </div>
                <div className="card-body">
                  <div className="search-tabs" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <button className={`btn btn-sm ${searchMode === 'epic' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setSearchMode('epic')}>
                      EPIC Search
                    </button>
                    <button className={`btn btn-sm ${searchMode === 'name' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setSearchMode('name')}>
                      Search by Name
                    </button>
                    <button className={`btn btn-sm ${searchMode === 'gps' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setSearchMode('gps'); handleBoothSearch(); }}>
                      <MapPin size={14} /> GPS Nearby
                    </button>
                  </div>

                  <div className="category-filter" style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {['All', 'School', 'Hospital', 'Community', 'Police'].map(cat => (
                      <button 
                        key={cat} 
                        className={`btn btn-sm ${selectedCategory === cat ? 'btn-secondary' : 'btn-ghost'}`} 
                        style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <form className="search-box" onSubmit={handleBoothSearch}>
                    {searchMode === 'epic' && (
                      <input 
                        type="text" 
                        placeholder={curr.epicPlaceholder} 
                        value={epicNumber}
                        onChange={(e) => setEpicNumber(e.target.value)}
                      />
                    )}
                    {searchMode === 'name' && (
                      <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                        <input 
                          type="text" 
                          placeholder="Full Name..." 
                          value={voterName}
                          onChange={(e) => setVoterName(e.target.value)}
                          style={{ flex: 2 }}
                        />
                        <input 
                          type="text" 
                          placeholder="State/District..." 
                          value={voterState}
                          onChange={(e) => setVoterState(e.target.value)}
                          style={{ flex: 1 }}
                        />
                      </div>
                    )}
                    {searchMode === 'gps' && (
                      <div style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem', flex: 1 }}>
                        Showing booths near your current location (New Delhi, 110001)
                      </div>
                    )}
                    {searchMode !== 'gps' && (
                      <button type="submit" disabled={isSearchingBooth}>
                        {isSearchingBooth ? 'Searching...' : 'Search'}
                      </button>
                    )}
                  </form>

                  <AnimatePresence>
                    {boothResults.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0 }}
                        style={{ marginTop: '2rem' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Found {boothResults.length} Polling Stations:</h4>
                          <span className="badge badge-official">{searchMode.toUpperCase()} RESULTS</span>
                        </div>
                        
                        <div className="grid grid-2" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {boothResults.map((booth) => (
                              <div className="card booth-result-card" key={booth.id} style={{ background: 'var(--surface-hover)', border: booth.sensitive ? '1px solid var(--error)' : '1px solid var(--border)' }}>
                                <div className="card-body" style={{ padding: '1rem' }}>
                                  <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div className="stat-icon" style={{ backgroundColor: booth.sensitive ? 'rgba(198,40,40,0.1)' : 'rgba(26,35,126,0.1)', color: booth.sensitive ? 'var(--error)' : 'var(--primary)' }}>
                                      <MapPin size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ fontWeight: 800, fontSize: '1rem' }}>{booth.name}</div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{booth.distance}</div>
                                      </div>
                                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{booth.address}</div>
                                      
                                      <div className="grid grid-2" style={{ marginTop: '1rem', gap: '0.5rem' }}>
                                        <div>
                                          <div style={{ fontSize: '0.65rem', color: 'var(--text-light)', fontWeight: 700 }}>ROOM</div>
                                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{booth.room}</div>
                                        </div>
                                        <div>
                                          <div style={{ fontSize: '0.65rem', color: 'var(--text-light)', fontWeight: 700 }}>BLO OFFICER</div>
                                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{booth.officer}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="card map-container" style={{ position: 'sticky', top: '1rem', height: '400px', overflow: 'hidden', background: '#e5e3df', zIndex: 5 }}>
                            <div className="map-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10, background: 'radial-gradient(circle, transparent 70%, rgba(0,0,0,0.1) 100%)' }} />
                            <LeafletMap results={boothResults} />
                            <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'white', padding: '0.5rem', borderRadius: '8px', boxShadow: 'var(--shadow-md)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', zIndex: 20 }}>
                              <TrendingUp size={12} /> Real-time GPS Tracking Active
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div style={{ marginTop: '2rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>{curr.recentSearches}</h4>
                    <div className="check-item" onClick={() => { setSearchMode('epic'); setEpicNumber('ABC1234567'); }}>
                      <MapPin size={18} color="var(--primary)" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Kendriya Vidyalaya, Sector 4</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Dwarka, New Delhi - 110075</div>
                      </div>
                      <div className="badge badge-official" style={{ marginLeft: 'auto' }}>SENSITIVE</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Mobile Nav ── */}
        <nav className="mobile-nav">
          <button className={`mobile-nav-btn ${currentTab === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentTab('dashboard')}>
            <Home size={20} />
            <span>{curr.dashboard}</span>
          </button>
          <button className={`mobile-nav-btn ${currentTab === 'timeline' ? 'active' : ''}`} onClick={() => setCurrentTab('timeline')}>
            <Calendar size={20} />
            <span>{curr.timeline}</span>
          </button>
          <button className={`mobile-nav-btn ${currentTab === 'assistant' ? 'active' : ''}`} onClick={() => setCurrentTab('assistant')}>
            <MessageSquare size={20} />
            <span>AI Chat</span>
          </button>
          <button className={`mobile-nav-btn ${currentTab === 'booth' ? 'active' : ''}`} onClick={() => setCurrentTab('booth')}>
            <MapPin size={20} />
            <span>Booth</span>
          </button>
        </nav>
      </main>
    </div>
  );
};

export default App;
