
import React, { useState, useMemo } from 'react';

// Define the structure for a historical event
interface HistoryEvent {
  year: number;
  yearDisplay: string;
  era: string;
  title: string;
  description: string;
  tags: string[];
}

// Mock data based on the user's provided timeline
export const historyEvents: HistoryEvent[] = [
    { year: -4500000000, yearDisplay: '4.5 Bya', era: 'Precambrian', title: 'Earth Forms', description: 'The planet Earth is formed from the solar nebula.', tags: ['Geology', 'Planet Formation'] },
    { year: -3500000000, yearDisplay: '3.5 Bya', era: 'Precambrian', title: 'First Life (Microbes)', description: 'The earliest forms of life, single-celled microorganisms, appear on Earth.', tags: ['Biology', 'Evolution'] },
    { year: -65000000, yearDisplay: '65 Mya', era: 'Mesozoic', title: 'Extinction of Dinosaurs', description: 'A mass extinction event leads to the demise of the dinosaurs, paving the way for mammals.', tags: ['Paleontology', 'Extinction Event'] },
    { year: -7000000, yearDisplay: '7 Mya', era: 'Cenozoic', title: 'Earliest Hominids', description: 'The first human-like ancestors (hominids) emerge in Africa.', tags: ['Anthropology', 'Human Evolution'] },
    { year: -2500000, yearDisplay: '2.5 Mya', era: 'Paleolithic', title: 'First Stone Tools', description: 'Early hominids begin to create and use the first stone tools, marking the beginning of the Paleolithic era.', tags: ['Archaeology', 'Technology'] },
    { year: -300000, yearDisplay: '300,000 BCE', era: 'Paleolithic', title: 'Homo Sapiens Appear', description: 'Anatomically modern humans, Homo sapiens, evolve in Africa.', tags: ['Human Evolution', 'Anthropology'] },
    { year: -40000, yearDisplay: '40,000 BCE', era: 'Paleolithic', title: 'Cave Art & Symbolic Culture', description: 'Humans begin to create cave paintings and other forms of art, indicating the development of symbolic thought.', tags: ['Art', 'Culture'] },
    { year: -12000, yearDisplay: '12,000 BCE', era: 'Neolithic', title: 'Neolithic Revolution', description: 'The transition from hunter-gatherer societies to agriculture and settlement begins, fundamentally changing human society.', tags: ['Agriculture', 'Civilization'] },
    { year: -3100, yearDisplay: '3100 BCE', era: 'Ancient History', title: 'First Egyptian Dynasty', description: 'Upper and Lower Egypt are unified, marking the beginning of the first dynasty and the rise of a powerful civilization.', tags: ['Egypt', 'Politics'] },
    { year: -2500, yearDisplay: '2500 BCE', era: 'Ancient History', title: 'Pyramids of Giza', description: 'The Great Pyramids of Giza are constructed, showcasing remarkable engineering and organizational skills.', tags: ['Egypt', 'Architecture', 'Wonder'] },
    { year: -500, yearDisplay: '500 BCE', era: 'Classical Antiquity', title: 'Age of Philosophers', description: 'A pivotal era for human thought, with figures like Buddha, Confucius, and Socrates laying philosophical foundations.', tags: ['Philosophy', 'Religion'] },
    { year: 0, yearDisplay: '0 CE', era: 'Classical Antiquity', title: 'Traditional Birth of Jesus', description: 'The approximate year marking the birth of Jesus Christ, a central figure in Christianity.', tags: ['Religion', 'Christianity'] },
    { year: 476, yearDisplay: '476 CE', era: 'Middle Ages', title: 'Fall of Western Roman Empire', description: 'The collapse of the Western Roman Empire marks a major turning point in European history.', tags: ['Rome', 'Europe', 'Politics'] },
    { year: 622, yearDisplay: '622 CE', era: 'Middle Ages', title: 'Hijra (Islamic Calendar Begins)', description: 'The migration of the Islamic prophet Muhammad from Mecca to Medina, marking the beginning of the Islamic calendar.', tags: ['Religion', 'Islam'] },
    { year: 1492, yearDisplay: '1492 CE', era: 'Renaissance', title: 'Columbus Reaches Americas', description: 'Christopher Columbus\'s voyage across the Atlantic initiates lasting contact between the Eastern and Western Hemispheres.', tags: ['Exploration', 'Colonization'] },
    { year: 1776, yearDisplay: '1776 CE', era: 'Modern Era', title: 'American Revolution', description: 'The thirteen American colonies declare independence from Great Britain, leading to the formation of the United States.', tags: ['USA', 'Revolution', 'Politics'] },
    { year: 1789, yearDisplay: '1789 CE', era: 'Modern Era', title: 'French Revolution', description: 'A period of radical social and political upheaval in France that had a lasting impact on modern history.', tags: ['France', 'Revolution', 'Politics'] },
    { year: 1800, yearDisplay: '1800s CE', era: 'Modern Era', title: 'Industrial Revolution', description: 'A period of major industrialization that saw the shift from agrarian societies to industrial and urban ones.', tags: ['Technology', 'Economy'] },
    { year: 1914, yearDisplay: '1914–1918 CE', era: 'Modern Era', title: 'World War I', description: 'A global conflict that reshaped the political map of Europe and led to unprecedented casualties.', tags: ['War', 'Global Conflict'] },
    { year: 1939, yearDisplay: '1939–1945 CE', era: 'Modern Era', title: 'World War II', description: 'The deadliest conflict in human history, involving more than 30 countries and resulting in an estimated 70–85 million fatalities.', tags: ['War', 'Global Conflict'] },
    { year: 1969, yearDisplay: '1969 CE', era: 'Modern Era', title: 'First Moon Landing', description: 'NASA\'s Apollo 11 mission successfully lands the first humans on the Moon, a monumental achievement in space exploration.', tags: ['Space', 'Technology', 'USA'] },
    { year: 1991, yearDisplay: '1991 CE', era: 'Modern Era', title: 'End of Cold War', description: 'The dissolution of the Soviet Union marks the end of the Cold War, a period of geopolitical tension between the US and the USSR.', tags: ['Politics', 'Cold War'] },
    { year: 2020, yearDisplay: '2020 CE', era: 'Modern Era', title: 'COVID-19 Pandemic', description: 'A global pandemic caused by the SARS-CoV-2 virus leads to widespread social and economic disruption.', tags: ['Health', 'Global Event'] },
    { year: 2025, yearDisplay: '2025 CE', era: 'Modern Era', title: 'Present Day', description: 'The current period, characterized by rapid technological advancement, globalization, and complex geopolitical challenges.', tags: ['Contemporary', 'Future'] },
];

