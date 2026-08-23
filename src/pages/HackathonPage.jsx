import { ExternalLink, Calendar, Award } from 'lucide-react';

export const HackathonPage = () => {
  const competitions = [
    {
      title: 'Smart India Hackathon (SIH) 2026',
      mode: 'Internal & National Round',
      deadline: 'Internal Selection: Sep 2026',
      desc: 'Nationwide initiative by MoE’s Innovation Cell for students to solve challenges posed by ministries and industries.',
      link: 'https://sih.gov.in',
    },
    {
      title: 'Flipkart GRiD 6.0 — Software Development',
      mode: 'All India Campus Tech Track',
      deadline: 'Live Registration',
      desc: 'Flagship engineering challenge inviting top developers to solve real e-commerce problems at scale.',
      link: 'https://unstop.com',
    },
    {
      title: 'NASA Space Apps Challenge',
      mode: 'Global Multi-City',
      deadline: 'October 2026',
      desc: 'Global hackathon using NASA open data to create open-source solutions for Earth and space exploration.',
      link: 'https://www.spaceappschallenge.org',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-extrabold text-maroon mb-2">Live Hackathons & Competitions</h2>
        <p className="text-sm text-neutral-600">
          Official college internal deadlines and recognized national-level opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {competitions.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex justify-between items-start gap-2 mb-3">
                <h4 className="font-bold text-lg text-neutral-900 leading-snug">{item.title}</h4>
                <span className="text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded whitespace-nowrap">
                  {item.mode}
                </span>
              </div>
              <p className="text-xs text-neutral-600 mb-6 leading-relaxed">{item.desc}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <span className="text-xs text-neutral-500 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-maroon" /> {item.deadline}
              </span>
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-maroon hover:underline"
              >
                Details <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};