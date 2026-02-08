import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ScoutForm } from './components/ScoutForm';
import { ScoutList } from './components/ScoutList';
import { TeamComparison } from './components/TeamComparison';
import { Footer } from './components/Footer';
import type { ScoutEntry } from './types';

function App() {
  // Initialize theme from localStorage or default to 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
  });

  // Tab management
  const [activeTab, setActiveTab] = useState<'scout' | 'compare'>('scout');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // Save theme to localStorage whenever it changes
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Enable transitions after initial mount to prevent flash
  useEffect(() => {
    // Small delay to ensure initial render is complete
    const timer = setTimeout(() => {
      document.body.classList.add('theme-transitions-enabled');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const [entries, setEntries] = useState<ScoutEntry[]>([
    {
      id: '1',
      scoutName: 'ITOBOT',
      teamNumber: '6038',
      matchNumber: '1',
      teamName: 'ZAP',
      driverSkill: 10,
      autonomousNotes: '',
      teleopNotes: '',
      generalNotes: '',
      timestamp: '15:46:56',
      date: new Date().toLocaleDateString('tr-TR')
    }
  ]);

  const [editingEntry, setEditingEntry] = useState<ScoutEntry | null>(null);

  const handleAddEntry = (entry: ScoutEntry) => {
    setEntries(prev => [entry, ...prev]);
  };

  const handleUpdateEntry = (updatedEntry: ScoutEntry) => {
    setEntries(prev => prev.map(entry =>
      entry.id === updatedEntry.id ? updatedEntry : entry
    ));
    setEditingEntry(null);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    if (editingEntry?.id === id) {
      setEditingEntry(null);
    }
  };

  const handleEditClick = (entry: ScoutEntry) => {
    setEditingEntry(entry);
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
  };

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="container mt-4">
        {/* Tab Navigation */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'scout' ? 'active' : ''}`}
              onClick={() => setActiveTab('scout')}
            >
              📝 Scout
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'compare' ? 'active' : ''}`}
              onClick={() => setActiveTab('compare')}
            >
              📊 Compare Teams
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        {activeTab === 'scout' ? (
          <div className="row">
            <div className="col-lg-4 mb-4">
              <ScoutForm
                key={editingEntry ? editingEntry.id : 'new-entry'}
                onAdd={handleAddEntry}
                onUpdate={handleUpdateEntry}
                initialData={editingEntry}
                onCancelEdit={handleCancelEdit}
              />
            </div>

            <div className="col-lg-8">
              <ScoutList
                entries={entries}
                onDelete={handleDeleteEntry}
                onEdit={handleEditClick}
              />
            </div>
          </div>
        ) : (
          <TeamComparison entries={entries} />
        )}
      </div>
      <Footer />
    </>
  );
}

export default App;
