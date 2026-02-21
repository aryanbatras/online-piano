import dynamic from 'next/dynamic';

const Piano = dynamic(() => import('../components/piano/Piano'), {
  ssr: false, 
});

export function PianoPage() {
  return <Piano />;
}
export default PianoPage;