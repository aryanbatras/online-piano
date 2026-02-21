export function useKeyEvents(
  keyId: number,
  onPressed: (keyId: number) => void,
  onReleased: (keyId: number) => void
) {
  const handleMouseDown = () => onPressed(keyId);
  const handleMouseUp = () => onReleased(keyId);
  const handleMouseLeave = () => onReleased(keyId);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    onPressed(keyId);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    onReleased(keyId);
  };

  return {
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd
  };
}
