import { useState } from 'react';
import Layout from './components/Layout';
import ProgressBar from './components/ProgressBar';
import Welcome from './components/steps/Welcome';
import ProjectInfo from './components/steps/ProjectInfo';
import LocationPicker from './components/steps/LocationPicker';
import Streams from './components/steps/Streams';
import ChainConfig from './components/steps/ChainConfig';
import AdviceReport from './components/steps/AdviceReport';
import type {
  Projectinfo,
  Locatie,
  KeteninrichtingInput,
  MaterialStream,
} from './types';

const STAPPEN = [
  'Welkom',
  'Projectinfo',
  'Locatie',
  'Materiaalstromen',
  'Keteninrichting',
  'Advies',
] as const;

const DEFAULT_PROJECTINFO: Projectinfo = {
  naam: '',
  gemeente: '',
  fase: 'tender',
  eigenKade: false,
  zeZoneActief: false,
};

const DEFAULT_LOCATIE: Locatie = {
  adres: '',
  lat: 52.0907, // NL geografisch midden
  lon: 5.1214,
  afstandTotKadeMeter: 500,
};

const DEFAULT_KETEN: KeteninrichtingInput = {
  ketenConfig: 'gedeelde-overslag',
  regiekamer: false,
  blvcBestek: false,
  ticketsysteem: false,
  drijvendeVoorraad: false,
};

export default function App() {
  const [stap, setStap] = useState(0);
  const [projectinfo, setProjectinfo] = useState<Projectinfo>(DEFAULT_PROJECTINFO);
  const [locatie, setLocatie] = useState<Locatie>(DEFAULT_LOCATIE);
  const [keten, setKeten] = useState<KeteninrichtingInput>(DEFAULT_KETEN);
  const [streams, setStreams] = useState<MaterialStream[]>([]);

  const next = () => setStap(s => Math.min(s + 1, STAPPEN.length - 1));
  const prev = () => setStap(s => Math.max(s - 1, 0));
  const goto = (s: number) => setStap(s);
  const reset = () => {
    setStap(0);
    setProjectinfo(DEFAULT_PROJECTINFO);
    setLocatie(DEFAULT_LOCATIE);
    setKeten(DEFAULT_KETEN);
    setStreams([]);
  };

  return (
    <Layout>
      <ProgressBar
        stappen={[...STAPPEN]}
        actief={stap}
        onClick={(idx) => idx < stap && goto(idx)}
      />

      <div className="mt-8">
        {stap === 0 && <Welcome onStart={next} />}

        {stap === 1 && (
          <ProjectInfo
            value={projectinfo}
            onChange={setProjectinfo}
            onNext={next}
            onPrev={prev}
          />
        )}

        {stap === 2 && (
          <LocationPicker
            value={locatie}
            onChange={setLocatie}
            onNext={next}
            onPrev={prev}
          />
        )}

        {stap === 3 && (
          <Streams
            value={streams}
            onChange={setStreams}
            onNext={next}
            onPrev={prev}
          />
        )}

        {stap === 4 && (
          <ChainConfig
            value={keten}
            onChange={setKeten}
            onNext={next}
            onPrev={prev}
          />
        )}

        {stap === 5 && (
          <AdviceReport
            projectinfo={projectinfo}
            locatie={locatie}
            keteninrichting={keten}
            streams={streams}
            onPrev={prev}
            onReset={reset}
          />
        )}
      </div>
    </Layout>
  );
}