const eras = ['All Eras', ...Array.from(new Set(historyEvents.map(e => e.era)))];

const eraDescriptions: { [key: string]: string } = {
  'All Eras': "A sweeping journey through time, from the planet's formation to the present day. Explore the major turning points that have shaped life, civilization, and the course of human history. Select an era to focus your exploration.",
  'Precambrian': "Spanning from Earth's formation to the emergence of complex life, this vast supereon covers nearly 90% of our planet's history. It was an age of volcanic activity, the formation of continents, and the slow, quiet rise of the first single-celled organisms in the primordial oceans.",
  'Mesozoic': "Known as the 'Age of Reptiles,' the Mesozoic Era was dominated by dinosaurs on land, pterosaurs in the sky, and massive marine reptiles in the seas. It witnessed the breakup of the supercontinent Pangaea and ended with a cataclysmic extinction event that changed the course of life forever.",
  'Cenozoic': "Following the extinction of the dinosaurs, the Cenozoic Era—the 'Age of Mammals'—began. Mammals diversified and grew, eventually leading to the emergence of the first hominids. This is the era of rising mountains, cooling climates, and the world we recognize today.",
  'Paleolithic': "The 'Old Stone Age' marks the dawn of humanity. During this vast period, early humans developed the first stone tools, mastered fire, created cave art, and lived as hunter-gatherers, spreading across the globe in nomadic bands.",
  'Neolithic': "The 'New Stone Age' sparked a revolution in human history. The development of agriculture and the domestication of animals allowed for permanent settlements, the rise of villages, and the foundation for complex civilizations to emerge.",
  'Ancient History': "This era witnessed the birth of the world's first great civilizations in Mesopotamia, Egypt, the Indus Valley, and China. It was an age of writing, monumental architecture like the pyramids, codified laws, and the formation of empires.",
  'Classical Antiquity': "Centered around the Mediterranean, this era was defined by the cultural and intellectual achievements of Greece and the vast political and engineering power of Rome. It laid the foundations for Western philosophy, democracy, art, and law.",
  'Middle Ages': "Following the fall of Rome, this period in European history was characterized by the rise of feudalism, the dominance of the Christian Church, and the great migrations of peoples. It was also an age of knights, castles, and the flourishing of Islamic and Byzantine civilizations.",
  'Renaissance': "A fervent period of European cultural, artistic, political, and economic 'rebirth' following the Middle Ages. Marked by a rediscovery of classical philosophy and a flourishing of art and science, it set the stage for the modern world.",
  'Modern Era': "From the Age of Exploration to the digital age, this period is defined by global interconnection, scientific revolutions, industrialization, and rapid political change. It has seen the rise and fall of empires, two World Wars, and the dawn of space exploration.",
};


