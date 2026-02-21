import dynamic from 'next/dynamic';

const CollaborativePiano = dynamic(() => import('../components/piano/CollaborativePiano'), {
  ssr: false, 
});

export function PianoPage() {
  return <CollaborativePiano />;
}
export default PianoPage;