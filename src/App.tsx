import React from 'react';
import GridPlot from './components/GridPlot';
import ContactSection from './components/ContactSection';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <GridPlot />
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <ContactSection />
      </div>
    </div>
  );
}

export default App;