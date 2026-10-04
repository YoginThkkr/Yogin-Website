import Navbar from "./components/Navbar";
import IntroSection from "./components/IntroSection";
import ResumeSection from "./components/ResumeSection";
import WorksSection from "./components/WorksSection";
import SkillsSection from "./components/SkillsSection";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-page font-sans text-black">
      <Navbar />
      <main>
        <IntroSection />
        <ResumeSection />
        <WorksSection />
        <SkillsSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
