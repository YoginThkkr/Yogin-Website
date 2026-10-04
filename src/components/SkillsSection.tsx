import { usePortfolio } from "../hooks/usePortfolio";

export default function SkillsSection() {
  const { skills } = usePortfolio();
  if (skills.categories.length === 0) return null;

  return (
    <section id="skills" className="section-pad">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="section-title font-display">Skills</h2>
        <div className="toolkit-grid">
          {skills.categories.map((category) => (
            <div key={category.name}>
              <h3 className="toolkit-name">{category.name}</h3>
              <ul className="toolkit-list">
                {category.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
