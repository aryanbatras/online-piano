import dynamic from 'next/dynamic';

const ConnectionTest = dynamic(() => import('../components/ConnectionTest'), {
  ssr: false, 
});

export function PianoPage() {
  return <ConnectionTest />;
}
export default PianoPage;