const HistoryExplorer: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<HistoryEvent>(historyEvents[8]); // Default to a relevant event
  const [activeEra, setActiveEra] = useState<string>('All Eras');

  const filteredEvents = useMemo(() => {
    if (activeEra === 'All Eras') {
      return historyEvents;
    }
    return historyEvents.filter(event => event.era === activeEra);
  }, [activeEra]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
      {/* Left Column: Timeline & Filters */}
      <div className="md:col-span-1 bg-white dark:bg-brand-dark-secondary p-6 rounded-lg shadow-sm flex flex-col h-full">
        <h2 className="font-serif text-3xl font-bold text-brand-dark dark:text-brand-light mb-4">Historical Eras</h2>
        <div className="mb-6 bg-brand-light-secondary dark:bg-brand-dark-tertiary p-4 rounded-lg border border-gray-200 dark:border-brand-dark-tertiary">
          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{eraDescriptions[activeEra]}</p>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {eras.map(era => (
            <button
              key={era}
              onClick={() => setActiveEra(era)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                activeEra === era
                  ? 'bg-brand-accent text-white'
                  : 'bg-brand-light-secondary dark:bg-brand-dark-tertiary text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {era}
            </button>
          ))}
        </div>
        <h2 className="font-serif text-3xl font-bold text-brand-dark dark:text-brand-light mb-4">Timeline</h2>
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-4">
            {filteredEvents.map(event => (
              <div
                key={event.year}
                onClick={() => setSelectedEvent(event)}
                className="mb-8 ml-8 cursor-pointer group"
              >
                <span className={`absolute -left-[9px] flex items-center justify-center w-4 h-4 rounded-full ring-4 ring-white dark:ring-brand-dark-secondary transition-colors ${
                  selectedEvent.year === event.year ? 'bg-brand-accent' : 'bg-gray-500 group-hover:bg-brand-accent-hover'
                }`}></span>
                <div className={`p-3 rounded-lg transition-colors ${selectedEvent.year === event.year ? 'bg-brand-accent/10' : ''}`}>
                    <time className="block mb-1 text-base font-normal leading-none text-gray-500 dark:text-gray-400">{event.yearDisplay}</time>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{event.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Event Details */}
      <div className="md:col-span-2 bg-white dark:bg-brand-dark-secondary p-8 md:p-12 rounded-lg shadow-sm overflow-y-auto">
        {selectedEvent ? (
          <div>
            <div className="border-b border-gray-200 dark:border-brand-dark-tertiary pb-6 mb-6">
                <p className="text-base font-semibold uppercase tracking-wider text-brand-accent mb-2">
                    {selectedEvent.era} &nbsp;&nbsp;&middot;&nbsp;&nbsp; {selectedEvent.yearDisplay}
                </p>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-brand-dark dark:text-brand-light">
                    {selectedEvent.title}
                </h1>
            </div>
            
            <div className="prose prose-lg sm:prose-xl max-w-none font-serif text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>{selectedEvent.description}</p>
            </div>

            <div className="mt-8">
              <h3 className="font-sans font-bold text-xl text-brand-dark dark:text-brand-light mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedEvent.tags.map(tag => (
                  <span key={tag} className="bg-brand-light-secondary dark:bg-brand-dark-tertiary border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-base font-medium">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400 text-xl">Select an event from the timeline to learn more.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default HistoryExplorer;
