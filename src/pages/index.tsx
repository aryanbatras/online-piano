import dynamic from 'next/dynamic';

const Piano = dynamic(() => import('../components/piano/CollaborativePiano'), {
  ssr: false, 
});

export function PianoPage() {
  return <Piano />;
}
export default PianoPage;